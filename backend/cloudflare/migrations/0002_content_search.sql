-- Normalized by the import/write repository using JavaScript Unicode lowercase.
-- SQLite lower() alone only handles ASCII. Keep this index updated with content writes.
CREATE TABLE content_search (
  kind TEXT NOT NULL CHECK(kind IN ('vocabulary','kanji','grammar','dictionary')),
  item_id INTEGER NOT NULL,
  search_text TEXT NOT NULL,
  PRIMARY KEY(kind,item_id)
);
