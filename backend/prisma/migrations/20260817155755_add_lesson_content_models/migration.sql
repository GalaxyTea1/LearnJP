-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LessonSectionType" AS ENUM ('OVERVIEW', 'VOCABULARY', 'KANJI', 'GRAMMAR', 'KAIWA', 'LISTENING', 'READING', 'WRITING', 'EXERCISE', 'SUMMARY');

-- CreateEnum
CREATE TYPE "LessonExerciseType" AS ENUM ('MULTIPLE_CHOICE', 'FILL_BLANK', 'TRUE_FALSE', 'MATCHING', 'SENTENCE_ORDERING', 'SHORT_ANSWER', 'DICTATION', 'SHADOWING');

-- AlterTable
ALTER TABLE "learning_modules" ADD COLUMN     "content_status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "published_at" TIMESTAMP(3),
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "lesson_sections" (
    "id" SERIAL NOT NULL,
    "module_id" INTEGER NOT NULL,
    "section_type" "LessonSectionType" NOT NULL,
    "title" TEXT NOT NULL,
    "title_jp" TEXT,
    "instructions" TEXT,
    "sort_order" INTEGER NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "review_notes" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "context" TEXT,
    "audio_url" TEXT,
    "sort_order" INTEGER NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_lines" (
    "id" SERIAL NOT NULL,
    "conversation_id" INTEGER NOT NULL,
    "speaker" TEXT NOT NULL,
    "japanese" TEXT NOT NULL,
    "hiragana" TEXT,
    "romaji" TEXT,
    "translation" TEXT,
    "audio_url" TEXT,
    "notes" TEXT,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversation_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listening_content" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT,
    "audio_url" TEXT NOT NULL,
    "duration_seconds" INTEGER,
    "playback_speed" DOUBLE PRECISION,
    "transcript" TEXT NOT NULL,
    "transcript_reading" TEXT,
    "transcript_translation" TEXT,
    "source" TEXT,
    "sort_order" INTEGER NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listening_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_passages" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "reading" TEXT,
    "translation" TEXT,
    "source" TEXT,
    "estimated_level" TEXT,
    "sort_order" INTEGER NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_passages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "writing_tasks" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "instructions" TEXT,
    "sample_answer" TEXT,
    "rubric" JSONB,
    "min_length" INTEGER,
    "max_length" INTEGER,
    "sort_order" INTEGER NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "writing_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_exercises" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "listening_id" INTEGER,
    "reading_passage_id" INTEGER,
    "exercise_type" "LessonExerciseType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "options" JSONB,
    "correct_answer" JSONB,
    "explanation" TEXT,
    "points" INTEGER NOT NULL DEFAULT 1,
    "sort_order" INTEGER NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lesson_sections_module_id_status_idx" ON "lesson_sections"("module_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_sections_module_id_sort_order_key" ON "lesson_sections"("module_id", "sort_order");

-- CreateIndex
CREATE INDEX "conversations_section_id_status_idx" ON "conversations"("section_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_section_id_sort_order_key" ON "conversations"("section_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_lines_conversation_id_sort_order_key" ON "conversation_lines"("conversation_id", "sort_order");

-- CreateIndex
CREATE INDEX "listening_content_section_id_status_idx" ON "listening_content"("section_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "listening_content_section_id_sort_order_key" ON "listening_content"("section_id", "sort_order");

-- CreateIndex
CREATE INDEX "reading_passages_section_id_status_idx" ON "reading_passages"("section_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "reading_passages_section_id_sort_order_key" ON "reading_passages"("section_id", "sort_order");

-- CreateIndex
CREATE INDEX "writing_tasks_section_id_status_idx" ON "writing_tasks"("section_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "writing_tasks_section_id_sort_order_key" ON "writing_tasks"("section_id", "sort_order");

-- CreateIndex
CREATE INDEX "lesson_exercises_section_id_status_idx" ON "lesson_exercises"("section_id", "status");

-- CreateIndex
CREATE INDEX "lesson_exercises_listening_id_idx" ON "lesson_exercises"("listening_id");

-- CreateIndex
CREATE INDEX "lesson_exercises_reading_passage_id_idx" ON "lesson_exercises"("reading_passage_id");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_exercises_section_id_sort_order_key" ON "lesson_exercises"("section_id", "sort_order");

-- AddForeignKey
ALTER TABLE "lesson_sections" ADD CONSTRAINT "lesson_sections_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "learning_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "lesson_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_lines" ADD CONSTRAINT "conversation_lines_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listening_content" ADD CONSTRAINT "listening_content_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "lesson_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_passages" ADD CONSTRAINT "reading_passages_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "lesson_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writing_tasks" ADD CONSTRAINT "writing_tasks_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "lesson_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_exercises" ADD CONSTRAINT "lesson_exercises_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "lesson_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_exercises" ADD CONSTRAINT "lesson_exercises_listening_id_fkey" FOREIGN KEY ("listening_id") REFERENCES "listening_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_exercises" ADD CONSTRAINT "lesson_exercises_reading_passage_id_fkey" FOREIGN KEY ("reading_passage_id") REFERENCES "reading_passages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
