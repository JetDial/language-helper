/* data-core.js — the wide tier of languages.
 *
 * The nine languages in data-words.js get a full phrasebook. Everything here
 * gets the same sixteen words instead, which is enough to be genuinely useful
 * and keeps a language down to a handful of lines.
 *
 * A row is either
 *     [written form, pronunciation]                 (Latin-script languages)
 * or  [written form, romanisation, pronunciation]   (everything else)
 * and `null` where a word would be a guess — an empty slot is better than a
 * wrong one.
 */

const CORE_SLOTS = [
  ['hello', 'greet'], ['goodbye', 'greet'], ['thank you', 'basic'],
  ['please', 'basic'], ['sorry / excuse me', 'basic'], ['yes', 'basic'],
  ['no', 'basic'], ['water', 'food'], ['food', 'food'], ['friend', 'people'],
  ['one', 'num'], ['two', 'num'], ['three', 'num'], ['love', 'feel'],
  ['how much?', 'travel'], ['toilet', 'travel']
];

const CORE_LANGUAGES = {

  /* ---------- Germanic: English first, since most learners want it ----- */
  en: {
    name: 'English', native: 'English', flag: '🇬🇧', voice: 'en-US',
    script: 'Latin alphabet', latin: true,
    note: 'English spelling stopped matching English sound centuries ago — '
        + '"through", "though" and "tough" all end differently. That is exactly '
        + 'what the respelling here is for.',
    core: [
      ['hello', 'h@.ˈlou'], ['goodbye', 'gUd.ˈbai'], ['thank you', 'ˈTaNk.ju'],
      ['please', 'pli:z'], ['sorry', 'ˈsO.ri'], ['yes', 'jes'], ['no', 'nou'],
      ['water', 'ˈwO.t@r'], ['food', 'fu:d'], ['friend', 'frend'],
      ['one', 'wUn'], ['two', 'tu:'], ['three', 'Tri:'], ['love', 'lUv'],
      ['how much', 'hau.ˈmUtS'], ['toilet', 'ˈtoi.l@t']
    ]
  },

  /* ---------- Romance ------------------------------------------------- */
  pt: {
    name: 'Portuguese', native: 'Português', flag: '🇧🇷', voice: 'pt-BR',
    script: 'Latin alphabet', latin: true,
    note: 'Brazilian Portuguese. The nasal vowels written ã and ão have no '
        + 'equivalent in most languages — they are the sound of a vowel let out '
        + 'through the nose.',
    core: [
      ['olá', 'o.ˈla'], ['tchau', 'tSau'], ['obrigado', 'o.bri.ˈga.du'],
      ['por favor', 'por.fa.ˈvor'], ['desculpe', 'des.ˈkul.pi'],
      ['sim', 'siN'], ['não', 'naN'], ['água', 'ˈa.gwa'], ['comida', 'ko.ˈmi.da'],
      ['amigo', 'a.ˈmi.gu'], ['um', 'uN'], ['dois', 'dois'], ['três', 'tres'],
      ['amor', 'a.ˈmor'], ['quanto', 'ˈkwan.tu'], ['banheiro', 'ba.ˈJei.ru']
    ]
  },
  it: {
    name: 'Italian', native: 'Italiano', flag: '🇮🇹', voice: 'it-IT',
    script: 'Latin alphabet', latin: true,
    note: 'Italian is said exactly as it is written, and double consonants are '
        + 'really held twice as long — "nono" and "nonno" are different words.',
    core: [
      ['ciao', 'tSau'], ['arrivederci', 'a.ri.ve.ˈder.tSi'], ['grazie', 'ˈgra.tsje'],
      ['per favore', 'per.fa.ˈvo.re'], ['scusa', 'ˈsku.za'], ['sì', 'si'], ['no', 'no'],
      ['acqua', 'ˈak.kwa'], ['cibo', 'ˈtSi.bo'], ['amico', 'a.ˈmi.ko'],
      ['uno', 'ˈu.no'], ['due', 'ˈdu.e'], ['tre', 'tre'], ['amore', 'a.ˈmo.re'],
      ['quanto', 'ˈkwan.to'], ['bagno', 'ˈba.Jo']
    ]
  },
  ro: {
    name: 'Romanian', native: 'Română', flag: '🇷🇴', voice: 'ro-RO',
    script: 'Latin alphabet', latin: true,
    note: 'A Romance language with Slavic neighbours. The letters ă, â and î are '
        + 'vowels made with the tongue pulled back and the lips relaxed.',
    core: [
      ['salut', 'sa.ˈlut'], ['la revedere', 'la.re.ve.ˈde.re'],
      ['mulțumesc', 'mul.tsu.ˈmesk'], ['vă rog', 'v@.ˈrog'], ['scuze', 'ˈsku.ze'],
      ['da', 'da'], ['nu', 'nu'], ['apă', 'ˈa.p@'], ['mâncare', 'm@n.ˈka.re'],
      ['prieten', 'pri.ˈe.ten'], ['unu', 'ˈu.nu'], ['doi', 'doi'], ['trei', 'trei'],
      ['dragoste', 'ˈdra.gos.te'], ['cât', 'k@t'], ['toaletă', 'to.a.ˈle.t@']
    ]
  },
  ca: {
    name: 'Catalan', native: 'Català', flag: '🏴', voice: 'ca-ES',
    script: 'Latin alphabet', latin: true,
    note: 'Spoken around Barcelona and Valencia. Unstressed a and e both soften '
        + 'toward the lazy "uh" vowel, much as in English.',
    core: [
      ['hola', 'ˈO.la'], ['adéu', 'a.ˈDe.u'], ['gràcies', 'ˈgra.si.@s'],
      ['si us plau', 'si.us.ˈplau'], ['perdó', 'p@r.ˈDo'], ['sí', 'si'], ['no', 'no'],
      ['aigua', 'ˈai.gw@'], ['menjar', 'm@n.ˈZa'], ['amic', 'a.ˈmik'],
      ['un', 'un'], ['dos', 'dos'], ['tres', 'tres'], ['amor', 'a.ˈmo'],
      ['quant', 'kwan'], ['lavabo', 'l@.ˈBa.Bu']
    ]
  },
  ht: {
    name: 'Haitian Creole', native: 'Kreyòl Ayisyen', flag: '🇭🇹', voice: 'ht-HT',
    script: 'Latin alphabet', latin: true,
    note: 'Kreyòl is written with one letter per sound, so it is the easiest '
        + 'spelling on this whole site. "an", "en" and "on" are nasal vowels.',
    core: [
      ['bonjou', 'boN.ˈZu'], ['orevwa', 'o.re.ˈvwa'], ['mèsi', 'ˈmE.si'],
      ['souple', 'su.ˈple'], ['eskize m', 'es.ki.ˈze.m'], ['wi', 'wi'], ['non', 'noN'],
      ['dlo', 'dlo'], ['manje', 'maN.ˈZe'], ['zanmi', 'zaN.ˈmi'],
      ['youn', 'jun'], ['de', 'de'], ['twa', 'twa'], ['lanmou', 'laN.ˈmu'],
      ['konbyen', 'koN.ˈbjeN'], ['twalèt', 'twa.ˈlEt']
    ]
  },

  /* ---------- Germanic ------------------------------------------------ */
  de: {
    name: 'German', native: 'Deutsch', flag: '🇩🇪', voice: 'de-DE',
    script: 'Latin alphabet', latin: true,
    note: 'Long words are simply short words stuck together, so they are less '
        + 'frightening than they look. "ch" is the scrapey sound at the back.',
    core: [
      ['hallo', 'ˈha.lo'], ['tschüss', 'tSys'], ['danke', 'ˈdaN.k@'],
      ['bitte', 'ˈbI.t@'], ['entschuldigung', 'ent.ˈSul.di.guN'], ['ja', 'ja'],
      ['nein', 'nain'], ['Wasser', 'ˈva.s@r'], ['Essen', 'ˈE.s@n'], ['Freund', 'froint'],
      ['eins', 'ains'], ['zwei', 'tsvai'], ['drei', 'drai'], ['Liebe', 'ˈli:.b@'],
      ['wie viel', 'vi.ˈfi:l'], ['Toilette', 'toi.ˈlE.t@']
    ]
  },
  nl: {
    name: 'Dutch', native: 'Nederlands', flag: '🇳🇱', voice: 'nl-NL',
    script: 'Latin alphabet', latin: true,
    note: 'Dutch "g" and "ch" are both the scrapey throat sound, which is the '
        + 'one thing every learner has to practise.',
    core: [
      ['hallo', 'ha.ˈlo'], ['doei', 'dui'], ['dank je', 'ˈdaNk.j@'],
      ['alsjeblieft', 'al.S@.ˈblift'], ['sorry', 'ˈsO.ri'], ['ja', 'ja'], ['nee', 'ne:'],
      ['water', 'ˈva:.t@r'], ['eten', 'ˈe:.t@n'], ['vriend', 'vrint'],
      ['een', 'e:n'], ['twee', 'tve:'], ['drie', 'dri'], ['liefde', 'ˈlif.d@'],
      ['hoeveel', 'hu.ˈve:l'], ['toilet', 'twa.ˈlEt']
    ]
  },
  af: {
    name: 'Afrikaans', native: 'Afrikaans', flag: '🇿🇦', voice: 'af-ZA',
    script: 'Latin alphabet', latin: true,
    note: 'Grown from Dutch in South Africa, with the grammar filed right down — '
        + 'no verb endings to learn at all.',
    core: [
      ['hallo', 'ha.ˈlo'], ['totsiens', 'tot.ˈsins'], ['dankie', 'ˈdaN.ki'],
      ['asseblief', 'a.s@.ˈblif'], ['jammer', 'ˈja.m@r'], ['ja', 'ja'], ['nee', 'ne:'],
      ['water', 'ˈva.t@r'], ['kos', 'kOs'], ['vriend', 'frint'],
      ['een', 'e:n'], ['twee', 'tve:'], ['drie', 'dri'], ['liefde', 'ˈlif.d@'],
      ['hoeveel', 'hu.ˈfi:l'], ['toilet', 'twa.ˈlEt']
    ]
  },
  sv: {
    name: 'Swedish', native: 'Svenska', flag: '🇸🇪', voice: 'sv-SE',
    script: 'Latin alphabet', latin: true,
    note: 'Swedish is sung as much as spoken — many words carry a rise and fall '
        + 'that no respelling can show you. Listen as well as read.',
    core: [
      ['hej', 'hei'], ['hej då', 'hei.ˈdO:'], ['tack', 'tak'], ['snälla', 'ˈsnE.la'],
      ['förlåt', 'f2r.ˈlo:t'], ['ja', 'ja'], ['nej', 'nei'], ['vatten', 'ˈva.t@n'],
      ['mat', 'ma:t'], ['vän', 'vEn'], ['ett', 'Et'], ['två', 'tvo:'], ['tre', 'tre:'],
      ['kärlek', 'ˈtSE:r.lek'], ['hur mycket', 'hu:r.ˈmy.k@'], ['toalett', 'tu.a.ˈlEt']
    ]
  },
  no: {
    name: 'Norwegian', native: 'Norsk', flag: '🇳🇴', voice: 'nb-NO',
    script: 'Latin alphabet', latin: true,
    note: 'Very close to Swedish and Danish in writing. "kj" is said like a soft '
        + 'sh made with the tongue flat.',
    core: [
      ['hei', 'hai'], ['ha det', 'ˈha:.de'], ['takk', 'tak'],
      ['vær så snill', 'vEr.so.ˈsnil'], ['unnskyld', 'ˈun.Syl'], ['ja', 'ja'],
      ['nei', 'nai'], ['vann', 'van'], ['mat', 'ma:t'], ['venn', 'vEn'],
      ['en', 'e:n'], ['to', 'tu:'], ['tre', 'tre:'], ['kjærlighet', 'ˈSE:r.li.he:t'],
      ['hvor mye', 'vur.ˈmy:.e'], ['toalett', 'tu.a.ˈlEt']
    ]
  },
  da: {
    name: 'Danish', native: 'Dansk', flag: '🇩🇰', voice: 'da-DK',
    script: 'Latin alphabet', latin: true,
    note: 'Danish swallows far more than it writes, so the respelling here is '
        + 'rougher than for its neighbours. Trust the recording over the letters.',
    core: [
      ['hej', 'hai'], ['farvel', 'fa.ˈvEl'], ['tak', 'tak'], ['vær så god', 'vEr.so.ˈgo:'],
      ['undskyld', 'ˈOn.skyl'], ['ja', 'ja'], ['nej', 'nai'], ['vand', 'van'],
      ['mad', 'mED'], ['ven', 'vEn'], ['en', 'e:n'], ['to', 'to:'], ['tre', 'tre:'],
      ['kærlighed', 'ˈkEr.li.he:D'], ['hvor meget', 'vor.ˈma.jED'], ['toilet', 'toa.ˈlEt']
    ]
  },

  /* ---------- Slavic --------------------------------------------------- */
  pl: {
    name: 'Polish', native: 'Polski', flag: '🇵🇱', voice: 'pl-PL',
    script: 'Latin alphabet', latin: true,
    note: 'Those consonant piles are friendlier than they look: sz is sh, cz is '
        + 'ch, rz is zh, and w is v. Stress is almost always the second-last syllable.',
    core: [
      ['cześć', 'tSEStS'], ['do widzenia', 'do.vi.ˈdze.Ja'], ['dziękuję', 'dZeN.ˈku.je'],
      ['proszę', 'ˈpro.SE'], ['przepraszam', 'pSe.ˈpra.Sam'], ['tak', 'tak'], ['nie', 'Je'],
      ['woda', 'ˈvo.da'], ['jedzenie', 'je.ˈdze.Je'], ['przyjaciel', 'pSi.ˈja.tSel'],
      ['jeden', 'ˈje.den'], ['dwa', 'dva'], ['trzy', 'tSi'], ['miłość', 'ˈmi.wOStS'],
      ['ile', 'ˈi.le'], ['toaleta', 'to.a.ˈle.ta']
    ]
  },
  cs: {
    name: 'Czech', native: 'Čeština', flag: '🇨🇿', voice: 'cs-CZ',
    script: 'Latin alphabet', latin: true,
    note: 'Stress always falls on the first syllable, whatever the word. The '
        + 'háček accent (č, š, ž) turns a letter into its "sh"-family cousin.',
    core: [
      ['ahoj', 'ˈa.hoi'], ['na shledanou', 'na.ˈsxle.da.nou'], ['děkuji', 'ˈdje.ku.ji'],
      ['prosím', 'ˈpro.si:m'], ['promiňte', 'ˈpro.miJ.te'], ['ano', 'ˈa.no'], ['ne', 'ne'],
      ['voda', 'ˈvo.da'], ['jídlo', 'ˈji:.dlo'], ['přítel', 'ˈpSi:.tel'],
      ['jeden', 'ˈje.den'], ['dva', 'dva'], ['tři', 'tSi'], ['láska', 'ˈla:s.ka'],
      ['kolik', 'ˈko.lik'], ['záchod', 'ˈza:.xod']
    ]
  },
  sk: {
    name: 'Slovak', native: 'Slovenčina', flag: '🇸🇰', voice: 'sk-SK',
    script: 'Latin alphabet', latin: true,
    note: 'Close enough to Czech that the two are mutually understood, with '
        + 'first-syllable stress just the same.',
    core: [
      ['ahoj', 'ˈa.hoi'], ['dovidenia', 'do.ˈvi.de.Ja'], ['ďakujem', 'ˈdja.ku.jem'],
      ['prosím', 'ˈpro.si:m'], ['prepáčte', 'ˈpre.pa:tS.te'], ['áno', 'ˈa:.no'], ['nie', 'Je'],
      ['voda', 'ˈvo.da'], ['jedlo', 'ˈje.dlo'], ['priateľ', 'ˈpri.a.tel'],
      ['jeden', 'ˈje.den'], ['dva', 'dva'], ['tri', 'tri'], ['láska', 'ˈla:s.ka'],
      ['koľko', 'ˈkol.ko'], ['záchod', 'ˈza:.xod']
    ]
  },
  hr: {
    name: 'Croatian', native: 'Hrvatski', flag: '🇭🇷', voice: 'hr-HR',
    script: 'Latin alphabet', latin: true,
    note: 'Croatian, Bosnian, Serbian and Montenegrin are the same language for '
        + 'a learner. Croatian writes it in Latin letters.',
    core: [
      ['bok', 'bok'], ['doviđenja', 'do.vi.ˈdZe.Ja'], ['hvala', 'ˈxva.la'],
      ['molim', 'ˈmo.lim'], ['oprostite', 'o.ˈpros.ti.te'], ['da', 'da'], ['ne', 'ne'],
      ['voda', 'ˈvo.da'], ['hrana', 'ˈxra.na'], ['prijatelj', 'ˈpri.ja.tel'],
      ['jedan', 'ˈje.dan'], ['dva', 'dva'], ['tri', 'tri'], ['ljubav', 'ˈlju.bav'],
      ['koliko', 'ˈko.li.ko'], ['zahod', 'ˈza.xod']
    ]
  },
  uk: {
    name: 'Ukrainian', native: 'Українська', flag: '🇺🇦', voice: 'uk-UA',
    script: 'Cyrillic', scripts: ['cyrillic'],
    note: 'Cyrillic again, with a few letters of its own: і, ї, є and ґ. The '
        + 'letter г is a soft breathy h, not the hard g of Russian.',
    core: [
      ['привіт', 'pryvit', 'pri.ˈvit'], ['до побачення', 'do pobachennya', 'do.po.ˈba.tSen.Ja'],
      ['дякую', 'dyakuyu', 'ˈdja.ku.ju'], ['будь ласка', 'bud laska', 'budj.ˈlas.ka'],
      ['вибачте', 'vybachte', 'ˈvi.batS.te'], ['так', 'tak', 'tak'], ['ні', 'ni', 'ni'],
      ['вода', 'voda', 'vo.ˈda'], ['їжа', 'yizha', 'ˈji.Za'], ['друг', 'druh', 'druh'],
      ['один', 'odyn', 'o.ˈdin'], ['два', 'dva', 'dva'], ['три', 'try', 'tri'],
      ['любов', 'lyubov', 'lju.ˈbov'], ['скільки', 'skilky', 'ˈskilj.ki'],
      ['туалет', 'tualet', 'tu.a.ˈlet']
    ]
  },
  bg: {
    name: 'Bulgarian', native: 'Български', flag: '🇧🇬', voice: 'bg-BG',
    script: 'Cyrillic', scripts: ['cyrillic'],
    note: 'The oldest written Slavic language, and the one Cyrillic was invented '
        + 'for. It dropped noun cases, which makes it kinder than Russian.',
    core: [
      ['здравей', 'zdravey', 'zdra.ˈvei'], ['довиждане', 'dovizhdane', 'do.ˈviZ.da.ne'],
      ['благодаря', 'blagodarya', 'bla.go.da.ˈrja'], ['моля', 'molya', 'ˈmo.lja'],
      ['извинете', 'izvinete', 'iz.vi.ˈne.te'], ['да', 'da', 'da'], ['не', 'ne', 'ne'],
      ['вода', 'voda', 'vo.ˈda'], ['храна', 'hrana', 'xra.ˈna'],
      ['приятел', 'priyatel', 'pri.ˈja.tel'], ['едно', 'edno', 'ed.ˈno'],
      ['две', 'dve', 'dve'], ['три', 'tri', 'tri'], ['любов', 'lyubov', 'lju.ˈbov'],
      ['колко', 'kolko', 'ˈkol.ko'], ['тоалетна', 'toaletna', 'to.a.ˈlet.na']
    ]
  },
  sr: {
    name: 'Serbian', native: 'Српски', flag: '🇷🇸', voice: 'sr-RS',
    script: 'Cyrillic (and Latin)', scripts: ['cyrillic'],
    note: 'Serbian is written in both Cyrillic and Latin letters, and everyone '
        + 'reads both. Cyrillic here; the Latin spelling matches Croatian.',
    core: [
      ['здраво', 'zdravo', 'ˈzdra.vo'], ['довиђења', 'doviđenja', 'do.vi.ˈdZe.Ja'],
      ['хвала', 'hvala', 'ˈxva.la'], ['молим', 'molim', 'ˈmo.lim'],
      ['извините', 'izvinite', 'iz.vi.ˈni.te'], ['да', 'da', 'da'], ['не', 'ne', 'ne'],
      ['вода', 'voda', 'ˈvo.da'], ['храна', 'hrana', 'ˈxra.na'],
      ['пријатељ', 'prijatelj', 'ˈpri.ja.tel'], ['један', 'jedan', 'ˈje.dan'],
      ['два', 'dva', 'dva'], ['три', 'tri', 'tri'], ['љубав', 'ljubav', 'ˈlju.bav'],
      ['колико', 'koliko', 'ˈko.li.ko'], ['тоалет', 'toalet', 'to.a.ˈlet']
    ]
  },

  /* ---------- other European ------------------------------------------- */
  fi: {
    name: 'Finnish', native: 'Suomi', flag: '🇫🇮', voice: 'fi-FI',
    script: 'Latin alphabet', latin: true,
    note: 'Finnish is spelled perfectly: every letter is one sound, always, and '
        + 'stress is always on the first syllable. A doubled letter is held longer.',
    core: [
      ['hei', 'hei'], ['näkemiin', 'ˈnE.ke.mi:n'], ['kiitos', 'ˈki:.tos'],
      ['ole hyvä', 'ˈo.le.ˈhy.vE'], ['anteeksi', 'ˈan.te:k.si'], ['kyllä', 'ˈkyl.lE'],
      ['ei', 'ei'], ['vesi', 'ˈve.si'], ['ruoka', 'ˈru.o.ka'], ['ystävä', 'ˈys.tE.vE'],
      ['yksi', 'ˈyk.si'], ['kaksi', 'ˈkak.si'], ['kolme', 'ˈkol.me'],
      ['rakkaus', 'ˈrak.ka.us'], ['paljonko', 'ˈpal.jon.ko'], ['vessa', 'ˈves.sa']
    ]
  },
  hu: {
    name: 'Hungarian', native: 'Magyar', flag: '🇭🇺', voice: 'hu-HU',
    script: 'Latin alphabet', latin: true,
    note: 'Related to Finnish and to almost nothing else in Europe. Stress is '
        + 'always on the first syllable, and "s" alone is sh.',
    core: [
      ['szia', 'ˈsi.jO'], ['viszlát', 'ˈvis.la:t'], ['köszönöm', 'ˈk2.s2.n2m'],
      ['kérem', 'ˈke:.rem'], ['bocsánat', 'ˈbo.tSa:.nOt'], ['igen', 'ˈi.gen'],
      ['nem', 'nem'], ['víz', 'vi:z'], ['étel', 'ˈe:.tel'], ['barát', 'ˈbO.ra:t'],
      ['egy', 'EdZ'], ['kettő', 'ˈket.t2'], ['három', 'ˈha:.rom'],
      ['szerelem', 'ˈse.re.lem'], ['mennyibe', 'ˈmeJ.Ji.be'], ['mosdó', 'ˈmoS.do:']
    ]
  },
  tr: {
    name: 'Turkish', native: 'Türkçe', flag: '🇹🇷', voice: 'tr-TR',
    script: 'Latin alphabet', latin: true,
    note: 'Endings pile onto the end of a word to do the work of whole English '
        + 'phrases, and the vowels in those endings shift to match the word.',
    core: [
      ['merhaba', 'ˈmer.ha.ba'], ['hoşça kal', 'hoS.tSa.ˈkal'],
      ['teşekkürler', 'te.SEk.kyr.ˈler'], ['lütfen', 'ˈlyt.fen'],
      ['affedersiniz', 'af.fe.ˈder.si.niz'], ['evet', 'e.ˈvet'], ['hayır', 'ha.ˈjir'],
      ['su', 'su'], ['yemek', 'je.ˈmek'], ['arkadaş', 'ar.ka.ˈdaS'],
      ['bir', 'bir'], ['iki', 'i.ˈki'], ['üç', 'ytS'], ['aşk', 'aSk'],
      ['ne kadar', 'ne.ka.ˈdar'], ['tuvalet', 'tu.va.ˈlet']
    ]
  },
  sq: {
    name: 'Albanian', native: 'Shqip', flag: '🇦🇱', voice: 'sq-AL',
    script: 'Latin alphabet', latin: true,
    note: 'A branch of the Indo-European family all on its own, related to no '
        + 'living language. "ë" is the lazy uh vowel and often barely said at all.',
    core: [
      ['përshëndetje', 'p@r.S@n.ˈde.tje'], ['mirupafshim', 'mi.ru.paf.ˈSim'],
      ['faleminderit', 'fa.le.min.ˈde.rit'], ['ju lutem', 'ju.ˈlu.tem'],
      ['më fal', 'm@.ˈfal'], ['po', 'po'], ['jo', 'jo'], ['ujë', 'ˈu.j@'],
      ['ushqim', 'uS.ˈkim'], ['mik', 'mik'], ['një', 'J@'], ['dy', 'dy'], ['tre', 'tre'],
      ['dashuri', 'da.Su.ˈri'], ['sa', 'sa'], ['banjo', 'ˈba.Jo']
    ]
  },
  eo: {
    name: 'Esperanto', native: 'Esperanto', flag: '🏳️', voice: 'eo',
    script: 'Latin alphabet', latin: true,
    note: 'Built on purpose in 1887 to be easy: no irregular verbs, no exceptions, '
        + 'and stress always on the second-last syllable.',
    core: [
      ['saluton', 'sa.ˈlu.ton'], ['ĝis revido', 'dZis.re.ˈvi.do'], ['dankon', 'ˈdan.kon'],
      ['bonvolu', 'bon.ˈvo.lu'], ['pardonu', 'par.ˈdo.nu'], ['jes', 'jes'], ['ne', 'ne'],
      ['akvo', 'ˈak.vo'], ['manĝaĵo', 'man.ˈdZa.Zo'], ['amiko', 'a.ˈmi.ko'],
      ['unu', 'ˈu.nu'], ['du', 'du'], ['tri', 'tri'], ['amo', 'ˈa.mo'],
      ['kiom', 'ˈki.om'], ['necesejo', 'ne.tse.ˈse.jo']
    ]
  },

  /* ---------- Middle East ----------------------------------------------- */
  he: {
    name: 'Hebrew', native: 'עברית', flag: '🇮🇱', voice: 'he-IL',
    script: 'Hebrew alphabet', rtl: true,
    note: 'Written right to left, and like Arabic it normally leaves the vowels '
        + 'out. Five letters change shape at the end of a word.',
    core: [
      ['שלום', 'shalom', 'Sa.ˈlom'], ['להתראות', 'lehitraot', 'le.hit.ra.ˈot'],
      ['תודה', 'toda', 'to.ˈda'], ['בבקשה', 'bevakasha', 'be.va.ka.ˈSa'],
      ['סליחה', 'slicha', 'sli.ˈxa'], ['כן', 'ken', 'ken'], ['לא', 'lo', 'lo'],
      ['מים', 'mayim', 'ˈma.jim'], ['אוכל', 'ochel', 'ˈo.xel'],
      ['חבר', 'chaver', 'xa.ˈver'], ['אחד', 'echad', 'e.ˈxad'],
      ['שתיים', 'shtayim', 'ˈSta.jim'], ['שלוש', 'shalosh', 'Sa.ˈloS'],
      ['אהבה', 'ahava', 'a.ha.ˈva'], ['כמה', 'kama', 'ˈka.ma'],
      ['שירותים', 'sherutim', 'Se.ru.ˈtim']
    ]
  },
  fa: {
    name: 'Persian', native: 'فارسی', flag: '🇮🇷', voice: 'fa-IR',
    script: 'Perso-Arabic', rtl: true,
    note: 'Persian uses the Arabic script with four extra letters, but the '
        + 'language itself is Indo-European — a distant cousin of English.',
    core: [
      ['سلام', 'salâm', 'sa.ˈlam'], ['خداحافظ', 'khodâhâfez', 'xo.da:.ˈha:.fez'],
      ['ممنون', 'mamnun', 'mam.ˈnun'], ['لطفا', 'lotfan', 'lot.ˈfan'],
      ['ببخشید', 'bebakhshid', 'be.bax.ˈSid'], ['بله', 'bale', 'ba.ˈle'], ['نه', 'na', 'na'],
      ['آب', 'âb', 'a:b'], ['غذا', 'ghazâ', 'Ga.ˈza'], ['دوست', 'dust', 'dust'],
      ['یک', 'yek', 'jek'], ['دو', 'do', 'do'], ['سه', 'se', 'se'],
      ['عشق', 'eshgh', 'eSq'], ['چند', 'chand', 'tSand'],
      ['دستشویی', 'dastshuyi', 'dast.Su.ˈji']
    ]
  },
  ur: {
    name: 'Urdu', native: 'اردو', flag: '🇵🇰', voice: 'ur-PK',
    script: 'Perso-Arabic (nastaliq)', rtl: true,
    note: 'Urdu and Hindi are the same spoken language written in two different '
        + 'scripts. Learn one and you can already speak the other.',
    core: [
      ['السلام علیکم', 'assalam alaikum', 'as.sa.ˈla:m.a.ˈlai.kum'],
      ['خدا حافظ', 'khuda hafiz', 'xu.ˈda:.ˈha:.fiz'], ['شکریہ', 'shukriya', 'ˈSuk.ri.ja'],
      ['مہربانی', 'meherbani', 'me.he.ra.ˈba:.ni:'],
      ['معاف کیجیے', 'maaf kijiye', 'ma.ˈa:f.ki:.dZi.je'], ['ہاں', 'haan', 'ha:N'],
      ['نہیں', 'nahin', 'na.ˈhiN'], ['پانی', 'paani', 'ˈpa:.ni:'],
      ['کھانا', 'khaana', 'ˈkHa:.na:'], ['دوست', 'dost', 'do:st'],
      ['ایک', 'aik', 'e:k'], ['دو', 'do', 'do:'], ['تین', 'teen', 'ti:n'],
      ['محبت', 'mohabbat', 'mu.ˈhab.bat'], ['کتنا', 'kitna', 'ˈkit.na:'],
      ['باتھ روم', 'bathroom', 'ba:tH.ru:m']
    ]
  },

  /* ---------- South Asia -------------------------------------------------- */
  bn: {
    name: 'Bengali', native: 'বাংলা', flag: '🇧🇩', voice: 'bn-BD',
    script: 'Bengali script',
    note: 'The script is a cousin of Devanagari with the same hanging top line. '
        + 'Bengali has no "v" and no "w" — both come out as b.',
    core: [
      ['নমস্কার', 'nomoskar', 'no.mo.ˈSkar'], ['বিদায়', 'biday', 'bi.ˈdai'],
      ['ধন্যবাদ', 'dhonnobad', 'dHon.no.ˈbad'], ['দয়া করে', 'doya kore', 'do.ja.ˈko.re'],
      ['দুঃখিত', 'dukkhito', 'ˈdu.kHi.to'], ['হ্যাঁ', 'hyan', 'hE'], ['না', 'na', 'na'],
      ['জল', 'jol', 'dZOl'], ['খাবার', 'khabar', 'ˈkHa.bar'],
      ['বন্ধু', 'bondhu', 'ˈbon.dHu'], ['এক', 'ek', 'Ek'], ['দুই', 'dui', 'dui'],
      ['তিন', 'tin', 'tin'], ['ভালোবাসা', 'bhalobasha', 'bHa.lo.ˈba.Sa'],
      ['কত', 'koto', 'ˈkO.to'], ['বাথরুম', 'bathroom', 'ˈbatH.rum']
    ]
  },
  mr: {
    name: 'Marathi', native: 'मराठी', flag: '🇮🇳', voice: 'mr-IN',
    script: 'Devanagari', scripts: ['devanagari'],
    note: 'Written in the same Devanagari as Hindi, and spoken around Mumbai by '
        + 'some eighty million people.',
    core: [
      ['नमस्कार', 'namaskar', 'na.mas.ˈka:r'], ['येतो', 'yeto', 'ˈje.to'],
      ['धन्यवाद', 'dhanyavad', 'dHan.ja.ˈva:d'], ['कृपया', 'krupaya', 'ˈkri.pa.ja'],
      ['माफ करा', 'maaf kara', 'ma:f.ka.ˈra:'], ['होय', 'hoy', 'hoj'],
      ['नाही', 'nahi', 'ˈna:.hi:'], ['पाणी', 'pani', 'ˈpa:.ni:'],
      ['जेवण', 'jevan', 'ˈdZe.van'], ['मित्र', 'mitra', 'ˈmi.tra'],
      ['एक', 'ek', 'ek'], ['दोन', 'don', 'don'], ['तीन', 'tin', 'ti:n'],
      ['प्रेम', 'prem', 'pre:m'], ['किती', 'kiti', 'ˈki.ti:'], null
    ]
  },
  ne: {
    name: 'Nepali', native: 'नेपाली', flag: '🇳🇵', voice: 'ne-NP',
    script: 'Devanagari', scripts: ['devanagari'],
    note: 'Devanagari again, so Hindi readers get a head start. Nepali is more '
        + 'formal about politeness levels than its neighbours.',
    core: [
      ['नमस्ते', 'namaste', 'na.mas.ˈte'], null,
      ['धन्यवाद', 'dhanyabad', 'dHan.ja.ˈbad'], ['कृपया', 'kripaya', 'ˈkri.pa.ja'],
      ['माफ गर्नुहोस्', 'maaf garnuhos', 'ma:f.ˈgar.nu.hos'], ['हो', 'ho', 'ho'],
      ['होइन', 'hoina', 'ˈho.i.na'], ['पानी', 'pani', 'ˈpa:.ni'],
      ['खाना', 'khana', 'ˈkHa:.na'], ['साथी', 'sathi', 'ˈsa:.tHi'],
      ['एक', 'ek', 'ek'], ['दुई', 'dui', 'dui'], ['तीन', 'tin', 'tin'],
      ['माया', 'maya', 'ˈma:.ja'], ['कति', 'kati', 'ˈka.ti'],
      ['शौचालय', 'shauchalaya', 'Sau.ˈtSa:.laj']
    ]
  },
  ta: {
    name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', voice: 'ta-IN',
    script: 'Tamil script',
    note: 'One of the oldest languages still spoken, with a literature going back '
        + 'two thousand years. The script has beautifully round letters.',
    core: [
      ['வணக்கம்', 'vanakkam', 'va.ˈnak.kam'], null,
      ['நன்றி', 'nandri', 'ˈnan.ri'], ['தயவுசெய்து', 'thayavuseythu', 'ta.ja.vu.ˈsej.tu'],
      ['மன்னிக்கவும்', 'mannikkavum', 'man.ˈnik.ka.vum'], ['ஆம்', 'aam', 'a:m'],
      ['இல்லை', 'illai', 'ˈil.lai'], ['தண்ணீர்', 'thanneer', 'ˈtan.ni:r'],
      ['உணவு', 'unavu', 'ˈu.na.vu'], ['நண்பன்', 'nanban', 'ˈnan.pan'],
      ['ஒன்று', 'ondru', 'ˈon.ru'], ['இரண்டு', 'irandu', 'i.ˈran.du'],
      ['மூன்று', 'moondru', 'ˈmu:n.ru'], ['அன்பு', 'anbu', 'ˈan.bu'],
      ['எவ்வளவு', 'evvalavu', 'ev.va.ˈla.vu'], null
    ]
  },

  /* ---------- South-East and East Asia ------------------------------------ */
  th: {
    name: 'Thai', native: 'ภาษาไทย', flag: '🇹🇭', voice: 'th-TH',
    script: 'Thai script',
    note: 'Thai has five tones and writes with no spaces between words. Vowels '
        + 'can sit above, below, before or after the consonant they follow.',
    core: [
      ['สวัสดี', 'sawatdi', 'sa.wat.ˈdi:'], ['ลาก่อน', 'la kon', 'la:.ˈko:n'],
      ['ขอบคุณ', 'khop khun', 'kHO:p.ˈkHun'], ['กรุณา', 'karuna', 'ka.ru.ˈna:'],
      ['ขอโทษ', 'kho thot', 'kHO:.ˈtHo:t'], ['ใช่', 'chai', 'tSai'], ['ไม่', 'mai', 'mai'],
      ['น้ำ', 'nam', 'na:m'], ['อาหาร', 'ahan', 'a:.ˈha:n'], ['เพื่อน', 'phuean', 'pH@:n'],
      ['หนึ่ง', 'nueng', 'n@N'], ['สอง', 'song', 'sO:N'], ['สาม', 'sam', 'sa:m'],
      ['ความรัก', 'khwam rak', 'kHwa:m.ˈrak'], ['เท่าไร', 'thao rai', 'tHau.ˈrai'],
      ['ห้องน้ำ', 'hong nam', 'hO:N.ˈna:m']
    ]
  },
  vi: {
    name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳', voice: 'vi-VN',
    script: 'Latin alphabet with tone marks', latin: true,
    note: 'Vietnamese uses Latin letters, but the marks piled on them are tones — '
        + 'six of them, and they change the word completely.',
    core: [
      ['xin chào', 'sin.tSau'], ['tạm biệt', 'tam.ˈbiet'], ['cảm ơn', 'kam.ˈ@n'],
      ['làm ơn', 'lam.ˈ@n'], ['xin lỗi', 'sin.ˈloi'], ['vâng', 'vaN'], ['không', 'kHoN'],
      ['nước', 'nuk'], ['thức ăn', 'tHuk.ˈan'], ['bạn', 'ban'],
      ['một', 'mot'], ['hai', 'hai'], ['ba', 'ba'], ['tình yêu', 'tiN.ˈje.u'],
      ['bao nhiêu', 'bau.ˈJe.u'], ['nhà vệ sinh', 'Ja.ve.ˈsiN']
    ]
  },
  id: {
    name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩', voice: 'id-ID',
    script: 'Latin alphabet', latin: true,
    note: 'Often called the easiest major language: no tones, no genders, no verb '
        + 'endings, no plurals beyond saying the word twice.',
    core: [
      ['halo', 'ˈha.lo'], ['selamat tinggal', 's@.ˈla.mat.ˈtiN.gal'],
      ['terima kasih', 't@.ˈri.ma.ˈka.sih'], ['tolong', 'ˈto.loN'], ['maaf', 'ma.ˈaf'],
      ['ya', 'ja'], ['tidak', 'ˈti.dak'], ['air', 'ˈa.ir'], ['makanan', 'ma.ˈka.nan'],
      ['teman', 'ˈt@.man'], ['satu', 'ˈsa.tu'], ['dua', 'ˈdu.a'], ['tiga', 'ˈti.ga'],
      ['cinta', 'ˈtSin.ta'], ['berapa', 'b@.ˈra.pa'], ['toilet', 'ˈtoi.let']
    ]
  },
  tl: {
    name: 'Tagalog / Filipino', native: 'Tagalog', flag: '🇵🇭', voice: 'fil-PH',
    script: 'Latin alphabet', latin: true,
    note: 'Full of Spanish borrowings, so a Spanish speaker recognises a great '
        + 'deal. "ng" is a single letter and can start a word.',
    core: [
      ['kumusta', 'ku.ˈmus.ta'], ['paalam', 'pa.ˈa.lam'], ['salamat', 'sa.ˈla.mat'],
      ['pakiusap', 'pa.ki.ˈu.sap'], ['pasensya', 'pa.ˈsen.Sa'], ['oo', 'ˈo.o'],
      ['hindi', 'hin.ˈdi'], ['tubig', 'ˈtu.big'], ['pagkain', 'pag.ˈka.in'],
      ['kaibigan', 'ka.i.ˈbi.gan'], ['isa', 'i.ˈsa'], ['dalawa', 'da.la.ˈwa'],
      ['tatlo', 'tat.ˈlo'], ['pag-ibig', 'pag.ˈi.big'], ['magkano', 'mag.ˈka.no'],
      ['banyo', 'ˈban.jo']
    ]
  },

  /* ---------- Africa ------------------------------------------------------ */
  sw: {
    name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪', voice: 'sw-KE',
    script: 'Latin alphabet', latin: true,
    note: 'The common language of East Africa. Spelling is one letter per sound '
        + 'and stress is always on the second-last syllable, without exception.',
    core: [
      ['jambo', 'ˈdZam.bo'], ['kwaheri', 'kwa.ˈhe.ri'], ['asante', 'a.ˈsan.te'],
      ['tafadhali', 'ta.fa.ˈDa.li'], ['samahani', 'sa.ma.ˈha.ni'], ['ndiyo', 'ˈndi.jo'],
      ['hapana', 'ha.ˈpa.na'], ['maji', 'ˈma.dZi'], ['chakula', 'tSa.ˈku.la'],
      ['rafiki', 'ra.ˈfi.ki'], ['moja', 'ˈmo.dZa'], ['mbili', 'ˈmbi.li'],
      ['tatu', 'ˈta.tu'], ['upendo', 'u.ˈpen.do'], ['bei gani', 'ˈbe.i.ˈga.ni'],
      ['choo', 'ˈtSo:']
    ]
  },
  yo: {
    name: 'Yoruba', native: 'Yorùbá', flag: '🇳🇬', voice: 'yo-NG',
    script: 'Latin alphabet with tone marks', latin: true,
    note: 'Yoruba is a tone language: the marks above the vowels are the melody, '
        + 'and the dots below ẹ, ọ and ṣ change the sound of the letter.',
    core: [
      ['báwo ni', 'ˈba.wo.ni'], ['ó dàbọ̀', 'o.ˈda.bO'], ['e ṣé', 'e.ˈSe'],
      ['jọ̀wọ́', 'ˈdZO.wO'], ['mà bínú', 'ma.ˈbi.nu'], ['bẹ́ẹ̀ ni', 'ˈbE.E.ni'],
      ['rárá', 'ˈra.ra'], ['omi', 'ˈo.mi'], ['oúnjẹ', 'ˈo.un.dZE'], ['ọ̀rẹ́', 'ˈO.rE'],
      ['ọ̀kan', 'ˈO.kan'], ['èjì', 'ˈe.dZi'], ['ẹ̀ta', 'ˈE.ta'], ['ìfẹ́', 'ˈi.fE'],
      ['mélòó', 'ˈme.lo:'], null
    ]
  },
  ha: {
    name: 'Hausa', native: 'Harshen Hausa', flag: '🇳🇬', voice: 'ha-NG',
    script: 'Latin alphabet', latin: true,
    note: 'The trade language of West Africa. The hooked letters ɓ, ɗ and ƙ are '
        + 'said with the throat briefly closed, which gives them a popping sound.',
    core: [
      ['sannu', 'ˈsan.nu'], ['sai anjima', 'sai.an.ˈdZi.ma'], ['na gode', 'na.ˈgo.de'],
      ['don Allah', 'don.ˈal.la'], ['yi hakuri', 'ji.ha.ˈku.ri'], ['eh', 'e:'],
      ['a\'a', 'ˈa.a'], ['ruwa', 'ˈru.wa'], ['abinci', 'a.ˈbin.tSi'],
      ['aboki', 'a.ˈbo.ki'], ['ɗaya', 'ˈda.ja'], ['biyu', 'ˈbi.ju'], ['uku', 'ˈu.ku'],
      ['soyayya', 'so.ˈjaj.ja'], ['nawa', 'ˈna.wa'], ['bayan gida', 'ˈba.jan.ˈgi.da']
    ]
  },
  zu: {
    name: 'Zulu', native: 'isiZulu', flag: '🇿🇦', voice: 'zu-ZA',
    script: 'Latin alphabet', latin: true,
    note: 'Zulu has click consonants — c, q and x are clicks, not ordinary '
        + 'letters, and no respelling can show them. Those words need the recording.',
    core: [
      ['sawubona', 'sa.wu.ˈbo.na'], ['sala kahle', 'sa.la.ˈka.hle'],
      ['ngiyabonga', 'ngi.ja.ˈbo.nga'], ['ngicela', 'ngi.ˈtSe.la'],
      ['uxolo', 'u.ˈkso.lo'], ['yebo', 'ˈje.bo'], null,
      ['amanzi', 'a.ˈman.zi'], ['ukudla', 'u.ˈku.dla'], ['umngane', 'um.ˈnga.ne'],
      ['kunye', 'ˈku.Je'], ['kubili', 'ku.ˈbi.li'], ['kuthathu', 'ku.ˈtHa.tHu'],
      ['uthando', 'u.ˈtHan.do'], ['malini', 'ma.ˈli.ni'], null
    ]
  },
  am: {
    name: 'Amharic', native: 'አማርኛ', flag: '🇪🇹', voice: 'am-ET',
    script: 'Ge\'ez script (fidel)',
    note: 'Written in fidel, where each character is a whole syllable — the same '
        + 'basic shape with small additions telling you which vowel follows.',
    core: [
      ['ሰላም', 'selam', 's@.ˈlam'], ['ደህና ሁን', 'dehna hun', 'd@h.na.ˈhun'],
      ['አመሰግናለሁ', 'ameseginalehu', 'a.m@.s@g.ˈna.l@.hu'],
      ['እባክህ', 'ebakih', '@.ˈba.k@h'], ['ይቅርታ', 'yiqirta', 'ji.ˈqir.ta'],
      ['አዎ', 'awo', 'ˈa.wo'], ['አይደለም', 'aydelem', 'aj.d@.ˈl@m'],
      ['ውሃ', 'wiha', 'ˈwi.ha'], ['ምግብ', 'migib', 'ˈmi.gib'],
      ['ጓደኛ', 'guadegna', 'gwa.ˈd@.Ja'], ['አንድ', 'and', 'and'],
      ['ሁለት', 'hulet', 'hu.ˈl@t'], ['ሶስት', 'sost', 'sost'],
      ['ፍቅር', 'fiqir', 'ˈfi.qir'], ['ስንት', 'sint', 'sint'], null
    ]
  },
  so: {
    name: 'Somali', native: 'Soomaali', flag: '🇸🇴', voice: 'so-SO',
    script: 'Latin alphabet', latin: true,
    note: 'Written with Latin letters since 1972. The letters c and x are throat '
        + 'sounds borrowed from Arabic, not the c and x you expect.',
    core: [
      ['salaan', 'sa.ˈla:n'], ['nabadgelyo', 'na.bad.ˈgel.jo'],
      ['mahadsanid', 'ma.had.ˈsa.nid'], ['fadlan', 'ˈfad.lan'],
      ['raali ahow', 'ˈra:.li.a.how'], ['haa', 'ha:'], ['maya', 'ˈma.ja'],
      ['biyo', 'ˈbi.jo'], ['cunto', 'ˈ3un.to'], ['saaxiib', 'sa:.ˈxi:b'],
      ['kow', 'kow'], ['laba', 'ˈla.ba'], ['saddex', 'ˈsad.dex'],
      ['jacayl', 'dZa.ˈ3ajl'], ['immisa', 'ˈim.mi.sa'], ['musqul', 'ˈmus.qul']
    ]
  },

  /* ---------- Caucasus and Central Asia ----------------------------------- */
  ka: {
    name: 'Georgian', native: 'ქართული', flag: '🇬🇪', voice: 'ka-GE',
    script: 'Georgian script',
    note: 'Its own alphabet, its own family, and no capital letters at all. '
        + 'Georgian happily stacks six consonants in a row.',
    core: [
      ['გამარჯობა', 'gamarjoba', 'ga.mar.ˈdZo.ba'],
      ['ნახვამდის', 'nakhvamdis', 'nax.ˈvam.dis'], ['მადლობა', 'madloba', 'ma.ˈdlo.ba'],
      ['გთხოვთ', 'gtkhovt', 'gtxovt'], ['ბოდიши', 'bodishi', 'bo.ˈdi.Si'],
      ['კი', 'ki', 'ki'], ['არა', 'ara', 'ˈa.ra'], ['წყალი', 'tsqali', 'ˈtskHa.li'],
      ['საჭმელი', 'sachmeli', 'satS.ˈme.li'], ['მეგობარი', 'megobari', 'me.go.ˈba.ri'],
      ['ერთი', 'erti', 'ˈer.ti'], ['ორი', 'ori', 'ˈo.ri'], ['სამი', 'sami', 'ˈsa.mi'],
      ['სიყვარული', 'siqvaruli', 'si.kHva.ˈru.li'], ['რამდენი', 'ramdeni', 'ram.ˈde.ni'],
      ['ტუალეტი', 'tualeti', 'tu.a.ˈle.ti']
    ]
  },
  hy: {
    name: 'Armenian', native: 'Հայերեն', flag: '🇦🇲', voice: 'hy-AM',
    script: 'Armenian script',
    note: 'An alphabet invented in 405 AD for this one language, and used for '
        + 'nothing else since.',
    core: [
      ['բարև', 'barev', 'ba.ˈrev'], ['ցտեսություն', 'tstesutyun', 'tsdes.u.ˈtHjun'],
      ['շնորհակալություն', 'shnorhakalutyun', 'Snor.ha.ka.lu.ˈtHjun'],
      ['խնդրեմ', 'khndrem', 'xn.ˈdrem'], ['ներողություն', 'neroghutyun', 'ne.ro.Gu.ˈtHjun'],
      ['այո', 'ayo', 'a.ˈjo'], ['ոչ', 'voch', 'votS'], ['ջուր', 'jur', 'dZur'],
      ['ուտելիք', 'utelik', 'u.te.ˈlikH'], ['ընկեր', 'ynker', '@N.ˈker'],
      ['մեկ', 'mek', 'mek'], ['երկու', 'yerku', 'jer.ˈku'], ['երեք', 'yerek', 'je.ˈrekH'],
      ['սեր', 'ser', 'ser'], ['ինչքան', 'inchkan', 'intS.ˈkHan'],
      ['զուգարան', 'zugaran', 'zu.ga.ˈran']
    ]
  },
  mn: {
    name: 'Mongolian', native: 'Монгол', flag: '🇲🇳', voice: 'mn-MN',
    script: 'Cyrillic', scripts: ['cyrillic'],
    note: 'Written in Cyrillic with two extra letters, ө and ү. The old vertical '
        + 'script is still used in Inner Mongolia.',
    core: [
      ['сайн байна уу', 'sain baina uu', 'sain.ˈbai.na.u:'],
      ['баяртай', 'bayartai', 'ba.jar.ˈtai'], ['баярлалаа', 'bayarlalaa', 'ba.jar.la.ˈla:'],
      ['гуйя', 'guiya', 'ˈgui.ja'], ['уучлаарай', 'uuchlaarai', 'u:tS.ˈla:.rai'],
      ['тийм', 'tiim', 'ti:m'], ['үгүй', 'ugui', 'y.ˈgyi'], ['ус', 'us', 'us'],
      ['хоол', 'khool', 'xo:l'], ['найз', 'naiz', 'naiz'], ['нэг', 'neg', 'neg'],
      ['хоёр', 'khoyor', 'xo.ˈjor'], ['гурав', 'gurav', 'ˈgu.rav'],
      ['хайр', 'khair', 'xair'], ['хэд', 'khed', 'xed'], null
    ]
  }
};

/* Fold the compact rows out into the same shape as the full phrasebooks. */
(function buildCoreLanguages() {
  Object.keys(CORE_LANGUAGES).forEach(code => {
    const src = CORE_LANGUAGES[code];
    const words = [];
    src.core.forEach((row, i) => {
      if (!row) return;                                  // slot deliberately empty
      const slot = CORE_SLOTS[i];
      const written = row[0];
      const translit = row.length === 3 ? row[1] : written;
      const pron = row.length === 3 ? row[2] : row[1];
      words.push([written, translit, pron, slot[0], slot[1]]);
    });

    LANGUAGES[code] = {
      name: src.name, native: src.native, flag: src.flag, voice: src.voice,
      script: src.script, scripts: src.scripts || [], note: src.note,
      rtl: !!src.rtl, latin: !!src.latin, core: true, words: words
    };
    if (LANGUAGE_ORDER.indexOf(code) === -1) LANGUAGE_ORDER.push(code);
  });
  LANGUAGE_ORDER.sort((a, b) => LANGUAGES[a].name.localeCompare(LANGUAGES[b].name));
})();
