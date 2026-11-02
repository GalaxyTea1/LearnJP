import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {vocab,kanji,grammar,dialogues,readings,listenings,grammarQuestions,listenQuestions,readQuestions,writing,kanjiQuestions} from '../../../content/n3/n3-06.mjs';
import {encodeRow} from '../n5/package.mjs';
export const moduleId=35001,levelId=30001;
export async function buildUnit(){
 const columns=JSON.parse(await readFile(new URL('../../../backend/cloudflare/columns.json',import.meta.url),'utf8'));
 const stamp='2026-11-04T00:00:00.000Z',rows={};
 const add=(table,data)=>{const list=rows[table]??=[];const row=Object.fromEntries(columns[table].map(f=>[f.name,null]));Object.assign(row,{id:35001+list.length,createdAt:stamp,updatedAt:stamp,status:'DRAFT',version:1},data);const encoded=encodeRow(row,columns[table]);list.push(encoded);return row.id;};
 add('learning_modules',{levelId,unitNumber:6,title:'Nguyên nhân và kết quả',titleJp:'原因と結果',description:'N3-06: nêu nguyên nhân và kết quả: ～ため (nguyên nhân), ～おかげで, ～せいで, ～からこそ, ～によって／による, ～ものだから, ～結果. Sự cố, thiên tai, giao thông, kinh tế và rút kinh nghiệm; 24 Hán tự. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',topics:['Nguyên nhân và kết quả','Sự cố và thiên tai','Rút kinh nghiệm'],sortOrder:6,contentStatus:'DRAFT'});
 const types=['OVERVIEW','VOCABULARY','KANJI','GRAMMAR','KAIWA','LISTENING','READING','WRITING','EXERCISE','SUMMARY'];
 const titles=['Mục tiêu và cách học','105 từ vựng mới','24 Hán tự mới','Nguyên nhân và kết quả','Hội thoại','Luyện nghe','Đọc hiểu','Tự luyện viết','Bài tập','Tổng kết'];
 const instructions=[
  "Tiên quyết: N5, N4 và N3-01 đến N3-05. Mục tiêu: nêu nguyên nhân và kết quả theo đúng sắc thái (trang trọng, biết ơn, trách, nhấn mạnh, xin lỗi), hiểu thông báo ở ga và bản tin thiên tai, viết báo cáo sự cố có nguyên nhân – kết quả – đối sách. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.",
  "Sự cố và tai nạn, thiên tai và phòng chống, giao thông, kinh tế, nguyên nhân – hệ quả, thành công – thất bại. Cặp gần nghĩa: 状況 (tình hình xung quanh) và 状態 (trạng thái của người, vật); 火事 và 火災 (văn viết); 不景気 (khẩu ngữ) và 不況 (tin tức); 予防 (phòng bệnh, tai nạn) và 防止 (ngăn chặn); 警報 (cảnh báo) mạnh hơn 注意報; 弁償 (đền đồ làm hỏng) và 補償 (bồi thường thiệt hại). Động từ gây hệ quả: 与える, 及ぼす, 引き起こす; chịu hệ quả: 受ける.",
  "24 chữ mới: 原因 結果 影響 効 故 害災 及 被損 失敗功 責任 状況 険危防件. Từ ghép trọng tâm: 原因, 結果（けっか, âm ngắt）, 影響（えいきょう）, 効果, 故障, 災害, 被害, 損害, 失敗（しっぱい）, 責任, 状況（じょうきょう）, 危険, 予防. Chú ý 及ぼす（およぼす）và 及ぶ（およぶ）cùng chữ khác nghĩa.",
  "7 mục: ～ため（に）nguyên nhân; ～おかげで; ～せいで／せいか; ～からこそ; ～によって／による; ～ものだから／もので; ～結果. So sánh: おかげで (kết quả tốt, biết ơn) / せいで (kết quả xấu, trách); ため (trang trọng, câu sau không là mệnh lệnh hay ý chí) / から (dùng được mọi loại câu). Phân biệt ために nguyên nhân với ために mục đích (N4-05).",
  "Hội thoại tự soạn, tình huống giả định. Chú giải: 信号（しんごう）tín hiệu; 遅延証明書（ちえんしょうめいしょ）giấy xác nhận tàu trễ; お互い様（おたがいさま）ai cũng như ai; 今後（こんご）từ nay; 聴解（ちょうかい）phần nghe hiểu; 前向き（まえむき）lạc quan, tích cực; お祝い（おいわい）ăn mừng.",
  "Nghe trước, sau đó mới mở bản chép. Bài 1 là thông báo ở ga: chú ý cụm ため、運転を見合わせております. Chú giải: 上り線／下り線（のぼりせん／くだりせん）tuyến lên/tuyến xuống; 振替輸送（ふりかえゆそう）chở thay; 改札口（かいさつぐち）cửa soát vé; 関東地方（かんとうちほう）vùng Kanto; 電力会社（でんりょくがいしゃ）công ty điện lực; 指示（しじ）lệnh; 体を壊す（からだをこわす）đổ bệnh.",
  "Chú giải bài 1: 会計（かいけい）thanh toán; おつり tiền thối; お札（おさつ）tiền giấy; お預かりします xin nhận (tiền); 幸い（さいわい）may mắn. Bài 2: 大型（おおがた）cỡ lớn; 各地（かくち）khắp nơi; 食料（しょくりょう）lương thực; 高齢者（こうれいしゃ）người cao tuổi; 逃げ遅れる（にげおくれる）chạy không kịp; 充電器（じゅうでんき）sạc pin; 持ち出す（もちだす）mang ra ngoài.",
  "Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bài 1 là báo cáo sự cố: chuyện gì, nguyên nhân, kết quả, đối sách. Bài 2 là tin nhắn cảm ơn. Kiểm tra: kết quả tốt dùng おかげで, xấu dùng せいで; câu sau ため không là mệnh lệnh. Bản nháp tự lưu trên trình duyệt.",
  "47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.",
  "Tự kiểm sau bài: cảm ơn một người bằng おかげで và kể một điều không may bằng せいで; đọc hiểu thông báo 「信号故障のため、運転を見合わせております」; xin lỗi đến muộn bằng ものですから; viết một câu からこそ về bài học từ thất bại. Bài tiếp theo (N3-07): thời điểm và diễn biến (ところだ, うちに, たとたん)."
 ];
 const section={};types.forEach((t,i)=>section[t]=add('lesson_sections',{moduleId,sectionType:t,title:titles[i],instructions:instructions[i],sortOrder:i+1,isRequired:true}));
 vocab.forEach(([japanese,hiragana,romaji,meaning,type,exampleJp,exampleEn])=>add('vocabulary',{moduleId,japanese,hiragana,romaji,english:meaning,type,level:'N3',lesson:'N3-06',exampleJp,exampleEn}));
 kanji.forEach(([character,meaning,onyomi,kunyomi,strokes,radical,examples])=>add('kanji',{moduleId,character,meaning,onyomi,kunyomi,strokeCount:Number(strokes),radical,level:'N3',exampleWords:examples.split('; ').map(s=>({jp:s.split(': ')[0],en:s.split(': ')[1]})),relatedChars:[],mnemonic:`Tập viết ${character} theo bộ ${radical}; liên hệ nghĩa “${meaning.split(' / ')[1]}” với các từ ghép ví dụ.`}));
 grammar.forEach(([pattern,meaning,explanation,examples])=>{const grammarId=add('grammar_patterns',{moduleId,pattern,meaning,explanation,level:'N3',lesson:'N3-06',textbook:'Original LearnJP — N3 cause and effect'});examples.forEach(([japanese,english],i)=>add('grammar_examples',{grammarPatternId:grammarId,japanese,english,sortOrder:i+1}));});
 dialogues.forEach(([title,context,lines],i)=>{const conversationId=add('conversations',{sectionId:section.KAIWA,title,context,sortOrder:i+1});lines.forEach(([japanese,translation],n)=>add('conversation_lines',{conversationId,speaker:n%2?'B':'A',japanese,translation,sortOrder:n+1}));});
 const listens=listenings.map(([title,transcript,transcriptTranslation],i)=>add('listening_content',{sectionId:section.LISTENING,title,transcript,transcriptTranslation,instructions:'Nghe và trả lời câu hỏi bên dưới. Sau đó mở bản chép và bản dịch để tự kiểm.',audioUrl:'TTS:ja-JP',playbackSpeed:0.9,source:'Original LearnJP; browser TTS',sortOrder:i+1}));
 const reads=readings.map(([title,content,translation],i)=>add('reading_passages',{sectionId:section.READING,title,content,translation,estimatedLevel:'N3',source:'Original LearnJP',sortOrder:i+1}));
 writing.forEach(([title,prompt,sampleAnswer,minLength,maxLength],i)=>add('writing_tasks',{sectionId:section.WRITING,title,prompt,instructions:prompt,sampleAnswer,minLength,maxLength,rubric:'Tự kiểm: đúng độ dài ký tự (20%); nêu đúng nguyên nhân – kết quả, chọn đúng おかげで／せいで／ため (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',sortOrder:i+1}));
 const choices=(q,i)=>{const [prompt,correct,...rest]=q;const explanation=rest.pop(),options=[correct,...rest];const shift=i%4;return {prompt,options:[...options.slice(shift),...options.slice(0,shift)],correctAnswer:(4-shift)%4,explanation};};
 const vq=vocab.slice(0,10).map((v,i)=>[`「${v[0]}（${v[1]}）」nghĩa là gì?`,v[3],vocab[(i+17)%vocab.length][3],vocab[(i+41)%vocab.length][3],vocab[(i+73)%vocab.length][3],`${v[0]} = ${v[3]}. Ví dụ: ${v[5]} (${v[6]})`]);
 const kq=kanjiQuestions.map(([word,...opts])=>[`Cách đọc của 「${word}」?`,...opts,`${word} đọc là ${opts[0]}. Xem ví dụ trong mục Hán tự.`]);
 let exerciseIndex=0;
 const exercise=(q,sectionId,extra={})=>{const c=choices(q,exerciseIndex++);add('lesson_exercises',{sectionId,...c,exerciseType:'MULTIPLE_CHOICE',points:1,sortOrder:exerciseIndex,metadata:{source:'N3-06'},...extra});};
 vq.forEach(q=>exercise(q,section.EXERCISE));kq.forEach(q=>exercise(q,section.EXERCISE));grammarQuestions.forEach(q=>exercise(q,section.EXERCISE));
 listenQuestions.forEach(([i,...q])=>exercise(q,section.LISTENING,{listeningId:listens[i]}));readQuestions.forEach(([i,...q])=>exercise(q,section.READING,{readingPassageId:reads[i]}));
 // Quiz covers all seven patterns, including the おかげで / せいで and ため / から contrasts.
 const quiz=[...vq.slice(0,3),...kq.slice(0,3),...[0,1,3,4,5,7,8,10,12,13,14].map(i=>grammarQuestions[i]),...[0,2,3,4].map(i=>listenQuestions[i]).map(([i,p,...q])=>[`Đọc lại bản chép để ôn nghe:\n${listenings[i][1]}\n\n${p}`,...q]),...[0,2,3,4].map(i=>readQuestions[i]).map(([i,p,...q])=>[`Đọc đoạn sau:\n${readings[i][1]}\n\n${p}`,...q])];
 quiz.forEach((q,i)=>{const {prompt,correctAnswer,...rest}=choices(q,i);add('quiz_questions',{moduleId,question:prompt,correctIndex:correctAnswer,...rest,questionType:'MULTIPLE_CHOICE',points:10});});
 assert.equal(vocab.length,105);assert.equal(kanji.length,24);assert.equal(quiz.length,25);assert.equal(exerciseIndex,47);
 return rows;
}
