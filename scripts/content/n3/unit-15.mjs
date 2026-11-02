import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {vocab,kanji,grammar,dialogues,readings,listenings,grammarQuestions,listenQuestions,readQuestions,writing,kanjiQuestions} from '../../../content/n3/n3-15.mjs';
import {encodeRow} from '../n5/package.mjs';
export const moduleId=44001,levelId=30001;
export async function buildUnit(){
 const columns=JSON.parse(await readFile(new URL('../../../backend/cloudflare/columns.json',import.meta.url),'utf8'));
 const stamp='2026-11-13T00:00:00.000Z',rows={};
 const add=(table,data)=>{const list=rows[table]??=[];const row=Object.fromEntries(columns[table].map(f=>[f.name,null]));Object.assign(row,{id:44001+list.length,createdAt:stamp,updatedAt:stamp,status:'DRAFT',version:1},data);const encoded=encodeRow(row,columns[table]);list.push(encoded);return row.id;};
 add('learning_modules',{levelId,unitNumber:15,title:'Tranh luận và nhượng bộ',titleJp:'意見を戦わせる',description:'N3-15: nhượng bộ, trách móc và phản bác: ～ものの, ～ながら（も）, ～くせに, ～にもかかわらず, ～からといって, ～ことから, ～だけでなく／ばかりでなく. Quyền và bình đẳng, chế độ, cạnh tranh, lao động và xã hội; 24 Hán tự về tranh luận. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',topics:['Tranh luận','Nhượng bộ và phản bác','Vấn đề xã hội'],sortOrder:15,contentStatus:'DRAFT'});
 const types=['OVERVIEW','VOCABULARY','KANJI','GRAMMAR','KAIWA','LISTENING','READING','WRITING','EXERCISE','SUMMARY'];
 const titles=['Mục tiêu và cách học','105 từ vựng mới','24 Hán tự mới','Nhượng bộ và phản bác','Hội thoại','Luyện nghe','Đọc hiểu','Tự luyện viết','Bài tập','Tổng kết'];
 const instructions=[
  "Tiên quyết: N5, N4 (～のに, ～ながら đồng thời) và N3-01 đến N3-14. Mục tiêu: nhượng bộ trong văn viết, trách móc người khác, phản bác một suy luận vội vàng, nêu căn cứ, thêm luận điểm; viết bài ý kiến khoảng 300 ký tự. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.",
  "Quyền và bình đẳng, chế độ và giới hạn, tranh luận, cạnh tranh và thắng thua, lao động và xã hội. Cặp gần nghĩa: 文句 (phàn nàn, khẩu ngữ) / 苦情 (khiếu nại chính thức); 抗議 (phản đối công khai) / 反発 (phản ứng chống lại); 主観 / 客観的; 楽観的 / 悲観的; 少数派 / 多数派; 言い訳 (bào chữa) / 言い分 (lý lẽ của mình).",
  "24 chữ mới: 権等批 支援 制限許可 観 抗争戦 勝負競 討賃絶 投票 迷惑構. Từ ghép trọng tâm: 人権（じんけん）, 平等（びょうどう）, 批判, 支援（しえん）, 制度, 制限（せいげん）, 許可（きょか）, 観客, 抵抗, 競争（きょうそう）, 戦争, 勝負（しょうぶ）, 検討, 賃金（ちんぎん）, 絶対, 投票（とうひょう）, 迷惑（めいわく）, 構造. Chú ý 迷子 đọc まいご, 客観的 đọc きゃっかんてき.",
  "7 mục: ～ものの; ～ながら（も） (nhượng bộ); ～くせに; ～にもかかわらず; ～からといって; ～ことから; ～だけでなく／ばかりでなく. So sánh: ものの (trung tính, văn viết) / のに (cảm xúc, hội thoại) / くせに (trách móc người khác); ながら nhượng bộ khác ながら đồng thời ở N4.",
  "Hội thoại tự soạn, tình huống giả định. Chú giải: 在宅勤務（ざいたくきんむ）làm việc tại nhà; 通勤（つうきん）đi làm; 両立（りょうりつ）cân bằng hai việc; 腹が立つ（はらがたつ）bực mình; 片付ける（かたづける）dọn dẹp; すっきり nhẹ người.",
  "Nghe trước, sau đó mới mở bản chép. Chú giải: 司会（しかい）dẫn chương trình; 生活費（せいかつひ）chi phí sinh hoạt; 部員（ぶいん）thành viên câu lạc bộ; 監督（かんとく）huấn luyện viên; 拍手（はくしゅ）vỗ tay; 告げ口（つげぐち）mách lẻo.",
  "Chú giải bài 1: めぐって xoay quanh; 一員（いちいん）một thành viên; 服装（ふくそう）trang phục; 保護者（ほごしゃ）phụ huynh; 性別（せいべつ）giới tính. Bài 2: 保育園（ほいくえん）nhà trẻ; 保育士（ほいくし）giáo viên mầm non; 人材（じんざい）nhân lực; 損失（そんしつ）tổn thất; 待遇（たいぐう）đãi ngộ.",
  "Viết khoảng 300 ký tự (250–350). Có bài mẫu để so sánh sau khi viết. Bố cục bài ý kiến: vấn đề → ý kiến trái chiều (ものの, にもかかわらず) → phản bác (からといって) → luận điểm thêm (だけでなく) → kết luận. Kiểm tra: không dùng くせに trong văn viết trang trọng; からといって đi với vế phủ định. Bản nháp tự lưu trên trình duyệt.",
  "47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.",
  "Tự kiểm sau bài: nói một việc chưa thành bằng ものの; nói hai mặt trái ngược bằng ながらも; than phiền về ai đó bằng くせに; nói kết quả bất ngờ bằng にもかかわらず; phản bác bằng からといって; nêu căn cứ bằng ことから; thêm ý bằng だけでなく. Bài tiếp theo (N3-16): tổng ôn N3."
 ];
 const section={};types.forEach((t,i)=>section[t]=add('lesson_sections',{moduleId,sectionType:t,title:titles[i],instructions:instructions[i],sortOrder:i+1,isRequired:true}));
 vocab.forEach(([japanese,hiragana,romaji,meaning,type,exampleJp,exampleEn])=>add('vocabulary',{moduleId,japanese,hiragana,romaji,english:meaning,type,level:'N3',lesson:'N3-15',exampleJp,exampleEn}));
 kanji.forEach(([character,meaning,onyomi,kunyomi,strokes,radical,examples])=>add('kanji',{moduleId,character,meaning,onyomi,kunyomi,strokeCount:Number(strokes),radical,level:'N3',exampleWords:examples.split('; ').map(s=>({jp:s.split(': ')[0],en:s.split(': ')[1]})),relatedChars:[],mnemonic:`Tập viết ${character} theo bộ ${radical}; liên hệ nghĩa “${meaning.split(' / ')[1]}” với các từ ghép ví dụ.`}));
 grammar.forEach(([pattern,meaning,explanation,examples])=>{const grammarId=add('grammar_patterns',{moduleId,pattern,meaning,explanation,level:'N3',lesson:'N3-15',textbook:'Original LearnJP — N3 debate and concession'});examples.forEach(([japanese,english],i)=>add('grammar_examples',{grammarPatternId:grammarId,japanese,english,sortOrder:i+1}));});
 dialogues.forEach(([title,context,lines],i)=>{const conversationId=add('conversations',{sectionId:section.KAIWA,title,context,sortOrder:i+1});lines.forEach(([japanese,translation],n)=>add('conversation_lines',{conversationId,speaker:n%2?'B':'A',japanese,translation,sortOrder:n+1}));});
 const listens=listenings.map(([title,transcript,transcriptTranslation],i)=>add('listening_content',{sectionId:section.LISTENING,title,transcript,transcriptTranslation,instructions:'Nghe và trả lời câu hỏi bên dưới. Sau đó mở bản chép và bản dịch để tự kiểm.',audioUrl:'TTS:ja-JP',playbackSpeed:0.9,source:'Original LearnJP; browser TTS',sortOrder:i+1}));
 const reads=readings.map(([title,content,translation],i)=>add('reading_passages',{sectionId:section.READING,title,content,translation,estimatedLevel:'N3',source:'Original LearnJP',sortOrder:i+1}));
 writing.forEach(([title,prompt,sampleAnswer,minLength,maxLength],i)=>add('writing_tasks',{sectionId:section.WRITING,title,prompt,instructions:prompt,sampleAnswer,minLength,maxLength,rubric:'Tự kiểm: đúng độ dài ký tự (20%); lập luận rõ ràng có phản bác, chọn đúng ものの／にもかかわらず／からといって (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',sortOrder:i+1}));
 const choices=(q,i)=>{const [prompt,correct,...rest]=q;const explanation=rest.pop(),options=[correct,...rest];const shift=i%4;return {prompt,options:[...options.slice(shift),...options.slice(0,shift)],correctAnswer:(4-shift)%4,explanation};};
 const vq=vocab.slice(0,10).map((v,i)=>[`「${v[0]}（${v[1]}）」nghĩa là gì?`,v[3],vocab[(i+17)%vocab.length][3],vocab[(i+41)%vocab.length][3],vocab[(i+73)%vocab.length][3],`${v[0]} = ${v[3]}. Ví dụ: ${v[5]} (${v[6]})`]);
 const kq=kanjiQuestions.map(([word,...opts])=>[`Cách đọc của 「${word}」?`,...opts,`${word} đọc là ${opts[0]}. Xem ví dụ trong mục Hán tự.`]);
 let exerciseIndex=0;
 const exercise=(q,sectionId,extra={})=>{const c=choices(q,exerciseIndex++);add('lesson_exercises',{sectionId,...c,exerciseType:'MULTIPLE_CHOICE',points:1,sortOrder:exerciseIndex,metadata:{source:'N3-15'},...extra});};
 vq.forEach(q=>exercise(q,section.EXERCISE));kq.forEach(q=>exercise(q,section.EXERCISE));grammarQuestions.forEach(q=>exercise(q,section.EXERCISE));
 listenQuestions.forEach(([i,...q])=>exercise(q,section.LISTENING,{listeningId:listens[i]}));readQuestions.forEach(([i,...q])=>exercise(q,section.READING,{readingPassageId:reads[i]}));
 // Quiz covers all seven patterns, including the ものの / のに / くせに contrast.
 const quiz=[...vq.slice(0,3),...kq.slice(0,3),...[0,1,2,4,5,6,8,9,10,12,13].map(i=>grammarQuestions[i]),...[0,2,3,4].map(i=>listenQuestions[i]).map(([i,p,...q])=>[`Đọc lại bản chép để ôn nghe:\n${listenings[i][1]}\n\n${p}`,...q]),...[0,2,3,4].map(i=>readQuestions[i]).map(([i,p,...q])=>[`Đọc đoạn sau:\n${readings[i][1]}\n\n${p}`,...q])];
 quiz.forEach((q,i)=>{const {prompt,correctAnswer,...rest}=choices(q,i);add('quiz_questions',{moduleId,question:prompt,correctIndex:correctAnswer,...rest,questionType:'MULTIPLE_CHOICE',points:10});});
 assert.equal(vocab.length,105);assert.equal(kanji.length,24);assert.equal(quiz.length,25);assert.equal(exerciseIndex,47);
 return rows;
}
