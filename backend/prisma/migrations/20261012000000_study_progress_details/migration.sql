ALTER TABLE "user_module_progress"
ADD COLUMN "completed_tabs" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "mastered_vocabulary_ids" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[];
