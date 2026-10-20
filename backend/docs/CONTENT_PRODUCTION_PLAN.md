# Ke hoach san xuat du lieu tung ngay

Ke hoach nay duoc thiet ke cho mot nguoi lam noi dung chinh. Uu tien chat luong,
co the kiem tra va co the chay lai seed, thay vi them that nhieu du lieu roi rac.

## 1. Muc tieu va quy mo

Toan bo curriculum co 80 module:

| Cap | Module | Thoi gian noi dung de xuat |
|---|---:|---:|
| N5 | 12 | 12 tuan |
| N4 | 14 | 14 tuan |
| N3 | 16 | 16 tuan |
| N2 | 18 | 18 tuan |
| N1 | 20 | 20 tuan |
| Tong | 80 | 80 tuan |

Nhip an toan cho nguoi moi la mot module hoan chinh moi tuan. Sau khi quy trinh
on dinh, co the lam hai module/tuan va rut ngan con khoang 40-46 tuan.

Khong can cho den khi du 80 module moi dua website vao su dung. Nen phat hanh
theo tung moc:

1. N5 MVP.
2. N4 MVP.
3. N3 MVP.
4. N2 MVP.
5. N1 MVP.
6. Bo de thi va noi dung mo rong.

## 2. Giai doan 0 - Chuan bi schema va cong cu (7-14 ngay)

Khong nen nap hang nghin ban ghi khi schema chua luu duoc Kaiwa va Listening.

### Ngay 1: Chot content contract

- Doc `JLPT_CURRICULUM_ROADMAP.md`.
- Chot field bat buoc cua vocabulary, Kanji, grammar va question.
- Chot ngon ngu nghia: nen luu ca Vietnamese va English ve sau.
- Chot cach dat ma: `N5-01`, `N5-02`, ...

### Ngay 2-3: Kiem tra migration noi dung

Migration `add_lesson_content_models` da bo sung:

```text
LessonSection
Conversation
ConversationLine
ListeningContent
ReadingPassage
WritingTask
LessonExercise
ContentStatus: DRAFT, IN_REVIEW, PUBLISHED, ARCHIVED
```

Field quan trong:

- `moduleId` hoac `sectionId`;
- `title`, `instructions`, `sortOrder`;
- `audioUrl`, `durationSeconds`, `transcript`;
- `speaker`, `japanese`, `reading`, `translation`;
- `difficulty`, `status`, `version`;
- `source`, `reviewedBy`, `publishedAt`.

### Ngay 4: Xac nhan migration

Migration da duoc tao. Khi cai dat database moi, chay:

```powershell
npm run prisma:migrate:prod
npm run prisma:generate
npm run build
npm test
```

### Ngay 5: Tach seed thanh module

Cau truc muc tieu:

```text
prisma/
  seed.ts
  seed-data/
    levels.ts
    n5/
      n5-01.ts
      n5-02.ts
    n4/
    tests/
```

### Ngay 6: Tao validator va kiem tra noi dung

Moi goi module can duoc validate truoc khi ghi database:

- khong trung tu vung;
- `correctIndex` nam trong options;
- khong co question khong co explanation;
- `sortOrder` khong trung;
- tat ca Kanji co reading va example words;
- full test `totalQuestions` bang so cau thuc.

### Ngay 7: Tao module mau vang

Hoan thanh `N5-01` that ky. Day la module mau de copy cho 79 module con lai.

## 3. Chu ky lam mot module trong 7 ngay

### Thu Hai - Khung bai va muc tieu

Thoi gian: 60-90 phut.

- dat ma, title, titleJp va description;
- chot 3-5 learning outcomes;
- chia section va sort order;
- chot chu de vocabulary, Kanji va grammar;
- viet checklist dau ra.

Ket qua cuoi ngay: skeleton module hoan chinh, chua publish.

### Thu Ba - Vocabulary

Thoi gian: 90-120 phut.

- them 15-25 tu moi trong dot dau;
- bo sung reading, romaji, loai tu va nghia;
- viet mot cau vi du cho moi tu;
- danh dau tu core va tu extension;
- kiem tra trung lap voi module truoc.

Neu module can 60 tu, co the chia vocabulary sang Thu Ba va Thu Tu.

### Thu Tu - Kanji va Grammar

Thoi gian: 90-120 phut.

- them 5-10 Kanji hoac quota theo cap;
- them tu ghep uu tien va mnemonic;
- them 2-4 mau ngu phap;
- moi mau co it nhat 3 vi du;
- viet loi sai thuong gap va so sanh mau gan nghia.

### Thu Nam - Kaiwa va Listening

Thoi gian: 90-150 phut.

- viet 2 hoi thoai theo tinh huong;
- moi hoi thoai co 8-16 luot noi;
- tao ban cham va ban tu nhien;
- viet 2 listening scripts;
- tao 3-5 cau hoi cho moi listening;
- ghi chu audio can thu am/TTS.

Khong tao audio truoc khi script da duoc review.

### Thu Sau - Reading va Writing/Output

Thoi gian: 90-120 phut.

- viet 1-3 reading passages dung cap do;
- tao cau hoi y chinh, chi tiet va suy luan;
- them mot writing task;
- them mot speaking/role-play task;
- tao sample answer va rubric don gian.

### Thu Bay - Practice va Quiz

Thoi gian: 120-180 phut.

- tao 30-80 bai tap theo dinh muc cap;
- tron nhieu question type;
- tao quiz cuoi module;
- kiem tra correct answer va explanation;
- chay seed tren database local;
- mo Prisma Studio kiem tra quan he.

### Chu Nhat - QA va Publish

Thoi gian: 60-120 phut.

- doc lai nhu mot nguoi hoc;
- kiem tra tieng Nhat, nghia va romaji;
- kiem tra audio/transcript;
- chay validator va test;
- sua loi;
- doi status tu `IN_REVIEW` sang `PUBLISHED` khi dat.

Neu QA chua dat, module o lai `IN_REVIEW`. Khong publish vi lich.

## 4. Dinh muc hang ngay de duy tri lau dai

Ngay it thoi gian (30-45 phut):

- 10 vocabulary; hoac
- 3 Kanji; hoac
- 1 grammar pattern; hoac
- 5 questions da co explanation.

Ngay binh thuong (60-90 phut):

- 20 vocabulary;
- 5 Kanji;
- 2 grammar patterns;
- 1 Kaiwa/listening script;
- 10 questions.

Ngay tap trung (2-3 gio):

- hoan thien mot section lon;
- QA mot module;
- tao checkpoint test;
- thu am va xu ly audio.

Quy tac: khong cong don quota bang cach bo qua QA. Du lieu sai kho sua hon du
lieu thieu.

## 5. Lo trinh phat hanh 80 tuan

### Tuan 1-12: Hoan thanh N5

- Mot module N5 moi tuan.
- Tuan 4, 8 va 12 tao checkpoint test.
- Tuan 12 them 3 mock tests N5.
- Sau N5, ket noi frontend vao API truoc khi tiep tuc quy mo lon.

### Tuan 13-26: Hoan thanh N4

- Mot module N4 moi tuan.
- Checkpoint sau module 4, 8, 11 va 14.
- Them audio toc do cham va toc do tu nhien.

### Tuan 27-42: Hoan thanh N3

- Tang reading va listening thuc te.
- Moi module co it nhat mot output task.
- Checkpoint sau moi 4 module.

### Tuan 43-60: Hoan thanh N2

- Uu tien business, news, formal writing va keigo.
- Noi dung can mot vong review tieng Nhat nghiem ngat hon.
- Moi module co reading dai va listening 2-5 phut.

### Tuan 61-80: Hoan thanh N1

- Uu tien sac thai, collocation va lap luan.
- Moi passage can ghi nguon hoac la noi dung tu bien soan.
- Moi grammar gan nghia can bang so sanh.
- Ket thuc voi 5 mock tests N1.

## 6. Ke hoach tang toc 46 tuan

Chi dung sau khi N5-01 den N5-04 da on dinh:

- 2 module moi tuan;
- mot module do ban soan, mot module do nguoi khac review neu co the;
- moi 4 tuan danh mot tuan cho QA va sua no ky thuat;
- khong tang toc phan N2-N1 neu khong co nguoi review tieng Nhat tot.

## 7. Quy trinh trang thai noi dung

Moi noi dung nen di qua:

```text
DRAFT -> IN_REVIEW -> PUBLISHED -> ARCHIVED
```

`DRAFT`:

- dang soan;
- frontend nguoi hoc khong duoc thay.

`IN_REVIEW`:

- da du noi dung;
- dang kiem tra ngon ngu, dap an va audio.

`PUBLISHED`:

- da dat checklist;
- API co the tra ve cho nguoi hoc.

`ARCHIVED`:

- noi dung cu khong con dung;
- khong xoa neu da co lich su hoc cua user.

## 8. Checklist QA cho mot module

### Noi dung

- [ ] Learning outcomes ro rang.
- [ ] Vocabulary dung cap do va khong trung vo ly.
- [ ] Kanji co reading, meaning va example words.
- [ ] Grammar co structure, explanation, examples va common mistakes.
- [ ] Kaiwa tu nhien, dung vai va dung muc do lich su.
- [ ] Listening transcript khop audio.
- [ ] Reading khong vuot qua muc do du kien.
- [ ] Writing/output co sample answer hoac rubric.

### Question

- [ ] Moi cau chi co mot dap an dung ro rang.
- [ ] `correctIndex`/`correctAnswer` dung zero-based index.
- [ ] Distractor hop ly, khong qua de do hinh thuc.
- [ ] Explanation noi vi sao dung va vi sao lua chon de nham sai.
- [ ] Khong lo dap an trong question text.

### Ky thuat

- [ ] Seed chay lai khong tao ban ghi trung.
- [ ] Foreign key tro dung module/section.
- [ ] Sort order lien tuc.
- [ ] Khong co JSON sai dinh dang.
- [ ] TypeScript build thanh cong.
- [ ] Test backend thanh cong.

## 9. Theo doi tien do moi ngay

Co the dung bang don gian sau trong issue, Notion hoac spreadsheet:

| Date | Module | Content type | Planned | Completed | Reviewed | Notes |
|---|---|---|---:|---:|---|---|
| 2026-08-18 | N5-01 | Vocabulary | 20 | 0 | No | |
| 2026-08-19 | N5-01 | Kanji | 8 | 0 | No | |

Chi tinh `Completed` khi ban ghi da vao seed/data file va validator chay qua.
Chi tinh `Reviewed` khi da kiem tra bang Prisma Studio hoac UI.

## 10. Uu tien 30 ngay dau

### Ngay 1-7

- hoan thien schema content;
- tach seed;
- tao validator;
- hoan thanh N5-01 lam module mau.

### Ngay 8-14

- N5-02;
- N5-03;
- checkpoint test 1;
- ket noi frontend voi API cho mot module.

### Ngay 15-21

- N5-04;
- N5-05;
- hoan thien SRS vocabulary/Kanji;
- them quy trinh audio.

### Ngay 22-30

- N5-06;
- review 6 module dau;
- chay thu luong hoc tu dau den quiz;
- sua schema/API theo ket qua thuc te truoc khi nap tiep.

Sau 30 ngay, muc tieu khong phai co that nhieu data. Muc tieu la co 6 module N5
day du, dung schema, chay duoc end-to-end va co quy trinh lap lai.

## 11. Nguyen tac quan trong

1. Migration de thay doi cau truc; seed/data file de them noi dung.
2. Khong nhap noi dung dai han truc tiep trong pgAdmin ma khong co ban sao trong code.
3. Khong xoa noi dung da co lich su hoc; dung `ARCHIVED`.
4. Khong publish cau hoi khong co explanation.
5. Khong dung audio ban quyen khong ro rang.
6. N2-N1 can review boi nguoi co nang luc tieng Nhat phu hop.
7. Hoan thanh mot module end-to-end truoc khi tao hang tram vocabulary.
