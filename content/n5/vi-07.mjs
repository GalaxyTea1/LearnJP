// N5-07 Vietnamese text, keyed by D1 row id (format: see vi-01.mjs and vi-02.mjs).
export default {
 vocabulary:{
  451:['mua sắm','Tôi đi mua sắm.'],452:['tiền','Tôi không có tiền.'],453:['yên (tiền Nhật)','100 yên.'],454:['bao nhiêu tiền','Cái này bao nhiêu tiền?'],
  455:['quầy thu ngân','Quầy thu ngân ở đằng kia.'],456:['quần áo','Tôi mua quần áo mới.'],457:['giày','Tôi muốn đôi giày đen.'],458:['mũ','Cho tôi xem cái mũ.'],
  459:['áo sơ mi','Tôi mua áo sơ mi trắng.'],460:['quần dài','Cái quần này dài.'],461:['váy','Tôi muốn cái váy xanh.'],462:['tất, vớ','Tôi mua ba đôi tất.'],
  463:['ô, dù','Có cái ô màu đỏ.'],464:['ví','Trong ví có 1000 yên.'],465:['kính (đeo mắt)','Tôi đang tìm kính.'],466:['màu sắc','Bạn thích màu gì?'],
  467:['đỏ','áo sơ mi đỏ'],468:['xanh dương, xanh lam','đôi giày xanh'],469:['đen','cái cặp đen'],470:['trắng','cái mũ trắng'],471:['vàng','cái ô vàng'],
  472:['to, lớn','Tôi muốn cái tivi to.'],473:['nhỏ, bé','Là cái cặp nhỏ.'],474:['mới','xe ô tô mới'],475:['cũ (không dùng cho người)','đồng hồ cũ'],
  476:['đắt; cao','Máy ảnh này đắt.'],477:['rẻ','Tôi đã mua giày rẻ.'],478:['muốn có','Tôi muốn có ô tô.'],479:['cho xem','Cho tôi xem cái máy ảnh đó.'],
  480:['một cái','Cho tôi một quả táo.'],481:['hai cái','Cho tôi hai cái đó.'],482:['ba cái','Tôi mua ba cái mũ.'],483:['bốn cái','Có bốn cái.'],484:['năm cái','Cho tôi năm cái.'],
  485:['sáu cái','Sáu cái.'],486:['bảy cái','Tôi mua bảy cái.'],487:['tám cái','Có tám cái.'],488:['chín cái','Chín cái.'],489:['mấy cái','Có mấy cái?'],
  490:['một tờ, một chiếc (đồ mỏng, dẹt)','Cho tôi một chiếc áo sơ mi.'],491:['hai tờ, hai chiếc (đồ mỏng, dẹt)','Tôi mua hai con tem.'],492:['mấy tờ, mấy chiếc','Bao nhiêu tờ?'],
  493:['tầng 1','Quầy thu ngân ở tầng 1.'],494:['tầng 2','Tầng 2 bán quần áo.'],495:['tầng mấy','Nhà vệ sinh ở tầng mấy?'],
 },
 kanji:{
  74:['VIÊN — yên (tiền), tròn',['100 yên']],75:['BÁCH — trăm',['300']],76:['THIÊN — nghìn',['3000']],77:['VẠN — mười nghìn',['10.000']],
  78:['CAO — cao, đắt',['đắt']],79:['AN — rẻ, yên ổn',['rẻ']],80:['TÂN — mới',['mới']],81:['CỔ — cũ',['cũ']],
 },
 grammar_patterns:{46:['bao nhiêu tiền?'],47:['muốn có N'],48:['tính từ đuôi い bổ nghĩa cho danh từ'],49:['cách đếm đồ vật'],50:['N này / N đó / N kia']},
 grammar_pattern_names:{49:'Cách đếm đồ vật'},
 grammar_examples:{82:'Cái áo sơ mi này bao nhiêu tiền?',83:'Tôi muốn có đôi giày mới.',84:'Tôi muốn có tiền.',85:'Tôi mua cái cặp to.',86:'Đây là cái đồng hồ cũ.',87:'Cho tôi ba quả táo.',88:'Tôi mua hai chiếc áo sơ mi.',89:'Cho tôi xem đôi giày đó.',90:'Người kia là anh Tanaka.'},
 conversations:{19:'Mua áo sơ mi',20:'Muốn có cái cặp mới'},
 conversation_lines:{83:'Xin mời quý khách.',84:'Xin lỗi, cho tôi xem cái áo sơ mi xanh đó.',85:'Vâng, mời anh.',86:'Cái này bao nhiêu tiền?',87:'Cái đó 3000 yên.',88:'Vậy cho tôi cái này.',89:'Chị Yamada muốn có gì?',90:'Tôi muốn có cái cặp mới.',91:'Cặp như thế nào?',92:'Tôi muốn cái cặp to.'},
 listening_content:{
  19:['Ở quầy thu ngân','Nghe khách hàng mua đồ.','Khách: Xin lỗi, cho tôi một cái mũ đen này và hai áo sơ mi trắng.\nNhân viên: Vâng, một mũ đen và hai áo sơ mi trắng phải không ạ? Tổng cộng 5000 yên.\nKhách: Vâng, gửi chị 5000 yên.'],
  20:['Tìm giày','Nghe khách hỏi quầy giày ở tầng mấy.','A: Xin lỗi, quầy giày ở tầng mấy?\nB: Giày à? Giày ở tầng 2.\nA: Cảm ơn. Tầng 2 nhỉ.\nB: Vâng, đúng vậy.'],
 },
 reading_passages:{
  19:['Đi mua sắm','Hôm qua là Chủ nhật. Tôi đã đi bách hóa. Ở bách hóa tôi đã mua đôi giày mới. Giày giá 5000 yên, hơi đắt. Sau đó tôi mua hai cái mũ. Mũ rẻ, 1000 yên một cái.'],
  20:['Sơ đồ cửa hàng','Hướng dẫn bách hóa ABC\nTầng 1: giày, ví, ô\nTầng 2: quần áo nữ, mũ\nTầng 3: quần áo nam, cà vạt\nTầng 4: nhà hàng'],
 },
 writing_tasks:{19:'Viết về món đồ bạn muốn có.',20:'Kể về một lần đi mua sắm.'},
};
