import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {vocab,kanji,grammar,dialogues,readings,listenings,grammarQuestions,listenQuestions,readQuestions,writing,kanjiQuestions} from '../../../content/n4/n4-09.mjs';
import {encodeRow} from '../n5/package.mjs';
export const moduleId=18001,levelId=10001;
export async function buildUnit(){
 const columns=JSON.parse(await readFile(new URL('../../../backend/cloudflare/columns.json',import.meta.url),'utf8'));
 const stamp='2026-10-25T00:00:00.000Z',rows={};
 const add=(table,data)=>{const list=rows[table]??=[];const row=Object.fromEntries(columns[table].map(f=>[f.name,null]));Object.assign(row,{id:18001+list.length,createdAt:stamp,updatedAt:stamp,status:'DRAFT',version:1},data);const encoded=encodeRow(row,columns[table]);list.push(encoded);return row.id;};
 add('learning_modules',{levelId,unitNumber:9,title:'Thay đổi trạng thái',titleJp:'変化と上達を話す',description:'N4-09: mô tả khả năng mới, thay đổi thói quen và quá trình tiến bộ; phân biệt thay đổi tự nhiên với tác động chủ động. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',topics:['Tiến bộ','Thói quen','Thay đổi trạng thái'],sortOrder:9,contentStatus:'DRAFT'});
 const types=['OVERVIEW','VOCABULARY','KANJI','GRAMMAR','KAIWA','LISTENING','READING','WRITING','EXERCISE','SUMMARY'];
 const titles=['Mục tiêu và cách học','50 từ dùng trong bài','12 Kanji mới','Thay đổi trạng thái','Hội thoại','Luyện nghe TTS','Đọc hiểu','Tự luyện viết','Bài tập','Tổng kết'];
 const instructions=[
  "Tiên quyết: thể từ điển/ない/て, thể khả năng N4-04, tính từ i/na. Mục tiêu: kể khả năng mới, cách duy trì thói quen và sự tiến bộ học tiếng Nhật. 40 bài tập, quiz 20 câu, ngưỡng đạt 70%. N4 đang mở dần, chưa phải khóa hoàn chỉnh.",
  "50 mục từ. 上げる (nâng lên) khác あげる (tặng) ở N4-07 dù cùng cách đọc. 増える／減る, 上がる／下がる diễn tả thay đổi; 上げる／下げる nêu tác động. 明るい／暗い từng xuất hiện ở ví dụ Kanji, nay học thành mục từ. 計る thường dùng đo thời gian; 測る đo chiều dài, đại lượng. Chú giải: 点（てん）điểm; 気温（きおん）nhiệt độ; 耳（みみ）tai; スピーチ bài nói; 覚え方（おぼえかた）cách nhớ.",
  "12 Kanji mới so với N5 và N4-01 đến N4-08. 増加、減少、文化、勤勉、訓練 là từ ghép mở rộng nhận biết, đã có cách đọc và nghĩa. 毎週 đọc まいしゅう; 最近 đọc さいきん. Các chữ có trong từ vựng trước đây nay được học chính thức ở phần Kanji.",
  "6 mục: ようになる; tính từ＋なる; ようにする; tính từ＋する; てくる; ていく. 読めるようになった là khả năng mới, 読むようになった thường là thói quen mới. ようにしている nhấn nỗ lực duy trì, không bảo đảm chưa từng bỏ buổi. So sánh 部屋が明るくなった với 部屋を明るくした.",
  "Hội thoại tự soạn, dùng TTS. 十分 ở thời lượng đọc じゅっぷん (mười phút), khác 十分（じゅうぶん）đầy đủ. ～てみる thử làm; ～ても dù...; ～ずつ mỗi...; ～やすい dễ làm; ～そう có vẻ (nhận biết). Mười lăm phút sáng và tối là đề xuất trong hội thoại, không phải lịch cố định của mọi bài.",
  "Nghe trước khi mở bản chép. Chú giải: ～ながら vừa... vừa...; 思い出す（おもいだす）nhớ lại; 前の日（まえのひ）ngày trước đó. Một bài nói nhật ký năm phút mỗi tối; bài còn lại ôn mười phút mỗi sáng. TTS không thay thế giọng thu âm người thật.",
  "Chú giải: 記事（きじ）bài viết; 声に出して（こえにだして）thành tiếng; 平日（へいじつ）ngày thường; ノート vở; ～のに時間がかかる mất thời gian để làm (không phải のに “mặc dù”); ～てから kể từ khi. Không suy ra điểm đã tăng khi đoạn chỉ nói thói quen thay đổi.",
  "Tự luyện theo số ký tự tiếng Nhật, có thể dùng tiến bộ tưởng tượng. Bản nháp chỉ lưu trong trình duyệt, không có điểm viết tự động. Viết rõ điều đã thay đổi, việc đang cố duy trì và kế hoạch tương lai. Không cần khẳng định thành thạo hoàn toàn.",
  "40 câu: 10 từ vựng, 8 Kanji, 12 ngữ pháp, 5 nghe, 5 đọc. Câu hỏi khả năng dùng đúng thể khả năng. Câu nghe/đọc có tư liệu tương ứng; quiz ôn nghe có bản chép, không phải bài thi nghe chuẩn hóa.",
  "読めるようになった: đã đọc được. 読むようにしている: cố duy trì đọc. 楽しくなる: trở nên vui; 説明を簡単にする: đơn giản hóa giải thích. 減ってきた: đã giảm dần đến nay; 続けていく: sẽ tiếp tục về sau. いい→よくなる／よくする; tính từ na và danh từ dùng に."
];
 const section={};types.forEach((t,i)=>section[t]=add('lesson_sections',{moduleId,sectionType:t,title:titles[i],instructions:instructions[i],sortOrder:i+1,isRequired:true}));
 vocab.forEach(([japanese,hiragana,romaji,meaning,type,exampleJp,exampleEn])=>add('vocabulary',{moduleId,japanese,hiragana,romaji,english:meaning,type,level:'N4',lesson:'N4-09',exampleJp,exampleEn}));
 kanji.forEach(([character,meaning,onyomi,kunyomi,strokes,radical,examples])=>add('kanji',{moduleId,character,meaning,onyomi,kunyomi,strokeCount:Number(strokes),radical,level:'N4',exampleWords:examples.split('; ').map(s=>({jp:s.split(': ')[0],en:s.split(': ')[1]})),relatedChars:[],mnemonic:`Tập viết ${character} theo bộ ${radical}; liên hệ nghĩa “${meaning.split(' / ')[1]}” với các từ ví dụ. Từ ghép chưa học chỉ dùng nhận biết.`}));
 grammar.forEach(([pattern,meaning,explanation,examples])=>{const grammarId=add('grammar_patterns',{moduleId,pattern,meaning,explanation,level:'N4',lesson:'N4-09',textbook:'Original LearnJP — changes and progress'});examples.forEach(([japanese,english],i)=>add('grammar_examples',{grammarPatternId:grammarId,japanese,english,sortOrder:i+1}));});
 dialogues.forEach(([title,context,lines],i)=>{const conversationId=add('conversations',{sectionId:section.KAIWA,title,context,sortOrder:i+1});lines.forEach(([japanese,translation],n)=>add('conversation_lines',{conversationId,speaker:n%2?'B':'A',japanese,translation,sortOrder:n+1}));});
 const listens=listenings.map(([title,transcript,transcriptTranslation],i)=>add('listening_content',{sectionId:section.LISTENING,title,transcript,transcriptTranslation,instructions:'Nghe TTS và trả lời câu hỏi bên dưới. Có thể mở bản chép và bản dịch để tự kiểm.',audioUrl:'TTS:ja-JP',playbackSpeed:0.85,source:'Original LearnJP; browser TTS',sortOrder:i+1}));
 const reads=readings.map(([title,content,translation],i)=>add('reading_passages',{sectionId:section.READING,title,content,translation,estimatedLevel:'N4',source:'Original LearnJP',sortOrder:i+1}));
 writing.forEach(([title,prompt,sampleAnswer,minLength,maxLength],i)=>add('writing_tasks',{sectionId:section.WRITING,title,prompt,instructions:prompt,sampleAnswer,minLength,maxLength,rubric:'Tự kiểm: đúng độ dài ký tự (25%); phân biệt thay đổi, nỗ lực duy trì và hướng thời gian (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',sortOrder:i+1}));
 const choices=(q,i)=>{const [prompt,correct,...rest]=q;const explanation=rest.pop(),options=[correct,...rest];const shift=i%4;return {prompt,options:[...options.slice(shift),...options.slice(0,shift)],correctAnswer:(4-shift)%4,explanation};};
 const vq=vocab.slice(0,10).map((v,i)=>[`「${v[0]}（${v[1]}）」nghĩa là gì?`,v[3],vocab[(i+13)%vocab.length][3],vocab[(i+23)%vocab.length][3],vocab[(i+33)%vocab.length][3],`${v[0]} = ${v[3]}. Ví dụ: ${v[5]} (${v[6]})`]);
 const kq=kanjiQuestions.map(([word,...opts])=>[`Cách đọc của 「${word}」?`,...opts,`${word} đọc là ${opts[0]}. Xem ví dụ trong mục Kanji.`]);
 let exerciseIndex=0;
 const exercise=(q,sectionId,extra={})=>{const c=choices(q,exerciseIndex++);add('lesson_exercises',{sectionId,...c,exerciseType:'MULTIPLE_CHOICE',points:1,sortOrder:exerciseIndex,metadata:{source:'N4-09'},...extra});};
 vq.forEach(q=>exercise(q,section.EXERCISE));kq.forEach(q=>exercise(q,section.EXERCISE));grammarQuestions.forEach(q=>exercise(q,section.EXERCISE));
 listenQuestions.forEach(([i,...q])=>exercise(q,section.LISTENING,{listeningId:listens[i]}));readQuestions.forEach(([i,...q])=>exercise(q,section.READING,{readingPassageId:reads[i]}));
 const quiz=[...vq.slice(0,2),...kq.slice(0,3),...grammarQuestions.slice(0,7),...listenQuestions.slice(0,4).map(([i,p,...q])=>[`Đọc lại bản chép để ôn nghe:\n${listenings[i][1]}\n\n${p}`,...q]),...readQuestions.slice(0,4).map(([i,p,...q])=>[`Đọc đoạn sau:\n${readings[i][1]}\n\n${p}`,...q])];
 quiz.forEach((q,i)=>{const {prompt,correctAnswer,...rest}=choices(q,i);add('quiz_questions',{moduleId,question:prompt,correctIndex:correctAnswer,...rest,questionType:'MULTIPLE_CHOICE',points:10});});
 assert.equal(vocab.length,50);assert.equal(kanji.length,12);assert.equal(quiz.length,20);assert.equal(exerciseIndex,40);
 return rows;
}
