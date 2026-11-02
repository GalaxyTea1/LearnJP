// N5-10 Vietnamese text, keyed by D1 row id (format: see vi-01.mjs and vi-02.mjs).
export default {
 vocabulary:{
  586:['nói','Hãy nói tên của bạn.'],587:['nói chuyện','Hãy nói bằng tiếng Nhật.'],588:['đợi','Hãy đợi ở đây.'],589:['cầm, mang','Tôi cầm hành lý giúp nhé?'],
  590:['lấy, chuyền','Lấy giúp tôi lọ muối.'],591:['giúp đỡ','Hãy giúp tôi việc này.'],592:['gọi','Tôi gọi taxi.'],593:['vội, khẩn trương','Hãy nhanh lên.'],
  594:['sống, cư trú','Tôi đang sống ở Tokyo.'],595:['ngồi','Mời ngồi xuống ghế.'],596:['đứng','Hãy đứng lên.'],597:['dùng, sử dụng','Tôi dùng cây bút được không?'],
  598:['hút (thuốc)','Không được hút thuốc.'],599:['bán','Họ đang bán ô tô.'],600:['biết (知っています: biết)','Tôi biết địa chỉ của anh Tanaka.'],
  601:['mở','Hãy mở cửa sổ.'],602:['đóng','Hãy đóng cửa.'],603:['bật','Hãy bật đèn.'],604:['tắt','Hãy tắt tivi.'],605:['dừng, đỗ (xe)','Không được đỗ xe ở đây.'],
  606:['điện, đèn điện','Tôi tắt đèn.'],607:['điều hòa','Hãy bật điều hòa.'],608:['hộ chiếu','Cho xem hộ chiếu.'],609:['tên','Hãy viết tên của bạn.'],
  610:['địa chỉ','Bạn có biết địa chỉ không?'],611:['thuốc lá','Tôi hút thuốc lá.'],612:['muối','Lấy giúp tôi lọ muối.'],613:['đường (ăn)','Tôi cho đường vào cà phê.'],
  614:['hành lý','Tôi mang hành lý.'],615:['số','Số điện thoại của bạn là bao nhiêu?'],616:['quy tắc, nội quy','nội quy trường học'],617:['cấm hút thuốc','Đây là khu vực cấm hút thuốc.'],
  618:['tòa thị chính','Tôi đến tòa thị chính.'],619:['độc thân','Tôi độc thân.'],620:['câu trả lời','Hãy viết câu trả lời.'],621:['vấn đề; câu hỏi (bài tập)','Có vấn đề.'],
  622:['con đường','Tôi đi thẳng con đường này.'],623:['đèn giao thông','Tôi rẽ phải ở đèn giao thông.'],624:['góc đường','Hãy rẽ trái ở góc đường đó.'],625:['xe đạp','Tôi dựng xe đạp.'],
  626:['thẳng','Hãy đi thẳng.'],627:['chậm rãi, thong thả','Hãy nói chậm thôi.'],628:['ngay lập tức','Tôi đi ngay.'],629:['lát nữa, sau','Lát nữa tôi gọi điện.'],630:['thêm một chút','Bớt cho tôi thêm một chút được không?'],
 },
 kanji:{
  98:['KHAI — mở',['mở']],99:['BẾ — đóng',['đóng']],100:['ĐÃI — đợi',['đợi']],101:['CHỈ — dừng',['dừng, đỗ (xe)']],
  102:['TRÌ — cầm, có',['cầm']],103:['TRÚ — sống, cư trú',['sống']],104:['SỬ — dùng',['dùng']],105:['MẠI — bán',['bán']],
 },
 grammar_patterns:{61:['thể て của động từ'],62:['hãy làm V'],63:['đang làm V / trạng thái'],64:['tôi làm V có được không?'],65:['không được làm V']},
 grammar_pattern_names:{61:'Cách chia động từ thể て'},
 grammar_examples:{110:'đợi → đợi (thể て)',111:'ăn → ăn (thể て)',112:'Xin đợi một chút.',113:'Hãy viết tên của bạn.',114:'Bây giờ trời đang mưa.',115:'Tôi đang sống ở Tokyo.',116:'Tôi chụp ảnh có được không?',117:'Vâng, được chứ.',118:'Không được hút thuốc ở đây.',119:'Không được đỗ xe.'},
 conversations:{25:'Tôi dùng cái này được không?',26:'Cấm hút thuốc'},
 conversation_lines:{109:'Xin lỗi, tôi dùng máy tính này được không?',110:'Vâng, được chứ. Mời anh.',111:'Cảm ơn.',112:'À, chị Yamada, mở giúp tôi cửa sổ. Vì trời nóng.',113:'Vâng, tôi hiểu rồi.',114:'Xin lỗi, tôi hút thuốc ở đây được không?',115:'Xin lỗi, ở đây cấm hút thuốc nên anh không được hút.',116:'À, vậy à. Tôi hút ở ngoài được không?',117:'Vâng, ở ngoài thì được.'},
 listening_content:{
  25:['Chỉ đường','Nghe đoạn hỏi và chỉ đường đến tòa thị chính.','Xin lỗi, tòa thị chính ở đâu ạ? — Anh đi thẳng con đường đằng kia. Rồi rẽ phải ở đèn giao thông thứ hai. Tòa thị chính ở bên trái. — Tôi hiểu rồi. Cảm ơn.'],
  26:['Hướng dẫn trong lớp','Nghe hướng dẫn của giáo viên trong lớp.','Chào cả lớp. Bây giờ chúng ta làm bài kiểm tra. Các em hãy gấp sách lại. Rồi viết tên vào bài kiểm tra. Không được dùng từ điển. Hãy đọc chậm rãi. Nào, bắt đầu làm bài.'],
 },
 reading_passages:{
  25:['Nội quy thư viện','Nội quy thư viện\nKhông được hút thuốc trong thư viện. Được chụp ảnh nhưng không được nói chuyện điện thoại. Không được ăn nhưng được uống nước. Khi mượn sách, hãy xuất trình thẻ.'],
  26:['Tự giới thiệu','Rất vui được gặp mọi người. Tôi là Maria. Bây giờ tôi đang sống ở Tokyo. Tôi đang học tiếng Nhật ở một trường đại học tại Tokyo. Hằng ngày tôi đi xe đạp đến trường. Tôi có máy ảnh. Cuối tuần, tôi hay chụp ảnh ở công viên.'],
 },
 writing_tasks:{25:'Nhờ ai đó làm một việc.',26:'Xin phép làm một việc.'},
};
