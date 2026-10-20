-- UserFlashcardProgress uses a polymorphic itemId, so it cannot reference only vocabulary.
ALTER TYPE "VocabType" ADD VALUE IF NOT EXISTS 'EXPRESSION';
ALTER TYPE "VocabType" ADD VALUE IF NOT EXISTS 'PRONOUN';

ALTER TABLE "user_flashcard_progress" DROP CONSTRAINT IF EXISTS "fk_flashcard_vocab";

-- Prevent duplicate answers from inflating test scores.
CREATE UNIQUE INDEX IF NOT EXISTS "user_test_answers_attempt_id_question_id_key"
ON "user_test_answers"("attempt_id", "question_id");
