import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {vocab,kanji,grammar,dialogues,readings,listenings,grammarQuestions,listenQuestions,readQuestions,writing,kanjiQuestions} from '../../../content/n3/n3-08.mjs';
import {encodeRow} from '../n5/package.mjs';
export const moduleId=37001,levelId=30001;
export async function buildUnit(){
 const columns=JSON.parse(await readFile(new URL('../../../backend/cloudflare/columns.json',import.meta.url),'utf8'));
 const stamp='2026-11-06T00:00:00.000Z',rows={};
 const add=(table,data)=>{const list=rows[table]??=[];const row=Object.fromEntries(columns[table].map(f=>[f.name,null]));Object.assign(row,{id:37001+list.length,createdAt:stamp,updatedAt:stamp,status:'DRAFT',version:1},data);const encoded=encodeRow(row,columns[table]);list.push(encoded);return row.id;};
 add('learning_modules',{levelId,unitNumber:8,title:'Đặt mục tiêu học tập',titleJp:'学ぶ目標を決める',description:'N3-08: mục đích và quyết định: ～ように, ～ようにと言う, ～ことにする, ～ことになる, ～ことにしている, ～ことになっている, ～ついでに. Trường học, thi cử, học bổng và phương pháp học; 24 Hán tự về học tập. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',topics:['Mục tiêu học tập','Quyết định và quy định','Trường học'],sortOrder:8,contentStatus:'DRAFT'});
 const types=['OVERVIEW','VOCABULARY','KANJI','GRAMMAR','KAIWA','LISTENING','READING','WRITING','EXERCISE','SUMMARY'];
 const titles=['Mục tiêu và cách học','105 từ vựng mới','24 Hán tự mới','Mục đích và quyết định','Hội thoại','Luyện nghe','Đọc hiểu','Tự luyện viết','Bài tập','Tổng kết'];
 const instructions=[
  "Tiên quyết: N5, N4 (N4-05 ために, N4-09 ようにする／ようになる) và N3-01 đến N3-07. Mục tiêu: nói mục đích đúng loại động từ, truyền đạt lời dặn, phân biệt quyết định của mình với việc được quyết định, nói thói quen tự đặt và nội quy chung; trình bày kế hoạch học và nội quy lớp. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.",
  "Trường học và khóa học, điểm số và thành tích, thi cử và hồ sơ, mục tiêu và ý chí, phương pháp học, trình độ. Cặp gần nghĩa: 教科 (môn ở trường phổ thông) / 科目 (môn thi, học phần); 講義 (bài giảng đại học) / 講座 (khóa học ngắn); 自習 (tự học trong giờ, ở lớp) / 独学 (tự học không thầy); 上達 (kỹ năng tiến bộ) / 発達 (phát triển); 学習 (văn viết) / 勉強; 聴解 (phần thi nghe) / 聞き取り.",
  "24 chữ mới: 講義科修 得点績復 標達 選択規則 努望希願夢志識 初級師. Từ ghép trọng tâm: 講義, 科目, 修了, 獲得, 点数, 満点, 成績, 実績, 復習, 目標, 達成（たっせい）, 選択（せんたく）, 規則, 努力, 希望, 願書（がんしょ）, 夢中, 志望, 知識, 意識, 初級, 教師. Chú ý 復帰 đọc ふっき (âm ngắt).",
  "7 mục: ～ように (mục đích); ～ようにと言う／頼む／注意する; ～ことにする; ～ことになる; ～ことにしている; ～ことになっている; ～ついでに. So sánh: ために (động từ ý chí, cùng chủ ngữ) / ように (không ý chí, thể khả năng, phủ định, khác chủ ngữ); ことにする (tự quyết) / ことになる (được quyết định); ことにしている (lệ của mình) / ことになっている (quy định chung).",
  "Hội thoại tự soạn, tình huống giả định. Chú giải: 苦手（にがて）yếu, không giỏi; 力がつく（ちからがつく）giỏi lên; 文房具（ぶんぼうぐ）đồ dùng học tập; 問題集（もんだいしゅう）sách bài tập; 勉強会（べんきょうかい）buổi học nhóm; 集合（しゅうごう）tập trung.",
  "Nghe trước, sau đó mới mở bản chép. Chú giải: 数える（かぞえる）tính, đếm; 出席率（しゅっせきりつ）tỷ lệ đi học; 受け付ける（うけつける）tiếp nhận; 日本語教育（にほんごきょういく）giảng dạy tiếng Nhật; 応援（おうえん）ủng hộ; 例文（れいぶん）câu ví dụ; 完璧（かんぺき）hoàn hảo; 目指す（めざす）nhắm tới.",
  "Chú giải bài 1: 中心（ちゅうしん）trọng tâm; 進み具合（すすみぐあい）tiến độ; 報告し合う（ほうこくしあう）báo cho nhau. Bài 2: 本校（ほんこう）trường này; 来年度（らいねんど）năm học tới; 対象（たいしょう）đối tượng; 在籍（ざいせき）đang theo học; 支給（しきゅう）cấp; 事務室（じむしつ）văn phòng; 中旬（ちゅうじゅん）giữa tháng.",
  "Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 trình bày kế hoạch học: mục tiêu, giai đoạn, thói quen, cách giữ động lực. Bài 2 giới thiệu nội quy cho người mới; dùng ～時は thay cho ～場合. Kiểm tra: ai quyết định (ことにする／ことになる), quy tắc của ai (ことにしている／ことになっている). Bản nháp tự lưu trên trình duyệt.",
  "47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.",
  "Tự kiểm sau bài: nói một mục đích bằng ～ように và một bằng ～ために; kể một lời dặn của thầy bằng ～ように言われた; phân biệt 留学することにした và 留学することになった; nói một thói quen bằng ～ことにしている và một nội quy bằng ～ことになっている; nhờ bạn việc gì bằng ～ついでに. Bài tiếp theo (N3-09): công việc, đối tượng và lập trường (について, に対して, として, にとって)."
 ];
 const section={};types.forEach((t,i)=>section[t]=add('lesson_sections',{moduleId,sectionType:t,title:titles[i],instructions:instructions[i],sortOrder:i+1,isRequired:true}));
 vocab.forEach(([japanese,hiragana,romaji,meaning,type,exampleJp,exampleEn])=>add('vocabulary',{moduleId,japanese,hiragana,romaji,english:meaning,type,level:'N3',lesson:'N3-08',exampleJp,exampleEn}));
 kanji.forEach(([character,meaning,onyomi,kunyomi,strokes,radical,examples])=>add('kanji',{moduleId,character,meaning,onyomi,kunyomi,strokeCount:Number(strokes),radical,level:'N3',exampleWords:examples.split('; ').map(s=>({jp:s.split(': ')[0],en:s.split(': ')[1]})),relatedChars:[],mnemonic:`Tập viết ${character} theo bộ ${radical}; liên hệ nghĩa “${meaning.split(' / ')[1]}” với các từ ghép ví dụ.`}));
 grammar.forEach(([pattern,meaning,explanation,examples])=>{const grammarId=add('grammar_patterns',{moduleId,pattern,meaning,explanation,level:'N3',lesson:'N3-08',textbook:'Original LearnJP — N3 study goals and decisions'});examples.forEach(([japanese,english],i)=>add('grammar_examples',{grammarPatternId:grammarId,japanese,english,sortOrder:i+1}));});
 dialogues.forEach(([title,context,lines],i)=>{const conversationId=add('conversations',{sectionId:section.KAIWA,title,context,sortOrder:i+1});lines.forEach(([japanese,translation],n)=>add('conversation_lines',{conversationId,speaker:n%2?'B':'A',japanese,translation,sortOrder:n+1}));});
 const listens=listenings.map(([title,transcript,transcriptTranslation],i)=>add('listening_content',{sectionId:section.LISTENING,title,transcript,transcriptTranslation,instructions:'Nghe và trả lời câu hỏi bên dưới. Sau đó mở bản chép và bản dịch để tự kiểm.',audioUrl:'TTS:ja-JP',playbackSpeed:0.9,source:'Original LearnJP; browser TTS',sortOrder:i+1}));
 const reads=readings.map(([title,content,translation],i)=>add('reading_passages',{sectionId:section.READING,title,content,translation,estimatedLevel:'N3',source:'Original LearnJP',sortOrder:i+1}));
 writing.forEach(([title,prompt,sampleAnswer,minLength,maxLength],i)=>add('writing_tasks',{sectionId:section.WRITING,title,prompt,instructions:prompt,sampleAnswer,minLength,maxLength,rubric:'Tự kiểm: đúng độ dài ký tự (20%); chọn đúng ように／ために và ことにする／ことになる, dùng đủ mẫu đề yêu cầu (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',sortOrder:i+1}));
 const choices=(q,i)=>{const [prompt,correct,...rest]=q;const explanation=rest.pop(),options=[correct,...rest];const shift=i%4;return {prompt,options:[...options.slice(shift),...options.slice(0,shift)],correctAnswer:(4-shift)%4,explanation};};
 const vq=vocab.slice(0,10).map((v,i)=>[`「${v[0]}（${v[1]}）」nghĩa là gì?`,v[3],vocab[(i+17)%vocab.length][3],vocab[(i+41)%vocab.length][3],vocab[(i+73)%vocab.length][3],`${v[0]} = ${v[3]}. Ví dụ: ${v[5]} (${v[6]})`]);
 const kq=kanjiQuestions.map(([word,...opts])=>[`Cách đọc của 「${word}」?`,...opts,`${word} đọc là ${opts[0]}. Xem ví dụ trong mục Hán tự.`]);
 let exerciseIndex=0;
 const exercise=(q,sectionId,extra={})=>{const c=choices(q,exerciseIndex++);add('lesson_exercises',{sectionId,...c,exerciseType:'MULTIPLE_CHOICE',points:1,sortOrder:exerciseIndex,metadata:{source:'N3-08'},...extra});};
 vq.forEach(q=>exercise(q,section.EXERCISE));kq.forEach(q=>exercise(q,section.EXERCISE));grammarQuestions.forEach(q=>exercise(q,section.EXERCISE));
 listenQuestions.forEach(([i,...q])=>exercise(q,section.LISTENING,{listeningId:listens[i]}));readQuestions.forEach(([i,...q])=>exercise(q,section.READING,{readingPassageId:reads[i]}));
 // Quiz covers all seven patterns, including the ように / ために and ことにする / ことになる contrasts.
 const quiz=[...vq.slice(0,3),...kq.slice(0,3),...[0,2,3,4,6,7,8,9,10,11,12].map(i=>grammarQuestions[i]),...[0,2,3,4].map(i=>listenQuestions[i]).map(([i,p,...q])=>[`Đọc lại bản chép để ôn nghe:\n${listenings[i][1]}\n\n${p}`,...q]),...[0,2,3,4].map(i=>readQuestions[i]).map(([i,p,...q])=>[`Đọc đoạn sau:\n${readings[i][1]}\n\n${p}`,...q])];
 quiz.forEach((q,i)=>{const {prompt,correctAnswer,...rest}=choices(q,i);add('quiz_questions',{moduleId,question:prompt,correctIndex:correctAnswer,...rest,questionType:'MULTIPLE_CHOICE',points:10});});
 assert.equal(vocab.length,105);assert.equal(kanji.length,24);assert.equal(quiz.length,25);assert.equal(exerciseIndex,47);
 return rows;
}
