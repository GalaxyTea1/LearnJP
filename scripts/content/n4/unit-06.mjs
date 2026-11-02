import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {vocab,kanji,grammar,dialogues,readings,listenings,grammarQuestions,listenQuestions,readQuestions,writing,kanjiQuestions} from '../../../content/n4/n4-06.mjs';
import {encodeRow} from '../n5/package.mjs';
export const moduleId=15001,levelId=10001;
export async function buildUnit(){
 const columns=JSON.parse(await readFile(new URL('../../../backend/cloudflare/columns.json',import.meta.url),'utf8'));
 const stamp='2026-10-25T00:00:00.000Z',rows={};
 const add=(table,data)=>{const list=rows[table]??=[];const row=Object.fromEntries(columns[table].map(f=>[f.name,null]));Object.assign(row,{id:15001+list.length,createdAt:stamp,updatedAt:stamp,status:'DRAFT',version:1},data);const encoded=encodeRow(row,columns[table]);list.push(encoded);return row.id;};
 add('learning_modules',{levelId,unitNumber:6,title:'Nghĩa vụ và lời khuyên',titleJp:'義務・助言を伝える',description:'N4-06: phân biệt nghĩa vụ, điều không bắt buộc, lời khuyên và yêu cầu không làm. Thực hành nội quy và lời nhắn cho bạn. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',topics:['Nghĩa vụ','Nội quy','Lời khuyên'],sortOrder:6,contentStatus:'DRAFT'});
 const types=['OVERVIEW','VOCABULARY','KANJI','GRAMMAR','KAIWA','LISTENING','READING','WRITING','EXERCISE','SUMMARY'];
 const titles=['Mục tiêu và cách học','50 từ dùng trong bài','12 Kanji mới','Nghĩa vụ và lời khuyên','Hội thoại','Luyện nghe TTS','Đọc hiểu','Tự luyện viết','Bài tập','Tổng kết'];
 const instructions=[
  "Tiên quyết: nhóm động từ, thể ない ở N4-01 và thể た. Mục tiêu: hiểu nội quy và đưa lời khuyên cho bạn. 40 bài tập, quiz 20 câu, ngưỡng đạt 70%. N4 đang mở dần, không xác nhận đạt JLPT.",
  "50 từ về sức khỏe, nội quy và thủ tục. 汚す／壊す là làm bẩn/làm hỏng, khác 汚れる／壊れる đã học. 並ぶ là xếp hàng, khác 並べる là sắp xếp đồ. 伝わる là được truyền đạt, khác 伝える là truyền đạt. Ôn chia ない trước khi ghép mẫu.",
  "12 Kanji mới so với N5 và N4-01 đến N4-05. Ví dụ từ ghép có cách đọc/nghĩa; 病人、入院、退院、医学、医院、薬局、薬剤師、頭痛、先頭、笑顔、足りる、遠足、歩道、走行 là mở rộng nhận biết, không phải từ mới bắt buộc.",
  "5 mẫu: ～なければならない (phải); ～なくてもいい (không cần); ～た／ないほうがいい (nên/không nên); ～ないでください (xin đừng); ～べき (nhập môn). なくてもいい không cấm hành động. べき mạnh, cần cân nhắc ngữ cảnh; không bắt buộc dùng trong phần viết.",
  "Hai hội thoại tự soạn, nghe bằng TTS. Chú giải: 勉強会（べんきょうかい）buổi học nhóm; 紙（かみ）giấy; 欄（らん）ô/mục; 休憩室（きゅうけいしつ）phòng nghỉ; お大事に（おだいじに）chúc mau khỏe; ～たら nếu (nhận biết). Nội quy là tình huống giả định.",
  "Nghe trước khi mở bản chép. 電話番号（でんわばんごう）số điện thoại; ボタン nút bấm; そのまま giữ nguyên; 金曜日までに chậm nhất thứ Sáu. Phân biệt việc không cần làm với việc bị yêu cầu không làm. TTS không thay thế thu âm người thật.",
  "Chú giải: 学習室（がくしゅうしつ）phòng học; 飲食（いんしょく）ăn uống; 休憩室（きゅうけいしつ）phòng nghỉ; 声（こえ）giọng/tiếng; ほかの những người khác; ～と伝える nhắn rằng (nhận biết). Xác định thời hạn, thông tin bắt buộc và quy định trong từng đoạn.",
  "Tự luyện theo số ký tự tiếng Nhật; có thể dùng tình huống tưởng tượng. Bản nháp chỉ lưu trong trình duyệt. Dùng rubric và bài mẫu tự kiểm, không có điểm viết tự động. 疲れているんですね thể hiện đã hiểu tình trạng bạn kể (nhận biết). Bài luyện ngôn ngữ không yêu cầu chẩn đoán hay kê thuốc.",
  "40 câu gồm 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe và 5 đọc. 機械（きかい）máy móc trong câu ngữ pháp. Câu nghe/đọc cần tư liệu đúng; quiz ôn nghe có kèm bản chép, không phải bài thi nghe chuẩn hóa.",
  "書かなければならない = phải viết; 書かなくてもいい = không cần viết; 休んだほうがいい = nên nghỉ; 無理しないほうがいい = không nên cố quá sức; 触らないでください = xin đừng chạm; 約束を守るべき = nên giữ lời hứa theo nguyên tắc. Thể た trong lời khuyên không kể quá khứ."
];
 const section={};types.forEach((t,i)=>section[t]=add('lesson_sections',{moduleId,sectionType:t,title:titles[i],instructions:instructions[i],sortOrder:i+1,isRequired:true}));
 vocab.forEach(([japanese,hiragana,romaji,meaning,type,exampleJp,exampleEn])=>add('vocabulary',{moduleId,japanese,hiragana,romaji,english:meaning,type,level:'N4',lesson:'N4-06',exampleJp,exampleEn}));
 kanji.forEach(([character,meaning,onyomi,kunyomi,strokes,radical,examples])=>add('kanji',{moduleId,character,meaning,onyomi,kunyomi,strokeCount:Number(strokes),radical,level:'N4',exampleWords:examples.split('; ').map(s=>({jp:s.split(': ')[0],en:s.split(': ')[1]})),relatedChars:[],mnemonic:`Tập viết ${character} theo bộ ${radical}; liên hệ nghĩa “${meaning.split(' / ')[1]}” với các từ ví dụ. Từ ghép chưa học chỉ dùng nhận biết.`}));
 grammar.forEach(([pattern,meaning,explanation,examples])=>{const grammarId=add('grammar_patterns',{moduleId,pattern,meaning,explanation,level:'N4',lesson:'N4-06',textbook:'Original LearnJP — obligations and advice'});examples.forEach(([japanese,english],i)=>add('grammar_examples',{grammarPatternId:grammarId,japanese,english,sortOrder:i+1}));});
 dialogues.forEach(([title,context,lines],i)=>{const conversationId=add('conversations',{sectionId:section.KAIWA,title,context,sortOrder:i+1});lines.forEach(([japanese,translation],n)=>add('conversation_lines',{conversationId,speaker:n%2?'B':'A',japanese,translation,sortOrder:n+1}));});
 const listens=listenings.map(([title,transcript,transcriptTranslation],i)=>add('listening_content',{sectionId:section.LISTENING,title,transcript,transcriptTranslation,instructions:'Nghe TTS và trả lời câu hỏi bên dưới. Có thể mở bản chép và bản dịch để tự kiểm.',audioUrl:'TTS:ja-JP',playbackSpeed:0.85,source:'Original LearnJP; browser TTS',sortOrder:i+1}));
 const reads=readings.map(([title,content,translation],i)=>add('reading_passages',{sectionId:section.READING,title,content,translation,estimatedLevel:'N4',source:'Original LearnJP',sortOrder:i+1}));
 writing.forEach(([title,prompt,sampleAnswer,minLength,maxLength],i)=>add('writing_tasks',{sectionId:section.WRITING,title,prompt,instructions:prompt,sampleAnswer,minLength,maxLength,rubric:'Tự kiểm: đúng độ dài ký tự (25%); chia đúng thể phủ định, phân biệt nghĩa vụ và lời khuyên (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',sortOrder:i+1}));
 const choices=(q,i)=>{const [prompt,correct,...rest]=q;const explanation=rest.pop(),options=[correct,...rest];const shift=i%4;return {prompt,options:[...options.slice(shift),...options.slice(0,shift)],correctAnswer:(4-shift)%4,explanation};};
 const vq=vocab.slice(0,10).map((v,i)=>[`「${v[0]}（${v[1]}）」nghĩa là gì?`,v[3],vocab[(i+13)%vocab.length][3],vocab[(i+23)%vocab.length][3],vocab[(i+33)%vocab.length][3],`${v[0]} = ${v[3]}. Ví dụ: ${v[5]} (${v[6]})`]);
 const kq=kanjiQuestions.map(([word,...opts])=>[`Cách đọc của 「${word}」?`,...opts,`${word} đọc là ${opts[0]}. Xem ví dụ trong mục Kanji.`]);
 let exerciseIndex=0;
 const exercise=(q,sectionId,extra={})=>{const c=choices(q,exerciseIndex++);add('lesson_exercises',{sectionId,...c,exerciseType:'MULTIPLE_CHOICE',points:1,sortOrder:exerciseIndex,metadata:{source:'N4-06'},...extra});};
 vq.forEach(q=>exercise(q,section.EXERCISE));kq.forEach(q=>exercise(q,section.EXERCISE));grammarQuestions.forEach(q=>exercise(q,section.EXERCISE));
 listenQuestions.forEach(([i,...q])=>exercise(q,section.LISTENING,{listeningId:listens[i]}));readQuestions.forEach(([i,...q])=>exercise(q,section.READING,{readingPassageId:reads[i]}));
 const quiz=[...vq.slice(0,2),...kq.slice(0,3),...grammarQuestions.slice(0,7),...listenQuestions.slice(0,4).map(([i,p,...q])=>[`Đọc lại bản chép để ôn nghe:\n${listenings[i][1]}\n\n${p}`,...q]),...readQuestions.slice(0,4).map(([i,p,...q])=>[`Đọc đoạn sau:\n${readings[i][1]}\n\n${p}`,...q])];
 quiz.forEach((q,i)=>{const {prompt,correctAnswer,...rest}=choices(q,i);add('quiz_questions',{moduleId,question:prompt,correctIndex:correctAnswer,...rest,questionType:'MULTIPLE_CHOICE',points:10});});
 assert.equal(vocab.length,50);assert.equal(kanji.length,12);assert.equal(quiz.length,20);assert.equal(exerciseIndex,40);
 return rows;
}
