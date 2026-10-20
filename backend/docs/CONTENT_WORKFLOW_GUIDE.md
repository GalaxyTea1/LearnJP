# Quy trinh lam viec voi file bai hoc JSON

Tai lieu nay la checklist lap lai cho moi module moi, vi du `N5-02.json`.

## 1. Sau khi Gemini tra JSON

Luu file goc vao dung thu muc:

```text
backend-figma/prisma/seed-data/n5/n5-02.json
```

Khong sua truc tiep trong pgAdmin va khong bo file JSON goc. JSON la source
de co the validate, import lai va truy vet khi du lieu co loi.

Chay validate:

```powershell
cd C:\Users\GamingGear\Desktop\SumaryJapanese\backend-figma
npm run content:validate -- prisma/seed-data/n5/n5-02.json
```

Chi tiep tuc khi ket qua la `Validation: PASS`.

## 2. Checklist review noi dung

### Kiem tra curriculum

- dung module code, level, unit va syllabus;
- grammar nam trong allowlist cua module;
- vocabulary khong trung voi cumulative ledger;
- Kanji moi dung danh sach da khoa;
- noi dung chi dung ngu phap da hoc hoac co danh dau extension;
- learning outcomes xuat hien trong exercise va quiz.

### Kiem tra ky thuat

- JSON parse duoc;
- du 10 sections va `sortOrder` khong trung;
- enum dung Prisma;
- `correctIndex` bat dau tu 0 va nam trong `options`;
- moi exercise/quiz co explanation;
- reading question va listening question co du lieu de gan ve section;
- khong co `id`, `moduleId` hay foreign key tu Gemini;
- audio dung `PENDING_AUDIO:...` cho den khi co file that;
- status moi record la `DRAFT`.

### Kiem tra tieng Nhat

- hiragana, katakana, kanji va romaji khop nhau;
- Hepburn romaji nhat quan;
- `は` doc la `wa` khi la tro tu;
- cau vi du tu nhien va dung cap N5;
- ban dich khong dich tung chu mot cach ky cuc;
- reading/listening khong dung tu vung hoac mau cau ngoai pham vi ma khong ghi chu.

## 3. Import vao database

Import chi chay sau validate va review:

```powershell
npm run content:import -- prisma/seed-data/n5/n5-02.json
```

Importer tao module va cac ban ghi trong mot transaction. Neu mot ban ghi loi,
toan bo transaction rollback. Importer khong cho tao trung module theo
`level + unit`.

Sau import, khong chay lai cung file de "cap nhat". Neu can sua module, giu
JSON cu, tao ban sua co review, hoac xoa module draft cu sau khi xac nhan pham
vi xoa. Chuc nang upsert noi dung se duoc them sau khi quy trinh on dinh.

## 4. Kiem tra sau import bang Prisma Studio

Mo Prisma Studio:

```powershell
npx prisma studio
```

Mo URL ma terminal in ra, thuong la `http://localhost:5555`.

Kiem tra theo thu tu:

1. `jlpt_levels`: co level N5.
2. `learning_modules`: dung `unit_number`, `title`, `content_status = DRAFT`.
3. `lesson_sections`: du 10 section, sort order 1 den 10.
4. `vocabulary`: so luong va `module_id` dung.
5. `kanji`: 8 character dung, khong trung.
6. `grammar_patterns` va `grammar_examples`: moi grammar co examples.
7. `conversations` va `conversation_lines`: dung so luot noi.
8. `listening_content`: co transcript va audio placeholder.
9. `reading_passages` va `lesson_exercises`: question gan dung passage.
10. `writing_tasks`: rubric, min/max length dung don vi.
11. `quiz_questions`: options va correct index dung.

Trong Prisma Studio, loc theo `module_id` cua module moi. Khong sua hang loat
trong Studio neu thay loi; sua JSON va import theo quy trinh de source luon
khop database.

## 5. Kiem tra bang API

Can co access token cua tai khoan dang nhap cho endpoint can auth.

```powershell
# Danh sach module
curl http://localhost:3001/api/v1/modules

# Thong tin module, thay 3 bang id that
curl http://localhost:3001/api/v1/modules/3

# Noi dung day du cho nguoi hoc
curl http://localhost:3001/api/v1/modules/3/full

# Quiz (API hoc vien khong tra correctIndex)
curl http://localhost:3001/api/v1/quizzes/module/3
```

API `/modules/:id/full` hien dang phuc vu module theo id va API quiz da an
`correctIndex`. Khi public content filtering duoc hoan thien, cac endpoint hoc
vien chi duoc tra module/section `PUBLISHED`.

## 6. Y nghia cac trang thai

### DRAFT

Du lieu vua import, dang sua. Kiem tra trong Prisma Studio va API admin/debug.
Khong cho hoc vien thay.

### IN_REVIEW

Noi dung da du, nguoi review dang doc va test. Review phai ghi lai loi can sua,
khong chi doi status.

### PUBLISHED

Chi dat sau khi:

- validator pass;
- schema va foreign key pass;
- review tieng Nhat pass;
- listening co audio that hoac da co quy uoc san sang phat;
- quiz da test submit;
- tat ca required sections cung duoc duyet;
- frontend/API doc dung noi dung.

### ARCHIVED

Noi dung cu khong hien cho hoc vien nhung giu lai de truy vet.

## 7. Kiem tra tren giao dien hien tai

Frontend Figma hien co roadmap tinh trong `src/app/data/roadmapPlan.ts` va
`src/app/data/jlptRoadmaps.ts`. Cac man hinh roadmap hien chua phai CMS va
chua hien thi day du `LessonSection`, Kaiwa, Listening, Reading, Writing tu
module JSON.

Backend da co endpoint module va full content, nhung chua co man hinh admin de:

- loc module theo DRAFT/IN_REVIEW/PUBLISHED;
- xem noi dung theo section;
- gui review note;
- chuyen status co guard;
- xem loi validator va checklist;
- upload audio.

Vi vay, o giai doan hien tai:

- dung **Prisma Studio** de xem va xac nhan trang thai database;
- dung **API** de kiem tra payload backend;
- dung frontend roadmap de kiem tra layout/tinh tuong thich, khong dung no lam
  bang quan tri content.

## 8. Checklist publish hang module

```text
[ ] JSON luu trong prisma/seed-data
[ ] content:validate PASS
[ ] review curriculum PASS
[ ] review tieng Nhat PASS
[ ] content:import PASS
[ ] Prisma Studio da kiem tra quan he
[ ] API full content tra du section
[ ] quiz submit da test
[ ] audio da thay placeholder neu module can publish audio
[ ] chuyen module va required sections sang IN_REVIEW
[ ] review lan cuoi PASS
[ ] chuyen sang PUBLISHED bang service/admin tool
[ ] cap nhat cumulative-ledger.json
```

Khong cap nhat ledger va khong publish neu mot muc bat buoc chua dat.
