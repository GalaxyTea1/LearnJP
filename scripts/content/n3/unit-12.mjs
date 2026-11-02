import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {vocab,kanji,grammar,dialogues,readings,listenings,grammarQuestions,listenQuestions,readQuestions,writing,kanjiQuestions} from '../../../content/n3/n3-12.mjs';
import {encodeRow} from '../n5/package.mjs';
export const moduleId=41001,levelId=30001;
export async function buildUnit(){
 const columns=JSON.parse(await readFile(new URL('../../../backend/cloudflare/columns.json',import.meta.url),'utf8'));
 const stamp='2026-11-10T00:00:00.000Z',rows={};
 const add=(table,data)=>{const list=rows[table]??=[];const row=Object.fromEntries(columns[table].map(f=>[f.name,null]));Object.assign(row,{id:41001+list.length,createdAt:stamp,updatedAt:stamp,status:'DRAFT',version:1},data);const encoded=encodeRow(row,columns[table]);list.push(encoded);return row.id;};
 add('learning_modules',{levelId,unitNumber:12,title:'Công nghệ và cuộc sống',titleJp:'技術と生活',description:'N3-12: so sánh lợi và hại của công nghệ: ～一方で, ～反面, ～に比べて, ～に代わって, ～かわりに (thay vì / bù lại), むしろ. Thiết bị, mạng, tự động hóa, thanh toán không tiền mặt và sự lệ thuộc; 24 Hán tự về kỹ thuật. Nghe bằng giọng đọc của thiết bị, viết tự luyện.',topics:['Công nghệ','So sánh lợi và hại','Thay thế và đánh đổi'],sortOrder:12,contentStatus:'DRAFT'});
 const types=['OVERVIEW','VOCABULARY','KANJI','GRAMMAR','KAIWA','LISTENING','READING','WRITING','EXERCISE','SUMMARY'];
 const titles=['Mục tiêu và cách học','105 từ vựng mới','24 Hán tự mới','So sánh và đối lập','Hội thoại','Luyện nghe','Đọc hiểu','Tự luyện viết','Bài tập','Tổng kết'];
 const instructions=[
  "Tiên quyết: N5, N4 và N3-01 đến N3-11 (đặc biệt というより ở N3-05). Mục tiêu: nói hai mặt của một vấn đề, so sánh hai thứ, nói sự thay thế và đánh đổi, đính chính cách nhìn; viết bài so sánh ưu nhược điểm. 47 bài luyện, bài kiểm tra 25 câu, đạt từ 70%.",
  "Kỹ thuật và thiết bị, thông tin và mạng, tự động hóa, thanh toán và mua sắm, mặt trái của công nghệ, so sánh. Cặp gần nghĩa: 製品 (sản phẩm chế tạo) / 商品 (hàng để bán); 製造 (sản xuất công nghiệp) / 製作 (làm ra tác phẩm); 画像 (ảnh tĩnh) / 映像 (hình ảnh động, thước phim) / 動画 (video); 造る (đóng, xây vật lớn) / 作る; 異なる (văn viết) / 違う; 対面 (gặp trực tiếp) / リモート・遠隔 (từ xa).",
  "24 chữ mới: 技術 機械器 製造 利便 携帯 個型 比較 向逆差異共 像板装置. Từ ghép trọng tâm: 技術（ぎじゅつ）, 機械, 器具, 製品, 製造, 利便性, 携帯（けいたい）, 個人, 新型, 比較, 向上（こうじょう）, 逆効果, 格差, 異なる, 共有, 画像（がぞう）, 映像, 看板, 装置, 設置. Chú ý 型 đọc がた trong 新型／大型.",
  "7 mục: ～一方（で）; ～反面; ～に比べて／と比べて; ～に代わって; ～かわりに (thay vì); ～かわりに (bù lại); むしろ. So sánh: 反面 chỉ cho hai mặt của cùng một đối tượng, 一方で dùng được cho hai đối tượng khác nhau và hai việc song song; に代わって (chủ thể khác đảm nhận vai trò) / かわりに (cùng người chọn B thay A, hoặc đánh đổi). Khác 一方だ ở N3-07.",
  "Hội thoại tự soạn, tình huống giả định. Chú giải: 買い替える（かいかえる）mua đổi cái mới; 長持ち（ながもち）bền; 高機能（こうきのう）nhiều chức năng; 移す（うつす）chuyển; 財布（さいふ）ví; ポイントがたまる tích điểm; お年寄り（おとしより）người già; 割り勘（わりかん）chia đều tiền.",
  "Nghe trước, sau đó mới mở bản chép. Chú giải: 飲食店（いんしょくてん）nhà hàng, quán ăn; 導入（どうにゅう）đưa vào sử dụng; 費用（ひよう）chi phí; 奪う（うばう）cướp; チャット khung trò chuyện; まとめて gộp lại; ビデオ電話 gọi video.",
  "Chú giải bài 1: 翻訳（ほんやく）dịch; 単純（たんじゅん）đơn giản; 創造的（そうぞうてき）sáng tạo; 含む（ふくむ）chứa; 頼りすぎる（たよりすぎる）quá phụ thuộc. Bài 2: SNS mạng xã hội; 電源（でんげん）nguồn điện; 引き出し（ひきだし）ngăn kéo; 一瞬（いっしゅん）chớp mắt; 深く（ふかく）sâu sắc; たまる tồn đọng.",
  "Viết 250–350 ký tự tiếng Nhật. Có bài mẫu để so sánh sau khi viết. Bố cục: giới thiệu đối tượng → ưu điểm → nhược điểm → cách dùng hoặc quan điểm. Kiểm tra: 反面 chỉ dùng cho hai mặt của cùng một thứ; かわりに đúng nghĩa (thay vì / bù lại). Bản nháp tự lưu trên trình duyệt.",
  "47 câu: 10 từ vựng, 10 Hán tự, 15 ngữ pháp, 6 nghe, 6 đọc. Bài kiểm tra cuối bài 25 câu, đạt từ 70%; phần nghe trong bài kiểm tra có bản chép để ôn lại.",
  "Tự kiểm sau bài: nói hai mặt của điện thoại thông minh bằng 反面; so sánh thành phố và nông thôn bằng 一方で; so sánh mẫu máy mới và cũ bằng に比べて; nói việc robot thay người bằng に代わって; nói một lựa chọn bằng ～かわりに; nêu quan điểm bằng むしろ. Bài tiếp theo (N3-13): môi trường và giả định (場合, としたら, さえ～ば)."
 ];
 const section={};types.forEach((t,i)=>section[t]=add('lesson_sections',{moduleId,sectionType:t,title:titles[i],instructions:instructions[i],sortOrder:i+1,isRequired:true}));
 vocab.forEach(([japanese,hiragana,romaji,meaning,type,exampleJp,exampleEn])=>add('vocabulary',{moduleId,japanese,hiragana,romaji,english:meaning,type,level:'N3',lesson:'N3-12',exampleJp,exampleEn}));
 kanji.forEach(([character,meaning,onyomi,kunyomi,strokes,radical,examples])=>add('kanji',{moduleId,character,meaning,onyomi,kunyomi,strokeCount:Number(strokes),radical,level:'N3',exampleWords:examples.split('; ').map(s=>({jp:s.split(': ')[0],en:s.split(': ')[1]})),relatedChars:[],mnemonic:`Tập viết ${character} theo bộ ${radical}; liên hệ nghĩa “${meaning.split(' / ')[1]}” với các từ ghép ví dụ.`}));
 grammar.forEach(([pattern,meaning,explanation,examples])=>{const grammarId=add('grammar_patterns',{moduleId,pattern,meaning,explanation,level:'N3',lesson:'N3-12',textbook:'Original LearnJP — N3 technology and comparison'});examples.forEach(([japanese,english],i)=>add('grammar_examples',{grammarPatternId:grammarId,japanese,english,sortOrder:i+1}));});
 dialogues.forEach(([title,context,lines],i)=>{const conversationId=add('conversations',{sectionId:section.KAIWA,title,context,sortOrder:i+1});lines.forEach(([japanese,translation],n)=>add('conversation_lines',{conversationId,speaker:n%2?'B':'A',japanese,translation,sortOrder:n+1}));});
 const listens=listenings.map(([title,transcript,transcriptTranslation],i)=>add('listening_content',{sectionId:section.LISTENING,title,transcript,transcriptTranslation,instructions:'Nghe và trả lời câu hỏi bên dưới. Sau đó mở bản chép và bản dịch để tự kiểm.',audioUrl:'TTS:ja-JP',playbackSpeed:0.9,source:'Original LearnJP; browser TTS',sortOrder:i+1}));
 const reads=readings.map(([title,content,translation],i)=>add('reading_passages',{sectionId:section.READING,title,content,translation,estimatedLevel:'N3',source:'Original LearnJP',sortOrder:i+1}));
 writing.forEach(([title,prompt,sampleAnswer,minLength,maxLength],i)=>add('writing_tasks',{sectionId:section.WRITING,title,prompt,instructions:prompt,sampleAnswer,minLength,maxLength,rubric:'Tự kiểm: đúng độ dài ký tự (20%); so sánh đủ hai mặt, chọn đúng 一方で／反面 và かわりに／に代わって (35%); bố cục mở–thân–kết và đủ ý (30%); từ dùng tự nhiên, lịch sự phù hợp người nhận (15%). Không có điểm tự động.',sortOrder:i+1}));
 const choices=(q,i)=>{const [prompt,correct,...rest]=q;const explanation=rest.pop(),options=[correct,...rest];const shift=i%4;return {prompt,options:[...options.slice(shift),...options.slice(0,shift)],correctAnswer:(4-shift)%4,explanation};};
 const vq=vocab.slice(0,10).map((v,i)=>[`「${v[0]}（${v[1]}）」nghĩa là gì?`,v[3],vocab[(i+17)%vocab.length][3],vocab[(i+41)%vocab.length][3],vocab[(i+73)%vocab.length][3],`${v[0]} = ${v[3]}. Ví dụ: ${v[5]} (${v[6]})`]);
 const kq=kanjiQuestions.map(([word,...opts])=>[`Cách đọc của 「${word}」?`,...opts,`${word} đọc là ${opts[0]}. Xem ví dụ trong mục Hán tự.`]);
 let exerciseIndex=0;
 const exercise=(q,sectionId,extra={})=>{const c=choices(q,exerciseIndex++);add('lesson_exercises',{sectionId,...c,exerciseType:'MULTIPLE_CHOICE',points:1,sortOrder:exerciseIndex,metadata:{source:'N3-12'},...extra});};
 vq.forEach(q=>exercise(q,section.EXERCISE));kq.forEach(q=>exercise(q,section.EXERCISE));grammarQuestions.forEach(q=>exercise(q,section.EXERCISE));
 listenQuestions.forEach(([i,...q])=>exercise(q,section.LISTENING,{listeningId:listens[i]}));readQuestions.forEach(([i,...q])=>exercise(q,section.READING,{readingPassageId:reads[i]}));
 // Quiz covers all seven patterns, including the 一方で / 反面 and に代わって / かわりに contrasts.
 const quiz=[...vq.slice(0,3),...kq.slice(0,3),...[0,1,2,3,4,6,8,9,10,11,13].map(i=>grammarQuestions[i]),...[0,2,3,4].map(i=>listenQuestions[i]).map(([i,p,...q])=>[`Đọc lại bản chép để ôn nghe:\n${listenings[i][1]}\n\n${p}`,...q]),...[0,2,3,4].map(i=>readQuestions[i]).map(([i,p,...q])=>[`Đọc đoạn sau:\n${readings[i][1]}\n\n${p}`,...q])];
 quiz.forEach((q,i)=>{const {prompt,correctAnswer,...rest}=choices(q,i);add('quiz_questions',{moduleId,question:prompt,correctIndex:correctAnswer,...rest,questionType:'MULTIPLE_CHOICE',points:10});});
 assert.equal(vocab.length,105);assert.equal(kanji.length,24);assert.equal(quiz.length,25);assert.equal(exerciseIndex,47);
 return rows;
}
