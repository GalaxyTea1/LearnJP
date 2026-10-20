ALTER TABLE "user_quiz_attempts" ADD COLUMN "request_id" UUID, ADD COLUMN "request_hash" TEXT, ADD COLUMN "response" JSONB;
CREATE UNIQUE INDEX "user_quiz_attempts_user_id_request_id_key" ON "user_quiz_attempts"("user_id", "request_id");
