import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as { body?: unknown; query?: unknown; params?: unknown };
      if (parsed.body !== undefined) req.body = parsed.body;
      // Express 5 exposes query via a getter; define an own validated value.
      for (const key of ['query', 'params'] as const) {
        if (parsed[key] !== undefined) Object.defineProperty(req, key, {
          value: parsed[key], writable: true, configurable: true, enumerable: true,
        });
      }
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues || (error as any).errors || [];
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: issues.map((e: any) => ({
            field: e.path ? e.path.join('.') : '',
            message: e.message,
          })),
        });
        return;
      }
      return next(error);
    }
  };
};
