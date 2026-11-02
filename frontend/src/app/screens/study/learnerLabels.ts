const exerciseLabels: Record<string, string> = {
  MULTIPLE_CHOICE: 'Trắc nghiệm',
  FILL_BLANK: 'Điền chỗ trống',
  TRUE_FALSE: 'Đúng / Sai',
  MATCHING: 'Nối cặp',
  SENTENCE_ORDERING: 'Sắp xếp câu',
  SHORT_ANSWER: 'Trả lời ngắn',
  DICTATION: 'Nghe chép chính tả',
  SHADOWING: 'Nghe và nói theo',
};
const vocabularyLabels: Record<string, string> = {
  NOUN: 'Danh từ',
  PRONOUN: 'Đại từ',
  EXPRESSION: 'Cách diễn đạt',
  PHRASE: 'Cụm từ',
  VERB: 'Động từ',
  PARTICLE: 'Trợ từ',
  ADVERB: 'Trạng từ',
  ADJECTIVE: 'Tính từ',
};
export const exerciseTypeLabel = (type?: string) => exerciseLabels[type?.trim().toUpperCase() || ''] || 'Bài tập';
export const vocabularyTypeLabel = (type?: string) => vocabularyLabels[type?.trim().toUpperCase() || ''] || 'Từ vựng';
