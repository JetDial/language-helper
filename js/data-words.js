/* data-words.js — the phrasebook.
 *
 * Each entry: [ written form, standard romanization, pronunciation, meaning, category ]
 * The pronunciation column is the only one that matters for respelling; the
 * romanization is shown for reference because textbooks use it.
 */

const CATEGORIES = {
  greet: 'Greetings',
  basic: 'Essentials',
  people: 'People & places',
  food: 'Food & drink',
  travel: 'Out and about',
  num: 'Numbers',
  feel: 'Feelings'
};

const LANGUAGES = {

  ja: {
    name: 'Japanese', native: '日本語', flag: '🇯🇵', voice: 'ja-JP',
    script: 'Hiragana, Katakana & Kanji',
    scripts: ['hiragana', 'katakana', 'kanji'],
    transcriber: 'ja',
    note: 'Japanese is built from clear, even syllables — almost every one is '
        + 'a consonant plus a vowel. A double consonant (kk, tt) means a tiny '
        + 'pause, and a long vowel is simply held twice as long.',
    words: [
      ['こんにちは', 'konnichiwa', 'kon.ni.tSi.wa', 'hello / good day', 'greet'],
      ['おはようございます', 'ohayō gozaimasu', 'o.ha.jo:.go.za.i.mas', 'good morning (polite)', 'greet'],
      ['こんばんは', 'konbanwa', 'kom.baN.wa', 'good evening', 'greet'],
      ['さようなら', 'sayōnara', 'sa.jo:.na.ra', 'goodbye', 'greet'],
      ['またね', 'mata ne', 'ma.ta.ne', 'see you later', 'greet'],
      ['ありがとう', 'arigatō', 'a.ri.ga.to:', 'thank you', 'basic'],
      ['すみません', 'sumimasen', 'su.mi.ma.seN', 'excuse me / sorry', 'basic'],
      ['お願いします', 'onegaishimasu', 'o.ne.gai.Si.mas', 'please', 'basic'],
      ['はい', 'hai', 'hai', 'yes', 'basic'],
      ['いいえ', 'iie', 'i:.e', 'no', 'basic'],
      ['分かりません', 'wakarimasen', 'wa.ka.ri.ma.seN', "I don't understand", 'basic'],
      ['大丈夫', 'daijōbu', 'dai.dZo:.bu', "it's fine / I'm okay", 'basic'],
      ['名前', 'namae', 'na.ma.e', 'name', 'people'],
      ['友達', 'tomodachi', 'to.mo.da.tSi', 'friend', 'people'],
      ['先生', 'sensei', 'seN.se:', 'teacher', 'people'],
      ['学校', 'gakkō', 'gak.ko:', 'school', 'people'],
      ['日本', 'nihon', 'ni.hoN', 'Japan', 'people'],
      ['猫', 'neko', 'ne.ko', 'cat', 'people'],
      ['犬', 'inu', 'i.nu', 'dog', 'people'],
      ['水', 'mizu', 'mi.zu', 'water', 'food'],
      ['ご飯', 'gohan', 'go.haN', 'rice / a meal', 'food'],
      ['お茶', 'ocha', 'o.tSa', 'tea', 'food'],
      ['美味しい', 'oishii', 'o.i.Si:', 'delicious', 'food'],
      ['いただきます', 'itadakimasu', 'i.ta.da.ki.mas', 'said before eating', 'food'],
      ['トイレはどこですか', 'toire wa doko desu ka', 'to.i.re.wa.do.ko.des.ka', 'where is the toilet?', 'travel'],
      ['駅', 'eki', 'e.ki', 'train station', 'travel'],
      ['いくらですか', 'ikura desu ka', 'i.ku.ra.des.ka', 'how much is it?', 'travel'],
      ['一', 'ichi', 'i.tSi', 'one', 'num'],
      ['二', 'ni', 'ni', 'two', 'num'],
      ['三', 'san', 'saN', 'three', 'num'],
      ['四', 'yon', 'joN', 'four', 'num'],
      ['五', 'go', 'go', 'five', 'num'],
      ['愛', 'ai', 'ai', 'love', 'feel'],
      ['元気ですか', 'genki desu ka', 'geN.ki.des.ka', 'how are you?', 'feel'],
      ['楽しい', 'tanoshii', 'ta.no.Si:', 'fun / enjoyable', 'feel']
    ]
  },

  ko: {
    name: 'Korean', native: '한국어', flag: '🇰🇷', voice: 'ko-KR',
    script: 'Hangul',
    scripts: ['hangul'],
    transcriber: 'ko',
    note: 'Hangul letters are stacked into square syllable blocks. Once you '
        + 'know 24 letters you can read anything — the blocks tell you exactly '
        + 'where each syllable starts and stops.',
    words: [
      ['안녕하세요', 'annyeonghaseyo', 'an.njO:N.ha.se.jo', 'hello', 'greet'],
      ['안녕히 가세요', 'annyeonghi gaseyo', 'an.njO:N.hi.ga.se.jo', 'goodbye (to someone leaving)', 'greet'],
      ['잘 자요', 'jal jayo', 'tSal.tSa.jo', 'sleep well', 'greet'],
      ['감사합니다', 'gamsahamnida', 'kam.sa.ham.ni.da', 'thank you', 'basic'],
      ['죄송합니다', 'joesonghamnida', 'tSwe.soN.ham.ni.da', 'I am sorry', 'basic'],
      ['네', 'ne', 'ne', 'yes', 'basic'],
      ['아니요', 'aniyo', 'a.ni.jo', 'no', 'basic'],
      ['몰라요', 'mollayo', 'mol.la.jo', "I don't know", 'basic'],
      ['괜찮아요', 'gwaenchanayo', 'kwEn.tSa.na.jo', "it's okay", 'basic'],
      ['이름', 'ireum', 'i.r@m', 'name', 'people'],
      ['친구', 'chingu', 'tSin.gu', 'friend', 'people'],
      ['선생님', 'seonsaengnim', 'sOn.sEN.nim', 'teacher', 'people'],
      ['학교', 'hakgyo', 'hak.kjo', 'school', 'people'],
      ['집', 'jip', 'tSip', 'house / home', 'people'],
      ['한국', 'hanguk', 'han.guk', 'Korea', 'people'],
      ['고양이', 'goyangi', 'ko.jaN.i', 'cat', 'people'],
      ['물', 'mul', 'mul', 'water', 'food'],
      ['밥', 'bap', 'pap', 'rice / a meal', 'food'],
      ['김치', 'gimchi', 'kim.tSi', 'kimchi', 'food'],
      ['맛있어요', 'masisseoyo', 'ma.si.ssO.jo', 'it is delicious', 'food'],
      ['얼마예요', 'eolmayeyo', 'Ol.ma.je.jo', 'how much is it?', 'travel'],
      ['화장실', 'hwajangsil', 'hwa.dZaN.sil', 'restroom', 'travel'],
      ['여기', 'yeogi', 'jO.gi', 'here', 'travel'],
      ['하나', 'hana', 'ha.na', 'one', 'num'],
      ['둘', 'dul', 'tul', 'two', 'num'],
      ['셋', 'set', 'set', 'three', 'num'],
      ['넷', 'net', 'net', 'four', 'num'],
      ['다섯', 'daseot', 'ta.sOt', 'five', 'num'],
      ['사랑해요', 'saranghaeyo', 'sa.raN.hE.jo', 'I love you', 'feel'],
      ['행복해요', 'haengbokhaeyo', 'hEN.bo.kE.jo', 'I am happy', 'feel']
    ]
  },

  zh: {
    name: 'Mandarin Chinese', native: '中文', flag: '🇨🇳', voice: 'zh-CN',
    script: 'Hanzi (characters) + Pinyin',
    scripts: ['pinyin', 'hanzi'],
    transcriber: 'zh',
    note: 'Mandarin has four tones — the same syllable said with a different '
        + 'melody is a different word. The tone marks in the romanization are '
        + 'the melody; the respelling only carries the sounds.',
    words: [
      ['你好', 'nǐ hǎo', 'ni.hau', 'hello', 'greet'],
      ['早上好', 'zǎoshang hǎo', 'tsau.SaN.hau', 'good morning', 'greet'],
      ['再见', 'zàijiàn', 'tsai.dZjen', 'goodbye', 'greet'],
      ['谢谢', 'xièxie', 'Sje.Sje', 'thank you', 'basic'],
      ['不客气', 'bù kèqi', 'bu.k@.tSi', "you're welcome", 'basic'],
      ['对不起', 'duìbuqǐ', 'dwei.bu.tSi', 'sorry', 'basic'],
      ['是', 'shì', 'S@', 'yes / it is', 'basic'],
      ['不是', 'bù shì', 'bu.S@', 'no / it is not', 'basic'],
      ['我不懂', 'wǒ bù dǒng', 'wo.bu.doN', "I don't understand", 'basic'],
      ['名字', 'míngzi', 'miN.ts@', 'name', 'people'],
      ['朋友', 'péngyou', 'p@N.jou', 'friend', 'people'],
      ['老师', 'lǎoshī', 'lau.S@', 'teacher', 'people'],
      ['学校', 'xuéxiào', 'Sye.Sjau', 'school', 'people'],
      ['中国', 'Zhōngguó', 'dZoN.gwo', 'China', 'people'],
      ['猫', 'māo', 'mau', 'cat', 'people'],
      ['狗', 'gǒu', 'gou', 'dog', 'people'],
      ['水', 'shuǐ', 'Swei', 'water', 'food'],
      ['米饭', 'mǐfàn', 'mi.fan', 'cooked rice', 'food'],
      ['茶', 'chá', 'tSa', 'tea', 'food'],
      ['好吃', 'hǎochī', 'hau.tS@', 'tasty', 'food'],
      ['多少钱', 'duōshao qián', 'dwo.Sau.tSjen', 'how much does it cost?', 'travel'],
      ['洗手间', 'xǐshǒujiān', 'Si.Sou.dZjen', 'restroom', 'travel'],
      ['火车站', 'huǒchēzhàn', 'hwo.tS@.dZan', 'train station', 'travel'],
      ['一', 'yī', 'i', 'one', 'num'],
      ['二', 'èr', 'ar', 'two', 'num'],
      ['三', 'sān', 'san', 'three', 'num'],
      ['四', 'sì', 's@', 'four', 'num'],
      ['五', 'wǔ', 'u', 'five', 'num'],
      ['我爱你', 'wǒ ài nǐ', 'wo.ai.ni', 'I love you', 'feel'],
      ['很高兴', 'hěn gāoxìng', 'h@n.gau.SiN', 'very glad', 'feel']
    ]
  },

  ru: {
    name: 'Russian', native: 'Русский', flag: '🇷🇺', voice: 'ru-RU',
    script: 'Cyrillic',
    scripts: ['cyrillic'],
    transcriber: 'ru',
    note: 'Cyrillic is an alphabet — 33 letters, and once learned it is read '
        + 'straight through. Stress is unmarked in writing but it changes the '
        + 'vowels, so the stressed syllable is shown in CAPITALS here.',
    words: [
      ['привет', 'privet', 'pri.ˈvjet', 'hi', 'greet'],
      ['здравствуйте', 'zdravstvuyte', 'ˈzdra.stvui.tje', 'hello (polite)', 'greet'],
      ['доброе утро', 'dobroye utro', 'ˈdo.bra.je.ˈu.tra', 'good morning', 'greet'],
      ['до свидания', 'do svidaniya', 'da.svi.ˈda.nja', 'goodbye', 'greet'],
      ['спасибо', 'spasibo', 'spa.ˈsi.ba', 'thank you', 'basic'],
      ['пожалуйста', 'pozhaluysta', 'pa.ˈZa.lus.ta', 'please / you are welcome', 'basic'],
      ['извините', 'izvinite', 'iz.vi.ˈnji.tje', 'excuse me', 'basic'],
      ['да', 'da', 'da', 'yes', 'basic'],
      ['нет', 'net', 'njet', 'no', 'basic'],
      ['я не понимаю', 'ya ne ponimayu', 'ja.nji.pa.nji.ˈma.ju', "I don't understand", 'basic'],
      ['имя', 'imya', 'ˈi.mja', 'name', 'people'],
      ['друг', 'drug', 'druk', 'friend', 'people'],
      ['учитель', 'uchitel', 'u.ˈtSi.tjel', 'teacher', 'people'],
      ['школа', 'shkola', 'ˈSko.la', 'school', 'people'],
      ['дом', 'dom', 'dom', 'house', 'people'],
      ['Россия', 'Rossiya', 'ra.ˈsi.ja', 'Russia', 'people'],
      ['собака', 'sobaka', 'sa.ˈba.ka', 'dog', 'people'],
      ['вода', 'voda', 'va.ˈda', 'water', 'food'],
      ['хлеб', 'khleb', 'xljep', 'bread', 'food'],
      ['чай', 'chay', 'tSai', 'tea', 'food'],
      ['вкусно', 'vkusno', 'ˈfkus.na', 'tasty', 'food'],
      ['сколько стоит', 'skolko stoit', 'ˈskol.ka.ˈsto.it', 'how much does it cost?', 'travel'],
      ['туалет', 'tualet', 'tu.a.ˈljet', 'toilet', 'travel'],
      ['вокзал', 'vokzal', 'vag.ˈzal', 'train station', 'travel'],
      ['один', 'odin', 'a.ˈdjin', 'one', 'num'],
      ['два', 'dva', 'dva', 'two', 'num'],
      ['три', 'tri', 'tri', 'three', 'num'],
      ['четыре', 'chetyre', 'tSi.ˈty.rje', 'four', 'num'],
      ['пять', 'pyat', 'pjatj', 'five', 'num'],
      ['я тебя люблю', 'ya tebya lyublyu', 'ja.tji.ˈbja.lju.ˈblju', 'I love you', 'feel'],
      ['хорошо', 'khorosho', 'xa.ra.ˈSo', 'good / fine', 'feel']
    ]
  },

  ar: {
    name: 'Arabic', native: 'العربية', flag: '🇸🇦', voice: 'ar-SA',
    script: 'Arabic abjad',
    scripts: ['arabic'],
    transcriber: 'ar',
    note: 'Arabic runs right to left and letters join up, changing shape by '
        + 'position. Short vowels are usually not written at all — readers '
        + 'supply them, which is why the respelling here is so useful.',
    words: [
      ['مرحبا', 'marhaban', 'ˈmar.Ha.ban', 'hello', 'greet'],
      ['السلام عليكم', 'as-salāmu ʿalaykum', 'as.sa.ˈla:.mu.3a.ˈlai.kum', 'peace be upon you', 'greet'],
      ['صباح الخير', 'ṣabāḥ al-khayr', 'sa.ˈba:H.al.ˈxair', 'good morning', 'greet'],
      ['مع السلامة', 'maʿa s-salāma', 'ˈma.3a.sa.ˈla:.ma', 'goodbye', 'greet'],
      ['شكرا', 'shukran', 'ˈSuk.ran', 'thank you', 'basic'],
      ['من فضلك', 'min faḍlik', 'min.ˈfad.lik', 'please', 'basic'],
      ['آسف', 'āsif', 'ˈa:.sif', 'sorry', 'basic'],
      ['نعم', 'naʿam', 'ˈna.3am', 'yes', 'basic'],
      ['لا', 'lā', 'la:', 'no', 'basic'],
      ['لا أفهم', 'lā afham', 'la:.ˈaf.ham', "I don't understand", 'basic'],
      ['اسم', 'ism', 'ism', 'name', 'people'],
      ['صديق', 'ṣadīq', 'sa.ˈdi:q', 'friend', 'people'],
      ['معلم', 'muʿallim', 'mu.ˈ3al.lim', 'teacher', 'people'],
      ['مدرسة', 'madrasa', 'ˈmad.ra.sa', 'school', 'people'],
      ['بيت', 'bayt', 'bait', 'house', 'people'],
      ['مصر', 'miṣr', 'misr', 'Egypt', 'people'],
      ['قطة', 'qiṭṭa', 'ˈqit.ta', 'cat', 'people'],
      ['ماء', 'māʾ', "ma:'", 'water', 'food'],
      ['خبز', 'khubz', 'xubz', 'bread', 'food'],
      ['شاي', 'shāy', 'Sa:i', 'tea', 'food'],
      ['لذيذ', 'ladhīdh', 'la.ˈDi:D', 'delicious', 'food'],
      ['كم الثمن', 'kam ath-thaman', 'kam.aT.ˈTa.man', 'how much is the price?', 'travel'],
      ['حمام', 'ḥammām', 'Ham.ˈma:m', 'bathroom', 'travel'],
      ['واحد', 'wāḥid', 'ˈwa:.Hid', 'one', 'num'],
      ['اثنان', 'ithnān', 'iT.ˈna:n', 'two', 'num'],
      ['ثلاثة', 'thalātha', 'Ta.ˈla:.Ta', 'three', 'num'],
      ['أربعة', 'arbaʿa', 'ˈar.ba.3a', 'four', 'num'],
      ['خمسة', 'khamsa', 'ˈxam.sa', 'five', 'num'],
      ['أحبك', 'uḥibbuka', 'u.ˈHib.bu.ka', 'I love you', 'feel'],
      ['جميل', 'jamīl', 'dZa.ˈmi:l', 'beautiful', 'feel']
    ]
  },

  hi: {
    name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', voice: 'hi-IN',
    script: 'Devanagari',
    scripts: ['devanagari'],
    transcriber: 'hi',
    note: 'Devanagari hangs from a top line. Every consonant carries a built-in '
        + '"a" unless a vowel sign replaces it. Hindi also separates plain and '
        + 'breathy consonants — the puff of air after k, p, t changes the word.',
    words: [
      ['नमस्ते', 'namaste', 'na.mas.ˈte', 'hello', 'greet'],
      ['सुप्रभात', 'suprabhat', 'su.pra.ˈbHa:t', 'good morning', 'greet'],
      ['फिर मिलेंगे', 'phir milenge', 'pHir.mi.ˈleN.ge', 'see you again', 'greet'],
      ['धन्यवाद', 'dhanyavaad', 'dHan.ja.ˈva:d', 'thank you', 'basic'],
      ['कृपया', 'kripaya', 'ˈkri.pa.ja', 'please', 'basic'],
      ['माफ़ कीजिए', 'maaf kijiye', 'ma:f.ˈki:.dZi.je', 'excuse me', 'basic'],
      ['हाँ', 'haan', 'ha:N', 'yes', 'basic'],
      ['नहीं', 'nahin', 'na.ˈhiN', 'no', 'basic'],
      ['समझ नहीं आया', 'samajh nahin aaya', 'sa.madZ.na.ˈhiN.ˈa:.ja', "I didn't understand", 'basic'],
      ['नाम', 'naam', 'na:m', 'name', 'people'],
      ['दोस्त', 'dost', 'do:st', 'friend', 'people'],
      ['शिक्षक', 'shikshak', 'ˈSik.Sak', 'teacher', 'people'],
      ['स्कूल', 'school', 'sku:l', 'school', 'people'],
      ['घर', 'ghar', 'gHar', 'home', 'people'],
      ['भारत', 'Bhaarat', 'ˈbHa:.rat', 'India', 'people'],
      ['बिल्ली', 'billi', 'ˈbil.li:', 'cat', 'people'],
      ['कुत्ता', 'kutta', 'ˈkut.ta:', 'dog', 'people'],
      ['पानी', 'paani', 'ˈpa:.ni:', 'water', 'food'],
      ['चावल', 'chaawal', 'ˈtSa:.val', 'rice', 'food'],
      ['चाय', 'chai', 'tSa:i', 'tea', 'food'],
      ['स्वादिष्ट', 'swaadisht', 'ˈsva:.diSt', 'delicious', 'food'],
      ['कितने का है', 'kitne ka hai', 'ˈkit.ne.ka:.hE', 'how much is it?', 'travel'],
      ['शौचालय', 'shauchaalay', 'Sau.ˈtSa:.laj', 'toilet', 'travel'],
      ['एक', 'ek', 'e:k', 'one', 'num'],
      ['दो', 'do', 'do:', 'two', 'num'],
      ['तीन', 'teen', 'ti:n', 'three', 'num'],
      ['चार', 'chaar', 'tSa:r', 'four', 'num'],
      ['पाँच', 'paanch', 'pa:NtS', 'five', 'num'],
      ['प्यार', 'pyaar', 'pja:r', 'love', 'feel'],
      ['अच्छा', 'achchha', 'ˈatS.tSHa:', 'good', 'feel']
    ]
  },

  el: {
    name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷', voice: 'el-GR',
    script: 'Greek alphabet',
    scripts: ['greek'],
    transcriber: 'el',
    note: 'The Greek alphabet is the ancestor of the Latin one, so half the '
        + 'letters already look familiar. Accent marks show which syllable is '
        + 'stressed, which is a gift — nothing is guesswork.',
    words: [
      ['γεια σου', 'yia sou', 'ˈja.su', 'hi', 'greet'],
      ['καλημέρα', 'kaliméra', 'ka.li.ˈme.ra', 'good morning', 'greet'],
      ['καλησπέρα', 'kalispéra', 'ka.li.ˈspe.ra', 'good evening', 'greet'],
      ['αντίο', 'adío', 'a.ˈdi.o', 'goodbye', 'greet'],
      ['ευχαριστώ', 'efcharistó', 'ef.xa.ri.ˈsto', 'thank you', 'basic'],
      ['παρακαλώ', 'parakaló', 'pa.ra.ka.ˈlo', 'please / you are welcome', 'basic'],
      ['συγγνώμη', 'signómi', 'si.ˈGno.mi', 'sorry', 'basic'],
      ['ναι', 'ne', 'ne', 'yes', 'basic'],
      ['όχι', 'óchi', 'ˈo.xi', 'no', 'basic'],
      ['δεν καταλαβαίνω', 'den katalavéno', 'Den.ka.ta.la.ˈve.no', "I don't understand", 'basic'],
      ['όνομα', 'ónoma', 'ˈo.no.ma', 'name', 'people'],
      ['φίλος', 'fílos', 'ˈfi.los', 'friend', 'people'],
      ['δάσκαλος', 'dáskalos', 'ˈDa.ska.los', 'teacher', 'people'],
      ['σχολείο', 'scholío', 'sxo.ˈli.o', 'school', 'people'],
      ['σπίτι', 'spíti', 'ˈspi.ti', 'house', 'people'],
      ['Ελλάδα', 'Elláda', 'e.ˈla.Da', 'Greece', 'people'],
      ['γάτα', 'gáta', 'ˈGa.ta', 'cat', 'people'],
      ['σκύλος', 'skílos', 'ˈski.los', 'dog', 'people'],
      ['νερό', 'neró', 'ne.ˈro', 'water', 'food'],
      ['ψωμί', 'psomí', 'pso.ˈmi', 'bread', 'food'],
      ['καφές', 'kafés', 'ka.ˈfes', 'coffee', 'food'],
      ['νόστιμο', 'nóstimo', 'ˈno.sti.mo', 'tasty', 'food'],
      ['πόσο κάνει', 'póso káni', 'ˈpo.so.ˈka.ni', 'how much does it cost?', 'travel'],
      ['τουαλέτα', 'toualéta', 'tu.a.ˈle.ta', 'toilet', 'travel'],
      ['ένα', 'éna', 'ˈe.na', 'one', 'num'],
      ['δύο', 'dío', 'ˈDi.o', 'two', 'num'],
      ['τρία', 'tría', 'ˈtri.a', 'three', 'num'],
      ['τέσσερα', 'téssera', 'ˈte.se.ra', 'four', 'num'],
      ['πέντε', 'pénde', 'ˈpen.de', 'five', 'num'],
      ["σ' αγαπώ", "s'agapó", 'sa.Ga.ˈpo', 'I love you', 'feel'],
      ['ωραία', 'oréa', 'o.ˈre.a', 'lovely', 'feel']
    ]
  },

  es: {
    name: 'Spanish', native: 'Español', flag: '🇪🇸', voice: 'es-ES',
    script: 'Latin alphabet',
    scripts: [],
    note: 'Spanish is spelled almost exactly as it sounds, so the respelling '
        + 'is mostly about the two r sounds and the "ñ".',
    words: [
      ['hola', 'hola', 'ˈo.la', 'hello', 'greet'],
      ['buenos días', 'buenos días', 'ˈbwe.nos.ˈdi.as', 'good morning', 'greet'],
      ['adiós', 'adiós', 'a.ˈdjos', 'goodbye', 'greet'],
      ['gracias', 'gracias', 'ˈgra.sjas', 'thank you', 'basic'],
      ['por favor', 'por favor', 'por.fa.ˈvor', 'please', 'basic'],
      ['lo siento', 'lo siento', 'lo.ˈsjen.to', 'I am sorry', 'basic'],
      ['sí', 'sí', 'si', 'yes', 'basic'],
      ['no', 'no', 'no', 'no', 'basic'],
      ['no entiendo', 'no entiendo', 'no.en.ˈtjen.do', "I don't understand", 'basic'],
      ['nombre', 'nombre', 'ˈnom.bre', 'name', 'people'],
      ['amigo', 'amigo', 'a.ˈmi.go', 'friend', 'people'],
      ['maestro', 'maestro', 'ma.ˈes.tro', 'teacher', 'people'],
      ['escuela', 'escuela', 'es.ˈkwe.la', 'school', 'people'],
      ['casa', 'casa', 'ˈka.sa', 'house', 'people'],
      ['España', 'España', 'es.ˈpa.Ja', 'Spain', 'people'],
      ['perro', 'perro', 'ˈpe.Ro', 'dog', 'people'],
      ['agua', 'agua', 'ˈa.gwa', 'water', 'food'],
      ['pan', 'pan', 'pan', 'bread', 'food'],
      ['café', 'café', 'ka.ˈfe', 'coffee', 'food'],
      ['delicioso', 'delicioso', 'de.li.ˈsjo.so', 'delicious', 'food'],
      ['cuánto cuesta', 'cuánto cuesta', 'ˈkwan.to.ˈkwes.ta', 'how much does it cost?', 'travel'],
      ['baño', 'baño', 'ˈba.Jo', 'bathroom', 'travel'],
      ['uno', 'uno', 'ˈu.no', 'one', 'num'],
      ['dos', 'dos', 'dos', 'two', 'num'],
      ['tres', 'tres', 'tres', 'three', 'num'],
      ['cuatro', 'cuatro', 'ˈkwa.tro', 'four', 'num'],
      ['cinco', 'cinco', 'ˈsin.ko', 'five', 'num'],
      ['te quiero', 'te quiero', 'te.ˈkje.ro', 'I love you', 'feel'],
      ['feliz', 'feliz', 'fe.ˈlis', 'happy', 'feel']
    ]
  },

  fr: {
    name: 'French', native: 'Français', flag: '🇫🇷', voice: 'fr-FR',
    script: 'Latin alphabet',
    scripts: [],
    note: 'French writes far more letters than it says — final consonants are '
        + 'usually silent, and the nasal vowels have no equivalent in most '
        + 'languages. The respelling drops everything you do not pronounce.',
    words: [
      ['bonjour', 'bonjour', 'boN.ˈZur', 'hello / good day', 'greet'],
      ['bonsoir', 'bonsoir', 'boN.ˈswar', 'good evening', 'greet'],
      ['au revoir', 'au revoir', 'o.r@.ˈvwar', 'goodbye', 'greet'],
      ['merci', 'merci', 'mEr.ˈsi', 'thank you', 'basic'],
      ["s'il vous plaît", "s'il vous plaît", 'sil.vu.ˈplE', 'please', 'basic'],
      ['pardon', 'pardon', 'par.ˈdoN', 'excuse me', 'basic'],
      ['oui', 'oui', 'wi', 'yes', 'basic'],
      ['non', 'non', 'noN', 'no', 'basic'],
      ['je ne comprends pas', 'je ne comprends pas', 'Z@.n@.koN.ˈpraN.pa', "I don't understand", 'basic'],
      ['nom', 'nom', 'noN', 'name', 'people'],
      ['ami', 'ami', 'a.ˈmi', 'friend', 'people'],
      ['professeur', 'professeur', 'pro.fE.ˈs2r', 'teacher', 'people'],
      ['école', 'école', 'e.ˈkOl', 'school', 'people'],
      ['maison', 'maison', 'mE.ˈzoN', 'house', 'people'],
      ['France', 'France', 'fraNs', 'France', 'people'],
      ['chien', 'chien', 'SjeN', 'dog', 'people'],
      ['chat', 'chat', 'Sa', 'cat', 'people'],
      ['eau', 'eau', 'o', 'water', 'food'],
      ['pain', 'pain', 'pEN', 'bread', 'food'],
      ['café', 'café', 'ka.ˈfe', 'coffee', 'food'],
      ['délicieux', 'délicieux', 'de.li.ˈsj2', 'delicious', 'food'],
      ['combien', 'combien', 'koN.ˈbjeN', 'how much?', 'travel'],
      ['toilettes', 'toilettes', 'twa.ˈlEt', 'toilets', 'travel'],
      ['un', 'un', '2N', 'one', 'num'],
      ['deux', 'deux', 'd2', 'two', 'num'],
      ['trois', 'trois', 'trwa', 'three', 'num'],
      ['quatre', 'quatre', 'ˈka.tr@', 'four', 'num'],
      ['cinq', 'cinq', 'sENk', 'five', 'num'],
      ["je t'aime", "je t'aime", 'Z@.ˈtEm', 'I love you', 'feel'],
      ['heureux', 'heureux', '2.ˈr2', 'happy', 'feel']
    ]
  }
};

const LANGUAGE_ORDER = ['ja', 'ko', 'zh', 'ru', 'ar', 'hi', 'el', 'es', 'fr'];

/** Words as objects, for convenience. */
function wordsOf(langCode) {
  const lang = LANGUAGES[langCode];
  if (!lang) return [];
  return lang.words.map((w, i) => ({
    id: langCode + ':' + i,
    lang: langCode,
    script: w[0], translit: w[1], pron: w[2], meaning: w[3], cat: w[4]
  }));
}
