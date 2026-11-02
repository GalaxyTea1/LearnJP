import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {vocab,kanji,grammar,dialogues,readings,listenings,grammarQuestions,listenQuestions,readQuestions,writing,kanjiQuestions} from '../../../content/n4/n4-05.mjs';
import {encodeRow} from '../n5/package.mjs';
export const moduleId=14001,levelId=10001;
export async function buildUnit(){
 const columns=JSON.parse(await readFile(new URL('../../../backend/cloudflare/columns.json',import.meta.url),'utf8'));
 const stamp='2026-10-25T00:00:00.000Z',rows={};
 const add=(table,data)=>{const list=rows[table]??=[];const row=Object.fromEntries(columns[table].map(f=>[f.name,null]));Object.assign(row,{id:14001+list.length,createdAt:stamp,updatedAt:stamp,status:'DRAFT',version:1},data);const encoded=encodeRow(row,columns[table]);list.push(encoded);return row.id;};
 add('learning_modules',{levelId,unitNumber:5,title:'Kế hoạch và ý định',titleJp:'予定・意志を話す',description:'N4-05: trình bày kế hoạch cuối tuần, lựa chọn phương án và giải thích mục đích. Phân biệt ý định cá nhân với lịch dự kiến. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',topics:['Kế hoạch cuối tuần','Ý định','Mục đích và lựa chọn'],sortOrder:5,contentStatus:'DRAFT'});
 const types=['OVERVIEW','VOCABULARY','KANJI','GRAMMAR','KAIWA','LISTENING','READING','WRITING','EXERCISE','SUMMARY'];
 const titles=['Mục tiêu và cách học','50 từ dùng trong bài','12 Kanji mới','Kế hoạch và mục đích','Hội thoại','Luyện nghe TTS','Đọc hiểu','Tự luyện viết','Bài tập','Tổng kết'];
 const instructions=[
  "Tiên quyết: nhóm động từ và thể từ điển/ない ở N4-01; kể hoạt động ở N4-03. Mục tiêu: trình bày kế hoạch cuối tuần có ngày giờ, lựa chọn và mục đích. 40 bài tập, quiz 20 câu, ngưỡng đạt 70%. Khóa N4 đang mở dần, không xác nhận đạt JLPT.",
  "50 mục từ theo chủ đề. 予定、計画、準備、予約、決める đã học nên dùng ôn tập, không thêm lại làm từ mới. 持っていく／持ってくる là cụm định hướng mang đi/mang đến; chia ở động từ cuối. Chú giải: 誘い（さそい）lời mời; 今日中に（きょうじゅうに）trong hôm nay; 入場（にゅうじょう）vào cửa; 計算する（けいさんする）tính toán. 日時 đọc にちじ, 日程 đọc にってい.",
  "12 Kanji mới so với danh sách N5 và N4-01 đến N4-04. Ví dụ có cách đọc/nghĩa; 定休日、決定、送料、放送、相手、会談、会費、日本的 là mở rộng nhận biết. Ôn 金、待 đã học, không tính lại là chữ mới.",
  "5 mẫu: Vる／Vないつもり; Vる／Nの予定; thể ý chí＋と思う; Vる／Nのために; Nにする. Ý định và lịch dự kiến có thể cùng phù hợp trong một tình huống; không xem chúng là đối lập tuyệt đối. Thể ý chí của ba nhóm được giải thích trong mục thứ ba.",
  "Hai hội thoại tự soạn, nghe bằng TTS. Chú giải: ～について về...; 今日中に trong hôm nay; もう一度 một lần nữa. Mẫu ～てもいい dùng để xin phép; ～ませんか dùng để đề nghị. Dùng câu trả lời của từng nhân vật để xác định lịch cuối cùng.",
  "Nghe trước khi mở bản chép. Chú giải: ～ことになりました = đã được quyết định là... (chỉ nhận biết); 今日中に trong hôm nay. Phân biệt giờ tập trung với giờ khởi hành, ngày cũ với ngày mới. TTS không thay thế thu âm hội thoại người thật.",
  "Chú giải: 入場無料（にゅうじょうむりょう）vào cửa miễn phí; それぞれ mỗi người; 金曜日までに chậm nhất thứ Sáu; ～たいと言っています đang nói rằng muốn... (nhận biết); ～ことも考えています cũng đang cân nhắc việc...; 計算する tính toán; 京都（きょうと）Kyoto. Phân biệt ngân sách với chi phí đi lại, ý định với việc đã đặt xong.",
  "Tự luyện theo số ký tự tiếng Nhật; có thể dùng kế hoạch tưởng tượng. Bản nháp chỉ lưu trong trình duyệt. Dùng rubric và bài mẫu tự kiểm, không có điểm viết tự động. 毎月（まいつき）= mỗi tháng trong bài mẫu.",
  "40 câu gồm 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe và 5 đọc. Câu nghe/đọc cần tư liệu đúng. Câu quiz ôn nghe có kèm bản chép; không phải bài thi nghe chuẩn hóa.",
  "行くつもり = định đi; 行かないつもり = định không đi; 九時の予定 = dự kiến chín giờ; 行こうと思う = có ý định đi; 行くために = để đi; 弁当にする = chọn cơm hộp. 予定 vẫn có thể thay đổi; つもりでした không chứng minh hành động đã xảy ra."
];
 const section={};types.forEach((t,i)=>section[t]=add('lesson_sections',{moduleId,sectionType:t,title:titles[i],instructions:instructions[i],sortOrder:i+1,isRequired:true}));
 vocab.forEach(([japanese,hiragana,romaji,meaning,type,exampleJp,exampleEn])=>add('vocabulary',{moduleId,japanese,hiragana,romaji,english:meaning,type,level:'N4',lesson:'N4-05',exampleJp,exampleEn}));
 kanji.forEach(([character,meaning,onyomi,kunyomi,strokes,radical,examples])=>add('kanji',{moduleId,character,meaning,onyomi,kunyomi,strokeCount:Number(strokes),radical,level:'N4',exampleWords:examples.split('; ').map(s=>({jp:s.split(': ')[0],en:s.split(': ')[1]})),relatedChars:[],mnemonic:`Tập viết ${character} theo bộ ${radical}; liên hệ nghĩa “${meaning.split(' / ')[1]}” với các từ ví dụ. Từ ghép chưa học chỉ dùng nhận biết.`}));
 grammar.forEach(([pattern,meaning,explanation,examples])=>{const grammarId=add('grammar_patterns',{moduleId,pattern,meaning,explanation,level:'N4',lesson:'N4-05',textbook:'Original LearnJP — plans and intentions'});examples.forEach(([japanese,english],i)=>add('grammar_examples',{grammarPatternId:grammarId,japanese,english,sortOrder:i+1}));});
 dialogues.forEach(([title,context,lines],i)=>{const conversationId=add('conversations',{sectionId:section.KAIWA,title,context,sortOrder:i+1});lines.forEach(([japanese,translation],n)=>add('conversation_lines',{conversationId,speaker:n%2?'B':'A',japanese,translation,sortOrder:n+1}));});
 const listens=listenings.map(([title,transcript,transcriptTranslation],i)=>add('listening_content',{sectionId:section.LISTENING,title,transcript,transcriptTranslation,instructions:'Nghe TTS và trả lời câu hỏi bên dưới. Có thể mở bản chép và bản dịch để tự kiểm.',audioUrl:'TTS:ja-JP',playbackSpeed:0.85,source:'Original LearnJP; browser TTS',sortOrder:i+1}));
 const reads=readings.map(([title,content,translation],i)=>add('reading_passages',{sectionId:section.READING,title,content,translation,estimatedLevel:'N4',source:'Original LearnJP',sortOrder:i+1}));
 writing.forEach(([title,prompt,sampleAnswer,minLength,maxLength],i)=>add('writing_tasks',{sectionId:section.WRITING,title,prompt,instructions:prompt,sampleAnswer,minLength,maxLength,rubric:'Tự kiểm: đúng độ dài ký tự (25%); chia thể ý chí, nêu kế hoạch và mục đích (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',sortOrder:i+1}));
 const choices=(q,i)=>{const [prompt,correct,...rest]=q;const explanation=rest.pop(),options=[correct,...rest];const shift=i%4;return {prompt,options:[...options.slice(shift),...options.slice(0,shift)],correctAnswer:(4-shift)%4,explanation};};
 const vq=vocab.slice(0,10).map((v,i)=>[`「${v[0]}（${v[1]}）」nghĩa là gì?`,v[3],vocab[(i+13)%vocab.length][3],vocab[(i+23)%vocab.length][3],vocab[(i+33)%vocab.length][3],`${v[0]} = ${v[3]}. Ví dụ: ${v[5]} (${v[6]})`]);
 const kq=kanjiQuestions.map(([word,...opts])=>[`Cách đọc của 「${word}」?`,...opts,`${word} đọc là ${opts[0]}. Xem ví dụ trong mục Kanji.`]);
 let exerciseIndex=0;
 const exercise=(q,sectionId,extra={})=>{const c=choices(q,exerciseIndex++);add('lesson_exercises',{sectionId,...c,exerciseType:'MULTIPLE_CHOICE',points:1,sortOrder:exerciseIndex,metadata:{source:'N4-05'},...extra});};
 vq.forEach(q=>exercise(q,section.EXERCISE));kq.forEach(q=>exercise(q,section.EXERCISE));grammarQuestions.forEach(q=>exercise(q,section.EXERCISE));
 listenQuestions.forEach(([i,...q])=>exercise(q,section.LISTENING,{listeningId:listens[i]}));readQuestions.forEach(([i,...q])=>exercise(q,section.READING,{readingPassageId:reads[i]}));
 const quiz=[...vq.slice(0,2),...kq.slice(0,3),...grammarQuestions.slice(0,7),...listenQuestions.slice(0,4).map(([i,p,...q])=>[`Đọc lại bản chép để ôn nghe:\n${listenings[i][1]}\n\n${p}`,...q]),...readQuestions.slice(0,4).map(([i,p,...q])=>[`Đọc đoạn sau:\n${readings[i][1]}\n\n${p}`,...q])];
 quiz.forEach((q,i)=>{const {prompt,correctAnswer,...rest}=choices(q,i);add('quiz_questions',{moduleId,question:prompt,correctIndex:correctAnswer,...rest,questionType:'MULTIPLE_CHOICE',points:10});});
 assert.equal(vocab.length,50);assert.equal(kanji.length,12);assert.equal(quiz.length,20);assert.equal(exerciseIndex,40);
 return rows;
}
