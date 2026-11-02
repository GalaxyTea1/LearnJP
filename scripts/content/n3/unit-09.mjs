import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {vocab,kanji,grammar,dialogues,readings,listenings,grammarQuestions,listenQuestions,readQuestions,writing,kanjiQuestions} from '../../../content/n3/n3-09.mjs';
import {encodeRow} from '../n5/package.mjs';
export const moduleId=38001,levelId=30001;
export async function buildUnit(){
 const columns=JSON.parse(await readFile(new URL('../../../backend/cloudflare/columns.json',import.meta.url),'utf8'));
 const stamp='2026-11-07T00:00:00.000Z',rows={};
 const add=(table,data)=>{const list=rows[table]??=[];const row=Object.fromEntries(columns[table].map(f=>[f.name,null]));Object.assign(row,{id:38001+list.length,createdAt:stamp,updatedAt:stamp,status:'DRAFT',version:1},data);const encoded=encodeRow(row,columns[table]);list.push(encoded);return row.id;};
 add('learning_modules',{levelId,unitNumber:9,title:'Tìm việc',titleJp:'仕事を探す',description:'N3-09: công việc, đối tượng và lập trường: ～について, ～に関して, ～に対して, ～として, ～にとって, ～をはじめ, ～において. Tuyển dụng, phỏng vấn, điều kiện làm việc và sự nghiệp; 24 Hán tự về công việc. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',topics:['Tìm việc','Phỏng vấn','Đối tượng và lập trường'],sortOrder:9,contentStatus:'DRAFT'});
 const types=['OVERVIEW','VOCABULARY','KANJI','GRAMMAR','KAIWA','LISTENING','READING','WRITING','EXERCISE','SUMMARY'];
 const titles=['Mục tiêu và cách học','105 từ vựng mới','24 Hán tự mới','Đối tượng và lập trường','Hội thoại','Luyện nghe','Đọc hiểu','Tự luyện viết','Bài tập','Tổng kết'];
 const instructions=[
  "Tiên quyết: N5, N4 và N3-01 đến N3-08 (đặc biệt kính ngữ ở N3-03). Mục tiêu: nêu chủ đề, đối tượng, tư cách và góc nhìn chính xác; đọc tin tuyển dụng; gọi điện hỏi và trả lời phỏng vấn xin việc; viết phần giới thiệu điểm mạnh và email hỏi thông tin. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.",
  "Tuyển dụng, hình thức làm việc, công ty và bộ phận, điều kiện làm việc, sự nghiệp, hồ sơ và phỏng vấn. Cặp gần nghĩa: 給与 (văn viết) / 給料; 雇う (thuê) / 雇用 (văn viết); 退職 (nghỉ việc, về hưu) / 退社 (tan sở hoặc rời công ty) / 辞職 (từ chức) / 引退 (giải nghệ); 業種 (loại hình kinh doanh) / 職種 (loại công việc); 顧客 (trang trọng) / お客様; パート (thường người lớn) / アルバイト.",
  "24 chữ mới: 働給求募応雇履 面接営販管企署部役担務 協資類式契退. Từ ghép trọng tâm: 働き方, 給与（きゅうよ）, 求人, 募集（ぼしゅう）, 応募（おうぼ）, 雇用（こよう）, 履歴書（りれきしょ）, 面接, 営業, 販売, 管理, 企業, 部署（ぶしょ）, 担当, 業務, 協力, 書類, 正式, 契約, 退職. Chú ý 役 đọc やく (役職, 役員).",
  "7 mục: ～について; ～に関して／に関する; ～に対して; ～として; ～にとって; ～をはじめ; ～において／における. So sánh: にとって (góc nhìn đánh giá: 私にとって大切だ) / に対して (hành động, thái độ hướng tới: お客様に対して丁寧だ); について (thường ngày) / に関して (trang trọng, email, thông báo). Dạng bổ nghĩa danh từ: についての, に関する, に対する, としての, における.",
  "Hội thoại tự soạn, tình huống giả định. Chú giải: 説明会（せつめいかい）buổi giới thiệu; 貿易会社（ぼうえきがいしゃ）công ty thương mại; ぴったり rất hợp; 目標（もくひょう）chỉ tiêu; 認める（みとめる）cho phép, công nhận; 翻訳（ほんやく）dịch thuật; 見せ合う（みせあう）cho nhau xem.",
  "Nghe trước, sau đó mới mở bản chép. Chú giải: 当社（とうしゃ）công ty chúng tôi; 名（めい）người (đếm); 卒業見込み（そつぎょうみこみ）dự kiến tốt nghiệp; 母国語（ぼこくご）tiếng mẹ đẻ; 筆記試験（ひっきしけん）thi viết; 個別に（こべつに）riêng từng người; 構わない cũng được; 焦る（あせる）vội vàng.",
  "Chú giải bài 1: 歓迎（かんげい）chào đón; 当店（とうてん）tiệm chúng tôi; 割引（わりびき）giảm giá; チャンス cơ hội; 職場（しょくば）nơi làm việc. Bài 2: 本業（ほんぎょう）công việc chính; 何らか（なんらか）nào đó; 収入（しゅうにゅう）thu nhập; 生かす（いかす）phát huy; 積む（つむ）tích lũy; 余裕（よゆう）dư dả; 課題（かだい）vấn đề cần giải quyết; 投げかける đặt ra.",
  "Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 là bài nói phỏng vấn, dùng khiêm nhường cho bản thân. Bài 2 là email hỏi thông tin, dùng ～に関して và kính ngữ. Kiểm tra: にとって đi với câu đánh giá, に対して đi với hành động, thái độ. Bản nháp tự lưu trên trình duyệt.",
  "47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.",
  "Tự kiểm sau bài: hỏi về nội dung công việc bằng ～について và viết một câu email bằng ～に関して; nói thái độ với khách bằng ～に対して; giới thiệu kinh nghiệm bằng ～として; nói công việc có ý nghĩa gì bằng ～にとって; phân biệt にとって và に対して. Bài tiếp theo (N3-10): sức khỏe, lời khuyên và nghĩa vụ (わけにはいかない, ことだ, ものだ)."
 ];
 const section={};types.forEach((t,i)=>section[t]=add('lesson_sections',{moduleId,sectionType:t,title:titles[i],instructions:instructions[i],sortOrder:i+1,isRequired:true}));
 vocab.forEach(([japanese,hiragana,romaji,meaning,type,exampleJp,exampleEn])=>add('vocabulary',{moduleId,japanese,hiragana,romaji,english:meaning,type,level:'N3',lesson:'N3-09',exampleJp,exampleEn}));
 kanji.forEach(([character,meaning,onyomi,kunyomi,strokes,radical,examples])=>add('kanji',{moduleId,character,meaning,onyomi,kunyomi,strokeCount:Number(strokes),radical,level:'N3',exampleWords:examples.split('; ').map(s=>({jp:s.split(': ')[0],en:s.split(': ')[1]})),relatedChars:[],mnemonic:`Tập viết ${character} theo bộ ${radical}; liên hệ nghĩa “${meaning.split(' / ')[1]}” với các từ ghép ví dụ.`}));
 grammar.forEach(([pattern,meaning,explanation,examples])=>{const grammarId=add('grammar_patterns',{moduleId,pattern,meaning,explanation,level:'N3',lesson:'N3-09',textbook:'Original LearnJP — N3 work and standpoint'});examples.forEach(([japanese,english],i)=>add('grammar_examples',{grammarPatternId:grammarId,japanese,english,sortOrder:i+1}));});
 dialogues.forEach(([title,context,lines],i)=>{const conversationId=add('conversations',{sectionId:section.KAIWA,title,context,sortOrder:i+1});lines.forEach(([japanese,translation],n)=>add('conversation_lines',{conversationId,speaker:n%2?'B':'A',japanese,translation,sortOrder:n+1}));});
 const listens=listenings.map(([title,transcript,transcriptTranslation],i)=>add('listening_content',{sectionId:section.LISTENING,title,transcript,transcriptTranslation,instructions:'Nghe và trả lời câu hỏi bên dưới. Sau đó mở bản chép và bản dịch để tự kiểm.',audioUrl:'TTS:ja-JP',playbackSpeed:0.9,source:'Original LearnJP; browser TTS',sortOrder:i+1}));
 const reads=readings.map(([title,content,translation],i)=>add('reading_passages',{sectionId:section.READING,title,content,translation,estimatedLevel:'N3',source:'Original LearnJP',sortOrder:i+1}));
 writing.forEach(([title,prompt,sampleAnswer,minLength,maxLength],i)=>add('writing_tasks',{sectionId:section.WRITING,title,prompt,instructions:prompt,sampleAnswer,minLength,maxLength,rubric:'Tự kiểm: đúng độ dài ký tự (20%); chọn đúng にとって／に対して／として và kính ngữ phù hợp (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',sortOrder:i+1}));
 const choices=(q,i)=>{const [prompt,correct,...rest]=q;const explanation=rest.pop(),options=[correct,...rest];const shift=i%4;return {prompt,options:[...options.slice(shift),...options.slice(0,shift)],correctAnswer:(4-shift)%4,explanation};};
 const vq=vocab.slice(0,10).map((v,i)=>[`「${v[0]}（${v[1]}）」nghĩa là gì?`,v[3],vocab[(i+17)%vocab.length][3],vocab[(i+41)%vocab.length][3],vocab[(i+73)%vocab.length][3],`${v[0]} = ${v[3]}. Ví dụ: ${v[5]} (${v[6]})`]);
 const kq=kanjiQuestions.map(([word,...opts])=>[`Cách đọc của 「${word}」?`,...opts,`${word} đọc là ${opts[0]}. Xem ví dụ trong mục Hán tự.`]);
 let exerciseIndex=0;
 const exercise=(q,sectionId,extra={})=>{const c=choices(q,exerciseIndex++);add('lesson_exercises',{sectionId,...c,exerciseType:'MULTIPLE_CHOICE',points:1,sortOrder:exerciseIndex,metadata:{source:'N3-09'},...extra});};
 vq.forEach(q=>exercise(q,section.EXERCISE));kq.forEach(q=>exercise(q,section.EXERCISE));grammarQuestions.forEach(q=>exercise(q,section.EXERCISE));
 listenQuestions.forEach(([i,...q])=>exercise(q,section.LISTENING,{listeningId:listens[i]}));readQuestions.forEach(([i,...q])=>exercise(q,section.READING,{readingPassageId:reads[i]}));
 // Quiz covers all seven patterns, including the にとって / に対して contrast.
 const quiz=[...vq.slice(0,3),...kq.slice(0,3),...[0,2,4,6,7,8,9,10,11,13,14].map(i=>grammarQuestions[i]),...[0,2,3,4].map(i=>listenQuestions[i]).map(([i,p,...q])=>[`Đọc lại bản chép để ôn nghe:\n${listenings[i][1]}\n\n${p}`,...q]),...[0,2,3,4].map(i=>readQuestions[i]).map(([i,p,...q])=>[`Đọc đoạn sau:\n${readings[i][1]}\n\n${p}`,...q])];
 quiz.forEach((q,i)=>{const {prompt,correctAnswer,...rest}=choices(q,i);add('quiz_questions',{moduleId,question:prompt,correctIndex:correctAnswer,...rest,questionType:'MULTIPLE_CHOICE',points:10});});
 assert.equal(vocab.length,105);assert.equal(kanji.length,24);assert.equal(quiz.length,25);assert.equal(exerciseIndex,47);
 return rows;
}
