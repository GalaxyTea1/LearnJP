// N5-06 Vietnamese text, keyed by D1 row id (format: see vi-01.mjs and vi-02.mjs).
export default {
 vocabulary:{
  406:['thích','Tôi thích sushi.'],407:['ghét, không thích','Tôi không thích cá.'],408:['ngon','Bánh ngọt này ngon.'],409:['dở, không ngon','Cà phê này dở.'],
  410:['ngọt','Sô-cô-la thì ngọt.'],411:['cay','Cà ri thì cay.'],412:['đắng','Trà này đắng.'],413:['chua','Chanh thì chua.'],
  414:['nóng (đồ vật, đồ uống)','Tôi uống trà nóng.'],415:['lạnh (đồ vật, đồ uống)','Cho tôi nước lạnh.'],416:['đồ ăn','Món ăn bạn thích là gì?'],
  417:['đồ uống','Bạn muốn uống gì?'],418:['món ăn; nấu ăn','Tôi thích món Nhật.'],419:['món sushi','Cùng ăn sushi nào.'],420:['tempura (món chiên bột)','Tempura ngon.'],
  421:['mì ramen','Tôi ăn ramen.'],422:['cà ri','Cà ri thì cay.'],423:['sashimi (cá sống)','Bạn có thích sashimi không?'],424:['mì udon','Tôi ăn udon nóng.'],
  425:['mì soba','Tôi thích soba lạnh.'],426:['bánh ngọt','Tôi ăn bánh ngọt.'],427:['sô-cô-la','Cho tôi sô-cô-la.'],428:['kem','Tôi thích kem.'],
  429:['bia','Cùng uống bia lạnh nào.'],430:['rượu vang','Tôi thích rượu vang.'],431:['nước ép, nước ngọt','Cho tôi nước ép.'],432:['cà phê','Bạn có uống cà phê không?'],
  433:['thực đơn','Cho tôi xem thực đơn.'],434:['gọi món, đặt hàng','Cho tôi gọi món.'],435:['thanh toán, hóa đơn','Cho tôi thanh toán.'],436:['nước','Cho tôi nước.'],
  437:['trà (thường là trà xanh)','Tôi uống trà.'],438:['xin cho tôi…','Cho tôi thực đơn.'],439:['xin vui lòng đợi một chút','Xin vui lòng đợi một chút.'],
  440:['xin phép ăn (nói trước bữa ăn)','Câu cảm ơn nói trước khi ăn.'],441:['cảm ơn vì bữa ăn (nói sau bữa ăn)','Cảm ơn vì bữa ăn.'],
  442:['xin mời vào (lời chào của cửa hàng)','Xin mời quý khách.'],443:['… như thế nào, loại nào','Bạn thích món ăn như thế nào?'],444:['nhất, số một','Món bạn thích nhất là gì?'],
  445:['cùng… nào (rủ rê)','Cùng ăn nào.'],446:['cùng… nhé?; tôi… giúp nhé?','Mình uống nhé?'],447:['rất','Rất ngon.'],448:['một chút','Hơi cay một chút.'],
  449:['nhiều','Tôi ăn nhiều.'],450:['tất cả','Tôi đã ăn hết.'],
 },
 kanji:{
  66:['NGƯ — cá',['cá']],67:['NHỤC — thịt',['thịt']],68:['TRÀ — trà',['trà']],69:['TỬU — rượu',['rượu']],
  70:['NGƯU — bò',['sữa bò']],71:['HẢO — thích',['thích']],72:['CAM — ngọt',['ngọt']],73:['TÂN — cay',['cay']],
 },
 grammar_patterns:{41:['xin cho tôi N'],42:['thích / không thích N'],43:['cùng làm V nào / cùng làm V nhé?'],44:['N như thế nào, loại N nào'],45:['N thì (tính từ)']},
 grammar_examples:{73:'Cho tôi thực đơn.',74:'Cho tôi nước.',75:'Tôi thích sushi.',76:'Tôi không thích rau.',77:'Cùng ăn trưa nào.',78:'Mình uống cà phê nhé?',79:'Bạn thích món ăn như thế nào?',80:'Bánh ngọt này ngọt.',81:'Cà ri rất cay.'},
 conversations:{17:'Gọi món ở nhà hàng',18:'Thích và không thích'},
 conversation_lines:{74:'Xin mời quý khách. Quý khách gọi món ạ.',75:'Cho tôi ramen và sushi.',76:'Quý khách dùng đồ uống gì ạ?',77:'Cho tôi bia lạnh.',78:'Vâng, xin quý khách đợi một chút.',79:'Anh Tanaka thích món ăn như thế nào?',80:'Tôi thích tempura nhất. Ngon nhỉ.',81:'Tôi thích bánh ngọt. Tôi không thích món cay.',82:'Vậy mình cùng ăn bánh ngọt nhé?'},
 listening_content:{
  17:['Ở quán cà phê','Nghe hai khách chọn đồ uống và gọi món ở quán cà phê.','A: Cà phê với hồng trà, bạn chọn cái nào?\nB: Cho tôi cà phê nóng.\nA: Vậy cho hai cà phê. Thêm một bánh sô-cô-la nữa.\nNhân viên: Vâng, hai cà phê và một bánh sô-cô-la phải không ạ?'],
  18:['Sở thích ăn uống','Nghe người nói kể về sở thích ăn uống.','Tôi rất thích món Nhật. Món tôi thích nhất là sushi. Tôi hay ăn sushi ở nhà hàng với bạn. Tôi cũng thích tempura. Nhưng tôi không thích cà ri cay lắm.'],
 },
 reading_passages:{
  17:['Nhà hàng tôi thích','Gần nhà tôi có một nhà hàng. Tôi hay ăn tối ở đó. Món ăn ở nhà hàng rất ngon. Tôi lúc nào cũng gọi ramen và bia lạnh. Ramen hơi cay. Bánh ngọt cũng ngọt và ngon.'],
  18:['Thực đơn','Quán cà phê Sakura\nCà phê: 300 yên\nHồng trà: 300 yên\nBánh ngọt: 400 yên\nKem: 200 yên\n* Combo bánh ngọt và cà phê: 600 yên.'],
 },
 writing_tasks:{17:'Viết về món ăn bạn thích.',18:'Rủ bạn đi nhà hàng.'},
};
