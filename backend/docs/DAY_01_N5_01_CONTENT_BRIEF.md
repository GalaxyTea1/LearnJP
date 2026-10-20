# Day 01 Content Brief - N5-01

Tai lieu nay la dau vao cho Gemini AI tao du lieu bai hoc dau tien cua
SumaryJapanese. Gemini chi tao **content data**, khong tao migration, khong tu
dat ID database va khong sua schema.

## 1. Thong tin bai hoc

```text
Code: N5-01
Level: N5
Unit: 1
Title: Kana, greetings and self-introduction
Title JP: ひらがな・カタカナ・あいさつ・自己紹介
Status: DRAFT
```

### Muc tieu dau ra

Sau bai hoc, nguoi hoc co the:

1. Nhan dien va doc dung 46 Hiragana co ban.
2. Nhan dien va doc dung 46 Katakana co ban o muc nhap mon.
3. Hieu va su dung 10-12 loi chao thong dung.
4. Tu gioi thieu ten, quoc tich, nghe nghiep va nguoi hoc.
5. Dung duoc `A は B です` va `A は B ですか`.
6. Nghe va nhan dien mot bai tu gioi thieu cham.
7. Viet duoc 5-8 cau gioi thieu ban than.

## 2. Dinh muc du lieu ngay 1

Khong can tao qua nhieu. Uu tien du lieu day du mot bai hoc.

| Loai | So luong muc tieu | Bang/model |
|---|---:|---|
| Module | 1 | `LearningModule` |
| Section | 10 | `LessonSection` |
| Vocabulary | 45-50 | `Vocabulary` |
| Kanji | 8 | `Kanji` |
| Grammar | 5 | `GrammarPattern` + `GrammarExample` |
| Kaiwa | 2 | `Conversation` + `ConversationLine` |
| Listening | 2 | `ListeningContent` |
| Reading | 2 | `ReadingPassage` |
| Writing | 2 | `WritingTask` |
| Lesson exercises | 30 | `LessonExercise` |
| Module quiz | 15 | `QuizQuestion` |

## 3. Section bat buoc

Tao theo thu tu sau de frontend co the hien thi dong nhat:

| Sort | Type | Noi dung |
|---:|---|---|
| 1 | `OVERVIEW` | Muc tieu, cach hoc, tu kiem tra dau vao |
| 2 | `VOCABULARY` | Loi chao, quoc gia, nghe nghiep, lop hoc |
| 3 | `KANJI` | 日, 本, 人, 学, 生, 語, 私, 先 |
| 4 | `GRAMMAR` | は, です, ですか va tu gioi thieu |
| 5 | `KAIWA` | Gap lan dau; tu gioi thieu trong lop hoc |
| 6 | `LISTENING` | Nghe loi chao va nghe bai tu gioi thieu |
| 7 | `READING` | Ho so hoc vien va doan tu gioi thieu ngan |
| 8 | `WRITING` | Viet profile va viet 5-8 cau gioi thieu |
| 9 | `EXERCISE` | Bai tap tong hop theo ky nang |
| 10 | `SUMMARY` | Tom tat, loi sai thuong gap, checklist |

Tat ca section bat buoc dung:

```json
{
  "status": "DRAFT",
  "version": 1,
  "isRequired": true
}
```

## 4. Yeu cau Vocabulary

Tao 45-50 tu, phan bo:

- 10 loi chao/cum tu co dinh;
- 8 dai tu va cach goi nguoi;
- 8 quoc gia/ngon ngu;
- 8 nghe nghiep/doi tuong lop hoc;
- 6 dong tu co ban: hoc, doc, noi, nghe, song, lam;
- 5 tu phuc vu gioi thieu ban than.

Moi record phai co:

```json
{
  "japanese": "学生",
  "hiragana": "がくせい",
  "romaji": "gakusei",
  "english": "student",
  "type": "NOUN",
  "level": "N5",
  "lesson": "N5-01",
  "exampleJp": "私は学生です。",
  "exampleEn": "I am a student."
}
```

Quy tac:

- `romaji` dung Hepburn nhat quan.
- Khong de nghia tieng Anh mo ho neu co the viet ro.
- Moi tu phai co it nhat mot cau vi du cap N5.
- Khong trung voi tu da co trong cung module.
- Dung enum: `PHRASE`, `EXPRESSION`, `PRONOUN`, `VERB`, `ADJECTIVE`, `NOUN`, `ADVERB`, `PARTICLE`.

## 5. Yeu cau Kanji

Tao 8 Kanji uu tien cho bai dau:

```text
日 本 人 学 生 語 私 先
```

Moi Kanji phai co:

- `character`;
- `meaning`;
- `onyomi` va `kunyomi` neu co;
- `level: N5`;
- `strokeCount`;
- `radical`;
- 2-3 `exampleWords` dang `{ "jp": "...", "en": "..." }`;
- `mnemonic` ngan, de nho, khong khang dinh sai ve nguon goc chu.

Khong tao trung `character` voi Kanji da ton tai trong database.

## 6. Yeu cau Grammar

Tao 5 mau sau:

1. `A は B です`
2. `A は B ですか`
3. `A は B ではありません`
4. `N の N`
5. `これ / それ / あれ は N です`

Moi mau can co:

- pattern;
- meaning Vietnamese va English;
- explanation de nguoi moi hieu;
- 3 cau vi du: khang dinh, hoi hoac phu dinh tuy mau;
- 5 bai tap rieng;
- loi sai thuong gap;
- ghi chu phat am `は = wa` trong vai tro tro tu.

## 7. Yeu cau Kaiwa

Tao 2 conversation:

### Kaiwa 1: Gap lan dau

- 2 nguoi hoc gap nhau.
- 8-10 luot noi.
- Co `はじめまして`, ten, quoc tich va `よろしくお願いします`.
- Co ban dich tu nhien, khong dich tung chu.

### Kaiwa 2: Trong lop hoc

- Giao vien va hoc vien.
- 8-12 luot noi.
- Co hoi ten, nghe nghiep, cach goi giao vien va ban hoc.
- Co mot bien the polite ro rang.

Moi `ConversationLine` phai co:

```json
{
  "speaker": "A",
  "japanese": "はじめまして。",
  "hiragana": "はじめまして。",
  "romaji": "Hajimemashite.",
  "translation": "Rat vui duoc gap ban.",
  "sortOrder": 1
}
```

Khong tu tao `audioUrl` that. Dung placeholder:

```text
PENDING_AUDIO:n5-01-kaiwa-01
```

## 8. Yeu cau Listening

Tao 2 bai nghe:

1. Bai nghe loi chao, 20-30 giay.
2. Bai nghe tu gioi thieu, 35-50 giay.

Moi bai phai co:

- title;
- instructions;
- transcript tieng Nhat;
- transcript reading;
- transcript translation;
- duration seconds uoc tinh;
- playback speed: `0.8` hoac `0.9` cho N5;
- source: `Original SumaryJapanese content`;
- 3-5 LessonExercise gan bang `listeningId`.

`audioUrl` bat buoc nhung chua co audio that, dung:

```text
PENDING_AUDIO:n5-01-listening-01
PENDING_AUDIO:n5-01-listening-02
```

Khong publish Listening khi `audioUrl` van la placeholder.

## 9. Yeu cau Reading

Tao 2 passage:

1. Ho so hoc vien, 80-120 ky tu.
2. Doan tu gioi thieu, 150-220 ky tu.

Moi passage co 3-5 cau hoi gom:

- tim thong tin truc tiep;
- chon y chinh;
- doc ten/quoc tich/nghe nghiep;
- khong yeu cau ngu phap ngoai N5-01.

## 10. Yeu cau Writing va Output

Tao 2 `WritingTask`:

1. Dien profile: ten, quoc tich, nghe nghiep.
2. Viet 5-8 cau tu gioi thieu.

Moi task co:

- prompt;
- instructions;
- sampleAnswer;
- rubric gom grammar, vocabulary, completeness;
- minLength va maxLength;
- ghi ro don vi la so cau hay so ky tu.

## 11. Yeu cau LessonExercise

Tao tong 30 bai tap:

- 8 vocabulary;
- 6 Kanji;
- 8 grammar;
- 3 listening;
- 3 reading;
- 2 sentence ordering.

Dung nhieu `exerciseType`:

```text
MULTIPLE_CHOICE
FILL_BLANK
TRUE_FALSE
MATCHING
SENTENCE_ORDERING
DICTATION
```

Quy tac dap an:

- index bat dau tu `0`;
- `correctAnswer` phai khop voi `options`;
- co explanation;
- points tu 1 den 3;
- khong tra dap an truoc khi submit o API.

## 12. Yeu cau module quiz

Tao 15 `QuizQuestion` tong hop:

- 5 vocabulary/Kanji;
- 5 grammar;
- 3 kaiwa/listening;
- 2 reading.

Tat ca cau quiz dung `questionType: MULTIPLE_CHOICE`, `points: 10` trong ngay dau.
Nhung ngay sau co the bo sung `FILL_BLANK`, `TRUE_FALSE` va `MATCHING`.

## 13. Format Gemini phai tra ve

Yeu cau Gemini tra ve **mot JSON duy nhat**, khong markdown, theo khung:

```json
{
  "module": {},
  "sections": [],
  "vocabulary": [],
  "kanji": [],
  "grammar": [],
  "conversations": [],
  "listening": [],
  "reading": [],
  "writing": [],
  "exercises": [],
  "quiz": []
}
```

Gemini khong duoc tao:

- `id`;
- `moduleId`;
- `sectionId`;
- `conversationId`;
- `listeningId`;
- `readingPassageId`;
- SQL migration;
- mat khau, token hoac URL audio gia.

Script import se tu tim ID sau khi tao module va section.

## 14. Checklist truoc khi import

- [ ] JSON parse duoc.
- [ ] Co dung 10 sections.
- [ ] Sort order khong trung.
- [ ] Co 45-50 vocabulary.
- [ ] Co 8 Kanji dung danh sach.
- [ ] Co 5 grammar patterns.
- [ ] Co 2 conversations.
- [ ] Co 2 listening va placeholder dung format.
- [ ] Co 2 reading passages.
- [ ] Co 2 writing tasks.
- [ ] Co 30 exercises.
- [ ] Co 15 quiz questions.
- [ ] Khong co ID tu bịa.
- [ ] Khong co dap an ngoai index.
- [ ] Khong publish khi audio chua co that.

Sau khi Gemini tra JSON, luu file goc vao `prisma/seed-data/n5/n5-01.json`.
Khong dan truc tiep JSON vao pgAdmin ma khong luu ban goc trong repository.
