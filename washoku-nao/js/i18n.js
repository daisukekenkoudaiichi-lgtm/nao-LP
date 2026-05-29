/**
 * i18n.js — 日本語 / English / 中文 全文切り替え
 * data-i18n="key"          → textContent を置換
 * data-i18n-html="key"     → innerHTML を置換（<br>などを含む場合）
 * data-i18n-placeholder="key" → placeholder 属性を置換
 */

const TRANSLATIONS = {

  /* ══════════════════════════════════════════
   * 日本語
   * ══════════════════════════════════════════ */
  ja: {
    // NAV
    nav_concept_primary: '店主の想い', nav_concept_sub: 'Vision',
    nav_ingredients_primary: '食材',   nav_ingredients_sub: 'Ingredients',
    nav_menu_primary: 'メニュー',      nav_menu_sub: 'Menu',
    nav_shop_primary: '店舗',          nav_shop_sub: 'Shop',
    nav_voice_primary: '顧客の声',     nav_voice_sub: 'Reviews',
    nav_access_primary: '案内',        nav_access_sub: 'Access',
    nav_concept_m: '店主の想い　Vision', nav_ingredients_m: '食材　Ingredients',
    nav_menu_m: 'メニュー　Menu',       nav_shop_m: '店舗　Shop',
    nav_voice_m: '顧客の声　Reviews',   nav_access_m: '案内　Access',
    nav_reserve_m: 'ご予約　Reservation',

    // CONCEPT
    concept_eyebrow: '店主の想い',
    concept_heading_html: 'ただ、素材と真っ<span class="nao-emphasis gold-foil">直</span>ぐに向き合う。',
    concept_p1: '釧路という街は、海と湿原と大地が織りなす、稀有な恵みの交差点。',
    concept_p2: '朝の漁港で揚がったばかりの魚、霧の湿原で育つ山菜、<br>広大な台地が育てる肉と乳。そのすべてが、半径百キロのうちに揃う。',
    concept_p3: '私たちはその恵みを、足し算ではなく引き算で味わっていただきたい。<br>余白を残し、香りを残し、季節を残す。それが、和食 直の流儀です。',
    concept_owner: '— 主人 直 / OWNER · NAO —',

    // INGREDIENTS
    ingredients_heading: '道東の恵み、ひと皿に。',
    ingredients_sub: '海・山・大地——三つの恵みを、釧路の地でしか味わえない調和へ。',
    ingredients_photo: '料理写真を追加',
    ingredients_sea_title: '海の恵み',   ingredients_sea_location: '釧路港',
    ingredients_sea_desc: '朝に揚がる毛蟹、雲丹、時鮭、たらば。<br>潮の流れが豊かな漁場を育む、太平洋の幸を朝引きでお届け。',
    ingredients_mountain_title: '山の恵み', ingredients_mountain_location: '阿寒・摩周',
    ingredients_mountain_desc: '霧の湿原に芽吹く山菜、阿寒の茸、湧水で締めた山葵。<br>大地の呼吸を、職人の包丁が引き出します。',
    ingredients_land_title: '大地の恵み', ingredients_land_location: '十勝・根釧',
    ingredients_land_desc: '放牧の和牛、滋味深い鴨、絞りたての乳。<br>広大な大地が時間をかけて育てた、力強い味わい。',
    ingredients_tag_crab: '毛蟹', ingredients_tag_uni: '雲丹', ingredients_tag_salmon: '時鮭', ingredients_tag_sanma: '秋刀魚',
    ingredients_tag_gyoja: '行者にんにく', ingredients_tag_maitake: '舞茸', ingredients_tag_wasabi: '本山葵',
    ingredients_tag_wagyu: '短角牛', ingredients_tag_duck: '合鴨', ingredients_tag_butter: '根釧バター',

    // COURSE
    course_heading_html: '季節のおまかせ。<br class="hidden md:block">一席、一夜の物語。',
    course_sub: 'その日の最良の食材を見極め、八〜十二品で構成する一夜限りのお品書き。<br>季節と仕入れにより内容は日々変わります。',
    course_note: '※ サービス料 別途10%。アレルギー・苦手食材は事前にお知らせください。',
    course_view_reserve: 'VIEW RESERVATION →',
    course_1_name: '特別ハーフコース', course_1_type: 'SPECIAL HALF COURSE',
    course_1_i1: '先付', course_1_i2: '椀物', course_1_i3: '造里（道東鮮魚三種）',
    course_1_i4: '焼物', course_1_i5: '凌ぎ・煮物', course_1_i6: '食事・甘味',
    course_2_name: '店主のおまかせコース', course_2_type: "CHEF'S OMAKASE COURSE",
    course_2_i1: '先付・八寸', course_2_i2: '椀物（昆布出汁）', course_2_i3: '造里（朝引き鮮魚五種）',
    course_2_i4: '焼物（炭火）', course_2_i5: '主菜（道東短角牛 or 鮭）',
    course_2_i6: '揚物・凌ぎ・食事', course_2_i7: '甘味・お薄',
    course_3_name: '店主の厳選コース', course_3_type: "CHEF'S SELECTION COURSE",
    course_3_i1: '茶懐石仕立て', course_3_i2: '道東食材の極み', course_3_i3: '季節の希少素材',
    course_3_i4: '利き酒三種付き', course_3_i5: '個室限定／二日前予約',
    course_tax: '／ 税込',

    // SPACE
    space_heading_html: '静寂と灯り、<br class="md:hidden">もてなしの間。',
    space_01_label: '迎えの暖簾', space_02_label: '八席のカウンター',
    space_seats_sub: '一夜限定', space_counter_sub: '職人の手元', space_lang_sub: '英語対応可',

    // VOICE
    voice_heading: '訪れた方々の、声。',
    voice_1_quote: '一皿ごとに、釧路の景色が浮かんでくる。<br>これは料理ではなく、土地そのものをいただく時間でした。',
    voice_1_credit: '接待利用 ／ 東京',
    voice_3_quote: '記念日に伺いました。<br>扉を抜けた瞬間から、静謐な時間が始まる。忘れられない夜になりました。',
    voice_3_credit: '記念日利用 ／ 札幌',

    // ACCESS
    access_heading: 'お越しの際に。',
    access_address: '〒085-0014<br>北海道釧路市末広町２丁目９',
    access_hours: '18:00 〜 22:00',
    access_closed: '日曜日',
    access_reserve_info: '完全予約制<br>受付 18:00 〜 22:00',
    access_direction: 'JR釧路駅より車で7分<br>たんちょう釧路空港より30分',

    // RESERVE FEATURES
    feat_1_title: '完全予約制', feat_1_desc: '一日数組様限定で<br>お迎えしております。',
    feat_2_title: 'カウンター席', feat_2_desc: '職人の技を間近で<br>ご覧いただけます。',
    feat_3_title: '季節のコース', feat_3_desc: '道東の旬を活かした<br>おまかせコースをご用意。',
    feat_4_title: '英語対応可', feat_4_desc: '海外のお客様も<br>安心してご利用いただけます。',
    feat_5_title: 'アレルギー対応', feat_5_desc: '食材のご対応も<br>お気軽にご相談ください。',

    // RESERVE CTA
    reserve_label: '完全予約制', reserve_heading: 'ご予約はこちらから',
    reserve_desc: '大切な時間を、最高の一皿とともに。<br>皆様のお越しを心よりお待ちしております。',
    reserve_badge_text: '今月の空席状況を確認する',
    reserve_cta_btn: 'ご予約・お問い合わせ',
    reserve_phone_label: 'お電話でのご予約', reserve_phone_hours: '受付時間 17:00〜22:00',

    // CALENDAR
    cal_title: 'ご予約空席カレンダー',
    cal_legend_open: '空席あり', cal_legend_warn: '残りわずか',
    cal_legend_full: '満席', cal_legend_closed: '休業日',
    cal_reserve_btn: 'この日を予約する',

    // FORM
    rf_title: '予約フォーム',
    rf_name_label: 'お名前', rf_name_ph: '山田 花子',
    rf_kana_label: 'ふりがな', rf_kana_ph: 'やまだ はなこ',
    rf_email_label: 'メールアドレス',
    rf_phone_label: 'お電話番号', rf_phone_ph: '090-0000-0000',
    rf_party_label: '人数', rf_party_ph: '人数を選択',
    rf_course_label: 'コース',
    rf_allergies_label: 'アレルギー・苦手な食材', rf_allergies_ph: '例：えび、かに、小麦　など',
    rf_notes_label: 'ご要望・備考', rf_notes_ph: '記念日のご利用、お席のご希望など',
    rf_required: '必須', rf_optional: '任意',
    rf_notice_1: '※ 完全予約制です。ご予約確認後、担当よりご連絡いたします。',
    rf_notice_2: '※ キャンセルは前日18時までにお電話にてお願いいたします。',
    rf_notice_3: '※ サービス料として別途10%を頂戴いたします。',
    rf_submit: '予約を申し込む', rf_loading: '送信中...',
    rf_success_title: 'ご予約を承りました',
    rf_success_msg: 'ご登録のメールアドレスに確認メールをお送りします。<br>担当より改めてご連絡いたします。',
    rf_error_title: '送信に失敗しました', rf_retry: 'もう一度試す', rf_done: '閉じる',
    rf_party_1: '1名', rf_party_2: '2名', rf_party_3: '3名', rf_party_4: '4名',
    rf_party_5: '5名', rf_party_6: '6名', rf_party_7: '7名', rf_party_8: '8名（カウンター満席）',
    rf_c1_name: '特別ハーフコース', rf_c1_price: '¥ 6,500 / 税込',
    rf_c2_name: '店主のおまかせコース', rf_c2_price: '¥ 10,000 / 税込',
    rf_c3_name: '店主の厳選コース', rf_c3_price: '¥ 12,000 / 税込',

    // FOOTER
    footer_desc: '道東・釧路の旬を一皿に込めて。<br>海・山・大地の恵みを知り尽くした職人が、季節のおまかせでお迎えする完全予約制の和食処。',
    footer_concept: '店主の想い', footer_ingredients: '食材', footer_menu: 'メニュー',
    footer_shop: '店舗', footer_voice: '顧客の声', footer_access: '案内', footer_reserve: 'ご予約',
    footer_copyright: '© 2026 WASHOKU NAO ／ 和食 直',
    sticky_cta: 'コースのご予約はこちら',
  },

  /* ══════════════════════════════════════════
   * English
   * ══════════════════════════════════════════ */
  en: {
    nav_concept_primary: 'Concept',    nav_concept_sub: 'Vision',
    nav_ingredients_primary: 'Ingredients', nav_ingredients_sub: 'Ingredients',
    nav_menu_primary: 'Menu',          nav_menu_sub: 'Menu',
    nav_shop_primary: 'Space',         nav_shop_sub: 'Shop',
    nav_voice_primary: 'Reviews',      nav_voice_sub: 'Reviews',
    nav_access_primary: 'Access',      nav_access_sub: 'Access',
    nav_concept_m: 'Concept　Vision',  nav_ingredients_m: 'Ingredients',
    nav_menu_m: 'Menu',                nav_shop_m: 'Space　Shop',
    nav_voice_m: 'Reviews',            nav_access_m: 'Access',
    nav_reserve_m: 'Reservation',

    concept_eyebrow: "Chef's Philosophy",
    concept_heading_html: 'Simply facing every ingredient, head-on.',
    concept_p1: 'Kushiro is a rare crossroads where ocean, marshland, and earth converge in extraordinary bounty.',
    concept_p2: 'Fish pulled from the harbor at dawn, mountain vegetables from the misty wetlands,<br>meat and dairy from the broad plateau — all within a hundred kilometers.',
    concept_p3: 'We invite you to savor these gifts through subtraction, not addition.<br>Leaving space. Leaving fragrance. Leaving the season. This is the way of Washoku Nao.',
    concept_owner: '— Owner NAO —',

    ingredients_heading: 'The Gifts of Eastern Hokkaido.',
    ingredients_sub: 'Sea, Mountain, Earth — three blessings in harmony, only in Kushiro.',
    ingredients_photo: 'Add food photo',
    ingredients_sea_title: 'Gifts of the Sea',     ingredients_sea_location: 'Kushiro Port',
    ingredients_sea_desc: 'Hairy crab, sea urchin, king salmon, king crab.<br>The Pacific\'s bounty, delivered fresh each morning.',
    ingredients_mountain_title: 'Gifts of the Mountain', ingredients_mountain_location: 'Akan · Mashu',
    ingredients_mountain_desc: 'Wild vegetables from misty marshland, Akan mushrooms, spring-water wasabi.<br>The breath of the earth, drawn out by the chef\'s blade.',
    ingredients_land_title: 'Gifts of the Earth',  ingredients_land_location: 'Tokachi · Konsen',
    ingredients_land_desc: 'Free-range wagyu, flavorful duck, freshly drawn milk.<br>The bold taste of produce nurtured by the vast land.',
    ingredients_tag_crab: 'Hairy Crab', ingredients_tag_uni: 'Sea Urchin', ingredients_tag_salmon: 'King Salmon', ingredients_tag_sanma: 'Saury',
    ingredients_tag_gyoja: 'Wild Garlic', ingredients_tag_maitake: 'Maitake', ingredients_tag_wasabi: 'Wasabi',
    ingredients_tag_wagyu: 'Shorthorn Beef', ingredients_tag_duck: 'Duck', ingredients_tag_butter: 'Konsen Butter',

    course_heading_html: 'Seasonal Omakase.<br class="hidden md:block">One Seat, One Evening.',
    course_sub: 'Selecting the finest of the day, an 8–12 course menu that changes with the season.',
    course_note: '* 10% service charge applies. Please inform us of any allergies in advance.',
    course_view_reserve: 'VIEW RESERVATION →',
    course_1_name: 'Special Half Course',     course_1_type: 'SPECIAL HALF COURSE',
    course_1_i1: 'Starter',      course_1_i2: 'Soup',
    course_1_i3: 'Sashimi (3 fish)', course_1_i4: 'Grilled dish',
    course_1_i5: 'Palate cleanser · Simmered', course_1_i6: 'Rice · Dessert',
    course_2_name: "Chef's Omakase Course",   course_2_type: "CHEF'S OMAKASE COURSE",
    course_2_i1: 'Starter · Hassun', course_2_i2: 'Soup (Kombu dashi)',
    course_2_i3: 'Sashimi (5 fish)', course_2_i4: 'Grilled (charcoal)',
    course_2_i5: 'Main (Wagyu or Salmon)', course_2_i6: 'Fried · Cleanser · Rice',
    course_2_i7: 'Dessert · Matcha',
    course_3_name: "Chef's Selection Course", course_3_type: "CHEF'S SELECTION COURSE",
    course_3_i1: 'Tea kaiseki style', course_3_i2: 'Finest E. Hokkaido produce',
    course_3_i3: 'Seasonal rare ingredients', course_3_i4: 'Three sake pairings',
    course_3_i5: 'Private room · 2 days advance',
    course_tax: '/ tax incl.',

    space_heading_html: 'Silence, Light,<br class="md:hidden"> and Hospitality.',
    space_01_label: 'Welcoming Noren', space_02_label: '8-Seat Counter',
    space_seats_sub: 'Per Evening',    space_counter_sub: "Chef's Counter",
    space_lang_sub: 'English Available',

    voice_heading: 'Voices of Our Guests.',
    voice_1_quote: 'With every dish, the landscape of Kushiro came alive.<br>This was not merely dining — it was receiving the land itself.',
    voice_1_credit: 'Business Dinner / Tokyo',
    voice_3_quote: 'We visited for an anniversary.<br>From the moment we stepped inside, a profound stillness began. An unforgettable evening.',
    voice_3_credit: 'Anniversary Dinner / Sapporo',

    access_heading: 'Finding Your Way to Us.',
    access_address: '〒085-0014<br>2-9 Suehiro-cho, Kushiro, Hokkaido',
    access_hours: '18:00 — 22:00',
    access_closed: 'Sundays',
    access_reserve_info: 'Reservation required<br>Reservations: 18:00 — 22:00',
    access_direction: '7 min by car from JR Kushiro Station<br>30 min from Tancho Kushiro Airport',

    feat_1_title: 'Reservation Only',   feat_1_desc: 'A limited number of parties<br>welcomed each evening.',
    feat_2_title: 'Counter Seats',      feat_2_desc: "Watch the chef's craft<br>up close.",
    feat_3_title: 'Seasonal Course',    feat_3_desc: 'Omakase menu featuring<br>the best of Eastern Hokkaido.',
    feat_4_title: 'English Available',  feat_4_desc: 'International guests are<br>warmly welcomed.',
    feat_5_title: 'Allergy Friendly',   feat_5_desc: 'Please consult us about<br>any dietary requirements.',

    reserve_label: 'Reservation Only',  reserve_heading: 'Make Your Reservation',
    reserve_desc: 'A precious moment, together with the finest dish.<br>We look forward to welcoming you.',
    reserve_badge_text: "Check this month's availability",
    reserve_cta_btn: 'Reserve / Enquire',
    reserve_phone_label: 'Phone Reservation', reserve_phone_hours: 'Hours: 18:00 — 22:00',

    cal_title: 'Availability Calendar',
    cal_legend_open: 'Available', cal_legend_warn: 'Limited',
    cal_legend_full: 'Full',      cal_legend_closed: 'Closed',
    cal_reserve_btn: 'Reserve This Date',

    rf_title: 'Reservation Form',
    rf_name_label: 'Full Name',          rf_name_ph: 'Hanako Yamada',
    rf_kana_label: 'Furigana (reading)', rf_kana_ph: 'やまだ はなこ',
    rf_email_label: 'Email Address',
    rf_phone_label: 'Phone Number',      rf_phone_ph: '090-0000-0000',
    rf_party_label: 'Party Size',        rf_party_ph: 'Select party size',
    rf_course_label: 'Course',
    rf_allergies_label: 'Allergies / Dietary Restrictions', rf_allergies_ph: 'e.g. shrimp, crab, wheat',
    rf_notes_label: 'Special Requests',  rf_notes_ph: 'Anniversary, seating preference, etc.',
    rf_required: 'Required', rf_optional: 'Optional',
    rf_notice_1: '* Reservations required. We will contact you to confirm.',
    rf_notice_2: '* Cancellations must be made by 18:00 the day before by phone.',
    rf_notice_3: '* A 10% service charge will be added.',
    rf_submit: 'Submit Reservation', rf_loading: 'Sending...',
    rf_success_title: 'Reservation Received',
    rf_success_msg: 'A confirmation email has been sent to your address.<br>We will be in touch shortly.',
    rf_error_title: 'Submission Failed', rf_retry: 'Try Again', rf_done: 'Close',
    rf_party_1: '1 guest', rf_party_2: '2 guests', rf_party_3: '3 guests', rf_party_4: '4 guests',
    rf_party_5: '5 guests', rf_party_6: '6 guests', rf_party_7: '7 guests', rf_party_8: '8 guests (full counter)',
    rf_c1_name: 'Special Half Course',   rf_c1_price: '¥ 6,500 incl. tax',
    rf_c2_name: "Chef's Omakase Course", rf_c2_price: '¥ 10,000 incl. tax',
    rf_c3_name: "Chef's Selection Course", rf_c3_price: '¥ 12,000 incl. tax',

    footer_desc: 'The finest of Eastern Hokkaido in every dish.<br>A reservation-only kaiseki restaurant where every season comes to the plate.',
    footer_concept: 'Concept',  footer_ingredients: 'Ingredients', footer_menu: 'Menu',
    footer_shop: 'Space',       footer_voice: 'Reviews',           footer_access: 'Access',
    footer_reserve: 'Reservation',
    footer_copyright: '© 2026 WASHOKU NAO',
    sticky_cta: 'Reserve a Course',
  },

  /* ══════════════════════════════════════════
   * 中文（简体）
   * ══════════════════════════════════════════ */
  zh: {
    nav_concept_primary: '主厨理念',    nav_concept_sub: 'Vision',
    nav_ingredients_primary: '食材',    nav_ingredients_sub: 'Ingredients',
    nav_menu_primary: '菜单',           nav_menu_sub: 'Menu',
    nav_shop_primary: '店铺',           nav_shop_sub: 'Shop',
    nav_voice_primary: '顾客评价',      nav_voice_sub: 'Reviews',
    nav_access_primary: '交通指南',     nav_access_sub: 'Access',
    nav_concept_m: '主厨理念　Vision',  nav_ingredients_m: '食材',
    nav_menu_m: '菜单　Menu',           nav_shop_m: '店铺　Shop',
    nav_voice_m: '顾客评价　Reviews',   nav_access_m: '交通指南　Access',
    nav_reserve_m: '预约　Reservation',

    concept_eyebrow: '主厨的理念',
    concept_heading_html: '只是，与食材直面相对。',
    concept_p1: '钏路，是海洋、湿原与大地交织出的，稀有恩赐的十字路口。',
    concept_p2: '清晨在渔港刚上岸的鱼，雾中湿原里生长的山野菜，<br>广阔台地孕育的肉与乳——一切都汇聚在方圆百公里之内。',
    concept_p3: '我们希望您以减法而非加法来品味这份馈赠。<br>留下余白，留下香气，留下季节。这就是和食直的流儀。',
    concept_owner: '— 主人 直 / OWNER · NAO —',

    ingredients_heading: '道东的馈赠，凝于一盘。',
    ingredients_sub: '海洋、山林、大地——三重恩赐，在钏路汇聚成独特的调和之味。',
    ingredients_photo: '添加料理照片',
    ingredients_sea_title: '海洋的馈赠',    ingredients_sea_location: '钏路港',
    ingredients_sea_desc: '清晨捕获的毛蟹、海胆、鲑鱼、帝王蟹。<br>太平洋的恩惠，每日清晨从丰饶渔场直送。',
    ingredients_mountain_title: '山林的馈赠', ingredients_mountain_location: '阿寒·摩周',
    ingredients_mountain_desc: '雾中湿原萌发的山野菜、阿寒的蘑菇、泉水点制的山葵。<br>大地的呼吸，经由职人的刀刃引出。',
    ingredients_land_title: '大地的馈赠',   ingredients_land_location: '十胜·根钏',
    ingredients_land_desc: '放牧的和牛、鲜美的鸭肉、现挤的鲜乳。<br>广袤大地悉心孕育，饱含力量的滋味。',
    ingredients_tag_crab: '毛蟹', ingredients_tag_uni: '海胆', ingredients_tag_salmon: '鲑鱼', ingredients_tag_sanma: '秋刀鱼',
    ingredients_tag_gyoja: '山蒜', ingredients_tag_maitake: '舞茸', ingredients_tag_wasabi: '山葵',
    ingredients_tag_wagyu: '短角牛', ingredients_tag_duck: '鸭肉', ingredients_tag_butter: '根钏黄油',

    course_heading_html: '时令omakase。<br class="hidden md:block">一席，一夜的故事。',
    course_sub: '精选当日最佳食材，构成八至十二道菜的一夜限定菜单。<br>随季节与进货每日变化。',
    course_note: '※ 另收10%服务费。请提前告知过敏食材。',
    course_view_reserve: '查看预约 →',
    course_1_name: '特别半套课程',    course_1_type: 'SPECIAL HALF COURSE',
    course_1_i1: '前菜', course_1_i2: '汤品', course_1_i3: '刺身（三种鱼）',
    course_1_i4: '烤物', course_1_i5: '口直し·煮物', course_1_i6: '主食·甜点',
    course_2_name: '主厨omakase套餐', course_2_type: "CHEF'S OMAKASE COURSE",
    course_2_i1: '前菜·八寸', course_2_i2: '汤品（昆布出汁）', course_2_i3: '刺身（五种鱼）',
    course_2_i4: '烤物（炭火）', course_2_i5: '主菜（和牛或鲑鱼）',
    course_2_i6: '炸物·口直し·主食', course_2_i7: '甜点·抹茶',
    course_3_name: '主厨精选套餐',    course_3_type: "CHEF'S SELECTION COURSE",
    course_3_i1: '茶懐石风格', course_3_i2: '道东食材极致', course_3_i3: '季节稀有食材',
    course_3_i4: '附赠三种清酒品鉴', course_3_i5: '包厢限定／提前两天预约',
    course_tax: '/ 含税',

    space_heading_html: '静谧与灯光，<br class="md:hidden">款待之间。',
    space_01_label: '迎客门帘', space_02_label: '八席吧台',
    space_seats_sub: '每晚限定', space_counter_sub: '职人近旁', space_lang_sub: '可英文对应',

    voice_heading: '来访者的声音。',
    voice_1_quote: '每一道菜，钏路的风景都浮现眼前。<br>这不只是用餐，而是品味这片土地本身的时光。',
    voice_1_credit: '商务宴请 / 东京',
    voice_3_quote: '我们为纪念日而来。<br>踏入门的瞬间，一种静谧便已开始。那是难以忘怀的一夜。',
    voice_3_credit: '纪念日聚餐 / 札幌',

    access_heading: '前往我们的店。',
    access_address: '〒085-0014<br>北海道钏路市末広町2丁目9',
    access_hours: '18:00 〜 22:00',
    access_closed: '每周日',
    access_reserve_info: '完全预约制<br>受理时间 18:00 〜 22:00',
    access_direction: 'JR钏路站乘车约7分钟<br>丹顶钏路机场约30分钟',

    feat_1_title: '完全预约制',  feat_1_desc: '每日仅限数组客人，<br>恭候您的光临。',
    feat_2_title: '吧台席位',    feat_2_desc: '近距离欣赏<br>职人精湛技艺。',
    feat_3_title: '时令套餐',    feat_3_desc: '以道东时令食材精心<br>打造的omakase套餐。',
    feat_4_title: '英文服务',    feat_4_desc: '海外客人也可<br>放心享用。',
    feat_5_title: '过敏对应',    feat_5_desc: '欢迎提前告知<br>食材相关需求。',

    reserve_label: '完全预约制',  reserve_heading: '在此预约',
    reserve_desc: '珍贵的时光，与最好的料理共度。<br>期待您的光临。',
    reserve_badge_text: '确认本月空席状况',
    reserve_cta_btn: '预约・咨询',
    reserve_phone_label: '电话预约', reserve_phone_hours: '受理时间 17:00〜22:00',

    cal_title: '预约空席日历',
    cal_legend_open: '有空席', cal_legend_warn: '席位有限',
    cal_legend_full: '已满席', cal_legend_closed: '休息日',
    cal_reserve_btn: '预约此日',

    rf_title: '预约表单',
    rf_name_label: '姓名',      rf_name_ph: '山田 花子',
    rf_kana_label: '假名拼音',  rf_kana_ph: 'やまだ はなこ',
    rf_email_label: '电子邮箱',
    rf_phone_label: '联系电话', rf_phone_ph: '090-0000-0000',
    rf_party_label: '人数',     rf_party_ph: '请选择人数',
    rf_course_label: '套餐',
    rf_allergies_label: '过敏・不耐受食材', rf_allergies_ph: '例：虾、蟹、小麦等',
    rf_notes_label: '特殊要求・备注',       rf_notes_ph: '纪念日用餐、座位偏好等',
    rf_required: '必填', rf_optional: '选填',
    rf_notice_1: '※ 本店为完全预约制。确认预约后，工作人员将与您联系。',
    rf_notice_2: '※ 取消预约请于前一日18时前致电告知。',
    rf_notice_3: '※ 另收10%服务费。',
    rf_submit: '提交预约', rf_loading: '发送中...',
    rf_success_title: '预约已受理',
    rf_success_msg: '确认邮件已发送至您的邮箱。<br>工作人员将尽快与您联系。',
    rf_error_title: '发送失败', rf_retry: '重试', rf_done: '关闭',
    rf_party_1: '1位', rf_party_2: '2位', rf_party_3: '3位', rf_party_4: '4位',
    rf_party_5: '5位', rf_party_6: '6位', rf_party_7: '7位', rf_party_8: '8位（吧台全满）',
    rf_c1_name: '特别半套课程',   rf_c1_price: '¥ 6,500 / 含税',
    rf_c2_name: '主厨omakase套餐', rf_c2_price: '¥ 10,000 / 含税',
    rf_c3_name: '主厨精选套餐',   rf_c3_price: '¥ 12,000 / 含税',

    footer_desc: '将道东・钏路的时令凝于一盘。<br>由深谙海山大地之馈的职人，以季节omakase相迎的完全预约制和食处。',
    footer_concept: '主厨理念',  footer_ingredients: '食材',   footer_menu: '菜单',
    footer_shop: '店铺',         footer_voice: '顾客评价',     footer_access: '交通指南',
    footer_reserve: '预约',
    footer_copyright: '© 2026 WASHOKU NAO ／ 和食 直',
    sticky_cta: '预约套餐',
  },
};

/* ══════════════════════════════════════════
 * 翻訳エンジン
 * ══════════════════════════════════════════ */
let currentLang = localStorage.getItem('nao-lang') || 'ja';

function applyTranslations(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ja;
  currentLang = lang;
  localStorage.setItem('nao-lang', lang);

  // data-i18n → textContent
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // data-i18n-html → innerHTML
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // data-i18n-placeholder → placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // ボタンの aria-pressed 更新
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
  });

  // html[lang] 属性更新
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang;
}

/* ══════════════════════════════════════════
 * 初期化
 * ══════════════════════════════════════════ */
function initI18n() {
  // lang-btn クリックで言語切り替え
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyTranslations(btn.dataset.lang));
  });

  // ページ読み込み時に適用
  applyTranslations(currentLang);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}
