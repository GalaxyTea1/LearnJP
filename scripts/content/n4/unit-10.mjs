import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {vocab,kanji,grammar,dialogues,readings,listenings,grammarQuestions,listenQuestions,readQuestions,writing,kanjiQuestions} from '../../../content/n4/n4-10.mjs';
import {encodeRow} from '../n5/package.mjs';
export const moduleId=19001,levelId=10001;
export async function buildUnit(){
 const columns=JSON.parse(await readFile(new URL('../../../backend/cloudflare/columns.json',import.meta.url),'utf8'));
 const stamp='2026-10-25T00:00:00.000Z',rows={};
 const add=(table,data)=>{const list=rows[table]??=[];const row=Object.fromEntries(columns[table].map(f=>[f.name,null]));Object.assign(row,{id:19001+list.length,createdAt:stamp,updatedAt:stamp,status:'DRAFT',version:1},data);const encoded=encodeRow(row,columns[table]);list.push(encoded);return row.id;};
 add('learning_modules',{levelId,unitNumber:10,title:'Bị động cơ bản',titleJp:'受身で出来事を話す',description:'N4-10: chia thể bị động, kể sự cố, hiểu thông báo và nêu người tạo ra. Phân biệt bị động trực tiếp, sở hữu và gián tiếp. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',topics:['Sự cố','Tin tức','Người tạo ra'],sortOrder:10,contentStatus:'DRAFT'});
 const types=['OVERVIEW','VOCABULARY','KANJI','GRAMMAR','KAIWA','LISTENING','READING','WRITING','EXERCISE','SUMMARY'];
 const titles=['Mục tiêu và cách học','50 từ dùng trong bài','12 Kanji mới','Bị động cơ bản','Hội thoại','Luyện nghe TTS','Đọc hiểu','Tự luyện viết','Bài tập','Tổng kết'];
 const instructions=[
  "Tiên quyết: nhóm động từ, trợ từ は／が／に／を và thể khả năng. Mục tiêu: kể một sự cố bằng bị động, hiểu thông báo và tác giả của một sản phẩm. 40 bài tập, quiz 20 câu, đạt từ 70%. N4 đang mở dần, chưa phải khóa hoàn chỉnh.",
  "50 mục từ về sự cố, thông báo và sáng tạo. 注意する là động từ; 注意 ở N4-06 là danh từ. 招く tương tự 招待する đã học nhưng khác dạng chia. Chú giải: 膝（ひざ）đầu gối; 載る（のる）được đăng; 知らせる（しらせる）báo tin; 若い（わかい）trẻ. Các tên người, công trình và tin tức trong bài là giả định.",
  "12 Kanji mới so với N5 và N4-01 đến N4-09. 世話、業界、学歴、日本史、歩道橋、公共、動物園 là từ mở rộng nhận biết, có cách đọc và nghĩa. Phân biệt 橋（はし）cầu với 箸（はし）đũa khi gặp ở bài khác.",
  "6 mục: cách chia ba nhóm; bị động trực tiếp; tác động đến đồ/bộ phận cơ thể; bị động gián tiếp; sự kiện; によって. 買う→買われる; する→される; 来る→来られる（こられる）. 食べられる có thể là khả năng hoặc bị động tùy ngữ cảnh. Bị động không nhất thiết là điều xấu.",
  "Hội thoại tự soạn, dùng TTS. Chú giải: 相手（あいて）người kia; 模型（もけい）mô hình; 十年前（じゅうねんまえ）mười năm trước; 書かれ nối câu dạng 書かれる; ～んですか hỏi xác nhận/giải thích (nhận biết). Thời gian xây tòa nhà trong hội thoại khác thời gian xây cây cầu trong bài đọc.",
  "Nghe trước khi mở bản chép. Chú giải: 知らない人（しらないひと）người lạ; 展示会（てんじかい）triển lãm; 入場（にゅうじょう）vào cửa. Câu hỏi dựa đúng tư liệu của từng bài. TTS không thay thế thu âm người thật.",
  "Chú giải: タオル khăn; 分かりやすい（わかりやすい）dễ hiểu; ～と言われた được nói/nhận xét rằng; 奥（おく）phía trong; 置いてある（おいてある）được đặt sẵn; 自由に（じゆうに）tự do; 三十日（さんじゅうにち）ngày 30. Tin và triển lãm là giả định, không phải lịch sự kiện thật.",
  "Tự luyện theo số ký tự tiếng Nhật, có thể dùng sự việc tưởng tượng. Bản nháp chỉ lưu trong trình duyệt, không có chấm điểm viết tự động. Viết rõ ai làm, ai chịu ảnh hưởng và diễn biến. Không cần kể trải nghiệm riêng tư.",
  "40 câu gồm 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Dùng ngữ cảnh để phân biệt dạng ～られる. Quiz ôn nghe có bản chép, không phải bài thi nghe chuẩn hóa. Câu hỏi không suy ra người gây sự cố cố tình làm hại.",
  "先生に褒められた: được giáo viên khen. 人に足を踏まれた: bị người khác giẫm chân. 雨に降られた: gặp mưa, chịu ảnh hưởng. 来週開催される: sẽ được tổ chức tuần sau. 技師によって設計された: do kỹ sư thiết kế. によって không thay mọi に trong câu bị động."
];
 const section={};types.forEach((t,i)=>section[t]=add('lesson_sections',{moduleId,sectionType:t,title:titles[i],instructions:instructions[i],sortOrder:i+1,isRequired:true}));
 vocab.forEach(([japanese,hiragana,romaji,meaning,type,exampleJp,exampleEn])=>add('vocabulary',{moduleId,japanese,hiragana,romaji,english:meaning,type,level:'N4',lesson:'N4-10',exampleJp,exampleEn}));
 kanji.forEach(([character,meaning,onyomi,kunyomi,strokes,radical,examples])=>add('kanji',{moduleId,character,meaning,onyomi,kunyomi,strokeCount:Number(strokes),radical,level:'N4',exampleWords:examples.split('; ').map(s=>({jp:s.split(': ')[0],en:s.split(': ')[1]})),relatedChars:[],mnemonic:`Tập viết ${character} theo bộ ${radical}; liên hệ nghĩa “${meaning.split(' / ')[1]}” với các từ ví dụ. Từ ghép chưa học chỉ dùng nhận biết.`}));
 grammar.forEach(([pattern,meaning,explanation,examples])=>{const grammarId=add('grammar_patterns',{moduleId,pattern,meaning,explanation,level:'N4',lesson:'N4-10',textbook:'Original LearnJP — basic passive voice'});examples.forEach(([japanese,english],i)=>add('grammar_examples',{grammarPatternId:grammarId,japanese,english,sortOrder:i+1}));});
 dialogues.forEach(([title,context,lines],i)=>{const conversationId=add('conversations',{sectionId:section.KAIWA,title,context,sortOrder:i+1});lines.forEach(([japanese,translation],n)=>add('conversation_lines',{conversationId,speaker:n%2?'B':'A',japanese,translation,sortOrder:n+1}));});
 const listens=listenings.map(([title,transcript,transcriptTranslation],i)=>add('listening_content',{sectionId:section.LISTENING,title,transcript,transcriptTranslation,instructions:'Nghe TTS và trả lời câu hỏi bên dưới. Có thể mở bản chép và bản dịch để tự kiểm.',audioUrl:'TTS:ja-JP',playbackSpeed:0.85,source:'Original LearnJP; browser TTS',sortOrder:i+1}));
 const reads=readings.map(([title,content,translation],i)=>add('reading_passages',{sectionId:section.READING,title,content,translation,estimatedLevel:'N4',source:'Original LearnJP',sortOrder:i+1}));
 writing.forEach(([title,prompt,sampleAnswer,minLength,maxLength],i)=>add('writing_tasks',{sectionId:section.WRITING,title,prompt,instructions:prompt,sampleAnswer,minLength,maxLength,rubric:'Tự kiểm: đúng độ dài ký tự (25%); chia bị động và xác định đúng người tác động, người chịu ảnh hưởng (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',sortOrder:i+1}));
 const choices=(q,i)=>{const [prompt,correct,...rest]=q;const explanation=rest.pop(),options=[correct,...rest];const shift=i%4;return {prompt,options:[...options.slice(shift),...options.slice(0,shift)],correctAnswer:(4-shift)%4,explanation};};
 const vq=vocab.slice(0,10).map((v,i)=>[`「${v[0]}（${v[1]}）」nghĩa là gì?`,v[3],vocab[(i+13)%vocab.length][3],vocab[(i+23)%vocab.length][3],vocab[(i+33)%vocab.length][3],`${v[0]} = ${v[3]}. Ví dụ: ${v[5]} (${v[6]})`]);
 const kq=kanjiQuestions.map(([word,...opts])=>[`Cách đọc của 「${word}」?`,...opts,`${word} đọc là ${opts[0]}. Xem ví dụ trong mục Kanji.`]);
 let exerciseIndex=0;
 const exercise=(q,sectionId,extra={})=>{const c=choices(q,exerciseIndex++);add('lesson_exercises',{sectionId,...c,exerciseType:'MULTIPLE_CHOICE',points:1,sortOrder:exerciseIndex,metadata:{source:'N4-10'},...extra});};
 vq.forEach(q=>exercise(q,section.EXERCISE));kq.forEach(q=>exercise(q,section.EXERCISE));grammarQuestions.forEach(q=>exercise(q,section.EXERCISE));
 listenQuestions.forEach(([i,...q])=>exercise(q,section.LISTENING,{listeningId:listens[i]}));readQuestions.forEach(([i,...q])=>exercise(q,section.READING,{readingPassageId:reads[i]}));
 const quiz=[...vq.slice(0,2),...kq.slice(0,3),...grammarQuestions.slice(0,7),...listenQuestions.slice(0,4).map(([i,p,...q])=>[`Đọc lại bản chép để ôn nghe:\n${listenings[i][1]}\n\n${p}`,...q]),...readQuestions.slice(0,4).map(([i,p,...q])=>[`Đọc đoạn sau:\n${readings[i][1]}\n\n${p}`,...q])];
 quiz.forEach((q,i)=>{const {prompt,correctAnswer,...rest}=choices(q,i);add('quiz_questions',{moduleId,question:prompt,correctIndex:correctAnswer,...rest,questionType:'MULTIPLE_CHOICE',points:10});});
 assert.equal(vocab.length,50);assert.equal(kanji.length,12);assert.equal(quiz.length,20);assert.equal(exerciseIndex,40);
 return rows;
}
