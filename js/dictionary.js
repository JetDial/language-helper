/* dictionary.js — meanings for the Read tab.
 *
 * A built-in glossary of the words that actually fill up ordinary sentences:
 * pronouns, particles, common verbs, numbers, everyday nouns. It is not a full
 * dictionary and does not pretend to be — anything it does not know is marked
 * as unknown rather than guessed at, and the user can save their own meaning
 * for it, which then sticks.
 *
 * Japanese and Chinese are written without spaces, so those two get a
 * longest-match segmenter driven by the same glossary.
 */

const GLOSS = {

  ja: {
    'は': 'marks the topic — "as for…" (said "wa" here)',
    'が': 'marks the subject', 'を': 'marks the object', 'に': 'to / at / in',
    'へ': 'toward', 'で': 'by means of / at', 'と': 'and / with',
    'も': 'also / too', 'の': "of / 's", 'か': 'turns it into a question',
    'ね': "isn't it?", 'よ': 'I tell you (emphasis)', 'から': 'from / because',
    'まで': 'until', 'です': 'is / am / are (polite)', 'ます': 'polite verb ending',
    'ました': 'polite past ending', 'ません': 'polite negative ending',
    'します': 'does / will do (polite)', 'しました': 'did (polite)',
    'ください': 'please give me / please do', 'ですか': 'is it…? (polite question)',
    'います': 'is there / has (people, animals)', 'あります': 'is there / has (things)',
    'ない': 'not', 'わたし': 'I, me', '私': 'I, me', 'ぼく': 'I, me (casual, male)',
    '僕': 'I, me (casual, male)', 'あなた': 'you', '彼': 'he', '彼女': 'she / girlfriend',
    'これ': 'this one', 'それ': 'that one', 'あれ': 'that one over there',
    'ここ': 'here', 'そこ': 'there', 'どこ': 'where', 'なに': 'what', '何': 'what',
    'だれ': 'who', '誰': 'who', 'いつ': 'when', 'なぜ': 'why', 'どう': 'how',
    'する': 'to do', 'した': 'did', 'いく': 'to go', '行く': 'to go', '来る': 'to come',
    '見る': 'to see, to watch', '食べる': 'to eat', '飲む': 'to drink',
    '話す': 'to speak', '読む': 'to read', '書く': 'to write', '聞く': 'to listen, to ask',
    'ある': 'to exist (things)', 'いる': 'to exist (people, animals)',
    'いい': 'good', '良い': 'good', 'わるい': 'bad', '悪い': 'bad',
    '大きい': 'big', '小さい': 'small', 'たかい': 'expensive / tall', '高い': 'expensive / tall',
    'やすい': 'cheap', '新しい': 'new', '古い': 'old', 'とても': 'very',
    'すこし': 'a little', '少し': 'a little', 'たくさん': 'a lot',
    '人': 'person', '時間': 'time', '今日': 'today', '明日': 'tomorrow',
    '昨日': 'yesterday', '今': 'now', '年': 'year', '月': 'month, moon',
    '日': 'day, sun', '家': 'house', '車': 'car', '電車': 'train', '店': 'shop',
    'お金': 'money', '本': 'book', '国': 'country', '言葉': 'word, language',
    '日本語': 'the Japanese language', '英語': 'the English language',
    'こんにちは': 'hello', 'ありがとう': 'thank you', 'すみません': 'excuse me / sorry',
    'さようなら': 'goodbye', 'はい': 'yes', 'いいえ': 'no', 'ください': 'please give me',
    'ともだち': 'friend', 'こうえん': 'park', 'がっこう': 'school', 'せんせい': 'teacher',
    'にほん': 'Japan', 'にほんご': 'the Japanese language', 'ほん': 'book', 'みず': 'water',
    'たべる': 'to eat', 'のむ': 'to drink', 'みる': 'to see', 'きく': 'to listen, to ask',
    'ひらがな': 'hiragana (the round script)', 'カタカナ': 'katakana (the angular script)',
    '漢字': 'kanji (Chinese characters)'
  },

  ko: {
    '은': 'marks the topic', '는': 'marks the topic', '이': 'marks the subject',
    '가': 'marks the subject', '을': 'marks the object', '를': 'marks the object',
    '에': 'to / at', '에서': 'at / from', '와': 'and / with', '과': 'and / with',
    '하고': 'and / with', '도': 'also', '의': "of / 's", '만': 'only',
    '요': 'polite ending', '입니다': 'is / am / are (formal)', '이에요': 'is (polite)',
    '예요': 'is (polite)', '나': 'I, me', '저': 'I, me (humble)', '너': 'you',
    '우리': 'we, our', '이것': 'this', '그것': 'that', '저것': 'that over there',
    '여기': 'here', '거기': 'there', '어디': 'where', '뭐': 'what', '무엇': 'what',
    '누구': 'who', '언제': 'when', '왜': 'why', '어떻게': 'how',
    '하다': 'to do', '해요': 'do / does', '가다': 'to go', '오다': 'to come',
    '보다': 'to see', '먹다': 'to eat', '마시다': 'to drink', '말하다': 'to speak',
    '읽다': 'to read', '쓰다': 'to write / to use', '있다': 'to have, to exist',
    '없다': 'to not have', '좋다': 'to be good', '좋아요': 'it is good / I like it',
    '나쁘다': 'to be bad', '크다': 'to be big', '작다': 'to be small',
    '많다': 'to be many', '조금': 'a little', '아주': 'very', '너무': 'too much',
    '학생': 'student', '선생님': 'teacher', '사람': 'person', '시간': 'time', '오늘': 'today', '내일': 'tomorrow',
    '어제': 'yesterday', '지금': 'now', '년': 'year', '월': 'month', '일': 'day, work',
    '집': 'house', '차': 'car / tea', '기차': 'train', '가게': 'shop', '돈': 'money',
    '책': 'book', '나라': 'country', '말': 'speech, words / horse',
    '한국어': 'the Korean language', '영어': 'the English language',
    '안녕하세요': 'hello', '감사합니다': 'thank you', '죄송합니다': 'I am sorry',
    '네': 'yes', '아니요': 'no', '주세요': 'please give me', '한글': 'Hangul (the Korean script)', '생일': 'birthday', '이름': 'name'
  },

  zh: {
    '我': 'I, me', '你': 'you', '您': 'you (polite)', '他': 'he', '她': 'she',
    '我们': 'we', '你们': 'you (plural)', '他们': 'they',
    '的': "of / 's (links words)", '了': 'marks a completed change',
    '是': 'to be, yes', '不': 'not', '没': 'not (past / have not)',
    '在': 'at, in / to be doing', '有': 'to have', '和': 'and', '也': 'also',
    '很': 'very', '太': 'too much', '都': 'all, both', '吗': 'turns it into a question',
    '呢': 'and how about…?', '吧': 'suggestion — shall we?', '这': 'this',
    '那': 'that', '哪': 'which', '什么': 'what', '谁': 'who', '哪里': 'where',
    '什么时候': 'when', '为什么': 'why', '怎么': 'how',
    '去': 'to go', '来': 'to come', '看': 'to look, to read', '吃': 'to eat',
    '喝': 'to drink', '说': 'to speak', '写': 'to write', '听': 'to listen',
    '想': 'to want, to think', '要': 'to want, will', '会': 'can, will',
    '能': 'to be able to', '做': 'to do, to make', '给': 'to give',
    '好': 'good', '大': 'big', '小': 'small', '多': 'many', '少': 'few',
    '新': 'new', '老': 'old', '快': 'fast', '慢': 'slow',
    '人': 'person', '时间': 'time', '今天': 'today', '明天': 'tomorrow',
    '昨天': 'yesterday', '现在': 'now', '年': 'year', '月': 'month, moon',
    '日': 'day, sun', '天': 'day, sky', '家': 'home, family', '车': 'car, vehicle',
    '火车': 'train', '商店': 'shop', '钱': 'money', '书': 'book', '国': 'country',
    '中国': 'China', '中文': 'the Chinese language', '英文': 'the English language',
    '你好': 'hello', '谢谢': 'thank you', '对不起': 'sorry', '再见': 'goodbye',
    '请': 'please', '汉字': 'Chinese characters'
  },

  ru: {
    'я': 'I', 'ты': 'you', 'вы': 'you (polite or plural)', 'он': 'he',
    'она': 'she', 'оно': 'it', 'мы': 'we', 'они': 'they',
    'это': 'this, this is', 'тот': 'that', 'здесь': 'here', 'там': 'there',
    'где': 'where', 'что': 'what', 'кто': 'who', 'когда': 'when',
    'почему': 'why', 'как': 'how', 'и': 'and', 'а': 'and, but', 'но': 'but',
    'или': 'or', 'не': 'not', 'нет': 'no, there is not', 'да': 'yes',
    'в': 'in, into', 'на': 'on, to', 'с': 'with, from', 'к': 'toward',
    'по': 'along, by', 'из': 'out of', 'у': 'at, by (I have…)', 'о': 'about',
    'для': 'for', 'же': 'emphasis', 'уже': 'already', 'ещё': 'still, more',
    'очень': 'very', 'тоже': 'also', 'только': 'only', 'можно': 'may I / it is allowed',
    'быть': 'to be', 'есть': 'there is / to eat', 'идти': 'to go', 'ехать': 'to ride',
    'делать': 'to do', 'знать': 'to know', 'думать': 'to think', 'видеть': 'to see',
    'сказать': 'to say', 'говорить': 'to speak', 'читать': 'to read',
    'писать': 'to write', 'хотеть': 'to want', 'мочь': 'to be able to',
    'хорошо': 'good, well', 'плохо': 'badly', 'большой': 'big', 'маленький': 'small',
    'новый': 'new', 'старый': 'old', 'человек': 'person', 'время': 'time',
    'день': 'day', 'ночь': 'night', 'год': 'year', 'сегодня': 'today',
    'завтра': 'tomorrow', 'вчера': 'yesterday', 'сейчас': 'now', 'дом': 'house',
    'город': 'city', 'страна': 'country', 'книга': 'book', 'деньги': 'money',
    'вода': 'water', 'друг': 'friend', 'язык': 'language, tongue',
    'мой': 'my', 'твой': 'your', 'наш': 'our', 'его': 'his, him', 'её': 'her', 'их': 'their',
    'русский': 'Russian', 'спасибо': 'thank you', 'пожалуйста': 'please / you are welcome',
    'привет': 'hi', 'здравствуйте': 'hello (polite)', 'извините': 'excuse me'
  },

  el: {
    'εγώ': 'I', 'εσύ': 'you', 'αυτός': 'he', 'αυτή': 'she', 'αυτό': 'it, this',
    'εμείς': 'we', 'εσείς': 'you (plural)', 'αυτοί': 'they',
    'ο': 'the (masculine)', 'η': 'the (feminine)', 'το': 'the (neuter)',
    'και': 'and', 'αλλά': 'but', 'ή': 'or', 'δεν': 'not', 'όχι': 'no', 'ναι': 'yes',
    'σε': 'to, at', 'από': 'from', 'με': 'with', 'για': 'for', 'στο': 'to the, at the',
    'στη': 'to the, at the', 'πολύ': 'very, a lot', 'λίγο': 'a little',
    'εδώ': 'here', 'εκεί': 'there', 'πού': 'where', 'τι': 'what', 'ποιος': 'who',
    'πότε': 'when', 'γιατί': 'why, because', 'πώς': 'how',
    'είμαι': 'I am', 'είναι': 'is, are', 'έχω': 'I have', 'θέλω': 'I want',
    'πάω': 'I go', 'έρχομαι': 'I come', 'βλέπω': 'I see', 'τρώω': 'I eat',
    'πίνω': 'I drink', 'λέω': 'I say', 'μιλάω': 'I speak', 'διαβάζω': 'I read',
    'γράφω': 'I write', 'ξέρω': 'I know', 'μπορώ': 'I can',
    'καλός': 'good', 'κακός': 'bad', 'μεγάλος': 'big', 'μικρός': 'small',
    'νέος': 'new, young', 'άνθρωπος': 'person', 'χρόνος': 'time, year',
    'μέρα': 'day', 'νύχτα': 'night', 'σήμερα': 'today', 'αύριο': 'tomorrow',
    'χθες': 'yesterday', 'τώρα': 'now', 'σπίτι': 'house', 'πόλη': 'city',
    'χώρα': 'country', 'βιβλίο': 'book', 'νερό': 'water', 'φίλος': 'friend',
    'μου': 'my', 'σου': 'your', 'του': 'his, of the', 'μας': 'our', 'σας': 'your (plural)',
    'γλώσσα': 'language, tongue', 'ελληνικά': 'Greek (the language)',
    'ευχαριστώ': 'thank you', 'παρακαλώ': 'please / you are welcome',
    'γεια': 'hi, health', 'καλημέρα': 'good morning', 'συγγνώμη': 'sorry'
  },

  hi: {
    'मैं': 'I', 'तुम': 'you (familiar)', 'आप': 'you (polite)', 'वह': 'he, she, that',
    'यह': 'this', 'हम': 'we', 'वे': 'they', 'मेरा': 'my', 'तुम्हारा': 'your',
    'आपका': 'your (polite)', 'उसका': 'his, her',
    'है': 'is', 'हैं': 'are', 'था': 'was', 'थे': 'were', 'हूँ': 'am',
    'का': 'of', 'की': 'of', 'के': 'of', 'को': 'to', 'में': 'in', 'पर': 'on, but',
    'से': 'from, with', 'और': 'and', 'या': 'or', 'नहीं': 'no, not', 'हाँ': 'yes',
    'भी': 'also', 'बहुत': 'very, a lot', 'थोड़ा': 'a little', 'सब': 'all',
    'क्या': 'what', 'कौन': 'who', 'कहाँ': 'where', 'कब': 'when', 'क्यों': 'why',
    'कैसे': 'how', 'कितना': 'how much', 'यहाँ': 'here', 'वहाँ': 'there',
    'करना': 'to do', 'जाना': 'to go', 'आना': 'to come', 'देखना': 'to see',
    'खाना': 'to eat / food', 'पीना': 'to drink', 'बोलना': 'to speak',
    'पढ़ना': 'to read, to study', 'लिखना': 'to write', 'जानना': 'to know',
    'चाहना': 'to want', 'होना': 'to be',
    'अच्छा': 'good', 'बुरा': 'bad', 'बड़ा': 'big', 'छोटा': 'small', 'नया': 'new',
    'पुराना': 'old', 'आदमी': 'man', 'औरत': 'woman', 'लोग': 'people',
    'समय': 'time', 'दिन': 'day', 'रात': 'night', 'साल': 'year', 'आज': 'today',
    'कल': 'tomorrow / yesterday', 'अभी': 'right now', 'घर': 'house, home',
    'शहर': 'city', 'देश': 'country', 'किताब': 'book', 'पानी': 'water',
    'दोस्त': 'friend', 'नाम': 'name', 'भाषा': 'language', 'हिन्दी': 'Hindi',
    'नमस्ते': 'hello', 'धन्यवाद': 'thank you', 'कृपया': 'please'
  },

  ar: {
    'أنا': 'I', 'أنت': 'you', 'هو': 'he', 'هي': 'she', 'نحن': 'we',
    'هم': 'they', 'هذا': 'this (masculine)', 'هذه': 'this (feminine)',
    'ذلك': 'that', 'ال': 'the (attached to the front of a word)',
    'في': 'in', 'من': 'from, who', 'إلى': 'to', 'على': 'on', 'مع': 'with',
    'عن': 'about', 'ل': 'for, to', 'ب': 'with, by', 'و': 'and', 'أو': 'or',
    'لا': 'no, not', 'نعم': 'yes', 'ما': 'what, not', 'ماذا': 'what',
    'من_سؤال': 'who', 'أين': 'where', 'متى': 'when', 'لماذا': 'why', 'كيف': 'how',
    'كل': 'every, all', 'بعض': 'some', 'كثير': 'much, many', 'قليل': 'few',
    'كان': 'was', 'يكون': 'to be', 'ذهب': 'went', 'جاء': 'came', 'قال': 'said',
    'رأى': 'saw', 'أكل': 'ate', 'شرب': 'drank', 'كتب': 'wrote', 'قرأ': 'read',
    'عرف': 'knew', 'أراد': 'wanted', 'يستطيع': 'can',
    'جيد': 'good', 'سيء': 'bad', 'كبير': 'big', 'صغير': 'small', 'جديد': 'new',
    'قديم': 'old', 'رجل': 'man', 'امرأة': 'woman', 'ولد': 'boy', 'بنت': 'girl',
    'ناس': 'people', 'وقت': 'time', 'يوم': 'day', 'ليل': 'night', 'سنة': 'year',
    'اليوم': 'today', 'غدا': 'tomorrow', 'الآن': 'now', 'بيت': 'house',
    'مدينة': 'city', 'بلد': 'country', 'كتاب': 'book', 'ماء': 'water',
    'صديق': 'friend', 'اسم': 'name', 'لغة': 'language', 'العربية': 'Arabic',
    'مرحبا': 'hello', 'شكرا': 'thank you', 'طالب': 'student', 'درس': 'lesson, studied',
    'مدرسة': 'school', 'معلم': 'teacher'
  }
};

/* Sounds for the common words above that no rule can work out on its own:
 * Japanese kanji (the reading is not in the writing) and Chinese characters
 * (which need a dictionary). Kana, hangul, Cyrillic, Greek, Devanagari and
 * Arabic are all handled by the rules in transcribe.js instead. */
const PRON_EXTRA = {
  ja: {
    'は': 'wa', 'が': 'ga', 'を': 'o', 'に': 'ni', 'へ': 'e', 'で': 'de', 'と': 'to',
    'も': 'mo', 'の': 'no', 'か': 'ka', 'ね': 'ne', 'よ': 'jo', 'から': 'ka.ra',
    'まで': 'ma.de', 'です': 'des', 'ます': 'mas', 'ました': 'ma.Si.ta',
    'ません': 'ma.seN', 'ない': 'na.i', '私': 'wa.ta.Si', '僕': 'bo.ku',
    'します': 'Si.mas', 'しました': 'Si.ma.Si.ta', 'ですか': 'des.ka',
    'います': 'i.mas', 'あります': 'a.ri.mas', 'わたし': 'wa.ta.Si',
    '彼': 'ka.re', '彼女': 'ka.no.dZo', '何': 'na.ni', '誰': 'da.re',
    '行く': 'i.ku', '来る': 'ku.ru', '見る': 'mi.ru', '食べる': 'ta.be.ru',
    '飲む': 'no.mu', '話す': 'ha.na.su', '読む': 'jo.mu', '書く': 'ka.ku',
    '聞く': 'ki.ku', '良い': 'jo.i', '悪い': 'wa.ru.i', '大きい': 'o:.ki:',
    '小さい': 'tSi:.sa.i', '高い': 'ta.ka.i', '新しい': 'a.ta.ra.Si:',
    '古い': 'fu.ru.i', '少し': 'su.ko.Si', '人': 'hi.to', '時間': 'dZi.kaN',
    '今日': 'kjo:', '明日': 'a.Si.ta', '昨日': 'ki.no:', '今': 'i.ma',
    '年': 'to.Si', '月': 'tsu.ki', '日': 'hi', '家': 'i.e', '車': 'ku.ru.ma',
    '電車': 'deN.Sa', '店': 'mi.se', 'お金': 'o.ka.ne', '本': 'hoN',
    '国': 'ku.ni', '言葉': 'ko.to.ba', '日本語': 'ni.hon.go', '英語': 'e:.go',
    '漢字': 'kan.dZi', 'ください': 'ku.da.sa.i'
  },
  zh: {
    '我': 'wo', '你': 'ni', '您': 'nin', '他': 'ta', '她': 'ta',
    '我们': 'wo.m@n', '你们': 'ni.m@n', '他们': 'ta.m@n',
    '的': 'd@', '了': 'l@', '是': 'S@', '不': 'bu', '没': 'mei', '在': 'tsai',
    '有': 'jou', '和': 'h@', '也': 'je', '很': 'h@n', '太': 'tHai', '都': 'dou',
    '吗': 'ma', '呢': 'n@', '吧': 'ba', '这': 'dZ@', '那': 'na', '哪': 'na',
    '什么': 'S@n.m@', '谁': 'Sei', '哪里': 'na.li', '为什么': 'wei.S@n.m@',
    '怎么': 'ts@n.m@', '去': 'tSy', '来': 'lai', '看': 'kHan', '吃': 'tS@',
    '喝': 'h@', '说': 'Swo', '写': 'Sje', '听': 'tHiN', '想': 'SjaN',
    '要': 'jau', '会': 'hwei', '能': 'n@N', '做': 'tswo', '给': 'gei',
    '好': 'hau', '大': 'da', '小': 'Sjau', '多': 'dwo', '少': 'Sau',
    '新': 'Sin', '老': 'lau', '快': 'kHwai', '慢': 'man', '人': 'Z@n',
    '时间': 'S@.dZjen', '今天': 'dZin.tHjen', '明天': 'miN.tHjen',
    '昨天': 'tswo.tHjen', '现在': 'Sjen.tsai', '年': 'njen', '月': 'ye',
    '日': 'Z@', '天': 'tHjen', '家': 'dZja', '车': 'tS@', '火车': 'hwo.tS@',
    '商店': 'SaN.djen', '钱': 'tSjen', '书': 'Su', '国': 'gwo',
    '中文': 'dZoN.w@n', '英文': 'iN.w@n', '请': 'tSiN'
  }
};

/* Very light stemming for the languages that pile endings onto words. Enough
 * to find the dictionary form of a word most of the time; results found this
 * way are labelled as a near match, never as certain. */
const STEM_RULES = {
  ru: ['ами', 'ями', 'ов', 'ев', 'ой', 'ей', 'ем', 'ом', 'ах', 'ях', 'ы', 'и',
       'а', 'я', 'у', 'ю', 'е', 'о', 'ь'],
  el: ['ους', 'ων', 'ες', 'εις', 'ας', 'ης', 'ος', 'ου', 'ο', 'α', 'ε', 'ι'],
  hi: ['ों', 'ें', 'ने', 'का', 'की', 'के', 'ता', 'ती', 'ते', 'ा', 'ी', 'े'],
  ko: ['습니다', '입니다', '해요', '어요', '아요', '이에요', '예요', '요', '다',
       '에서', '으로', '는', '은', '을', '를', '이', '가', '도', '에', '의', '와', '과', '로'],
  ar: ['ات', 'ون', 'ين', 'ان', 'ها', 'هم', 'ية', 'ة']
};

/** Words the phrasebook already knows, folded into the same lookup. */
function phrasebookGloss(lang) {
  const out = {};
  (LANGUAGES[lang] ? LANGUAGES[lang].words : []).forEach(w => { out[w[0]] = w[3]; });
  return out;
}

const _indexCache = {};
function glossIndex(lang) {
  if (!_indexCache[lang]) {
    _indexCache[lang] = Object.assign({}, GLOSS[lang] || {}, phrasebookGloss(lang));
  }
  return _indexCache[lang];
}

/**
 * lookup('ru', 'книгу') -> { meaning: 'book', match: 'near', base: 'книга' }
 * Returns null when nothing is known — the UI then invites the user to
 * supply the meaning themselves.
 */
function lookup(lang, word, speaks) {
  if (!word) return null;

  /* the user's own note always wins */
  if (speaks) {
    const mine = MyWords.getWord(speaks, lang, word);
    if (mine && mine.meaning) return { meaning: mine.meaning, match: 'mine', base: word };
  }

  const index = glossIndex(lang);
  const clean = word.replace(/[.,!?;:"'()«»。、！？…]/g, '').trim();
  if (!clean) return null;

  if (index[clean]) return { meaning: index[clean], match: 'exact', base: clean };
  const lower = clean.toLowerCase();
  if (index[lower]) return { meaning: index[lower], match: 'exact', base: lower };

  /* Arabic: strip the attached article */
  if (lang === 'ar' && lower.startsWith('ال') && index[lower.slice(2)])
    return { meaning: index[lower.slice(2)], match: 'near', base: lower.slice(2) };

  for (const suffix of (STEM_RULES[lang] || [])) {
    if (lower.length > suffix.length && lower.endsWith(suffix)) {
      const stem = lower.slice(0, -suffix.length);
      if (index[stem]) return { meaning: index[stem], match: 'near', base: stem };
      for (const tail of ['а', 'я', 'о', 'ы', 'и', 'ε', 'α', 'ο', 'ος', 'ης', 'ας', 'ा', 'ी', '다', '']) {
        if (index[stem + tail]) return { meaning: index[stem + tail], match: 'near', base: stem + tail };
      }
    }
  }
  return null;
}

/** Longest known word first — used to break up Japanese and Chinese text. */
const _sortedCache = {};
function sortedKeys(lang) {
  if (!_sortedCache[lang]) {
    _sortedCache[lang] = Object.keys(glossIndex(lang)).sort((a, b) => b.length - a.length);
  }
  return _sortedCache[lang];
}

const SPACELESS = { ja: true, zh: true };

/* One-character Japanese words that glue onto the end of a phrase. They are
 * only split off when a content word has just finished, because the same
 * characters turn up inside ordinary words all the time. */
const PARTICLES = { ja: new Set(['は', 'が', 'を', 'に', 'へ', 'で', 'と', 'も', 'の', 'か', 'ね', 'よ']) };

/** Split text into word-sized pieces. */
function segment(lang, text) {
  if (!SPACELESS[lang]) {
    return text.split(/(\s+)/).filter(p => p.trim() !== '').map(t => ({ text: t }));
  }
  const keys = sortedKeys(lang);
  const particles = PARTICLES[lang] || new Set();
  const longMatchAt = (pos) => {
    for (const k of keys) if (k.length > 1 && text.startsWith(k, pos)) return k;
    return null;
  };

  const out = [];
  let i = 0, afterContent = false;
  while (i < text.length) {
    const ch = text[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (/[。、，,.!?！？「」『』（）()・…"']/.test(ch)) {
      out.push({ text: ch, punct: true }); i++; afterContent = false; continue;
    }

    const hit = longMatchAt(i);
    if (hit) { out.push({ text: hit }); i += hit.length; afterContent = true; continue; }

    if (particles.has(ch) && afterContent) {
      out.push({ text: ch }); i++; afterContent = false; continue;
    }

    /* Unknown: swallow the run of same-kind characters, but stop as soon as a
     * word we do know begins, or a particle rounds the phrase off. */
    const kind = charKind(ch);
    if (kind === 'kanji') { out.push({ text: ch }); i++; afterContent = true; continue; }

    let j = i + 1;
    while (j < text.length && charKind(text[j]) === kind && kind !== 'other') {
      /* a particle only ends the run once the run is long enough to be a word
       * of its own, or ともだち would come apart at its first も */
      if (longMatchAt(j) || (particles.has(text[j]) && j - i >= 2)) break;
      j++;
    }
    out.push({ text: text.slice(i, j) });
    i = j;
    afterContent = true;
  }
  return out;
}

function charKind(ch) {
  const c = ch.codePointAt(0);
  if (c >= 0x3040 && c <= 0x309f) return 'hiragana';
  if (c >= 0x30a0 && c <= 0x30ff) return 'katakana';
  if (c >= 0x4e00 && c <= 0x9fff) return 'kanji';
  if (/[a-z0-9]/i.test(ch)) return 'latin';
  return 'other';
}
