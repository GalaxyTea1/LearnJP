# N4 Content Brief Template

Tai lieu nay la template brief cho Gemini AI tao du lieu tung module N4.
Copy file nay, dien thong tin cho module cu the va gui cho Gemini cung voi
`CURRICULUM_SOURCE_OF_TRUTH_N4.md` va `cumulative-ledger.json`.

---

## 1. Thong tin bai hoc

```text
Code: N4-XX
Level: N4
Unit: XX
Title: [Dien title tieng Anh]
Title JP: [Dien title tieng Nhat]
Status: DRAFT
Prerequisites: N5 complete + N4-01 to N4-[XX-1]
```

### Muc tieu dau ra

Sau bai hoc, nguoi hoc co the:

1. [Outcome 1 - tu vung]
2. [Outcome 2 - Kanji]
3. [Outcome 3 - ngu phap 1]
4. [Outcome 4 - ngu phap 2]
5. [Outcome 5 - giao tiep/kaiwa]
6. [Outcome 6 - nghe hieu]
7. [Outcome 7 - doc hieu]
8. [Outcome 8 - viet/output]

## 2. Dinh muc du lieu

| Loai | So luong muc tieu | Bang/model |
|---|---:|---|
| Module | 1 | `LearningModule` |
| Section | 10 | `LessonSection` |
| Vocabulary | 50-80 | `Vocabulary` |
| Kanji | 10-16 | `Kanji` |
| Grammar | 6-9 | `GrammarPattern` + `GrammarExample` |
| Kaiwa | 2 | `Conversation` + `ConversationLine` |
| Listening | 2-3 | `ListeningContent` |
| Reading | 2 | `ReadingPassage` |
| Writing | 2 | `WritingTask` |
| Lesson exercises | 35-45 | `LessonExercise` |
| Module quiz | 20 | `QuizQuestion` |

## 3. Section bat buoc

Tao theo thu tu sau de frontend hien thi dong nhat:

| Sort | Type | Noi dung |
|---:|---|---|
| 1 | `OVERVIEW` | Muc tieu, on N5 lien quan, tu kiem tra dau vao |
| 2 | `VOCABULARY` | [Dien pham vi tu vung] |
| 3 | `KANJI` | [Dien danh sach Kanji moi] |
| 4 | `GRAMMAR` | [Dien danh sach mau ngu phap] |
| 5 | `KAIWA` | [Dien 2 tinh huong hoi thoai] |
| 6 | `LISTENING` | [Dien 2-3 bai nghe] |
| 7 | `READING` | [Dien 2 bai doc] |
| 8 | `WRITING` | [Dien 2 bai viet/output] |
| 9 | `EXERCISE` | Bai tap tong hop theo ky nang |
| 10 | `SUMMARY` | Tom tat, loi sai thuong gap, so sanh ngu phap, checklist |

Tat ca section bat buoc dung:

```json
{
  "status": "DRAFT",
  "version": 1,
  "isRequired": true
}
```

## 4. Yeu cau Vocabulary

Tao 50-80 tu, phan bo:

- [XX] tu vung chu de chinh 1: [dien];
- [XX] tu vung chu de chinh 2: [dien];
- [XX] dong tu lien quan (bao gom cac the: plain, te-form, potential...);
- [XX] tinh tu moi;
- [XX] pho tu va cum tu co dinh;
- [XX] tu phuc vu cho tinh huong giao tiep.

Moi record phai co:

```json
{
  "japanese": "経験",
  "hiragana": "けいけん",
  "romaji": "keiken",
  "english": "experience",
  "vietnamese": "kinh nghiệm",
  "type": "NOUN",
  "level": "N4",
  "lesson": "N4-XX",
  "exampleJp": "日本に住んだ経験があります。",
  "exampleEn": "I have the experience of living in Japan.",
  "exampleVi": "Tôi có kinh nghiệm sống ở Nhật.",
  "introducedIn": "N4-XX",
  "sourceRef": "N4-XX.vocab.001"
}
```

Quy tac:

- `romaji` dung Hepburn nhat quan.
- Nghia co ca tieng Anh va tieng Viet.
- Moi tu phai co it nhat mot cau vi du cap N4.
- Dong tu ghi ro nhom (1/2/3) va cho biet dictionary form.
- Tinh tu ghi ro loai (i/na).
- Khong trung voi tu da co trong cumulative ledger hoac module truoc.
- Dung enum: `PHRASE`, `EXPRESSION`, `PRONOUN`, `VERB`, `ADJECTIVE`, `NOUN`,
  `ADVERB`, `PARTICLE`, `CONJUNCTION`, `COUNTER`.
- Tu N5 da hoc co the xuat hien trong vi du nhung khong tinh vao quota tu moi.

## 5. Yeu cau Kanji

Tao 10-16 Kanji theo danh sach da khoa:

```text
[Dien danh sach Kanji cua module, vi du: 経 験 旅 行 写 真 予 定 計 画]
```

Moi Kanji phai co:

- `character`;
- `meaning` (English va Vietnamese);
- `onyomi` va `kunyomi` (ghi bang Katakana va Hiragana);
- `level: N4`;
- `strokeCount`;
- `radical`;
- 3-4 `exampleWords` dang `{ "jp": "...", "reading": "...", "en": "...", "vi": "..." }`;
- `mnemonic` ngan, de nho, khong khang dinh sai ve nguon goc chu;
- `introducedIn`: `N4-XX`;
- `sourceRef`: `N4-XX.kanji.001`.

Khong tao trung `character` voi Kanji da ton tai trong N5 hoac module truoc.

## 6. Yeu cau Grammar

Tao 6-9 mau ngu phap theo danh sach da khoa:

[Dien danh sach, vi du:]
1. `[mau 1]`
2. `[mau 2]`
3. `[mau 3]`
4. `[mau 4]`
5. `[mau 5]`
6. `[mau 6]`

Moi mau can co:

```json
{
  "pattern": "Vた ことがある",
  "meaningVi": "Đã từng làm ~",
  "meaningEn": "Have done ~ / Have the experience of ~",
  "explanation": "Dùng để nói về kinh nghiệm đã từng trải qua...",
  "structure": "Động từ thể た + ことがある",
  "conjugationNote": "Động từ phải ở thể た (quá khứ plain form)",
  "examples": [
    {
      "jp": "日本に行ったことがあります。",
      "en": "I have been to Japan.",
      "vi": "Tôi đã từng đi Nhật."
    },
    {
      "jp": "寿司を食べたことがありますか。",
      "en": "Have you ever eaten sushi?",
      "vi": "Bạn đã từng ăn sushi chưa?"
    },
    {
      "jp": "富士山に登ったことがありません。",
      "en": "I have never climbed Mt. Fuji.",
      "vi": "Tôi chưa từng leo núi Phú Sĩ."
    }
  ],
  "commonMistakes": "Sử dụng thể ます thay vì thể た trước ことがある.",
  "comparison": "So sánh với たことがない (phủ định kinh nghiệm).",
  "pronunciationNote": "",
  "sourceRef": "N4-XX.grammar.001",
  "introducedIn": "N4-XX"
}
```

Quy tac ngu phap N4:

- Phai ghi ro `structure` (cau truc) vi N4 co nhieu the dong tu.
- Phai co `conjugationNote` neu mau lien quan den chia dong tu.
- Moi mau co it nhat 3 cau vi du: khang dinh, phu dinh va nghi van.
- Co `comparison` de so sanh voi mau gan nghia (nhat la dieu kien, passive).
- 5 bai tap rieng cho moi mau.
- Loi sai thuong gap.
- Khong dung ngu phap ngoai allowlist cua module.

## 7. Yeu cau Kaiwa

Tao 2 conversation:

### Kaiwa 1: [Dien tinh huong 1]

- [Dien vai noi va boi canh].
- 10-14 luot noi.
- [Dien ngu phap va tu vung can xuat hien].
- Co ban cham va ban tu nhien (dung plain form khi phu hop).
- Co ban dich tu nhien, khong dich tung chu.

### Kaiwa 2: [Dien tinh huong 2]

- [Dien vai noi va boi canh].
- 10-14 luot noi.
- [Dien ngu phap va tu vung can xuat hien].
- Co bien the polite va casual ro rang.

Moi `ConversationLine` phai co:

```json
{
  "speaker": "A",
  "japanese": "先週、京都に行ったことがありますか。",
  "hiragana": "せんしゅう、きょうとにいったことがありますか。",
  "romaji": "Senshuu, Kyouto ni itta koto ga arimasu ka.",
  "translation": "Tuần trước, bạn đã từng đi Kyoto chưa?",
  "sortOrder": 1,
  "audioUrl": "PENDING_AUDIO:n4-XX-kaiwa-01"
}
```

Khong tu tao `audioUrl` that. Dung placeholder:

```text
PENDING_AUDIO:n4-XX-kaiwa-01
PENDING_AUDIO:n4-XX-kaiwa-02
```

## 8. Yeu cau Listening

Tao 2-3 bai nghe:

1. Bai nghe hoi thoai ngan, 40-60 giay.
2. Bai nghe hoi thoai/doc thoai dai hon, 60-90 giay.
3. (Tuy chon) Bai nghe thong bao/huong dan, 30-45 giay.

Moi bai phai co:

```json
{
  "title": "[Dien]",
  "instructions": "[Dien]",
  "transcriptJp": "[Dien transcript tieng Nhat]",
  "transcriptRomaji": "[Dien transcript romaji]",
  "transcriptEn": "[Dien transcript tieng Anh]",
  "transcriptVi": "[Dien transcript tieng Viet]",
  "durationSeconds": 55,
  "playbackSpeed": 0.9,
  "source": "Original SumaryJapanese content",
  "audioUrl": "PENDING_AUDIO:n4-XX-listening-01",
  "sourceRef": "N4-XX.listening.001",
  "introducedIn": "N4-XX"
}
```

Luu y N4:
- Toc do `0.85` hoac `0.9` cho N4 (nhanh hon N5 mot chut).
- Transcript co the dung plain form trong hoi thoai than mat.
- 3-5 LessonExercise gan bang `listeningRef` cho moi bai.
- Cau hoi nghe gom: bat y chinh, chi tiet, muc dich va cam xuc nguoi noi.

Khong publish Listening khi `audioUrl` van la placeholder.

## 9. Yeu cau Reading

Tao 2 passage:

1. Passage 1: [Dien loai van ban, vi du: email, lich trinh], 200-300 ky tu.
2. Passage 2: [Dien loai van ban, vi du: quang cao, huong dan], 300-400 ky tu.

Moi passage co:

```json
{
  "title": "[Dien]",
  "passage": "[Dien noi dung tieng Nhat]",
  "passageReading": "[Dien furigana/hiragana full]",
  "passageTranslation": "[Dien ban dich tieng Viet]",
  "questions": [
    {
      "question": "[Dien cau hoi tieng Nhat]",
      "questionVi": "[Dien cau hoi tieng Viet]",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "[Dien giai thich]"
    }
  ],
  "sourceRef": "N4-XX.reading.001",
  "introducedIn": "N4-XX"
}
```

Moi passage co 4-5 cau hoi gom:

- tim thong tin truc tiep;
- chon y chinh;
- suy ra muc dich/cam xuc nguoi viet;
- tim nghia cua tu/cum tu trong ngu canh;
- khong yeu cau ngu phap ngoai N4-XX va cac module truoc.

Loai van ban N4: email, lich trinh, quang cao, huong dan su dung, thong bao
truong hoc/cong ty, blog ngan, nhat ky.

## 10. Yeu cau Writing va Output

Tao 2 `WritingTask`:

### Writing 1: [Dien dang bai, vi du: email]

- [Dien yeu cau cu the].
- Do dai: 80-120 chu.

### Writing 2: [Dien dang bai, vi du: nhat ky/mieu ta]

- [Dien yeu cau cu the].
- Do dai: 120-180 chu.

Moi task co:

```json
{
  "prompt": "[Dien de bai tieng Viet]",
  "instructions": "[Dien huong dan chi tiet]",
  "sampleAnswer": "[Dien bai mau tieng Nhat]",
  "sampleAnswerReading": "[Dien furigana bai mau]",
  "sampleAnswerTranslation": "[Dien ban dich bai mau]",
  "rubric": {
    "grammar": "Su dung dung mau ngu phap cua module (4 diem).",
    "vocabulary": "Tu vung da dang va dung chu de (3 diem).",
    "structure": "Co dau, than va ket (2 diem).",
    "completeness": "Du yeu cau cua de bai (1 diem)."
  },
  "minLength": 80,
  "maxLength": 180,
  "unit": "characters",
  "sourceRef": "N4-XX.writing.001",
  "introducedIn": "N4-XX"
}
```

## 11. Yeu cau LessonExercise

Tao tong 35-45 bai tap:

- 10 vocabulary (chon nghia, dich, dien tu);
- 8 Kanji (chon cach doc, chon Kanji dung, matching);
- 10 grammar (dien tro tu, chia dong tu, chon mau dung, sap xep cau);
- 4 listening (cau hoi nghe);
- 4 reading (cau hoi doc);
- 3 sentence ordering / matching.

Dung nhieu `exerciseType`:

```text
MULTIPLE_CHOICE
FILL_BLANK
TRUE_FALSE
MATCHING
SENTENCE_ORDERING
DICTATION
CONJUGATION
```

Quy tac dap an:

- index bat dau tu `0`;
- `correctAnswer` phai khop voi `options`;
- co explanation (bao gom vi sao dap an dung va vi sao cac lua chon khac sai);
- points tu 1 den 3;
- moi exercise co `sourceRef` va `skill`;
- khong tra dap an truoc khi submit o API.

Vi du exercise:

```json
{
  "sourceRef": "N4-XX.exercise.001",
  "exerciseType": "FILL_BLANK",
  "question": "日本に（　　）ことがあります。",
  "options": ["行く", "行った", "行って", "行き"],
  "correctIndex": 1,
  "explanation": "Mẫu 'Vた ことがある' yêu cầu động từ thể た. 行く → 行った.",
  "points": 2,
  "skill": "GRAMMAR"
}
```

```json
{
  "sourceRef": "N4-XX.exercise.010",
  "exerciseType": "CONJUGATION",
  "question": "Chuyển động từ 'たべる' sang thể khả năng (potential form).",
  "options": ["たべれる", "たべられる", "たべらる", "たべるれる"],
  "correctIndex": 1,
  "explanation": "たべる là nhóm 2, bỏ る thêm られる → たべられる.",
  "points": 2,
  "skill": "GRAMMAR"
}
```

## 12. Yeu cau module quiz

Tao 20 `QuizQuestion` tong hop:

- 5 vocabulary/Kanji;
- 7 grammar (bao gom conjugation va dien tro tu);
- 4 kaiwa/listening;
- 4 reading.

Tat ca cau quiz dung `questionType: MULTIPLE_CHOICE` trong giai doan dau.
Nhung co the bo sung `FILL_BLANK`, `TRUE_FALSE` va `MATCHING`.

Moi quiz question co:

```json
{
  "sourceRef": "N4-XX.quiz.001",
  "questionType": "MULTIPLE_CHOICE",
  "question": "[Dien cau hoi]",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 0,
  "explanation": "[Dien giai thich]",
  "points": 10
}
```

## 13. Format Gemini phai tra ve

Yeu cau Gemini tra ve **mot JSON duy nhat**, khong markdown, theo khung:

```json
{
  "module": {
    "code": "N4-XX",
    "level": "N4",
    "unit": 1,
    "title": "...",
    "titleJp": "...",
    "status": "DRAFT",
    "prerequisites": "N5 complete"
  },
  "sections": [
    {
      "sortOrder": 1,
      "type": "OVERVIEW",
      "title": "Overview",
      "status": "DRAFT",
      "version": 1,
      "isRequired": true,
      "content": "..."
    }
  ],
  "vocabulary": [],
  "kanji": [],
  "grammar": [],
  "conversations": [],
  "listening": [],
  "reading": [],
  "writing": [],
  "exercises": [],
  "quiz": [],
  "qaWarnings": []
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
- [ ] Sort order khong trung (1-10).
- [ ] Co 50-80 vocabulary.
- [ ] Co 10-16 Kanji dung danh sach, khong trung N5.
- [ ] Co 6-9 grammar patterns.
- [ ] Moi grammar co structure va conjugationNote.
- [ ] Co 2 conversations, moi cai 10-14 luot noi.
- [ ] Co 2-3 listening va placeholder dung format `PENDING_AUDIO:n4-XX-...`.
- [ ] Co 2 reading passages, moi cai 200-400 ky tu.
- [ ] Co 2 writing tasks, do dai 80-180 chu.
- [ ] Co 35-45 exercises.
- [ ] Co 20 quiz questions.
- [ ] Khong co ID tu bia.
- [ ] Khong co dap an ngoai index.
- [ ] Tat ca sourceRef dung format `N4-XX.loai.so`.
- [ ] Tat ca item co introducedIn.
- [ ] Khong publish khi audio chua co that.
- [ ] Khong dung ngu phap ngoai allowlist.
- [ ] Tu vung khong trung cumulative ledger.

Sau khi Gemini tra JSON, luu file goc vao `prisma/seed-data/n4/n4-XX.json`.
Khong dan truc tiep JSON vao pgAdmin ma khong luu ban goc trong repository.

---

# Huong dan su dung template nay

## Buoc 1: Copy file nay thanh `N4_XX_CONTENT_BRIEF.md`

Thay `XX` bang so module (01, 02, ..., 14).

## Buoc 2: Dien thong tin tu syllabus

Mo `CURRICULUM_SOURCE_OF_TRUTH_N4.md`, tim dong module tuong ung va dien:

- Title, Title JP;
- Muc tieu dau ra (8 outcomes);
- Pham vi tu vung;
- Danh sach Kanji moi;
- Danh sach mau ngu phap;
- 2 tinh huong Kaiwa;
- 2-3 bai Listening;
- 2 bai Reading;
- 2 bai Writing.

## Buoc 3: Gui cho Gemini

Gui 3 file:

1. `CURRICULUM_SOURCE_OF_TRUTH_N4.md`
2. `N4_XX_CONTENT_BRIEF.md` (da dien)
3. `cumulative-ledger.json` (bao gom tat ca N5 + N4 truoc do)

Dung prompt khung trong Section 7 cua `CURRICULUM_SOURCE_OF_TRUTH_N4.md`.

## Buoc 4: Validate va import

```powershell
cd C:\Users\GamingGear\Desktop\SumaryJapanese\backend-figma

# Validate
npm run content:validate -- prisma/seed-data/n4/n4-XX.json

# Import
npm run content:import -- prisma/seed-data/n4/n4-XX.json

# Kiem tra
npx prisma studio
```

## Buoc 5: Kiem tra API

```powershell
# Danh sach module
curl http://localhost:3001/api/v1/modules

# Noi dung day du
curl http://localhost:3001/api/v1/modules/{id}/full

# Quiz
curl http://localhost:3001/api/v1/quizzes/module/{id}
```
