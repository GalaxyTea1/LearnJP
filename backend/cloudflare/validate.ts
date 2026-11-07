// Small zod-compatible validator for request bodies. zod's first-use cost dominated CPU on
// cold isolates (and was 76% of the bundle); this keeps the same call style and semantics for
// the subset the Worker uses. Schemas are immutable: every method returns a new schema.
// Regexes are copied from zod v4 (core/regexes.js) so accepted inputs do not change.
type Path = (string | number)[];
type Step = (value: any) => any;
const FAIL = Symbol('fail');
class Invalid {
  constructor(public paths: Path[]) {}
}
type Issue = { path: Path };
type SafeParse<T> = { success: true; data: T } | { success: false; error: { issues: Issue[] } };

const emailPattern =
  /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
const uuidPattern =
  /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
const datePattern =
  '(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))';
const offsetDatetime = new RegExp(
  `^${datePattern}T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$`,
);
const plainObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

export abstract class Schema<T> {
  readonly isOptional: boolean = false;
  protected steps: Step[] = [];
  protected abstract base(value: unknown, path: Path): unknown;
  run(value: unknown, path: Path): T {
    let out = this.base(value, path);
    if (out === FAIL) throw new Invalid([path]);
    for (const step of this.steps) if ((out = step(out)) === FAIL) throw new Invalid([path]);
    return out as T;
  }
  safeParse(input: unknown): SafeParse<T> {
    try {
      return { success: true, data: this.run(input, []) };
    } catch (error) {
      if (error instanceof Invalid) return { success: false, error: { issues: error.paths.map(path => ({ path })) } };
      throw error;
    }
  }
  protected with(step: Step): this {
    const next = Object.assign(Object.create(Object.getPrototypeOf(this)), this) as this;
    next.steps = [...this.steps, step];
    return next;
  }
  protected check(ok: (value: T) => boolean): this {
    return this.with(v => (ok(v) ? v : FAIL));
  }
  refine(ok: (value: T) => boolean, _message?: string): this {
    return this.check(ok);
  }
  optional(): Schema<T | undefined> {
    return new Wrapped(this, v => v === undefined, undefined, true);
  }
  nullable(): Schema<T | null> {
    return new Wrapped(this, v => v === null, null, this.isOptional);
  }
  default(value: T): Schema<T> {
    return new Wrapped(
      this,
      v => v === undefined,
      () => (Array.isArray(value) ? [...value] : value),
      true,
    ) as Schema<T>;
  }
}
class Wrapped<T> extends Schema<T> {
  constructor(
    private inner: Schema<any>,
    private accepts: (v: unknown) => boolean,
    private fallback: unknown,
    readonly isOptional: boolean,
  ) {
    super();
  }
  protected base(value: unknown, path: Path) {
    if (this.accepts(value)) return typeof this.fallback === 'function' ? this.fallback() : value;
    return this.inner.run(value, path);
  }
}
class StringSchema extends Schema<string> {
  protected base(v: unknown) {
    return typeof v === 'string' ? v : FAIL;
  }
  min(n: number) {
    return this.check(v => v.length >= n);
  }
  max(n: number) {
    return this.check(v => v.length <= n);
  }
  regex(pattern: RegExp) {
    return this.check(v => pattern.test(v));
  }
  email() {
    return this.regex(emailPattern);
  }
  uuid() {
    return this.regex(uuidPattern);
  }
  trim() {
    return this.with((v: string) => v.trim());
  }
  toLowerCase() {
    return this.with((v: string) => v.toLowerCase());
  }
}
class NumberSchema extends Schema<number> {
  protected base(v: unknown) {
    return typeof v === 'number' && Number.isFinite(v) ? v : FAIL;
  }
  int() {
    return this.check(Number.isSafeInteger);
  }
  positive() {
    return this.check(v => v > 0);
  }
  min(n: number) {
    return this.check(v => v >= n);
  }
  max(n: number) {
    return this.check(v => v <= n);
  }
}
class BooleanSchema extends Schema<boolean> {
  protected base(v: unknown) {
    return typeof v === 'boolean' ? v : FAIL;
  }
}
class UnknownSchema extends Schema<unknown> {
  protected base(v: unknown) {
    return v;
  }
}
class EnumSchema<T extends string> extends Schema<T> {
  constructor(private values: readonly T[]) {
    super();
  }
  protected base(v: unknown) {
    return this.values.includes(v as T) ? v : FAIL;
  }
}
class ArraySchema<T> extends Schema<T[]> {
  private minLength = 0;
  private maxLength = Infinity;
  constructor(private item: Schema<T>) {
    super();
  }
  protected base(v: unknown, path: Path) {
    // Like zod, a length violation is reported alone and items are not parsed.
    if (!Array.isArray(v) || v.length < this.minLength || v.length > this.maxLength) return FAIL;
    const failed: Path[] = [],
      out = v.map((x, i) => {
        try {
          return this.item.run(x, [...path, i]);
        } catch (e) {
          if (!(e instanceof Invalid)) throw e;
          failed.push(...e.paths);
        }
      });
    if (failed.length) throw new Invalid(failed);
    return out;
  }
  min(n: number) {
    const next = this.with(v => v);
    next.minLength = n;
    return next;
  }
  max(n: number) {
    const next = this.with(v => v);
    next.maxLength = n;
    return next;
  }
}
class RecordSchema extends Schema<Record<string, unknown>> {
  protected base(v: unknown) {
    return plainObject(v) ? { ...v } : FAIL;
  }
}

type Shape = Record<string, Schema<any>>;
type Out<S> = S extends Schema<infer T> ? T : never;
type Required<S extends Shape> = { [K in keyof S as undefined extends Out<S[K]> ? never : K]: Out<S[K]> };
type Optional<S extends Shape> = { [K in keyof S as undefined extends Out<S[K]> ? K : never]?: Out<S[K]> };
class ObjectSchema<S extends Shape> extends Schema<Required<S> & Optional<S>> {
  constructor(
    readonly shape: S,
    private exact = false,
  ) {
    super();
  }
  protected base(v: unknown, path: Path) {
    if (!plainObject(v)) return FAIL;
    const failed: Path[] = [],
      out: Record<string, unknown> = {};
    for (const [key, schema] of Object.entries(this.shape)) {
      if (v[key] === undefined && !schema.isOptional) {
        failed.push([...path, key]);
        continue;
      }
      try {
        const value = schema.run(v[key], [...path, key]);
        if (value !== undefined || key in v) out[key] = value;
      } catch (e) {
        if (!(e instanceof Invalid)) throw e;
        failed.push(...e.paths);
      }
    }
    // zod reports unrecognised keys on the object itself, after the field failures.
    if (this.exact && Object.keys(v).some(k => !(k in this.shape))) failed.push(path);
    if (failed.length) throw new Invalid(failed);
    return out;
  }
  strict() {
    return new ObjectSchema(this.shape, true);
  }
  partial() {
    return new ObjectSchema(
      Object.fromEntries(Object.entries(this.shape).map(([k, s]) => [k, s.isOptional ? s : s.optional()])) as {
        [K in keyof S]: Schema<Out<S[K]> | undefined>;
      },
      this.exact,
    );
  }
  extend<E extends Shape>(extra: E) {
    return new ObjectSchema({ ...this.shape, ...extra } as Omit<S, keyof E> & E, this.exact);
  }
}

// Named z so call sites read like the zod code they replaced.
export const z = {
  string: () => new StringSchema(),
  number: () => new NumberSchema(),
  boolean: () => new BooleanSchema(),
  unknown: () => new UnknownSchema(),
  enum: <const T extends string>(values: readonly T[]) => new EnumSchema<T>(values),
  array: <T>(item: Schema<T>) => new ArraySchema(item),
  object: <S extends Shape>(shape: S) => new ObjectSchema(shape),
  strictObject: <S extends Shape>(shape: S) => new ObjectSchema(shape, true),
  record: (_key: Schema<string>, _value: Schema<unknown>) => new RecordSchema(),
  /** z.iso.datetime({offset:true}): seconds required, Z or ±hh:mm offset. Only that form is supported. */
  iso: { datetime: (_options: { offset: true }) => new StringSchema().regex(offsetDatetime) },
};
