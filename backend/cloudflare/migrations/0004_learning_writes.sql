-- Guards exist only inside a batch and are removed before commit. A failed
-- CHECK aborts the whole D1 batch, including every progress/XP/answer write.
CREATE TABLE mutation_guards (
  id TEXT PRIMARY KEY,
  ok INTEGER NOT NULL CONSTRAINT mutation_check CHECK(ok=1)
);
CREATE TABLE assessment_revision (id INTEGER PRIMARY KEY CHECK(id=1), version INTEGER NOT NULL);
INSERT INTO assessment_revision VALUES (1,0);
CREATE TRIGGER quiz_revision_insert AFTER INSERT ON quiz_questions BEGIN UPDATE assessment_revision SET version=version+1 WHERE id=1; END;
CREATE TRIGGER quiz_revision_update AFTER UPDATE ON quiz_questions BEGIN UPDATE assessment_revision SET version=version+1 WHERE id=1; END;
CREATE TRIGGER quiz_revision_delete AFTER DELETE ON quiz_questions BEGIN UPDATE assessment_revision SET version=version+1 WHERE id=1; END;
CREATE TRIGGER test_revision_insert AFTER INSERT ON test_questions BEGIN UPDATE assessment_revision SET version=version+1 WHERE id=1; END;
CREATE TRIGGER test_revision_update AFTER UPDATE ON test_questions BEGIN UPDATE assessment_revision SET version=version+1 WHERE id=1; END;
CREATE TRIGGER test_revision_delete AFTER DELETE ON test_questions BEGIN UPDATE assessment_revision SET version=version+1 WHERE id=1; END;
CREATE TRIGGER section_revision_update AFTER UPDATE ON test_sections BEGIN UPDATE assessment_revision SET version=version+1 WHERE id=1; END;
CREATE TRIGGER section_revision_delete AFTER DELETE ON test_sections BEGIN UPDATE assessment_revision SET version=version+1 WHERE id=1; END;
ALTER TABLE user_flashcard_progress ADD COLUMN version INTEGER NOT NULL DEFAULT 0;
ALTER TABLE user_test_attempts ADD COLUMN question_snapshot TEXT CHECK(question_snapshot IS NULL OR json_valid(question_snapshot));
ALTER TABLE user_test_attempts ADD COLUMN submission_hash TEXT;
ALTER TABLE user_test_attempts ADD COLUMN submission_response TEXT CHECK(submission_response IS NULL OR json_valid(submission_response));
ALTER TABLE user_test_attempts ADD COLUMN start_request_id TEXT;
CREATE UNIQUE INDEX test_start_request ON user_test_attempts(user_id,start_request_id);
CREATE TABLE xp_events (
  event_key TEXT PRIMARY KEY,
  operation_id TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK(amount>=0),
  kind TEXT NOT NULL CHECK(kind IN ('quiz','srs','test')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX xp_user ON xp_events(user_id,created_at);
CREATE TRIGGER award_xp AFTER INSERT ON xp_events BEGIN
  INSERT INTO user_gamification(user_id,xp,total_xp_earned,daily_xp,daily_xp_date)
  VALUES (NEW.user_id,NEW.amount,NEW.amount,NEW.amount,NEW.created_at)
  ON CONFLICT(user_id) DO UPDATE SET
    xp=xp+NEW.amount, total_xp_earned=total_xp_earned+NEW.amount,
    daily_xp=CASE WHEN substr(daily_xp_date,1,10)=substr(NEW.created_at,1,10) THEN daily_xp+NEW.amount ELSE NEW.amount END,
    daily_xp_date=NEW.created_at,updated_at=NEW.created_at;
END;
