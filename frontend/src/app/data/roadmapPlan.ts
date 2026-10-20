export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export type RoadmapPhase = {
  title: string;
  weeks: string;
  focus: string;
  outcomes: string[];
};

export type RoadmapPlan = {
  level: JLPTLevel;
  label: string;
  japaneseLabel: string;
  outcome: string;
  durationWeeks: number;
  hoursPerWeek: string;
  vocabulary: number;
  kanji: number;
  grammar: number;
  color: string;
  readiness: number;
  skillTargets: { label: string; value: number }[];
  phases: RoadmapPhase[];
  checkpoint: string[];
  capstone: string;
};

export const roadmapPlans: RoadmapPlan[] = [
  {
    level: "N5",
    label: "Nền tảng sinh tồn",
    japaneseLabel: "基礎・日常生活",
    outcome: "Đọc hai bảng chữ, xử lý hội thoại chậm và tự giới thiệu trong các tình huống đời sống cơ bản.",
    durationWeeks: 16,
    hoursPerWeek: "7–9 giờ",
    vocabulary: 800,
    kanji: 100,
    grammar: 80,
    color: "#477a58",
    readiness: 65,
    skillTargets: [
      { label: "Từ vựng", value: 72 }, { label: "Ngữ pháp", value: 68 },
      { label: "Kanji", value: 60 }, { label: "Kaiwa", value: 45 },
      { label: "Đọc", value: 55 }, { label: "Nghe", value: 50 }, { label: "Viết", value: 40 },
    ],
    phases: [
      { title: "Chữ viết & âm thanh", weeks: "Tuần 1–3", focus: "Kana, trường âm, âm ngắt và phát âm", outcomes: ["Đọc Kana không cần romaji", "Chép chính tả câu ngắn"] },
      { title: "Câu giao tiếp cốt lõi", weeks: "Tuần 4–10", focus: "Trợ từ, động từ, tính từ và 450 từ thiết yếu", outcomes: ["Tự giới thiệu 2 phút", "Hỏi đường, mua sắm, gọi món"] },
      { title: "Tích hợp & ôn tập", weeks: "Tuần 11–16", focus: "Đọc đoạn ngắn, nghe hội thoại và ôn kiến thức từng bài", outcomes: ["Ôn lại câu sai trong quiz", "Hoàn thành nhật ký 14 ngày"] },
    ],
    checkpoint: ["Kana đạt 95%", "Ôn đúng hạn 80%", "Đọc 600 chữ trong 10 phút", "Ôn lại câu sai trong quiz"],
    capstone: "Ghi âm bài tự giới thiệu và hoàn thành một ngày du lịch Nhật Bản giả lập.",
  },
  {
    level: "N4",
    label: "Giao tiếp đời sống",
    japaneseLabel: "初級・生活会話",
    outcome: "Duy trì hội thoại quen thuộc, kể trải nghiệm và đọc thông báo hoặc email đơn giản.",
    durationWeeks: 20,
    hoursPerWeek: "8–10 giờ",
    vocabulary: 1500,
    kanji: 300,
    grammar: 120,
    color: "#2f6f88",
    readiness: 25,
    skillTargets: [
      { label: "Từ vựng", value: 65 }, { label: "Ngữ pháp", value: 64 },
      { label: "Kanji", value: 64 }, { label: "Kaiwa", value: 60 },
      { label: "Đọc", value: 60 }, { label: "Nghe", value: 58 }, { label: "Viết", value: 52 },
    ],
    phases: [
      { title: "Mở rộng cấu trúc", weeks: "Tuần 1–7", focus: "Thể て, thể thường, khả năng và kinh nghiệm", outcomes: ["Nối 5–7 câu tự nhiên", "Mô tả thói quen và trải nghiệm"] },
      { title: "Tương tác xã hội", weeks: "Tuần 8–14", focus: "Cho nhận, nhờ vả, so sánh và kế hoạch", outcomes: ["Hội thoại 5 phút", "Viết email cá nhân 150 chữ"] },
      { title: "Đọc nghe thực dụng", weeks: "Tuần 15–20", focus: "Thông báo, lịch trình và hội thoại tốc độ vừa", outcomes: ["Đạt 70% đề N4", "Theo dõi vlog có phụ đề Nhật"] },
    ],
    checkpoint: ["1.500 từ nhận diện", "300 Kanji đạt 85%", "Nghe bắt ý chính 70%", "Mock test đạt 70%"],
    capstone: "Lập kế hoạch chuyến đi 3 ngày bằng tiếng Nhật và trình bày trong 5 phút.",
  },
  {
    level: "N3",
    label: "Cầu nối trung cấp",
    japaneseLabel: "中級・自立した日本語",
    outcome: "Theo dõi nội dung đời sống ở tốc độ tự nhiên vừa phải và trình bày quan điểm có lý do.",
    durationWeeks: 24,
    hoursPerWeek: "10–12 giờ",
    vocabulary: 3700,
    kanji: 650,
    grammar: 150,
    color: "#725b8f",
    readiness: 10,
    skillTargets: [
      { label: "Từ vựng", value: 70 }, { label: "Ngữ pháp", value: 68 },
      { label: "Kanji", value: 68 }, { label: "Kaiwa", value: 66 },
      { label: "Đọc", value: 66 }, { label: "Nghe", value: 64 }, { label: "Viết", value: 62 },
    ],
    phases: [
      { title: "Chuyển sang tiếng Nhật thật", weeks: "Tuần 1–8", focus: "Cụm từ, sắc thái và liên kết đoạn", outcomes: ["Bỏ dịch từng từ", "Tóm tắt bản tin 3 câu"] },
      { title: "Quan điểm & lập luận", weeks: "Tuần 9–17", focus: "Nguyên nhân, giả định, đối chiếu và cảm xúc", outcomes: ["Viết 300 chữ", "Tranh luận ngắn có dẫn chứng"] },
      { title: "Tốc độ & chiến thuật thi", weeks: "Tuần 18–24", focus: "Skimming, nghe chọn lọc và đề tổng hợp", outcomes: ["Đạt 70% đề N3", "Đọc một graded reader"] },
    ],
    checkpoint: ["Đọc 900 chữ trong 12 phút", "Viết 300 chữ mạch lạc", "Nghe không phụ đề 60%", "Mock test đạt 70%"],
    capstone: "Đọc một bài báo đời sống, viết tóm tắt và thuyết trình quan điểm trong 7 phút.",
  },
  {
    level: "N2",
    label: "Năng lực chuyên nghiệp",
    japaneseLabel: "上級・仕事と社会",
    outcome: "Sử dụng tiếng Nhật trong công việc, hiểu tin tức và xử lý văn bản có lập luận phức tạp.",
    durationWeeks: 28,
    hoursPerWeek: "12–14 giờ",
    vocabulary: 6000,
    kanji: 1000,
    grammar: 200,
    color: "#a85e13",
    readiness: 0,
    skillTargets: [
      { label: "Từ vựng", value: 75 }, { label: "Ngữ pháp", value: 72 },
      { label: "Kanji", value: 74 }, { label: "Kaiwa", value: 72 },
      { label: "Đọc", value: 74 }, { label: "Nghe", value: 70 }, { label: "Viết", value: 70 },
    ],
    phases: [
      { title: "Văn phong trang trọng", weeks: "Tuần 1–9", focus: "Kính ngữ, email, báo cáo và từ ghép", outcomes: ["Viết email công việc", "Tham gia họp mô phỏng"] },
      { title: "Xã hội & truyền thông", weeks: "Tuần 10–19", focus: "Tin tức, bình luận và lập luận trừu tượng", outcomes: ["Tóm tắt bài báo 500 chữ", "Phân biệt quan điểm tác giả"] },
      { title: "Hiệu suất N2", weeks: "Tuần 20–28", focus: "Đọc nhanh, nghe tức thời và bộ đề chuẩn", outcomes: ["Đạt 70% đề N2", "Hoàn thành 4 đề đúng giờ"] },
    ],
    checkpoint: ["1.000 Kanji chủ động", "Đọc 1.200 chữ trong 12 phút", "Nghe tin tức bắt ý 70%", "Mock test đạt 70%"],
    capstone: "Chuẩn bị hồ sơ ứng tuyển và thực hiện phỏng vấn công việc mô phỏng bằng tiếng Nhật.",
  },
  {
    level: "N1",
    label: "Làm chủ học thuật",
    japaneseLabel: "最上級・専門と教養",
    outcome: "Hiểu sắc thái tinh tế trong học thuật, truyền thông và giao tiếp chuyên môn ở tốc độ tự nhiên.",
    durationWeeks: 32,
    hoursPerWeek: "14–16 giờ",
    vocabulary: 10000,
    kanji: 2000,
    grammar: 250,
    color: "#a33b35",
    readiness: 0,
    skillTargets: [
      { label: "Từ vựng", value: 80 }, { label: "Ngữ pháp", value: 78 },
      { label: "Kanji", value: 80 }, { label: "Kaiwa", value: 78 },
      { label: "Đọc", value: 80 }, { label: "Nghe", value: 76 }, { label: "Viết", value: 78 },
    ],
    phases: [
      { title: "Sắc thái & diễn ngôn", weeks: "Tuần 1–10", focus: "Đồng nghĩa, quán ngữ và văn phong học thuật", outcomes: ["Giải thích khác biệt sắc thái", "Đọc xã luận không tra liên tục"] },
      { title: "Chuyên môn sâu", weeks: "Tuần 11–22", focus: "Luật, kinh tế, văn học và thảo luận chuyên ngành", outcomes: ["Tóm tắt podcast 20 phút", "Viết luận 800 chữ"] },
      { title: "Ổn định năng lực N1", weeks: "Tuần 23–32", focus: "Tốc độ, độ chính xác và đề áp lực cao", outcomes: ["Đạt 70% đề N1", "Duy trì 5 đề liên tiếp"] },
    ],
    checkpoint: ["10.000 từ nhận diện", "Đọc 1.500 chữ trong 10 phút", "Luận 800 chữ có phản biện", "Mock test đạt 70%"],
    capstone: "Nghiên cứu một chủ đề chuyên môn, viết báo cáo 1.200 chữ và bảo vệ quan điểm trong 12 phút.",
  },
];

export const weeklyRhythm = [
  { day: "Thứ 2", focus: "Từ vựng + SRS", minutes: 60 },
  { day: "Thứ 3", focus: "Ngữ pháp + bài tập", minutes: 75 },
  { day: "Thứ 4", focus: "Kanji + viết", minutes: 60 },
  { day: "Thứ 5", focus: "Nghe sâu + shadowing", minutes: 75 },
  { day: "Thứ 6", focus: "Đọc hiểu + tóm tắt", minutes: 75 },
  { day: "Thứ 7", focus: "Output + dự án", minutes: 120 },
  { day: "Chủ nhật", focus: "Ôn lỗi + kiểm tra tuần", minutes: 60 },
];
