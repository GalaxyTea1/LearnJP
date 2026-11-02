-- Catalog counts are maintained by triggers so listing modules reads one row per
-- module instead of scanning every vocabulary/kanji/grammar/quiz index entry.
CREATE TABLE module_content_counts (
  module_id INTEGER PRIMARY KEY,
  vocabulary INTEGER NOT NULL DEFAULT 0,
  kanji INTEGER NOT NULL DEFAULT 0,
  grammar INTEGER NOT NULL DEFAULT 0,
  quiz INTEGER NOT NULL DEFAULT 0
);
INSERT INTO module_content_counts(module_id,vocabulary,kanji,grammar,quiz)
SELECT m.id,
  (SELECT count(*) FROM vocabulary WHERE module_id=m.id),
  (SELECT count(*) FROM kanji WHERE module_id=m.id),
  (SELECT count(*) FROM grammar_patterns WHERE module_id=m.id),
  (SELECT count(*) FROM quiz_questions WHERE module_id=m.id)
FROM learning_modules m;
CREATE TRIGGER vocabulary_count_insert AFTER INSERT ON vocabulary WHEN NEW.module_id IS NOT NULL BEGIN
  INSERT OR IGNORE INTO module_content_counts(module_id) VALUES (NEW.module_id);
  UPDATE module_content_counts SET vocabulary=vocabulary+1 WHERE module_id=NEW.module_id;
END;
CREATE TRIGGER vocabulary_count_delete AFTER DELETE ON vocabulary WHEN OLD.module_id IS NOT NULL BEGIN
  UPDATE module_content_counts SET vocabulary=vocabulary-1 WHERE module_id=OLD.module_id;
END;
CREATE TRIGGER vocabulary_count_move AFTER UPDATE OF module_id ON vocabulary WHEN OLD.module_id IS NOT NEW.module_id BEGIN
  UPDATE module_content_counts SET vocabulary=vocabulary-1 WHERE module_id=OLD.module_id;
  INSERT OR IGNORE INTO module_content_counts(module_id) SELECT NEW.module_id WHERE NEW.module_id IS NOT NULL;
  UPDATE module_content_counts SET vocabulary=vocabulary+1 WHERE module_id=NEW.module_id;
END;
CREATE TRIGGER kanji_count_insert AFTER INSERT ON kanji WHEN NEW.module_id IS NOT NULL BEGIN
  INSERT OR IGNORE INTO module_content_counts(module_id) VALUES (NEW.module_id);
  UPDATE module_content_counts SET kanji=kanji+1 WHERE module_id=NEW.module_id;
END;
CREATE TRIGGER kanji_count_delete AFTER DELETE ON kanji WHEN OLD.module_id IS NOT NULL BEGIN
  UPDATE module_content_counts SET kanji=kanji-1 WHERE module_id=OLD.module_id;
END;
CREATE TRIGGER kanji_count_move AFTER UPDATE OF module_id ON kanji WHEN OLD.module_id IS NOT NEW.module_id BEGIN
  UPDATE module_content_counts SET kanji=kanji-1 WHERE module_id=OLD.module_id;
  INSERT OR IGNORE INTO module_content_counts(module_id) SELECT NEW.module_id WHERE NEW.module_id IS NOT NULL;
  UPDATE module_content_counts SET kanji=kanji+1 WHERE module_id=NEW.module_id;
END;
CREATE TRIGGER grammar_patterns_count_insert AFTER INSERT ON grammar_patterns WHEN NEW.module_id IS NOT NULL BEGIN
  INSERT OR IGNORE INTO module_content_counts(module_id) VALUES (NEW.module_id);
  UPDATE module_content_counts SET grammar=grammar+1 WHERE module_id=NEW.module_id;
END;
CREATE TRIGGER grammar_patterns_count_delete AFTER DELETE ON grammar_patterns WHEN OLD.module_id IS NOT NULL BEGIN
  UPDATE module_content_counts SET grammar=grammar-1 WHERE module_id=OLD.module_id;
END;
CREATE TRIGGER grammar_patterns_count_move AFTER UPDATE OF module_id ON grammar_patterns WHEN OLD.module_id IS NOT NEW.module_id BEGIN
  UPDATE module_content_counts SET grammar=grammar-1 WHERE module_id=OLD.module_id;
  INSERT OR IGNORE INTO module_content_counts(module_id) SELECT NEW.module_id WHERE NEW.module_id IS NOT NULL;
  UPDATE module_content_counts SET grammar=grammar+1 WHERE module_id=NEW.module_id;
END;
CREATE TRIGGER quiz_questions_count_insert AFTER INSERT ON quiz_questions WHEN NEW.module_id IS NOT NULL BEGIN
  INSERT OR IGNORE INTO module_content_counts(module_id) VALUES (NEW.module_id);
  UPDATE module_content_counts SET quiz=quiz+1 WHERE module_id=NEW.module_id;
END;
CREATE TRIGGER quiz_questions_count_delete AFTER DELETE ON quiz_questions WHEN OLD.module_id IS NOT NULL BEGIN
  UPDATE module_content_counts SET quiz=quiz-1 WHERE module_id=OLD.module_id;
END;
CREATE TRIGGER quiz_questions_count_move AFTER UPDATE OF module_id ON quiz_questions WHEN OLD.module_id IS NOT NEW.module_id BEGIN
  UPDATE module_content_counts SET quiz=quiz-1 WHERE module_id=OLD.module_id;
  INSERT OR IGNORE INTO module_content_counts(module_id) SELECT NEW.module_id WHERE NEW.module_id IS NOT NULL;
  UPDATE module_content_counts SET quiz=quiz+1 WHERE module_id=NEW.module_id;
END;
CREATE TRIGGER learning_modules_count_delete AFTER DELETE ON learning_modules BEGIN
  DELETE FROM module_content_counts WHERE module_id=OLD.id;
END;
-- Public content responses are cached under this version. Any write to public
-- content (Worker, admin or wrangler import) moves every cache key at once.
CREATE TABLE content_cache_version (id INTEGER PRIMARY KEY CHECK(id=1), version INTEGER NOT NULL);
INSERT INTO content_cache_version VALUES (1,0);
CREATE TRIGGER jlpt_levels_cache_insert AFTER INSERT ON jlpt_levels BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER jlpt_levels_cache_update AFTER UPDATE ON jlpt_levels BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER jlpt_levels_cache_delete AFTER DELETE ON jlpt_levels BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER learning_modules_cache_insert AFTER INSERT ON learning_modules BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER learning_modules_cache_update AFTER UPDATE ON learning_modules BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER learning_modules_cache_delete AFTER DELETE ON learning_modules BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER lesson_sections_cache_insert AFTER INSERT ON lesson_sections BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER lesson_sections_cache_update AFTER UPDATE ON lesson_sections BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER lesson_sections_cache_delete AFTER DELETE ON lesson_sections BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER conversations_cache_insert AFTER INSERT ON conversations BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER conversations_cache_update AFTER UPDATE ON conversations BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER conversations_cache_delete AFTER DELETE ON conversations BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER conversation_lines_cache_insert AFTER INSERT ON conversation_lines BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER conversation_lines_cache_update AFTER UPDATE ON conversation_lines BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER conversation_lines_cache_delete AFTER DELETE ON conversation_lines BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER listening_content_cache_insert AFTER INSERT ON listening_content BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER listening_content_cache_update AFTER UPDATE ON listening_content BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER listening_content_cache_delete AFTER DELETE ON listening_content BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER reading_passages_cache_insert AFTER INSERT ON reading_passages BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER reading_passages_cache_update AFTER UPDATE ON reading_passages BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER reading_passages_cache_delete AFTER DELETE ON reading_passages BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER writing_tasks_cache_insert AFTER INSERT ON writing_tasks BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER writing_tasks_cache_update AFTER UPDATE ON writing_tasks BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER writing_tasks_cache_delete AFTER DELETE ON writing_tasks BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER lesson_exercises_cache_insert AFTER INSERT ON lesson_exercises BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER lesson_exercises_cache_update AFTER UPDATE ON lesson_exercises BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER lesson_exercises_cache_delete AFTER DELETE ON lesson_exercises BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER vocabulary_cache_insert AFTER INSERT ON vocabulary BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER vocabulary_cache_update AFTER UPDATE ON vocabulary BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER vocabulary_cache_delete AFTER DELETE ON vocabulary BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER kanji_cache_insert AFTER INSERT ON kanji BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER kanji_cache_update AFTER UPDATE ON kanji BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER kanji_cache_delete AFTER DELETE ON kanji BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER grammar_patterns_cache_insert AFTER INSERT ON grammar_patterns BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER grammar_patterns_cache_update AFTER UPDATE ON grammar_patterns BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER grammar_patterns_cache_delete AFTER DELETE ON grammar_patterns BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER grammar_examples_cache_insert AFTER INSERT ON grammar_examples BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER grammar_examples_cache_update AFTER UPDATE ON grammar_examples BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER grammar_examples_cache_delete AFTER DELETE ON grammar_examples BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER quiz_questions_cache_insert AFTER INSERT ON quiz_questions BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER quiz_questions_cache_update AFTER UPDATE ON quiz_questions BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER quiz_questions_cache_delete AFTER DELETE ON quiz_questions BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER content_search_cache_insert AFTER INSERT ON content_search BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER content_search_cache_update AFTER UPDATE ON content_search BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
CREATE TRIGGER content_search_cache_delete AFTER DELETE ON content_search BEGIN UPDATE content_cache_version SET version=version+1 WHERE id=1; END;
