-- D1 SQLite baseline. UTC dates are ISO-8601 TEXT; JSON is validated TEXT.

-- updated_at must be set explicitly by future write repositories.

CREATE TABLE "users" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "username" TEXT NOT NULL UNIQUE,
  "password_hash" TEXT NOT NULL,
  "display_name" TEXT,
  "avatar_url" TEXT,
  "role" TEXT NOT NULL DEFAULT 'USER' CHECK ("role" IN ('USER','ADMIN','MODERATOR')),
  "current_streak" INTEGER NOT NULL DEFAULT 0,
  "last_study_date" TEXT,
  "is_active" INTEGER NOT NULL DEFAULT 1 CHECK ("is_active" IN (0,1)),
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE "refresh_tokens" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "user_id" INTEGER NOT NULL,
  "expires_at" TEXT NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "refresh_tokens_lookup_0" ON "refresh_tokens" ("user_id");

CREATE INDEX "refresh_tokens_lookup_1" ON "refresh_tokens" ("user_id");

CREATE TABLE "auth_rate_limits" (
  "key" TEXT PRIMARY KEY NOT NULL,
  "count" INTEGER NOT NULL,
  "reset_at" TEXT NOT NULL
);

CREATE INDEX "auth_rate_limits_lookup_0" ON "auth_rate_limits" ("reset_at");

CREATE TABLE "user_learning_settings" (
  "user_id" INTEGER PRIMARY KEY NOT NULL,
  "weekly_goal_target" INTEGER NOT NULL DEFAULT 20,
  "daily_reminder_time" TEXT,
  "preferred_level" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "user_learning_settings_lookup_0" ON "user_learning_settings" ("user_id");

CREATE TABLE "jlpt_levels" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "level" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "title_jp" TEXT NOT NULL,
  "color" TEXT NOT NULL,
  "badge" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "total_vocab" INTEGER NOT NULL,
  "total_kanji" INTEGER NOT NULL,
  "total_grammar" INTEGER NOT NULL,
  "sort_order" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE "learning_modules" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "level_id" INTEGER NOT NULL,
  "unit_number" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "title_jp" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "topics" TEXT NOT NULL CHECK ("topics" IS NULL OR json_valid("topics")),
  "sort_order" INTEGER NOT NULL,
  "content_status" TEXT NOT NULL DEFAULT 'DRAFT' CHECK ("content_status" IN ('DRAFT','IN_REVIEW','PUBLISHED','ARCHIVED')),
  "version" INTEGER NOT NULL DEFAULT 1,
  "published_at" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE ("level_id","unit_number"),
  FOREIGN KEY ("level_id") REFERENCES "jlpt_levels" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "learning_modules_lookup_0" ON "learning_modules" ("level_id");

CREATE TABLE "lesson_sections" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "module_id" INTEGER NOT NULL,
  "section_type" TEXT NOT NULL CHECK ("section_type" IN ('OVERVIEW','VOCABULARY','KANJI','GRAMMAR','KAIWA','LISTENING','READING','WRITING','EXERCISE','SUMMARY')),
  "title" TEXT NOT NULL,
  "title_jp" TEXT,
  "instructions" TEXT,
  "sort_order" INTEGER NOT NULL,
  "is_required" INTEGER NOT NULL DEFAULT 1 CHECK ("is_required" IN (0,1)),
  "status" TEXT NOT NULL DEFAULT 'DRAFT' CHECK ("status" IN ('DRAFT','IN_REVIEW','PUBLISHED','ARCHIVED')),
  "version" INTEGER NOT NULL DEFAULT 1,
  "review_notes" TEXT,
  "published_at" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE ("module_id","sort_order"),
  FOREIGN KEY ("module_id") REFERENCES "learning_modules" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "lesson_sections_lookup_0" ON "lesson_sections" ("module_id","status");

CREATE INDEX "lesson_sections_lookup_1" ON "lesson_sections" ("module_id");

CREATE TABLE "conversations" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "section_id" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "context" TEXT,
  "audio_url" TEXT,
  "sort_order" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT' CHECK ("status" IN ('DRAFT','IN_REVIEW','PUBLISHED','ARCHIVED')),
  "version" INTEGER NOT NULL DEFAULT 1,
  "published_at" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE ("section_id","sort_order"),
  FOREIGN KEY ("section_id") REFERENCES "lesson_sections" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "conversations_lookup_0" ON "conversations" ("section_id","status");

CREATE INDEX "conversations_lookup_1" ON "conversations" ("section_id");

CREATE TABLE "conversation_lines" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "conversation_id" INTEGER NOT NULL,
  "speaker" TEXT NOT NULL,
  "japanese" TEXT NOT NULL,
  "hiragana" TEXT,
  "romaji" TEXT,
  "translation" TEXT,
  "audio_url" TEXT,
  "notes" TEXT,
  "sort_order" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE ("conversation_id","sort_order"),
  FOREIGN KEY ("conversation_id") REFERENCES "conversations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "conversation_lines_lookup_0" ON "conversation_lines" ("conversation_id");

CREATE TABLE "listening_content" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "section_id" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "instructions" TEXT,
  "audio_url" TEXT NOT NULL,
  "duration_seconds" INTEGER,
  "playback_speed" REAL,
  "transcript" TEXT NOT NULL,
  "transcript_reading" TEXT,
  "transcript_translation" TEXT,
  "source" TEXT,
  "sort_order" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT' CHECK ("status" IN ('DRAFT','IN_REVIEW','PUBLISHED','ARCHIVED')),
  "version" INTEGER NOT NULL DEFAULT 1,
  "published_at" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE ("section_id","sort_order"),
  FOREIGN KEY ("section_id") REFERENCES "lesson_sections" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "listening_content_lookup_0" ON "listening_content" ("section_id","status");

CREATE INDEX "listening_content_lookup_1" ON "listening_content" ("section_id");

CREATE TABLE "reading_passages" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "section_id" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "reading" TEXT,
  "translation" TEXT,
  "source" TEXT,
  "estimated_level" TEXT,
  "sort_order" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT' CHECK ("status" IN ('DRAFT','IN_REVIEW','PUBLISHED','ARCHIVED')),
  "version" INTEGER NOT NULL DEFAULT 1,
  "published_at" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE ("section_id","sort_order"),
  FOREIGN KEY ("section_id") REFERENCES "lesson_sections" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "reading_passages_lookup_0" ON "reading_passages" ("section_id","status");

CREATE INDEX "reading_passages_lookup_1" ON "reading_passages" ("section_id");

CREATE TABLE "writing_tasks" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "section_id" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "instructions" TEXT,
  "sample_answer" TEXT,
  "rubric" TEXT CHECK ("rubric" IS NULL OR json_valid("rubric")),
  "min_length" INTEGER,
  "max_length" INTEGER,
  "sort_order" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT' CHECK ("status" IN ('DRAFT','IN_REVIEW','PUBLISHED','ARCHIVED')),
  "version" INTEGER NOT NULL DEFAULT 1,
  "published_at" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE ("section_id","sort_order"),
  FOREIGN KEY ("section_id") REFERENCES "lesson_sections" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "writing_tasks_lookup_0" ON "writing_tasks" ("section_id","status");

CREATE INDEX "writing_tasks_lookup_1" ON "writing_tasks" ("section_id");

CREATE TABLE "lesson_exercises" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "section_id" INTEGER NOT NULL,
  "listening_id" INTEGER,
  "reading_passage_id" INTEGER,
  "exercise_type" TEXT NOT NULL CHECK ("exercise_type" IN ('MULTIPLE_CHOICE','FILL_BLANK','TRUE_FALSE','MATCHING','SENTENCE_ORDERING','SHORT_ANSWER','DICTATION','SHADOWING')),
  "prompt" TEXT NOT NULL,
  "options" TEXT CHECK ("options" IS NULL OR json_valid("options")),
  "correct_answer" TEXT CHECK ("correct_answer" IS NULL OR json_valid("correct_answer")),
  "explanation" TEXT,
  "points" INTEGER NOT NULL DEFAULT 1,
  "sort_order" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT' CHECK ("status" IN ('DRAFT','IN_REVIEW','PUBLISHED','ARCHIVED')),
  "version" INTEGER NOT NULL DEFAULT 1,
  "metadata" TEXT CHECK ("metadata" IS NULL OR json_valid("metadata")),
  "published_at" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE ("section_id","sort_order"),
  FOREIGN KEY ("section_id") REFERENCES "lesson_sections" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("listening_id") REFERENCES "listening_content" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("reading_passage_id") REFERENCES "reading_passages" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "lesson_exercises_lookup_0" ON "lesson_exercises" ("section_id","status");

CREATE INDEX "lesson_exercises_lookup_1" ON "lesson_exercises" ("listening_id");

CREATE INDEX "lesson_exercises_lookup_2" ON "lesson_exercises" ("reading_passage_id");

CREATE INDEX "lesson_exercises_lookup_3" ON "lesson_exercises" ("section_id");

CREATE INDEX "lesson_exercises_lookup_4" ON "lesson_exercises" ("listening_id");

CREATE INDEX "lesson_exercises_lookup_5" ON "lesson_exercises" ("reading_passage_id");

CREATE TABLE "vocabulary" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "module_id" INTEGER,
  "japanese" TEXT NOT NULL,
  "hiragana" TEXT,
  "romaji" TEXT NOT NULL,
  "english" TEXT NOT NULL,
  "type" TEXT NOT NULL CHECK ("type" IN ('PHRASE','EXPRESSION','PRONOUN','VERB','ADJECTIVE','NOUN','ADVERB','PARTICLE')),
  "level" TEXT,
  "lesson" TEXT,
  "example_jp" TEXT,
  "example_en" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY ("module_id") REFERENCES "learning_modules" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "vocabulary_lookup_0" ON "vocabulary" ("module_id");

CREATE TABLE "kanji" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "module_id" INTEGER,
  "character" TEXT NOT NULL UNIQUE,
  "meaning" TEXT NOT NULL,
  "onyomi" TEXT,
  "kunyomi" TEXT,
  "level" TEXT NOT NULL,
  "stroke_count" INTEGER,
  "radical" TEXT,
  "example_words" TEXT CHECK ("example_words" IS NULL OR json_valid("example_words")),
  "related_chars" TEXT CHECK ("related_chars" IS NULL OR json_valid("related_chars")),
  "mnemonic" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY ("module_id") REFERENCES "learning_modules" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "kanji_lookup_0" ON "kanji" ("module_id");

CREATE TABLE "grammar_patterns" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "module_id" INTEGER,
  "pattern" TEXT NOT NULL,
  "meaning" TEXT NOT NULL,
  "explanation" TEXT NOT NULL,
  "level" TEXT NOT NULL,
  "lesson" TEXT,
  "textbook" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY ("module_id") REFERENCES "learning_modules" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "grammar_patterns_lookup_0" ON "grammar_patterns" ("module_id");

CREATE TABLE "grammar_examples" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "grammar_pattern_id" INTEGER NOT NULL,
  "japanese" TEXT NOT NULL,
  "romaji" TEXT,
  "english" TEXT NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY ("grammar_pattern_id") REFERENCES "grammar_patterns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "grammar_examples_lookup_0" ON "grammar_examples" ("grammar_pattern_id");

CREATE TABLE "quiz_questions" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "module_id" INTEGER NOT NULL,
  "question" TEXT NOT NULL,
  "options" TEXT NOT NULL CHECK ("options" IS NULL OR json_valid("options")),
  "correct_index" INTEGER NOT NULL,
  "explanation" TEXT NOT NULL,
  "question_type" TEXT NOT NULL DEFAULT 'MULTIPLE_CHOICE' CHECK ("question_type" IN ('MULTIPLE_CHOICE','FILL_BLANK','TRUE_FALSE','MATCHING')),
  "points" INTEGER NOT NULL DEFAULT 10,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY ("module_id") REFERENCES "learning_modules" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "quiz_questions_lookup_0" ON "quiz_questions" ("module_id");

CREATE TABLE "user_module_progress" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "module_id" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK ("status" IN ('NOT_STARTED','IN_PROGRESS','COMPLETED','LOCKED')),
  "progress_percent" INTEGER NOT NULL DEFAULT 0,
  "started_at" TEXT,
  "completed_at" TEXT,
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE ("user_id","module_id"),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("module_id") REFERENCES "learning_modules" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "user_module_progress_lookup_0" ON "user_module_progress" ("user_id");

CREATE INDEX "user_module_progress_lookup_1" ON "user_module_progress" ("user_id");

CREATE INDEX "user_module_progress_lookup_2" ON "user_module_progress" ("module_id");

CREATE TABLE "user_quiz_attempts" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "module_id" INTEGER NOT NULL,
  "score" INTEGER NOT NULL,
  "total_questions" INTEGER NOT NULL,
  "answers" TEXT NOT NULL CHECK ("answers" IS NULL OR json_valid("answers")),
  "time_taken" INTEGER,
  "attempted_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "request_id" TEXT,
  "request_hash" TEXT,
  "response" TEXT CHECK ("response" IS NULL OR json_valid("response")),
  UNIQUE ("user_id","request_id"),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("module_id") REFERENCES "learning_modules" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "user_quiz_attempts_lookup_0" ON "user_quiz_attempts" ("user_id");

CREATE INDEX "user_quiz_attempts_lookup_1" ON "user_quiz_attempts" ("user_id");

CREATE INDEX "user_quiz_attempts_lookup_2" ON "user_quiz_attempts" ("module_id");

CREATE TABLE "user_flashcard_progress" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "item_type" TEXT NOT NULL CHECK ("item_type" IN ('VOCAB','KANJI','GRAMMAR')),
  "item_id" INTEGER NOT NULL,
  "repetitions" INTEGER NOT NULL DEFAULT 0,
  "interval" INTEGER NOT NULL DEFAULT 0,
  "ease_factor" REAL NOT NULL DEFAULT 2.5,
  "next_review" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "last_review" TEXT,
  "status" TEXT NOT NULL DEFAULT 'LEARNING' CHECK ("status" IN ('LEARNING','REVIEWING','MASTERED')),
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE ("user_id","item_type","item_id"),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "user_flashcard_progress_lookup_0" ON "user_flashcard_progress" ("user_id","next_review");

CREATE INDEX "user_flashcard_progress_lookup_1" ON "user_flashcard_progress" ("user_id");

CREATE TABLE "user_game_scores" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "game_type" TEXT NOT NULL CHECK ("game_type" IN ('QUIZ','MATCH','SPEED')),
  "score" INTEGER NOT NULL,
  "streak" INTEGER DEFAULT 0,
  "details" TEXT CHECK ("details" IS NULL OR json_valid("details")),
  "played_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "user_game_scores_lookup_0" ON "user_game_scores" ("user_id");

CREATE INDEX "user_game_scores_lookup_1" ON "user_game_scores" ("game_type","score");

CREATE INDEX "user_game_scores_lookup_2" ON "user_game_scores" ("user_id");

CREATE TABLE "user_kana_progress" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "kana_type" TEXT NOT NULL CHECK ("kana_type" IN ('HIRAGANA','KATAKANA')),
  "character" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'LEARNING' CHECK ("status" IN ('LEARNING','MASTERED')),
  "review_count" INTEGER NOT NULL DEFAULT 0,
  "last_reviewed" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE ("user_id","kana_type","character"),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "user_kana_progress_lookup_0" ON "user_kana_progress" ("user_id");

CREATE TABLE "user_gamification" (
  "user_id" INTEGER PRIMARY KEY NOT NULL,
  "xp" INTEGER NOT NULL DEFAULT 0,
  "total_xp_earned" INTEGER NOT NULL DEFAULT 0,
  "daily_xp" INTEGER NOT NULL DEFAULT 0,
  "daily_xp_date" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "streak" INTEGER NOT NULL DEFAULT 0,
  "last_active_date" TEXT,
  "badges" TEXT NOT NULL DEFAULT '[]' CHECK ("badges" IS NULL OR json_valid("badges")),
  "stats" TEXT NOT NULL DEFAULT '{"testsCompleted":0,"flashcardsFlipped":0,"vocabReviewed":0,"kanjiReviewed":0,"quizzesTaken":0}' CHECK ("stats" IS NULL OR json_valid("stats")),
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "user_gamification_lookup_0" ON "user_gamification" ("user_id");

CREATE TABLE "dictionary_entries" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "japanese" TEXT NOT NULL,
  "romaji" TEXT,
  "english" TEXT NOT NULL,
  "type" TEXT,
  "level" TEXT,
  "example_jp" TEXT,
  "example_en" TEXT
);

CREATE TABLE "search_history" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "query" TEXT NOT NULL,
  "results_count" INTEGER NOT NULL DEFAULT 0,
  "searched_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "search_history_lookup_0" ON "search_history" ("user_id");

CREATE INDEX "search_history_lookup_1" ON "search_history" ("user_id");

CREATE TABLE "translation_history" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "source_text" TEXT NOT NULL,
  "translated_text" TEXT NOT NULL,
  "direction" TEXT NOT NULL,
  "translated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "translation_history_lookup_0" ON "translation_history" ("user_id");

CREATE INDEX "translation_history_lookup_1" ON "translation_history" ("user_id");

CREATE TABLE "test_templates" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" TEXT NOT NULL,
  "level" TEXT NOT NULL,
  "description" TEXT,
  "duration_minutes" INTEGER NOT NULL,
  "total_questions" INTEGER NOT NULL,
  "is_published" INTEGER NOT NULL DEFAULT 0 CHECK ("is_published" IN (0,1)),
  "created_by" INTEGER,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "test_templates_lookup_0" ON "test_templates" ("created_by");

CREATE TABLE "test_sections" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "template_id" INTEGER NOT NULL,
  "section_type" TEXT NOT NULL CHECK ("section_type" IN ('VOCABULARY','GRAMMAR','READING','LISTENING')),
  "title" TEXT NOT NULL,
  "duration_minutes" INTEGER,
  "sort_order" INTEGER NOT NULL,
  FOREIGN KEY ("template_id") REFERENCES "test_templates" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "test_sections_lookup_0" ON "test_sections" ("template_id");

CREATE TABLE "test_questions" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "section_id" INTEGER NOT NULL,
  "question_type" TEXT NOT NULL CHECK ("question_type" IN ('MULTIPLE_CHOICE','FILL_BLANK','READING_COMP','LISTENING_COMP')),
  "passage" TEXT,
  "question_text" TEXT NOT NULL,
  "options" TEXT NOT NULL CHECK ("options" IS NULL OR json_valid("options")),
  "correct_answer" INTEGER NOT NULL,
  "explanation" TEXT,
  "points" INTEGER NOT NULL DEFAULT 1,
  "sort_order" INTEGER NOT NULL,
  FOREIGN KEY ("section_id") REFERENCES "test_sections" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "test_questions_lookup_0" ON "test_questions" ("section_id");

CREATE TABLE "user_test_attempts" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "template_id" INTEGER NOT NULL,
  "started_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "finished_at" TEXT,
  "total_score" INTEGER NOT NULL DEFAULT 0,
  "max_score" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS' CHECK ("status" IN ('IN_PROGRESS','COMPLETED','ABANDONED')),
  "answers" TEXT NOT NULL DEFAULT '[]' CHECK ("answers" IS NULL OR json_valid("answers")),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("template_id") REFERENCES "test_templates" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "user_test_attempts_lookup_0" ON "user_test_attempts" ("user_id");

CREATE INDEX "user_test_attempts_lookup_1" ON "user_test_attempts" ("user_id");

CREATE INDEX "user_test_attempts_lookup_2" ON "user_test_attempts" ("template_id");

CREATE TABLE "user_test_answers" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "attempt_id" INTEGER NOT NULL,
  "question_id" INTEGER NOT NULL,
  "selected_answer" INTEGER NOT NULL,
  "is_correct" INTEGER NOT NULL CHECK ("is_correct" IN (0,1)),
  "points_earned" INTEGER NOT NULL DEFAULT 0,
  UNIQUE ("attempt_id","question_id"),
  FOREIGN KEY ("attempt_id") REFERENCES "user_test_attempts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("question_id") REFERENCES "test_questions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "user_test_answers_lookup_0" ON "user_test_answers" ("attempt_id");

CREATE INDEX "user_test_answers_lookup_1" ON "user_test_answers" ("question_id");

CREATE TABLE "site_settings" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "key" TEXT NOT NULL UNIQUE,
  "value" TEXT NOT NULL,
  "description" TEXT,
  "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE "announcements" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'INFO' CHECK ("type" IN ('INFO','WARNING','MAINTENANCE','UPDATE')),
  "is_active" INTEGER NOT NULL DEFAULT 1 CHECK ("is_active" IN (0,1)),
  "created_by" INTEGER,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  "expires_at" TEXT,
  FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "announcements_lookup_0" ON "announcements" ("created_by");

CREATE TABLE "activity_logs" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id" INTEGER,
  "action" TEXT NOT NULL,
  "entity_type" TEXT,
  "entity_id" INTEGER,
  "details" TEXT CHECK ("details" IS NULL OR json_valid("details")),
  "ip_address" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "activity_logs_lookup_0" ON "activity_logs" ("user_id");

CREATE INDEX "activity_logs_lookup_1" ON "activity_logs" ("action");

CREATE INDEX "activity_logs_lookup_2" ON "activity_logs" ("user_id");

CREATE TABLE study_completed_tabs (
  progress_id INTEGER NOT NULL REFERENCES user_module_progress(id) ON DELETE CASCADE,
  tab TEXT NOT NULL CHECK(tab IN ('vocab','kanji','grammar','dialogue','exercise')),
  PRIMARY KEY(progress_id,tab)
);
CREATE TABLE study_mastered_vocabulary (
  progress_id INTEGER NOT NULL REFERENCES user_module_progress(id) ON DELETE CASCADE,
  vocabulary_id INTEGER NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
  PRIMARY KEY(progress_id,vocabulary_id)
);
CREATE INDEX modules_public ON learning_modules(content_status,level_id,unit_number);
CREATE INDEX sections_public ON lesson_sections(module_id,status,sort_order);
CREATE INDEX quiz_module ON quiz_questions(module_id,id);
