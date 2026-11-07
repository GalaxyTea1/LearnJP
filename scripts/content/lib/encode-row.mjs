// Turns a row keyed by Prisma-style field names into a D1 row keyed by column names:
// JSON fields are stringified and booleans become 0/1 (columns.json lists every table's fields).
export const encodeRow = (row, fields) =>
  Object.fromEntries(
    fields.map(f => [
      f.column,
      row[f.name] == null
        ? null
        : f.type === 'Json'
          ? JSON.stringify(row[f.name])
          : f.type === 'Boolean'
            ? Number(row[f.name])
            : row[f.name],
    ]),
  );
