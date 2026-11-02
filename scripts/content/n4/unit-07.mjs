import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {vocab,kanji,grammar,dialogues,readings,listenings,grammarQuestions,listenQuestions,readQuestions,writing,kanjiQuestions} from '../../../content/n4/n4-07.mjs';
import {encodeRow} from '../n5/package.mjs';
export const moduleId=16001,levelId=10001;
export async function buildUnit(){
 const columns=JSON.parse(await readFile(new URL('../../../backend/cloudflare/columns.json',import.meta.url),'utf8'));
 const stamp='2026-10-25T00:00:00.000Z',rows={};
 const add=(table,data)=>{const list=rows[table]??=[];const row=Object.fromEntries(columns[table].map(f=>[f.name,null]));Object.assign(row,{id:16001+list.length,createdAt:stamp,updatedAt:stamp,status:'DRAFT',version:1},data);const encoded=encodeRow(row,columns[table]);list.push(encoded);return row.id;};
 add('learning_modules',{levelId,unitNumber:7,title:'Cho và nhận',titleJp:'贈り物と助け合い',description:'N4-07: kể việc tặng quà, nhận sự giúp đỡ, nhờ và cảm ơn phù hợp. Phân biệt điểm nhìn người cho và người nhận. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',topics:['Quà tặng','Giúp đỡ','Nhờ và cảm ơn'],sortOrder:7,contentStatus:'DRAFT'});
 const types=['OVERVIEW','VOCABULARY','KANJI','GRAMMAR','KAIWA','LISTENING','READING','WRITING','EXERCISE','SUMMARY'];
 const titles=['Mục tiêu và cách học','50 từ dùng trong bài','12 Kanji mới','Cho và nhận','Hội thoại','Luyện nghe TTS','Đọc hiểu','Tự luyện viết','Bài tập','Tổng kết'];
 const instructions=[
  "Tiên quyết: thể て, trợ từ は／が／に／を và thể khả năng. Mục tiêu: kể việc tặng quà, nhờ giúp và cảm ơn phù hợp quan hệ. 40 bài tập, quiz 20 câu, ngưỡng đạt 70%. N4 đang mở dần, chưa phải khóa hoàn chỉnh.",
  "50 mục từ về quà tặng và giúp đỡ. 贈る và 送る cùng đọc おくる nhưng 贈る nhấn tặng quà, 送る nhấn gửi. 預かる = giữ hộ; 預ける = gửi nhờ giữ. 手伝う đã học ở N5 dưới dạng 手伝います nên chỉ ôn, không tính thêm. どういたしまして dùng đáp lời cảm ơn; với bạn bè cũng thường nói いいえ hoặc いえいえ.",
  "12 Kanji mới so với N5 và N4-01 đến N4-06. 借りる là mượn, 貸す là cho mượn. Từ ghép 借金、貸出、礼儀、包装、品物、商品 dùng nhận biết, đã có cách đọc và nghĩa. 親切 là tử tế; 切 đã học, không tính lại.",
  "7 mục: あげる、もらう、くれる và ba mẫu Vてあげる／もらう／くれる; Vていただく nhập môn. Luôn xác định người thực hiện và người hưởng lợi. Nhiều mẫu có thể kể cùng sự việc khi đổi chủ thể/trợ từ. Khi chủ thể giữ nguyên thì không thay các động từ tùy ý.",
  "Hai hội thoại tự soạn, nghe TTS. Chú giải: 去年（きょねん）năm ngoái; きっと chắc là; お互いに（おたがいに）lẫn nhau; ～なら nếu là... (nhận biết); ～ので vì... (nhận biết). Đối chiếu giờ hẹn: hội thoại với giáo viên là ba giờ chiều.",
  "Nghe trước khi mở bản chép. 電話（でんわ）điện thoại; お礼を言う nói lời cảm ơn. Phân biệt nguồn tặng găng tay với nguồn tặng thiệp. Bài nghe giáo viên hẹn bốn giờ chiều, là tình huống riêng với hội thoại. TTS không thay thế giọng thu âm người thật.",
  "Chú giải: メッセージ lời nhắn; ～てありました ở trạng thái đã được làm (chỉ nhận biết); 重い（おもい）nặng; ～のために cho/vì...; 試験を受ける（しけんをうける）dự thi. Theo dõi tên từng người trước khi chọn đáp án.",
  "Tự luyện theo số ký tự tiếng Nhật. Có thể tưởng tượng món quà và sự giúp đỡ. Bản nháp chỉ lưu trong trình duyệt, không có điểm viết tự động. Chú giải bài mẫu: おかげで nhờ vậy; ～てもらって nối mệnh đề nhận giúp đỡ. Với bạn bè dùng ～てくれてありがとう; với giáo viên dùng cách nhờ/cảm ơn lịch sự ở mục ngữ pháp.",
  "40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Câu nghe/đọc dùng đúng tư liệu kèm theo. Quiz ôn nghe có bản chép, không phải bài thi nghe chuẩn hóa.",
  "私は友達に本をあげた: tôi tặng sách cho bạn. 私は友達に本をもらった／友達が私に本をくれた: tôi nhận sách từ bạn. 私は友達に撮ってもらった／友達が撮ってくれた: bạn chụp giúp tôi. 先生に見ていただいた: giáo viên xem giúp tôi. Đề nghị giúp dùng ～ましょうか; nhờ lịch sự dùng ～ていただけませんか."
];
 const section={};types.forEach((t,i)=>section[t]=add('lesson_sections',{moduleId,sectionType:t,title:titles[i],instructions:instructions[i],sortOrder:i+1,isRequired:true}));
 vocab.forEach(([japanese,hiragana,romaji,meaning,type,exampleJp,exampleEn])=>add('vocabulary',{moduleId,japanese,hiragana,romaji,english:meaning,type,level:'N4',lesson:'N4-07',exampleJp,exampleEn}));
 kanji.forEach(([character,meaning,onyomi,kunyomi,strokes,radical,examples])=>add('kanji',{moduleId,character,meaning,onyomi,kunyomi,strokeCount:Number(strokes),radical,level:'N4',exampleWords:examples.split('; ').map(s=>({jp:s.split(': ')[0],en:s.split(': ')[1]})),relatedChars:[],mnemonic:`Tập viết ${character} theo bộ ${radical}; liên hệ nghĩa “${meaning.split(' / ')[1]}” với các từ ví dụ. Từ ghép chưa học chỉ dùng nhận biết.`}));
 grammar.forEach(([pattern,meaning,explanation,examples])=>{const grammarId=add('grammar_patterns',{moduleId,pattern,meaning,explanation,level:'N4',lesson:'N4-07',textbook:'Original LearnJP — giving and receiving'});examples.forEach(([japanese,english],i)=>add('grammar_examples',{grammarPatternId:grammarId,japanese,english,sortOrder:i+1}));});
 dialogues.forEach(([title,context,lines],i)=>{const conversationId=add('conversations',{sectionId:section.KAIWA,title,context,sortOrder:i+1});lines.forEach(([japanese,translation],n)=>add('conversation_lines',{conversationId,speaker:n%2?'B':'A',japanese,translation,sortOrder:n+1}));});
 const listens=listenings.map(([title,transcript,transcriptTranslation],i)=>add('listening_content',{sectionId:section.LISTENING,title,transcript,transcriptTranslation,instructions:'Nghe TTS và trả lời câu hỏi bên dưới. Có thể mở bản chép và bản dịch để tự kiểm.',audioUrl:'TTS:ja-JP',playbackSpeed:0.85,source:'Original LearnJP; browser TTS',sortOrder:i+1}));
 const reads=readings.map(([title,content,translation],i)=>add('reading_passages',{sectionId:section.READING,title,content,translation,estimatedLevel:'N4',source:'Original LearnJP',sortOrder:i+1}));
 writing.forEach(([title,prompt,sampleAnswer,minLength,maxLength],i)=>add('writing_tasks',{sectionId:section.WRITING,title,prompt,instructions:prompt,sampleAnswer,minLength,maxLength,rubric:'Tự kiểm: đúng độ dài ký tự (25%); đúng điểm nhìn cho/nhận và trợ từ (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',sortOrder:i+1}));
 const choices=(q,i)=>{const [prompt,correct,...rest]=q;const explanation=rest.pop(),options=[correct,...rest];const shift=i%4;return {prompt,options:[...options.slice(shift),...options.slice(0,shift)],correctAnswer:(4-shift)%4,explanation};};
 const vq=vocab.slice(0,10).map((v,i)=>[`「${v[0]}（${v[1]}）」nghĩa là gì?`,v[3],vocab[(i+13)%vocab.length][3],vocab[(i+23)%vocab.length][3],vocab[(i+33)%vocab.length][3],`${v[0]} = ${v[3]}. Ví dụ: ${v[5]} (${v[6]})`]);
 const kq=kanjiQuestions.map(([word,...opts])=>[`Cách đọc của 「${word}」?`,...opts,`${word} đọc là ${opts[0]}. Xem ví dụ trong mục Kanji.`]);
 let exerciseIndex=0;
 const exercise=(q,sectionId,extra={})=>{const c=choices(q,exerciseIndex++);add('lesson_exercises',{sectionId,...c,exerciseType:'MULTIPLE_CHOICE',points:1,sortOrder:exerciseIndex,metadata:{source:'N4-07'},...extra});};
 vq.forEach(q=>exercise(q,section.EXERCISE));kq.forEach(q=>exercise(q,section.EXERCISE));grammarQuestions.forEach(q=>exercise(q,section.EXERCISE));
 listenQuestions.forEach(([i,...q])=>exercise(q,section.LISTENING,{listeningId:listens[i]}));readQuestions.forEach(([i,...q])=>exercise(q,section.READING,{readingPassageId:reads[i]}));
 const quiz=[...vq.slice(0,2),...kq.slice(0,3),...grammarQuestions.slice(0,7),...listenQuestions.slice(0,4).map(([i,p,...q])=>[`Đọc lại bản chép để ôn nghe:\n${listenings[i][1]}\n\n${p}`,...q]),...readQuestions.slice(0,4).map(([i,p,...q])=>[`Đọc đoạn sau:\n${readings[i][1]}\n\n${p}`,...q])];
 quiz.forEach((q,i)=>{const {prompt,correctAnswer,...rest}=choices(q,i);add('quiz_questions',{moduleId,question:prompt,correctIndex:correctAnswer,...rest,questionType:'MULTIPLE_CHOICE',points:10});});
 assert.equal(vocab.length,50);assert.equal(kanji.length,12);assert.equal(quiz.length,20);assert.equal(exerciseIndex,40);
 return rows;
}
