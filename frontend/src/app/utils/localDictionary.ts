export interface WordDetail {
  char: string;
  type: 'hiragana' | 'katakana' | 'kanji' | 'vocab';
  romaji?: string;
  meaning?: string;
  onyomi?: string;
  kunyomi?: string;
  level?: string;
  strokes?: number;
  vocabType?: string;
  examples?: { jp: string; en: string }[];
  related?: string[];
  mnemonic?: string;
}

export const localDictionary: {
  // en holds the Vietnamese meaning for these entries; Jisho results (remote) are in English.
  jp: string;
  rom: string;
  en: string;
  type: string;
  level: string;
  example?: string;
  exampleEn?: string;
}[] = [
  {
    jp: 'ありがとう',
    rom: 'arigatou',
    en: 'cảm ơn',
    type: 'phrase',
    level: 'N5',
    example: 'ありがとうございます',
    exampleEn: 'Cảm ơn rất nhiều (lịch sự)',
  },
  {
    jp: 'おはよう',
    rom: 'ohayou',
    en: 'chào buổi sáng',
    type: 'phrase',
    level: 'N5',
    example: 'おはようございます',
    exampleEn: 'Chào buổi sáng (lịch sự)',
  },
  { jp: 'こんにちは', rom: 'konnichiwa', en: 'xin chào', type: 'phrase', level: 'N5' },
  { jp: 'さようなら', rom: 'sayounara', en: 'tạm biệt', type: 'phrase', level: 'N5' },
  {
    jp: 'すみません',
    rom: 'sumimasen',
    en: 'xin lỗi; xin phép',
    type: 'phrase',
    level: 'N5',
    example: 'すみません、駅はどこですか',
    exampleEn: 'Xin lỗi, nhà ga ở đâu ạ?',
  },
  { jp: 'わかりません', rom: 'wakarimasen', en: 'tôi không hiểu', type: 'phrase', level: 'N5' },
  { jp: 'はい', rom: 'hai', en: 'vâng, có', type: 'interjection', level: 'N5' },
  { jp: 'いいえ', rom: 'iie', en: 'không', type: 'interjection', level: 'N5' },
  { jp: '食べる', rom: 'taberu', en: 'ăn', type: 'verb', level: 'N5', example: 'すしを食べる', exampleEn: 'ăn sushi' },
  { jp: '飲む', rom: 'nomu', en: 'uống', type: 'verb', level: 'N5', example: '水を飲む', exampleEn: 'uống nước' },
  { jp: '行く', rom: 'iku', en: 'đi', type: 'verb', level: 'N5', example: '学校に行く', exampleEn: 'đi học' },
  { jp: '来る', rom: 'kuru', en: 'đến', type: 'verb', level: 'N5' },
  { jp: '見る', rom: 'miru', en: 'nhìn, xem', type: 'verb', level: 'N5', example: '映画を見る', exampleEn: 'xem phim' },
  { jp: '聞く', rom: 'kiku', en: 'nghe; hỏi', type: 'verb', level: 'N5' },
  { jp: '話す', rom: 'hanasu', en: 'nói, nói chuyện', type: 'verb', level: 'N5' },
  { jp: '読む', rom: 'yomu', en: 'đọc', type: 'verb', level: 'N5', example: '本を読む', exampleEn: 'đọc sách' },
  { jp: '書く', rom: 'kaku', en: 'viết', type: 'verb', level: 'N5' },
  { jp: '買う', rom: 'kau', en: 'mua', type: 'verb', level: 'N5' },
  { jp: '大きい', rom: 'ookii', en: 'to, lớn', type: 'adjective', level: 'N5' },
  { jp: '小さい', rom: 'chiisai', en: 'nhỏ, bé', type: 'adjective', level: 'N5' },
  { jp: '新しい', rom: 'atarashii', en: 'mới', type: 'adjective', level: 'N5' },
  { jp: '古い', rom: 'furui', en: 'cũ', type: 'adjective', level: 'N5' },
  {
    jp: 'おいしい',
    rom: 'oishii',
    en: 'ngon',
    type: 'adjective',
    level: 'N5',
    example: 'このラーメンはおいしい',
    exampleEn: 'Món ramen này ngon',
  },
  { jp: 'かわいい', rom: 'kawaii', en: 'dễ thương', type: 'adjective', level: 'N5' },
  { jp: '学校', rom: 'gakkou', en: 'trường học', type: 'noun', level: 'N5' },
  { jp: '先生', rom: 'sensei', en: 'thầy, cô giáo', type: 'noun', level: 'N5' },
  { jp: '学生', rom: 'gakusei', en: 'học sinh, sinh viên', type: 'noun', level: 'N5' },
  { jp: '友達', rom: 'tomodachi', en: 'bạn bè', type: 'noun', level: 'N5' },
  { jp: '家族', rom: 'kazoku', en: 'gia đình', type: 'noun', level: 'N5' },
  { jp: '電話', rom: 'denwa', en: 'điện thoại', type: 'noun', level: 'N5' },
  { jp: '時間', rom: 'jikan', en: 'thời gian', type: 'noun', level: 'N5' },
  { jp: '仕事', rom: 'shigoto', en: 'công việc', type: 'noun', level: 'N5' },
  { jp: 'お金', rom: 'okane', en: 'tiền', type: 'noun', level: 'N5' },
  { jp: '天気', rom: 'tenki', en: 'thời tiết', type: 'noun', level: 'N5' },
  { jp: '今日', rom: 'kyou', en: 'hôm nay', type: 'noun', level: 'N5' },
  { jp: '明日', rom: 'ashita', en: 'ngày mai', type: 'noun', level: 'N5' },
  { jp: '昨日', rom: 'kinou', en: 'hôm qua', type: 'noun', level: 'N5' },
  { jp: '日本', rom: 'nihon', en: 'Nhật Bản', type: 'noun', level: 'N5' },
  { jp: '東京', rom: 'toukyou', en: 'Tokyo', type: 'noun', level: 'N5' },
  { jp: '愛', rom: 'ai', en: 'tình yêu', type: 'noun', level: 'N3' },
];
