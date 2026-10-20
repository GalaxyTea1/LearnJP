# N4-01 Content Brief - On N5 va plain form

Tai lieu nay la dau vao cho Gemini AI tao du lieu bai hoc dau tien cua N4.
Gemini chi tao **content data**, khong tao migration, khong tu dat ID database
va khong sua schema.

---

## 1. Thong tin bai hoc

```text
Code: N4-01
Level: N4
Unit: 1
Title: N5 Review and Plain Form
Title JP: N5復習・普通形
Status: DRAFT
Prerequisites: N5 complete (12 modules)
```

### Muc tieu dau ra

Sau bai hoc, nguoi hoc co the:

1. On tap va su dung thanh thao cac mau ngu phap N5 co ban.
2. Nhan biet va doc dung 10-12 Kanji moi cap N4.
3. Chuyen doi dong tu tu masu-form sang dictionary form (nhom 1/2/3).
4. Su dung plain form khang dinh/phu dinh qua khu/hien tai (da/datta/dewa nai/dewa nakatta).
5. Dien dat y kien don gian voi `to omou` (plain form).
6. Nghe va hieu hoi thoai dung plain form giua ban be.
7. Doc mot doan nhat ky ngan 150-250 ky tu viet bang plain form.
8. Viet nhat ky 100 chu dung plain form.

## 2. Dinh muc du lieu

| Loai | So luong muc tieu | Bang/model |
|---|---:|---|
| Module | 1 | `LearningModule` |
| Section | 10 | `LessonSection` |
| Vocabulary | 50-60 | `Vocabulary` |
| Kanji | 12 | `Kanji` |
| Grammar | 7 | `GrammarPattern` + `GrammarExample` |
| Kaiwa | 2 | `Conversation` + `ConversationLine` |
| Listening | 2 | `ListeningContent` |
| Reading | 2 | `ReadingPassage` |
| Writing | 2 | `WritingTask` |
| Lesson exercises | 40 | `LessonExercise` |
| Module quiz | 20 | `QuizQuestion` |

## 3. Section bat buoc

| Sort | Type | Noi dung |
|---:|---|---|
| 1 | `OVERVIEW` | Muc tieu, on N5 lien quan, kiem tra dau vao plain form |
| 2 | `VOCABULARY` | On tap tu N5 (khong tinh quota), tu moi ve cam xuc, y kien, doi song hang ngay |
| 3 | `KANJI` | 思, 考, 言, 話, 読, 書, 聞, 食, 飲, 作, 待, 持 |
| 4 | `GRAMMAR` | Plain form (4 the), dictionary form, da kara, to omou |
| 5 | `KAIWA` | Tro chuyen voi ban be (plain form); Chia se y kien ve so thich |
| 6 | `LISTENING` | Nghe hoi thoai ban be; Nghe y kien ngan |
| 7 | `READING` | Nhat ky mot ngay; Blog ngan ve cuoi tuan |
| 8 | `WRITING` | Nhat ky 100 chu; Chia se y kien 80 chu |
| 9 | `EXERCISE` | Bai tap tong hop: conjugation, vocabulary, grammar, nghe, doc |
| 10 | `SUMMARY` | Tom tat plain form, bang chia dong tu, loi sai thuong gap |

Tat ca section bat buoc dung:

```json
{
  "status": "DRAFT",
  "version": 1,
  "isRequired": true
}
```

## 4. Yeu cau Vocabulary

Tao 50-60 tu, phan bo:

- 8 tu ve cam xuc/cam giac: うれしい, 悲しい, 楽しい, つまらない, 心配, 残念, 大変, 簡単;
- 8 tu ve y kien/suy nghi: 意見, 考え, 理由, 本当, 嘘, 正しい, 間違い, 反対;
- 10 dong tu nhat thiet can cho plain form (cac nhom): 思う, 考える, 言う, 話す,
  読む, 書く, 聞く, 食べる, 飲む, 作る;
- 8 dong tu bo sung (doi song): 待つ, 持つ, 住む, 働く, 遊ぶ, 休む, 始まる, 終わる;
- 8 pho tu va cum tu: 多分, きっと, 本当に, 全然, たぶん, 絶対, だから, それで;
- 8 tu phuc vu tinh huong giao tiep hang ngay: 最近, 普通, 趣味, 将来, 夢, 経験, 予定, 約束.

Moi record phai co:

```json
{
  "japanese": "思う",
  "hiragana": "おもう",
  "romaji": "omou",
  "english": "to think",
  "vietnamese": "nghĩ, cho rằng",
  "type": "VERB",
  "level": "N4",
  "lesson": "N4-01",
  "verbGroup": 1,
  "exampleJp": "日本語は面白いと思う。",
  "exampleEn": "I think Japanese is interesting.",
  "exampleVi": "Tôi nghĩ tiếng Nhật thú vị.",
  "introducedIn": "N4-01",
  "sourceRef": "N4-01.vocab.001"
}
```

Quy tac:

- `romaji` dung Hepburn nhat quan.
- Nghia co ca tieng Anh va tieng Viet.
- Moi tu phai co it nhat mot cau vi du cap N4 (dung plain form khi phu hop).
- Dong tu ghi ro `verbGroup` (1/2/3).
- Tinh tu ghi ro loai (i/na).
- Khong trung voi tu da co trong N5.
- Dung enum: `PHRASE`, `EXPRESSION`, `PRONOUN`, `VERB`, `ADJECTIVE`, `NOUN`,
  `ADVERB`, `PARTICLE`, `CONJUNCTION`.

## 5. Yeu cau Kanji

Tao 12 Kanji:

```text
思 考 言 話 読 書 聞 食 飲 作 待 持
```

Moi Kanji phai co:

- `character`;
- `meaning` (English va Vietnamese);
- `onyomi` va `kunyomi`;
- `level: N4`;
- `strokeCount`;
- `radical`;
- 3-4 `exampleWords` dang `{ "jp": "...", "reading": "...", "en": "...", "vi": "..." }`;
- `mnemonic` ngan, de nho;
- `introducedIn`: `N4-01`;
- `sourceRef`: `N4-01.kanji.001`.

Khong tao trung `character` voi Kanji N5 da hoc:
日 本 人 学 生 語 私 先 大 小 中 上 下 山 川 田 月 火 水 木 金 土 一 二 三 四 五 六
七 八 九 十 百 千 万 円 年 時 間 分 今 前 後 午 毎 何 名 外 国 出 入 見 行 来 休 東
西 南 北 口 目 耳 手 足 長 高 安 新 古 多 少 白 花 天 気 電 車 駅 道 店 会 社 校 男
女 子 友 父 母 兄 姉 弟 妹 右 左

## 6. Yeu cau Grammar

Tao 7 mau sau:

1. **Plain form khang dinh hien tai**: Dong tu dictionary form, i-adj nguyen dang, na-adj + da, N + da
2. **Plain form phu dinh hien tai**: Dong tu nai-form, i-adj ~kunai, na-adj + dewa nai, N + dewa nai
3. **Plain form khang dinh qua khu**: Dong tu ta-form, i-adj ~katta, na-adj + datta, N + datta
4. **Plain form phu dinh qua khu**: Dong tu nakatta-form, i-adj ~kunakatta, na-adj + dewa nakatta, N + dewa nakatta
5. **Dictionary form cua dong tu nhom 1/2/3**: Quy tac chuyen doi tu masu-form sang dictionary form
6. **~ da kara / ~ dakara**: Dien dat ly do bang plain form
7. **~ to omou**: Dien dat y kien ca nhan voi plain form

Moi mau can co:

- pattern;
- meaningVi va meaningEn;
- explanation de nguoi hoc N4 hieu;
- structure (cau truc chi tiet);
- conjugationNote (bang chia dong tu khi can);
- 3 cau vi du: khang dinh, phu dinh va nghi van (hoac tuy mau);
- 5 bai tap rieng;
- commonMistakes;
- comparison voi mau gan nghia hoac mau polite tuong ung;
- pronunciationNote (neu can).

## 7. Yeu cau Kaiwa

### Kaiwa 1: Tro chuyen voi ban ve cuoi tuan

- 2 ban be noi chuyen ve cuoi tuan vua roi va ke hoach sap toi.
- 10-12 luot noi.
- Dung plain form xuyen suot (ban be than).
- Co `to omou`, `da kara`, dong tu plain form.
- Co ban dich tu nhien.

### Kaiwa 2: Chia se y kien ve mon an

- 2 ban cung lop noi ve mon an yeu thich va nha hang.
- 10-14 luot noi.
- Pha tron plain form va polite form (ban moi quen).
- Co `to omou`, `i-adj/na-adj` plain form.
- Co bien the polite va casual de so sanh.

Moi `ConversationLine` phai co:

```json
{
  "speaker": "A",
  "japanese": "...",
  "hiragana": "...",
  "romaji": "...",
  "translation": "...",
  "sortOrder": 1,
  "audioUrl": "PENDING_AUDIO:n4-01-kaiwa-01"
}
```

## 8. Yeu cau Listening

Tao 2 bai nghe:

1. **Hoi thoai ban be** - 2 nguoi ban noi chuyen bang plain form ve cuoi tuan, 45-55 giay.
2. **Y kien ngan** - Mot nguoi chia se y kien ve viec hoc tieng Nhat, 50-65 giay.

Moi bai phai co:

- title;
- instructions;
- transcriptJp, transcriptRomaji, transcriptEn, transcriptVi;
- durationSeconds;
- playbackSpeed: `0.85` hoac `0.9`;
- source: `Original SumaryJapanese content`;
- 3-5 LessonExercise gan bang `listeningRef`;
- audioUrl: `PENDING_AUDIO:n4-01-listening-01`, `PENDING_AUDIO:n4-01-listening-02`.

Cau hoi nghe:
- Bat y chinh (nguoi noi da lam gi?);
- Chi tiet (khi nao? o dau?);
- Y kien (nguoi noi nghi gi?);
- Cam xuc (nguoi noi cam thay the nao?).

## 9. Yeu cau Reading

Tao 2 passage:

### Reading 1: Nhat ky mot ngay

- Viet theo goc nhin ngoi thu nhat, plain form.
- 150-220 ky tu.
- Ke ve mot ngay binh thuong: sang, trua, chieu, toi.
- 4 cau hoi: tim thong tin, y chinh, suy ra cam xuc, tu vung trong ngu canh.

### Reading 2: Blog ngan ve cuoi tuan

- Blog ca nhan, pha tron plain va polite form.
- 250-350 ky tu.
- Ke ve hoat dong cuoi tuan va y kien ca nhan.
- 4-5 cau hoi: tim thong tin, y chinh, muc dich, tu vung, suy ra y kien.

## 10. Yeu cau Writing va Output

### Writing 1: Nhat ky 100 chu

- Viet nhat ky ve mot ngay cua ban bang plain form.
- Bao gom: sang lam gi, trua an gi, chieu/toi lam gi, cam nghi.
- Do dai: 80-120 chu (characters).
- Rubric: grammar (plain form dung), vocabulary, completeness.

### Writing 2: Chia se y kien 80 chu

- Viet y kien ve mot chu de (vi du: mon an yeu thich, so thich).
- Dung `to omou` va `da kara` de dien dat ly do.
- Do dai: 60-100 chu (characters).
- Rubric: grammar, reasoning (co ly do), naturalness.

## 11. Yeu cau LessonExercise

Tao tong 40 bai tap:

- 10 vocabulary: chon nghia, dich tu, dien tu vao cau;
- 8 Kanji: chon cach doc, chon Kanji dung, matching tu-nghia;
- 12 grammar: conjugation (masu -> dictionary, plain past/negative), dien tro tu,
  chon mau dung, sap xep cau;
- 5 listening: cau hoi nghe;
- 5 reading: cau hoi doc.

Dung nhieu `exerciseType`: `MULTIPLE_CHOICE`, `FILL_BLANK`, `TRUE_FALSE`,
`MATCHING`, `SENTENCE_ORDERING`, `CONJUGATION`.

## 12. Yeu cau module quiz

Tao 20 `QuizQuestion`:

- 5 vocabulary/Kanji;
- 7 grammar (bao gom conjugation va to omou);
- 4 kaiwa/listening;
- 4 reading.

Points: 10 moi cau. questionType: `MULTIPLE_CHOICE`.

## 13. Format Gemini phai tra ve

Yeu cau Gemini tra ve **mot JSON duy nhat**, khong markdown, theo khung:

```json
{
  "module": {
    "code": "N4-01",
    "level": "N4",
    "unit": 1,
    "title": "N5 Review and Plain Form",
    "titleJp": "N5復習・普通形",
    "status": "DRAFT",
    "prerequisites": "N5 complete"
  },
  "sections": [],
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

## 14. Checklist truoc khi import

- [ ] JSON parse duoc.
- [ ] Co dung 10 sections, sort order 1-10.
- [ ] Co 50-60 vocabulary.
- [ ] Co 12 Kanji: 思考言話読書聞食飲作待持.
- [ ] Khong Kanji trung N5.
- [ ] Co 7 grammar patterns.
- [ ] Moi grammar co structure va conjugationNote.
- [ ] Co 2 conversations, moi cai 10-14 luot noi.
- [ ] Co 2 listening va placeholder dung format.
- [ ] Co 2 reading passages.
- [ ] Co 2 writing tasks.
- [ ] Co 40 exercises.
- [ ] Co 20 quiz questions.
- [ ] Khong co ID tu bia.
- [ ] correctIndex zero-based va nam trong options.
- [ ] Tat ca sourceRef dung format N4-01.loai.so.
- [ ] Tat ca item co introducedIn: N4-01.
- [ ] Khong dung ngu phap ngoai allowlist (7 mau da khoa).

Sau khi Gemini tra JSON, luu file goc vao `prisma/seed-data/n4/n4-01.json`.
