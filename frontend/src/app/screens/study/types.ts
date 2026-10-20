export interface VocabularyItem {
  id: number;
  moduleId: number;
  japanese: string;
  hiragana: string;
  romaji: string;
  english: string;
  type?: string;
  exampleJp?: string | null;
  exampleEn?: string | null;
  audioUrl?: string | null;
}

export interface KanjiExample {
  jp: string;
  en: string;
}

export interface KanjiItem {
  id: number;
  moduleId: number;
  character: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  strokeCount: number;
  radical?: string | null;
  mnemonic?: string | null;
  exampleWords?: KanjiExample[] | null;
}

export interface GrammarExample {
  id: number;
  grammarPatternId?: number;
  japanese: string;
  romaji?: string | null;
  english: string;
  sortOrder?: number;
}

export interface GrammarPattern {
  id: number;
  moduleId: number;
  pattern: string;
  meaning: string;
  explanation: string;
  level?: string;
  lesson?: string;
  examples: GrammarExample[];
}

export interface DialogueLine {
  id: number;
  speaker: string;
  japanese: string;
  hiragana?: string | null;
  romaji?: string | null;
  translation?: string | null;
  sortOrder: number;
}

export interface Conversation {
  id: number;
  title: string;
  context?: string | null;
  lines: DialogueLine[];
}

export interface ListeningItem {
  id: number;
  title: string;
  instructions?: string | null;
  audioUrl?: string | null;
  transcript?: string | null;
  transcriptReading?: string | null;
  transcriptTranslation?: string | null;
}

export interface ReadingExercise {
  id: number;
  prompt: string;
  options?: string[];
  correctAnswer?: unknown;
  explanation?: string;
}

export interface ReadingPassage {
  id: number;
  title: string;
  content: string;
  translation?: string | null;
  exercises?: ReadingExercise[];
}

export interface WritingTask {
  id: number;
  prompt: string;
  instructions?: string | null;
  sampleAnswer?: string | null;
}

export interface ExerciseItem {
  id: number;
  listeningId?: number | null;
  readingPassageId?: number | null;
  prompt: string;
  exerciseType?: string;
  options?: string[];
  correctAnswer?: unknown;
  explanation?: string;
}

export interface SectionItem {
  id: number;
  sectionType: string;
  title: string;
  sortOrder: number;
  conversations?: Conversation[];
  listeningContent?: ListeningItem[];
  readingPassages?: ReadingPassage[];
  writingTasks?: WritingTask[];
  exercises?: ExerciseItem[];
}

export interface QuizQuestionItem {
  id: number;
  question: string;
  options: string[];
  explanation?: string;
  questionType?: string;
  points: number;
}

export interface StudyModuleData {
  quizRevision?: string;
  id: number;
  unitNumber: number;
  title: string;
  titleJp: string;
  description: string;
  topics?: string[];
  level: {
    level: string;
    title: string;
    color: string;
  };
  vocabulary: VocabularyItem[];
  kanji: KanjiItem[];
  grammarPatterns: GrammarPattern[];
  sections: SectionItem[];
  quizQuestions: QuizQuestionItem[];
  userProgress?: {
    status: string;
    progressPercent: number;
  };
}

export type StudyTabId = "vocab" | "kanji" | "grammar" | "dialogue" | "exercise" | "quiz";

export interface StudyTabConfig {
  id: StudyTabId;
  label: string;
  icon: string;
  countBadge?: number | string;
}
