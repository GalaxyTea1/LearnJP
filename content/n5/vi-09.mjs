// N5-09 Vietnamese text, keyed by D1 row id (format: see vi-01.mjs and vi-02.mjs).
export default {
 vocabulary:{
  541:['thời tiết','Hôm nay trời đẹp.'],542:['trời nắng, quang đãng','Ngày mai trời nắng.'],543:['mưa','Trời đang mưa.'],544:['tuyết','Tuyết màu trắng.'],
  545:['trời nhiều mây','Hôm nay trời nhiều mây.'],546:['gió','Gió mạnh.'],547:['mùa','Nhật Bản có 4 mùa.'],548:['mùa xuân','Mùa xuân ấm áp.'],
  549:['mùa hè','Mùa hè rất nóng.'],550:['mùa thu','Mùa thu mát mẻ.'],551:['mùa đông','Mùa đông có tuyết rơi.'],552:['ấm áp','Hôm nay ấm nhỉ.'],
  553:['mát mẻ','Gió mát.'],554:['nóng (thời tiết)','Việt Nam nóng.'],555:['lạnh (thời tiết)','Mùa đông ở Nhật lạnh.'],556:['dự báo thời tiết','Tôi xem dự báo thời tiết.'],
  557:['tốt, đẹp (chia theo よい)','Trời đẹp nhỉ.'],558:['xấu, tệ','Thời tiết xấu.'],559:['bận','Công việc bận.'],560:['rảnh','Ngày mai tôi rảnh.'],
  561:['khỏe mạnh, hăng hái','Bạn có khỏe không?'],562:['đẹp; sạch','Biển đã rất đẹp.'],563:['yên tĩnh','Thị trấn này yên tĩnh.'],564:['nhộn nhịp','Hà Nội nhộn nhịp.'],
  565:['tốt bụng','Anh Tanaka tốt bụng.'],566:['tiện lợi','Ô tô tiện lợi.'],567:['khó','Tiếng Nhật khó.'],568:['dễ','Bài kiểm tra này dễ.'],
  569:['gần','Nhà ga gần.'],570:['xa','Trường học xa.'],571:['nhiều','Đông người.'],572:['ít','Ít xe.'],
  573:['cái nào, bên nào (trong hai)','Bạn thích cái nào?'],574:['cái nào (thân mật)','Cái nào tốt hơn?'],575:['hơn (so sánh)','Chó to hơn mèo.'],
  576:['phía, bên (dùng khi so sánh)','Tôi cao hơn.'],577:['… hơn nhiều (khi so sánh)','Hôm nay lạnh hơn hôm qua nhiều.'],578:['nhất','Rẻ nhất.'],
  579:['thế giới','Đẹp nhất thế giới.'],580:['đất nước','Đất nước tôi là Việt Nam.'],581:['thế nào','Chuyến du lịch thế nào?'],582:['… như thế nào','Thị trấn như thế nào?'],
  583:['để xem nào; đúng vậy nhỉ','Để xem nào, đắt đấy.'],584:['nhưng','Nhưng mà ngon.'],585:['và, rồi thì','Và còn rẻ nữa.'],
 },
 kanji:{
  90:['THIÊN — trời',['thời tiết']],91:['KHÍ — khí, tinh thần',['khỏe mạnh']],92:['VŨ — mưa',['mưa']],93:['TUYẾT — tuyết',['tuyết']],
  94:['XUÂN — mùa xuân',['mùa xuân']],95:['HẠ — mùa hè',['mùa hè']],96:['THU — mùa thu',['mùa thu']],97:['ĐÔNG — mùa đông',['mùa đông']],
 },
 grammar_patterns:{56:['quá khứ của tính từ đuôi い'],57:['quá khứ của tính từ đuôi な và danh từ'],58:['A … hơn B'],59:['A và B, cái nào … hơn? / A … hơn'],60:['trong nhóm, N … nhất']},
 grammar_pattern_names:{60:'Phạm vi の中で N が 一番 ～です'},
 grammar_examples:{100:'Hôm qua trời lạnh.',101:'Bài kiểm tra đã không khó.',102:'Chuyến đi đã yên tĩnh.',103:'Hôm qua trời không mưa.',104:'Hôm nay nóng hơn hôm qua.',105:'Máy bay nhanh hơn ô tô.',106:'Mùa xuân và mùa thu, bạn thích mùa nào hơn?',107:'Tôi thích mùa thu hơn.',108:'Trong các mùa, tôi thích mùa đông nhất.',109:'Trong lớp, anh Tanaka cao nhất.'},
 conversations:{23:'Thời tiết thế nào?',24:'Bạn thích cái nào hơn?'},
 conversation_lines:{101:'Anh Tanaka, chuyến du lịch Tokyo thế nào?',102:'Rất vui. Nhưng hơi lạnh.',103:'Có tuyết rơi không?',104:'Không, không phải tuyết. Là mưa.',105:'Mùa hè Việt Nam nóng nhỉ.',106:'Đúng vậy. Mùa hè Nhật và mùa hè Việt Nam, nơi nào nóng hơn?',107:'Việt Nam nóng hơn nhiều.',108:'Tôi ghét mùa nóng. Tôi thích mùa đông nhất.'},
 listening_content:{
  23:['Thời tiết hôm qua','Nghe người nói tả thời tiết hôm qua và hôm nay.','Hôm qua trời mưa. Gió cũng mạnh. Vì trời rất lạnh nên tôi không ra ngoài. Tôi ở trong nhà đọc sách, nghe nhạc. Hôm nay trời đẹp. Vì trời ấm nên tôi sẽ đi dạo công viên.'],
  24:['So sánh','Nghe đoạn hội thoại so sánh hai thành phố.','A: Tokyo và Kyoto, bạn thích nơi nào hơn?\nB: Tôi thích Kyoto hơn.\nA: Tại sao vậy?\nB: Vì Kyoto yên tĩnh và đẹp hơn Tokyo. Trong các thành phố Nhật Bản, tôi thích Kyoto nhất.'],
 },
 reading_passages:{
  23:['Chuyến đi Hokkaido','Tuần trước tôi cùng gia đình đi Hokkaido. Hokkaido rất lạnh. Tuyết rơi nhiều. Nhưng lễ hội tuyết rất đẹp. Đồ ăn ở khách sạn ngon. Chuyến đi Hokkaido vui nhưng tôi hơi mệt.'],
  24:['Phương tiện tôi thích','Máy bay, tàu Shinkansen và xe buýt, bạn thích phương tiện nào nhất? Tôi thích Shinkansen nhất. Shinkansen nhanh hơn xe buýt. Máy bay nhanh nhất nhưng đắt và bất tiện. Shinkansen nhanh và tiện lợi. Vì vậy, tôi lúc nào cũng đi Shinkansen.'],
 },
 writing_tasks:{23:'Tả thời tiết hôm qua.',24:'So sánh hai thứ.'},
};
