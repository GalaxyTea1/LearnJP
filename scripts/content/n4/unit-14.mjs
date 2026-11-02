import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {vocab,kanji,grammar,dialogues,readings,listenings,grammarQuestions,listenQuestions,readQuestions,writing,kanjiQuestions} from '../../../content/n4/n4-14.mjs';
import {encodeRow} from '../n5/package.mjs';
export const moduleId=23001,levelId=10001;
export async function buildUnit(){
 const columns=JSON.parse(await readFile(new URL('../../../backend/cloudflare/columns.json',import.meta.url),'utf8'));
 const stamp='2026-10-27T00:00:00.000Z',rows={};
 const add=(table,data)=>{const list=rows[table]??=[];const row=Object.fromEntries(columns[table].map(f=>[f.name,null]));Object.assign(row,{id:23001+list.length,createdAt:stamp,updatedAt:stamp,status:'DRAFT',version:1},data);const encoded=encodeRow(row,columns[table]);list.push(encoded);return row.id;};
 add('learning_modules',{levelId,unitNumber:14,title:'Tổng ôn N4',titleJp:'N4総復習',description:'N4-14: ôn 13 bài trước, lập kế hoạch du lịch ba ngày và tự kiểm tra tổng hợp. 50 từ ôn tập; bài kiểm tra trong khóa không thay bộ đề thi thử. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',topics:['Tổng ôn','Du lịch ba ngày','Tự đánh giá'],sortOrder:14,contentStatus:'DRAFT'});
 const types=['OVERVIEW','VOCABULARY','KANJI','GRAMMAR','KAIWA','LISTENING','READING','WRITING','EXERCISE','SUMMARY'];
 const titles=['Mục tiêu và cách học','50 từ ôn tập','12 Kanji mới','Tổng ôn N4','Hội thoại','Luyện nghe TTS','Đọc hiểu','Tự luyện viết','Bài tập','Tổng kết'];
 const instructions=[
  "Tiên quyết: hoàn thành N4-01 đến N4-13. Mục tiêu: phối hợp mẫu câu đã học để lên lịch du lịch ba ngày, xử lý thay đổi và kể lại trải nghiệm. 40 bài tập và quiz tổng ôn 20 câu, đạt từ 70%. Đây là bài tổng ôn trong khóa; bộ 3 đề thi thử riêng và rà soát toàn khóa còn chờ hoàn thành. Không phải đề JLPT chính thức.",
  "50 từ ôn tập được chọn từ 13 bài trước, không phải 50 từ mới. Mỗi từ giữ nguyên cách đọc, nghĩa và ví dụ ở bài gốc. Học theo ngữ cảnh và tự đặt câu cho chuyến đi. Từ xuất hiện lại có thể tạo thẻ ôn trong riêng bài này; số mục hiển thị không đồng nghĩa số từ mới độc lập.",
  "12 Kanji bổ sung theo chủ đề đi lại: 港、湖、島、船、鉄、路、線、急、特、指、階、荷. Đọc qua từ ghép; 三階 thường đọc さんがい, 特急 đọc とっきゅう. 空港、湖、島、船、鉄道、路線、指定席、荷物 là từ nhận biết bổ sung tại mục Kanji, không nằm trong 50 từ ôn. 小島、湖水、船旅 là từ mở rộng.",
  "9 nhóm ôn phủ 13 bài trước: thể thường/kinh nghiệm; thể て; khả năng/thay đổi; kế hoạch/nghĩa vụ; cho nhận; điều kiện; bị động; truyền đạt/lịch sự; thời gian/のに. Nhóm gộp không có nghĩa các mẫu thay thế được cho nhau. Đọc điểm nhìn người giúp/nhận, quan hệ thời gian và sự khác nhau giữa phỏng đoán với truyền đạt.",
  "Hội thoại tự soạn, tình huống giả định. Chú giải: 博物館（はくぶつかん）bảo tàng; 預ける（あずける）gửi đồ; 預かる（あずかる）giữ đồ hộ; 掲示板（けいじばん）bảng thông báo; 発表（はっぴょう）thông báo/công bố; お気をつけて chúc đi cẩn thận. Hai hội thoại không dùng để suy ra phí của bài đọc.",
  "Nghe trước khi xem bản chép. Mỗi đoạn có lịch riêng. Chú giải: 一日中（いちにちじゅう）cả ngày; 入口（いりぐち）cửa vào; 指定席（していせき）ghế đặt trước; 受け取る（うけとる）nhận; 弱くなる（よわくなる）yếu/nhẹ đi. Giờ mở cửa khác giờ hẹn. Dùng TTS thiết bị, không phải bản thu âm người thật.",
  "Chú giải: 入場料（にゅうじょうりょう）vé vào cửa; 往復（おうふく）khứ hồi; 食費（しょくひ）tiền ăn; 予算（よさん）ngân sách; 残り（のこり）phần còn lại; 窓口（まどぐち）quầy; 時点（じてん）thời điểm; 以外（いがい）ngoài/trừ. Bài 1 có giá hoàn toàn giả định cho một người, tính cả vé bảo tàng. Bài 2 chưa xác nhận tàu chiều, không tự suy ra tàu chạy vì bảo tàng mở.",
  "Tự luyện kế hoạch 180–240 ký tự và email sau chuyến đi 160–220 ký tự tiếng Nhật. Có mẫu để so sánh sau khi viết. Chú giải: 予算を超える（よさんをこえる）vượt ngân sách; 値段（ねだん）giá; 初めて（はじめて）lần đầu. Bản nháp lưu ở trình duyệt; không có chấm điểm tự động. Dùng lịch và thông tin tưởng tượng.",
  "40 câu: 9 từ vựng, 8 Kanji, 13 ngữ pháp, 5 nghe, 5 đọc. Quiz tổng ôn 20 câu có câu ngữ pháp từ từng bài N4-01 đến N4-13. Phần ôn nghe trong quiz hiển thị bản chép, không đo nghe độc lập. Cần chọn theo nguồn đang hỏi; không ghép giờ và giá từ tình huống khác.",
  "Sau bài này: tự kiểm kể được kế hoạch ba ngày, nhờ giúp lịch sự, chọn phương án nếu thời tiết thay đổi và giải thích điều đã tiến bộ. Xem giải thích câu sai rồi quay lại bài gốc tương ứng. 14 bài đã có nội dung không đồng nghĩa đã hoàn tất bộ đề thi thử và xác minh mức sẵn sàng thi JLPT."
];
 const section={};types.forEach((t,i)=>section[t]=add('lesson_sections',{moduleId,sectionType:t,title:titles[i],instructions:instructions[i],sortOrder:i+1,isRequired:true}));
 vocab.forEach(([japanese,hiragana,romaji,meaning,type,exampleJp,exampleEn])=>add('vocabulary',{moduleId,japanese,hiragana,romaji,english:meaning,type,level:'N4',lesson:'N4-14',exampleJp,exampleEn}));
 kanji.forEach(([character,meaning,onyomi,kunyomi,strokes,radical,examples])=>add('kanji',{moduleId,character,meaning,onyomi,kunyomi,strokeCount:Number(strokes),radical,level:'N4',exampleWords:examples.split('; ').map(s=>({jp:s.split(': ')[0],en:s.split(': ')[1]})),relatedChars:[],mnemonic:`Tập viết ${character} theo bộ ${radical}; liên hệ nghĩa “${meaning.split(' / ')[1]}” với các từ ví dụ. Từ ghép chưa học chỉ dùng nhận biết.`}));
 grammar.forEach(([pattern,meaning,explanation,examples])=>{const grammarId=add('grammar_patterns',{moduleId,pattern,meaning,explanation,level:'N4',lesson:'N4-14',textbook:'Original LearnJP — N4 cumulative review'});examples.forEach(([japanese,english],i)=>add('grammar_examples',{grammarPatternId:grammarId,japanese,english,sortOrder:i+1}));});
 dialogues.forEach(([title,context,lines],i)=>{const conversationId=add('conversations',{sectionId:section.KAIWA,title,context,sortOrder:i+1});lines.forEach(([japanese,translation],n)=>add('conversation_lines',{conversationId,speaker:n%2?'B':'A',japanese,translation,sortOrder:n+1}));});
 const listens=listenings.map(([title,transcript,transcriptTranslation],i)=>add('listening_content',{sectionId:section.LISTENING,title,transcript,transcriptTranslation,instructions:'Nghe TTS và trả lời câu hỏi bên dưới. Có thể mở bản chép và bản dịch để tự kiểm.',audioUrl:'TTS:ja-JP',playbackSpeed:0.85,source:'Original LearnJP; browser TTS',sortOrder:i+1}));
 const reads=readings.map(([title,content,translation],i)=>add('reading_passages',{sectionId:section.READING,title,content,translation,estimatedLevel:'N4',source:'Original LearnJP',sortOrder:i+1}));
 writing.forEach(([title,prompt,sampleAnswer,minLength,maxLength],i)=>add('writing_tasks',{sectionId:section.WRITING,title,prompt,instructions:prompt,sampleAnswer,minLength,maxLength,rubric:'Tự kiểm: đúng độ dài ký tự (25%); dùng mẫu đã học đúng ngữ cảnh (35%); đủ ý và thứ tự theo đề (25%); mạch lạc, từ dùng tự nhiên (15%). Không có điểm tự động.',sortOrder:i+1}));
 const choices=(q,i)=>{const [prompt,correct,...rest]=q;const explanation=rest.pop(),options=[correct,...rest];const shift=i%4;return {prompt,options:[...options.slice(shift),...options.slice(0,shift)],correctAnswer:(4-shift)%4,explanation};};
 const vq=vocab.slice(0,9).map((v,i)=>[`「${v[0]}（${v[1]}）」nghĩa là gì?`,v[3],vocab[(i+13)%vocab.length][3],vocab[(i+23)%vocab.length][3],vocab[(i+33)%vocab.length][3],`${v[0]} = ${v[3]}. Ví dụ: ${v[5]} (${v[6]})`]);
 const kq=kanjiQuestions.map(([word,...opts])=>[`Cách đọc của 「${word}」?`,...opts,`${word} đọc là ${opts[0]}. Xem ví dụ trong mục Kanji.`]);
 let exerciseIndex=0;
 const exercise=(q,sectionId,extra={})=>{const c=choices(q,exerciseIndex++);add('lesson_exercises',{sectionId,...c,exerciseType:'MULTIPLE_CHOICE',points:1,sortOrder:exerciseIndex,metadata:{source:'N4-14'},...extra});};
 vq.forEach(q=>exercise(q,section.EXERCISE));kq.forEach(q=>exercise(q,section.EXERCISE));grammarQuestions.forEach(q=>exercise(q,section.EXERCISE));
 listenQuestions.forEach(([i,...q])=>exercise(q,section.LISTENING,{listeningId:listens[i]}));readQuestions.forEach(([i,...q])=>exercise(q,section.READING,{readingPassageId:reads[i]}));
 const quiz=[...vq.slice(0,1),...kq.slice(0,1),...grammarQuestions,...[listenQuestions[0],listenQuestions[3]].map(([i,p,...q])=>[`Đọc lại bản chép để ôn nghe:\n${listenings[i][1]}\n\n${p}`,...q]),...readQuestions.slice(0,3).map(([i,p,...q])=>[`Đọc đoạn sau:\n${readings[i][1]}\n\n${p}`,...q])];
 quiz.forEach((q,i)=>{const {prompt,correctAnswer,...rest}=choices(q,i);add('quiz_questions',{moduleId,question:prompt,correctIndex:correctAnswer,...rest,questionType:'MULTIPLE_CHOICE',points:10});});
 assert.equal(vocab.length,50);assert.equal(kanji.length,12);assert.equal(quiz.length,20);assert.equal(exerciseIndex,40);
 return rows;
}
