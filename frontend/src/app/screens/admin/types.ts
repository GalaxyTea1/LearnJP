export type ContentStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";

export interface ModuleFromApi {
  id: number;
  title: string;
  titleJp: string;
  description: string;
  unitNumber: number;
  sortOrder: number;
  contentStatus: ContentStatus;
  version: number;
  publishedAt: string | null;
  level: { level: string; title: string; color: string };
  _count: { vocabulary: number; kanji: number; grammarPatterns: number; quizQuestions: number };
  status?: string;
  progressPercent?: number;
}

export interface ModuleFullContent extends ModuleFromApi {
  sections: SectionData[];
  vocabulary: any[];
  kanji: any[];
  grammarPatterns: any[];
  quizQuestions: any[];
}

export interface SectionData {
  id: number;
  sectionType: string;
  title: string;
  sortOrder: number;
  isRequired: boolean;
  status: ContentStatus;
  reviewNotes: string | null;
  conversations: any[];
  listeningContent: any[];
  readingPassages: any[];
  writingTasks: any[];
  exercises: any[];
}

export const STATUS_META: Record<ContentStatus, { label: string; bg: string; text: string; description: string }> = {
  DRAFT: {
    label: "DRAFT",
    bg: "bg-blue-50",
    text: "text-blue-700",
    description: "Đã import. Kiểm tra DB, sửa nội dung, kiểm tra API. Chưa cho người học.",
  },
  IN_REVIEW: {
    label: "IN_REVIEW",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    description: "Nội dung hoàn thiện, đang chờ review cuối. Cần validator pass, Prisma Studio, API, tiếng Nhật, quiz, sections.",
  },
  PUBLISHED: {
    label: "PUBLISHED",
    bg: "bg-green-100",
    text: "text-green-700",
    description: "Live cho người học. Tất cả section, audio, quiz đã sẵn sàng.",
  },
  ARCHIVED: {
    label: "ARCHIVED",
    bg: "bg-gray-200",
    text: "text-gray-600",
    description: "Module cũ, đã thay thế. Giữ lịch sử và truy vết.",
  },
};
