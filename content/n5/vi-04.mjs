// N5-04 Vietnamese text, keyed by D1 row id (format: see vi-01.mjs and vi-02.mjs).
export default {
 vocabulary:{
  316:['ăn','Tôi ăn bánh mì.'],317:['uống','Tôi uống nước.'],318:['xem, nhìn','Tôi xem phim.'],319:['nghe','Tôi nghe nhạc.'],
  320:['đọc','Tôi đọc sách.'],321:['viết','Tôi viết thư.'],322:['mua','Tôi mua táo.'],323:['chụp (ảnh)','Tôi chụp ảnh.'],
  324:['làm','Tôi làm bài tập về nhà.'],325:['gặp','Tôi gặp bạn.'],326:['bữa ăn; cơm','Tôi ăn cơm.'],327:['bữa sáng','Tôi ăn sáng.'],
  328:['bữa trưa','Tôi ăn trưa.'],329:['bữa tối','Tôi ăn tối.'],330:['bánh mì','Tôi mua bánh mì.'],331:['thịt','Tôi ăn thịt.'],
  332:['cá','Tôi ăn cá.'],333:['trứng','Tôi mua trứng.'],334:['rau','Tôi ăn rau.'],335:['trái cây','Tôi mua trái cây.'],
  336:['nước','Tôi uống nước.'],337:['trà (thường là trà xanh)','Tôi uống trà.'],338:['hồng trà, trà đen','Tôi uống hồng trà.'],339:['sữa (bò)','Tôi uống sữa.'],
  340:['rượu, rượu sake','Tôi uống rượu.'],341:['bức thư','Tôi viết thư.'],342:['phim','Tôi xem phim.'],343:['ảnh','Tôi chụp ảnh.'],
  344:['bài tập về nhà','Tôi làm bài tập về nhà.'],345:['âm nhạc','Tôi nghe nhạc.'],346:['cửa hàng','Tôi mua ở cửa hàng.'],347:['nhà (của mình)','Tôi ăn ở nhà.'],
  348:['siêu thị','Tôi mua ở siêu thị.'],349:['nhà hàng','Tôi ăn ở nhà hàng.'],350:['công viên','Tôi chụp ảnh ở công viên.'],
  351:['luôn luôn','Tôi lúc nào cũng ăn bánh mì.'],352:['thường, hay','Tôi hay xem phim.'],353:['thỉnh thoảng','Thỉnh thoảng tôi uống trà.'],
  354:['không… lắm (đi với phủ định)','Tôi không xem tivi nhiều lắm.'],355:['hoàn toàn không (đi với phủ định)','Tôi hoàn toàn không uống rượu.'],
  356:['cái gì','Bạn sẽ mua gì?'],357:['sau đó','Sau đó, tôi học bài.'],358:['cùng nhau','Đi cùng nhau không?'],359:['một chút','Tôi nghỉ một chút.'],360:['vâng, ừ (thân mật)','Ừ, hay đấy.'],
 },
 kanji:{
  50:['THỰC — ăn, đồ ăn',['ăn']],51:['ẨM — uống',['uống']],52:['KIẾN — nhìn, xem',['xem, nhìn']],53:['VĂN — nghe',['nghe']],
  54:['ĐỘC — đọc',['đọc']],55:['THƯ — viết',['viết']],56:['MÃI — mua',['mua']],57:['VẬT — đồ vật',['trái cây']],
 },
 grammar_patterns:{31:['làm / không làm'],32:['trợ từ を: tân ngữ trực tiếp'],33:['làm gì ở đâu (trợ từ で)'],34:['làm gì?'],35:['trạng từ chỉ tần suất']},
 grammar_pattern_names:{32:'N（vật）を Vます',33:'N（nơi chốn）で Vます'},
 grammar_examples:{54:'Tôi ăn bánh mì.',55:'Tôi không uống rượu.',56:'Tôi đọc sách.',57:'Tôi chụp ảnh.',58:'Tôi ăn cơm ở nhà.',59:'Tôi mua ở siêu thị.',60:'Ngày mai bạn làm gì?',61:'Bạn làm gì ở công viên?',62:'Tôi hay xem phim.',63:'Tôi không uống trà nhiều lắm.'},
 conversations:{13:'Ngày mai bạn làm gì?',14:'Thói quen ăn sáng'},
 conversation_lines:{58:'Ngày mai bạn làm gì?',59:'Tôi sẽ mua trái cây ở siêu thị.',60:'Vậy à. Đi cùng nhau không?',61:'Ừ, hay đấy.',62:'Sáng nào bạn cũng ăn sáng à?',63:'Vâng, tôi có ăn.',64:'Bạn ăn gì?',65:'Tôi lúc nào cũng ăn bánh mì và trứng.'},
 listening_content:{
  13:['Kế hoạch chiều nay','Nghe A và B nói về việc sẽ làm chiều nay.','A: Chiều nay bạn làm gì?\nB: Tôi chụp ảnh ở công viên.\nA: Vậy à. Tôi cũng chụp ảnh.\nB: Vậy cùng đi công viên không?\nA: Ừ, hay đấy.'],
  14:['Thói quen ăn uống','Nghe một người kể về thói quen ăn uống.','Ngày nào tôi cũng ăn tối ở nhà. Tôi hay ăn thịt và rau. Tôi không ăn cá nhiều lắm. Ngoài ra, tôi lúc nào cũng uống trà. Tôi hoàn toàn không uống rượu.'],
 },
 reading_passages:{
  13:['Một ngày của tôi','Sáng nào tôi cũng dậy lúc 6 giờ. Sau đó tôi ăn sáng. Tôi lúc nào cũng ăn bánh mì và trứng, uống cà phê. Bữa trưa tôi ăn ở nhà hàng. Buổi tối, tôi làm bài tập ở nhà. Sau đó, tôi đi ngủ lúc 11 giờ.'],
  14:['Sở thích','Tôi thích âm nhạc. Ngày nào tôi cũng nghe nhạc ở nhà. Thỉnh thoảng tôi xem phim. Chiều thứ Bảy, tôi đá bóng với bạn ở công viên. Chủ nhật tôi không đá bóng nhiều. Tôi đọc sách ở nhà.'],
 },
 writing_tasks:{13:'Viết về bữa sáng của bạn.',14:'Viết về hoạt động cuối tuần của bạn.'},
};
