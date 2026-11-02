import sqlite3,json,sys
conn=sqlite3.connect(':memory:')
conn.row_factory=sqlite3.Row
with open(sys.argv[1],encoding='utf-8') as source:
    conn.executescript(source.read())
names=[r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%'")]
print(json.dumps({name:[dict(r) for r in conn.execute('SELECT * FROM "'+name+'"')] for name in names},ensure_ascii=False))
