// Numeric answers in imported multiple-choice content are zero-based indexes.
// Text answers (including numeric text) belong to free-text exercises.
export function answerDisplay(answer: unknown, options?: string[] | null): string {
  if (answer === null || answer === undefined || answer === '') return 'Chưa có đáp án mẫu.';
  if (typeof answer === 'number') {
    if (options) return Number.isInteger(answer) && answer >= 0 && answer < options.length
      ? options[answer] : 'Đáp án chưa hợp lệ. Vui lòng báo lỗi nội dung.';
    return String(answer);
  }
  if (typeof answer === 'string') return answer;
  if (typeof answer === 'boolean') return answer ? 'Đúng' : 'Sai';
  if (Array.isArray(answer)) return answer.map(item => answerDisplay(item, options)).join(' · ');
  return 'Chưa hỗ trợ hiển thị đáp án này.';
}
