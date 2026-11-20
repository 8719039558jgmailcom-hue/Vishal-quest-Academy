import { ChapterNodeDefinition } from '../types/quiz';

// Complete Class 10th New MP Board NCERT Syllabus Nodes (Zero Skipped Chapters)
// Every subject is split into individual playable & sequentially unlockable chapter levels with dedicated NCERT notes & >= 3 MCQs each.
export const SYLLABUS_NODES_10: ChapterNodeDefinition[] = [
  // ==================== CLASS 10 · HINDI (9 STAGES) ====================
  {
    id: '10-hi-k1',
    grade: '10',
    subjectId: 'hindi',
    subsectionId: 'kavya-khand',
    order: 1,
    chapterCode: { en: 'Kshitij-2 Kavya · Ch. 1', hi: 'क्षितिज-2 काव्य · पाठ 1' },
    title: {
      en: 'Surdas ke Pad (Bhramargeet)',
      hi: 'सूरदास के पद (भ्रमरगीत)',
    },
    bossName: { en: 'Surdas Kavya Guardian', hi: 'सूरदास काव्य प्रहरी' },
    summaryPoints: [
      {
        en: 'Gopis address Uddhav as "Badbhagi" ironically because he remains untouched by Krishna’s divine love.',
        hi: 'गोपियाँ उद्धव को व्यंग्य में "बड़भागी" कहती हैं क्योंकि वे प्रेम-बंधन से अछूते हैं।',
      },
      {
        en: 'Written in sweet Braj Bhasha, depicting Gopis as ants stuck to jaggery ("गुर चाँटी ज्यों पागी") & Krishna as Haril’s stick.',
        hi: 'ब्रजभाषा में रचित इन पदों में गोपियों का प्रेम "गुर चाँटी ज्यों पागी" और कृष्ण "हारिल की लकरी" हैं।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '1. Surdas ke Pad (Bhramargeet)', hi: '1. सूरदास के पद (भ्रमरगीत)' },
        summary: {
          en: 'Surdas depicts the Gopis’ unshakeable Saguna Bhakti over Uddhav’s dry Nirguna Yoga.',
          hi: 'सूरदास ने उद्धव के निर्गुण ज्ञान पर गोपियों के सगुण कृष्ण-प्रेम की विजय दिखाई है।',
        },
        keyPoints: [
          { en: 'Language: Braj Bhasha · Ras: Viyog Shringar', hi: 'भाषा: ब्रजभाषा · प्रमुख रस: वियोग शृंगार' },
          { en: 'Metaphors: Lotus leaf in water (प्रीति नदी में पाँव न बोरयो), Gur-Chanti, and Haril bird holding its stick.', hi: 'दृष्टांत: जल में कमल का पत्ता, गुड़ से चिपकी चींटियाँ व हारिल पक्षी की लकड़ी।' },
        ],
        examTip: { en: 'MP Board PYQ: Who is called "Badbhagi"? → Uddhav.', hi: 'बोर्ड मुख्य प्रश्न: "बड़भागी" किसे कहा गया? → उद्धव को।' },
      },
    ],
    questionIds: ['10-hi-1', '10-hi-m-1', '10-hi-m-2', '10-hi-m-15'],
    secondsPerQuestion: 10,
    baseXP: 115,
    mapCoords: { x: 14, y: 68 },
  },
  {
    id: '10-hi-tulsidas',
    grade: '10',
    subjectId: 'hindi',
    subsectionId: 'kavya-khand',
    order: 2,
    chapterCode: { en: 'Kshitij-2 Kavya · Ch. 2', hi: 'क्षितिज-2 काव्य · पाठ 2' },
    title: {
      en: 'Ram-Lakshman-Parashuram Samvad (Tulsidas)',
      hi: 'राम-लक्ष्मण-परशुराम संवाद (तुलसीदास)',
    },
    bossName: { en: 'Awadhi Dhanush Warden', hi: 'अवधी धनुष भंग रक्षक' },
    summaryPoints: [
      {
        en: 'Excerpt from Balakand of Ramcharitmanas after Ram breaks Shiva’s bow at Sita’s Swayamvara.',
        hi: 'रामचरितमानस के बालकांड से उद्धृत; शिव-धनुष भंग के बाद परशुराम का क्रोध व लक्ष्मण का व्यंग्य।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '2. Ram-Lakshman-Parashuram Samvad', hi: '2. राम-लक्ष्मण-परशुराम संवाद (तुलसीदास)' },
        summary: {
          en: 'Shri Ram calms the furious sage humbly calling himself "your servant", while Lakshman responds with fearless satire.',
          hi: 'श्रीराम विनम्रता से धनुष टूटने की ज़िम्मेदारी "दास" बनकर स्वीकारते हैं, जबकि लक्ष्मण वीर व्यंग्य करते हैं।',
        },
        keyPoints: [
          { en: 'Language: Awadhi · Metre: Chaupai & Doha.', hi: 'भाषा: अवधी · छंद: चौपाई व दोहा।' },
          { en: 'Ras: Veer & Raudra Ras.', hi: 'प्रमुख रस: रौद्र व वीर रस।' },
        ],
        examTip: { en: 'MP Board PYQ: Source Kand = Balakand of Ramcharitmanas.', hi: 'बोर्ड प्रश्न: यह संवाद रामचरितमानस के "बालकांड" से लिया गया है।' },
      },
    ],
    questionIds: ['10-hi-2', '10-hi-m-3', '10-hi-m-4', '10-hi-m-16'],
    secondsPerQuestion: 10,
    baseXP: 120,
    mapCoords: { x: 24, y: 52 },
  },
  {
    id: '10-hi-k2',
    grade: '10',
    subjectId: 'hindi',
    subsectionId: 'kavya-khand',
    order: 3,
    chapterCode: { en: 'Kshitij-2 Kavya · Ch. 3–6', hi: 'क्षितिज-2 काव्य · पाठ 3–6' },
    title: {
      en: 'Aatmakathya, Utsah, Yah Danturit Muskan, Fasal & Sangatkar',
      hi: 'आत्मकथ्य, उत्साह, यह दंतुरित मुसकान, फसल व संगतकार',
    },
    bossName: { en: 'Chhayavad Lyric Warden', hi: 'छायावाद काव्य रक्षक' },
    summaryPoints: [
      {
        en: 'Jaishankar Prasad declined writing an autobiography for Premchand’s "Hans" (1932); Nirala invokes clouds in "Utsah".',
        hi: 'जयशंकर प्रसाद ने प्रेमचंद की "हंस" पत्रिका (1932) हेतु "आत्मकथ्य" रचा; निराला ने "उत्साह" में बादल का आह्वान किया।',
      },
      {
        en: 'Nagarjun celebrates a baby’s smile & farmers in "Fasal"; Manglesh Dabral honors backing vocalists in "Sangatkar".',
        hi: 'नागार्जुन ने शिशु की मुसकान व "फसल" की महिमा गाई; "संगतकार" मुख्य गायक के सहायक के महत्व को दर्शाता है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '3–6. Aatmakathya, Utsah, Danturit Muskan & Sangatkar', hi: '3–6. आत्मकथ्य, उत्साह, दंतुरित मुसकान, फसल व संगतकार' },
        summary: {
          en: 'Prasad calls his life an empty pitcher (रीति गागर); child’s smile melts even stone (पाषाण); Sangatkar lowers his pitch out of humanity.',
          hi: 'शिशु की मुसकान से कठोर पाषाण पिघल जाता है; तार सप्तक पर संगतकार मुख्य गायक की टेक सँभालता है।',
        },
        keyPoints: [
          { en: 'Published in 1932 in "Hans" edited by Munshi Premchand.', hi: 'सन् 1932 में "हंस" पत्रिका के आत्मकथा विशेषांक में प्रकाशित।' },
          { en: 'Sangatkar’s lowered voice preserves the main singer’s dignity—it is humanity, not failure.', hi: 'संगतकार का स्वर जानबूझकर धीमा रखना उसकी मानवीय संवेदनशीलता है।' },
        ],
      },
    ],
    questionIds: ['10-hi-11', '10-hi-utsah-1', '10-hi-m-5', '10-hi-m-6', '10-hi-m-7'],
    secondsPerQuestion: 10,
    baseXP: 130,
    mapCoords: { x: 34, y: 40 },
  },
  {
    id: '10-hi-g1',
    grade: '10',
    subjectId: 'hindi',
    subsectionId: 'gadya-khand',
    order: 4,
    chapterCode: { en: 'Kshitij-2 Gadya · Ch. 7', hi: 'क्षितिज-2 गद्य · पाठ 7' },
    title: {
      en: 'Netaji ka Chashma (Swayam Prakash)',
      hi: 'नेताजी का चश्मा (स्वयं प्रकाश)',
    },
    bossName: { en: 'Deshbhakti Square Keeper', hi: 'देशभक्ति चौराहा प्रहरी' },
    summaryPoints: [
      {
        en: 'Captain Chashmewala was a patriotic lame hawker who fitted frames on Subhas Chandra Bose’s stone statue.',
        hi: 'कैप्टन चश्मेवाला देशभक्ति से प्रेरित होकर नेताजी की मूर्ति पर असली चश्मा लगाता था।',
      },
      {
        en: 'After Captain’s death, town children placed a Sarkanda (reed) frame on the statue, delighting Haldar Sahab.',
        hi: 'कैप्टन की मृत्यु के बाद बच्चों ने मूर्ति पर सरकंडे का चश्मा लगाया, जिसे देख हालदार साहब भावुक हुए।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '7. Netaji ka Chashma — Character & Message', hi: '7. नेताजी का चश्मा — पात्र व संदेश' },
        summary: {
          en: 'Everyday citizens like Captain and children keep patriotism alive even without grand monuments.',
          hi: 'स्वयं प्रकाश बताते हैं कि देशभक्ति किसी बड़े पद की नहीं बल्कि आम नागरिकों और बच्चों की भावना से जीवित रहती है।',
        },
        keyPoints: [
          { en: 'Even Panwala wiped his eyes quietly when reporting Captain’s death.', hi: 'कैप्टन की मृत्यु पर पानवाला भी भावुक होकर आँखें पोंछता है।' },
        ],
      },
    ],
    questionIds: ['10-hi-3', '10-hi-m-8', '10-hi-m-13', '10-hi-m-17'],
    secondsPerQuestion: 10,
    baseXP: 135,
    mapCoords: { x: 46, y: 66 },
  },
  {
    id: '10-hi-balgovin',
    grade: '10',
    subjectId: 'hindi',
    subsectionId: 'gadya-khand',
    order: 5,
    chapterCode: { en: 'Kshitij-2 Gadya · Ch. 8–9', hi: 'क्षितिज-2 गद्य · पाठ 8–9' },
    title: {
      en: 'Balgovin Bhagat & Lakhnavi Andaz',
      hi: 'बालगोबिन भगत व लखनवी अंदाज़',
    },
    bossName: { en: 'Bhagat & Nawab Warden', hi: 'भगत-नवाब गद्य रक्षक' },
    summaryPoints: [
      {
        en: 'Balgovin Bhagat revered Kabir as "Sahab", celebrated his son’s death as union with God, and arranged his daughter-in-law’s remarriage.',
        hi: 'बालगोबिन भगत कबीर को "साहब" मानते थे; पुत्र की मृत्यु पर उत्सव मनाने व पतोहू के पुनर्विवाह का संदेश दिया।',
      },
      {
        en: 'Nawab Sahab in "Lakhnavi Andaz" discarded spiced cucumber slices after merely smelling them to show hollow pride.',
        hi: '"लखनवी अंदाज़" में नवाब साहब ने झूठी शान दिखाने हेतु खीरा बिना खाए खिड़की से फेंक दिया।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '8–9. Balgovin Bhagat & Lakhnavi Andaz', hi: '8–9. बालगोबिन भगत व लखनवी अंदाज़' },
        summary: {
          en: 'Ramvriksh Benipuri’s रेखाचित्र contrasts true spiritual householder simplicity vs Yashpal’s satire on feudal vanity.',
          hi: 'बेनीपुरी जी का रेखाचित्र रूढ़ियों पर प्रहार करता है; यशपाल का व्यंग्य "नई कहानी" की ओर संकेत करता है।',
        },
        keyPoints: [
          { en: 'Bhagat sang Kabir’s padas in Karthik-Phagun dawn.', hi: 'भगत जी पतोहू के भाई को बुलाकर उसका पुनर्विवाह करने का आदेश देते हैं।' },
        ],
      },
    ],
    questionIds: ['10-hi-5', '10-hi-13', '10-hi-m-9', '10-hi-m-12'],
    secondsPerQuestion: 10,
    baseXP: 145,
    mapCoords: { x: 56, y: 42 },
  },
  {
    id: '10-hi-g2',
    grade: '10',
    subjectId: 'hindi',
    subsectionId: 'gadya-khand',
    order: 6,
    chapterCode: { en: 'Kshitij-2 Gadya · Ch. 10–12', hi: 'क्षितिज-2 गद्य · पाठ 10–12' },
    title: {
      en: 'Ek Kahani Yah Bhi, Naubatkhane Mein Ibadat & Sanskriti',
      hi: 'एक कहानी यह भी, नौबतखाने में इबादत व संस्कृति',
    },
    bossName: { en: 'Kashi Shehnai Sentinel', hi: 'काशी शहनाई व संस्कृति प्रहरी' },
    summaryPoints: [
      {
        en: 'Manu Bhandari’s professor Sheela Agrawal shaped her activism; Bismillah Khan revered Kashi’s Shehnai & Ganga.',
        hi: 'मन्नू भंडारी पर शीला अग्रवाल का गहरा प्रभाव रहा; उस्ताद बिस्मिल्ला खाँ काशी व शहनाई के अमर साधक थे।',
      },
      {
        en: 'Bhadant Anand Kausalyayan defines "Sanskriti" as creative welfare intelligence and "Sabhyata" as its outward product.',
        hi: 'आग और सुई का आविष्कार करने वाली कल्याणकारी बुद्धि "संस्कृति" है तथा उसका परिणाम "सभ्यता" है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '10–12. Ajmer Awakening, Kashi Shehnai & Sanskriti', hi: '10–12. एक कहानी यह भी, नौबतखाने व संस्कृति' },
        summary: {
          en: 'Covers women’s participation in 1946–47 independence movement, Ustad Bismillah Khan’s syncretic music, and Civilization vs Culture.',
          hi: 'अजमेर का स्वतंत्रता संग्राम, काशी की गंगा-जमुनी तहज़ीब व सभ्यता-संस्कृति की परिभाषा।',
        },
        keyPoints: [
          { en: 'Sabhyata is the outer result of inner Sanskriti (Newton, fire, needle).', hi: 'जब कल्याणकारी बुद्धि कल्याण की भावना खो दे तो "असंस्कृति" बन जाती है।' },
        ],
      },
    ],
    questionIds: ['10-hi-ekkahani-1', '10-hi-m-10', '10-hi-m-14', '10-hi-m-18'],
    secondsPerQuestion: 10,
    baseXP: 150,
    mapCoords: { x: 64, y: 66 },
  },
  {
    id: '10-hi-kritika',
    grade: '10',
    subjectId: 'hindi',
    subsectionId: 'gadya-khand',
    order: 7,
    chapterCode: { en: 'Kritika-2 · Ch. 1, 2 & 3', hi: 'कृतिका-2 · पाठ 1, 2 व 3' },
    title: {
      en: 'Mata ka Anchal, Sana Sana Hath Jodi & Main Kyon Likhta Hoon',
      hi: 'माता का अँचल, साना-साना हाथ जोड़ि व मैं क्यों लिखता हूँ',
    },
    bossName: { en: 'Kritika Memoir Sentinel', hi: 'कृतिका स्मृति प्रहरी' },
    summaryPoints: [
      {
        en: 'Kritika-2: Bholanath (Tarkeshwarnath) hides in his mother’s lap when scared by a snake; Gangtok is city of hardworking kings.',
        hi: 'भोलानाथ (तारकेश्वरनाथ) साँप से डरकर माँ के अँचल में छिपता है; "गंतोक" को मेहनतकश बादशाहों का शहर कहा गया है।',
      },
      {
        en: 'Agyeya reflects on his Hiroshima nuclear shadow visit in "Main Kyon Likhta Hoon".',
        hi: 'अज्ञेय जी ने हिरोशिमा के परमाणु अनुभव से "मैं क्यों लिखता हूँ" की आभ्यंतर विवशता बताई।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Kritika-2 Complete (Ch. 1, 2 & 3)', hi: 'कृतिका-2 संपूर्ण (पाठ 1, 2 व 3)' },
        summary: {
          en: 'Shivpujan Sahay celebrates rural childhood & maternal refuge; Madhu Kankariya describes Sikkim’s Yoomthang & Katao; Agyeya defines inner creative urge.',
          hi: 'मातृ-प्रेम की छत्रछाया, सिक्किम यात्रा वृत्तांत व लेखक की आंतरिक अनुभूति के तीनों पाठ।',
        },
        keyPoints: [
          { en: 'Bholanath’s real name in Mata ka Anchal: Tarkeshwarnath.', hi: 'भोलानाथ का वास्तविक नाम: तारकेश्वरनाथ।' },
        ],
      },
    ],
    questionIds: ['10-hi-8', '10-hi-14', '10-hi-15', '10-hi-m-11'],
    secondsPerQuestion: 10,
    baseXP: 155,
    mapCoords: { x: 74, y: 36 },
  },
  {
    id: '10-hi-ras-alankar',
    grade: '10',
    subjectId: 'hindi',
    subsectionId: 'kavyabodh-vyakaran',
    order: 8,
    chapterCode: { en: 'Kavya Bodh · Ras, Chhand & Alankar', hi: 'काव्य बोध · रस, छंद व अलंकार' },
    title: {
      en: 'Dedicated Subsections: Ras, Alankar & Chhand Poetics',
      hi: 'समर्पित उपखंड: रस, अलंकार एवं छंद विधान',
    },
    bossName: { en: 'Chhand Alankar Warden', hi: 'रस-छंद-अलंकार अधिपति' },
    summaryPoints: [
      {
        en: 'All 10 Ras with Sthayi Bhava: Shringar (Rati), Veer (Utsah), Karun (Shok), Hasya (Has), Raudra (Krodh).',
        hi: 'प्रमुख रस व स्थायी भाव: शृंगार (रति), वीर (उत्साह), करुण (शोक), हास्य (हास), रौद्र (क्रोध), शांत (निर्वेद)।',
      },
      {
        en: 'Alankar: Anupras, Yamak, Shlesh, Atishayokti; Chhand: Doha (13-11), Chaupai (16 matras).',
        hi: 'अलंकार: अनुप्रास, यमक, श्लेष, अतिशयोक्ति; छंद: दोहा (13-11 मात्राएँ) व चौपाई (16 मात्राएँ)।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Subsection A: Ras (रस एवं स्थायी भाव)', hi: 'उपखंड A: रस एवं उसके 4 अंग व 10 भेद' },
        summary: {
          en: 'Acharya Vishwanath: "रसात्मकं वाक्यं काव्यम्". Four limbs of Ras: Sthayi Bhava, Vibhava, Anubhava, Sanchari Bhava (33).',
          hi: 'आचार्य विश्वनाथ: "वाक्यं रसात्मकं काव्यम्"। रस के 4 अंग: स्थायी भाव, विभाव, अनुभाव, संचारी भाव (संख्या 33)।',
        },
        keyPoints: [
          { en: 'Veer → Utsah · Karun → Shok · Shant → Nirved · Vatsalya → Vatsalyata.', hi: 'वीर → उत्साह · करुण → शोक · शांत → निर्वेद · भयानक → भय · अद्भुत → विस्मय।' },
        ],
      },
      {
        topicTitle: { en: 'Subsection B: Alankar & Chhand (अलंकार व छंद)', hi: 'उपखंड B: अलंकार (श्लेष, यमक, रूपक) व दोहा-चौपाई छंद' },
        summary: {
          en: 'Doha has 13-11 matras; Chaupai has 16 matras in each of 4 lines; Atishayokti exaggerates beyond world limits.',
          hi: 'दोहा अर्धसम मात्रिक (13-11 मात्राएँ) तथा चौपाई सम मात्रिक छंद (प्रत्येक चरण 16 मात्राएँ) है।',
        },
        keyPoints: [
          { en: 'Yamak: "कनक-कनक ते सौ गुनी"; Utpreksha markers: मनु, मानो, जनु, जानो.', hi: 'उत्प्रेक्षा के वाचक शब्द: मनु, मानो, जनु, जानो, मनहुँ; अतिशयोक्ति में लोक-सीमा से बढ़ाकर वर्णन।' },
        ],
      },
    ],
    questionIds: ['10-hi-7', '10-hi-9', '10-hi-10', '10-hi-tricky-2'],
    secondsPerQuestion: 10,
    baseXP: 165,
    mapCoords: { x: 82, y: 58 },
  },
  {
    id: '10-hi-vyakaran',
    grade: '10',
    subjectId: 'hindi',
    subsectionId: 'kavyabodh-vyakaran',
    order: 9,
    chapterCode: { en: 'Vyakaran · Complete Grammar', hi: 'हिन्दी व्याकरण · संपूर्ण खंड' },
    title: {
      en: 'Samas, Sandhi, Vachya, Kriya, Vakya Bhed & Muhavare',
      hi: 'समास, संधि, वाच्य, क्रिया, वाक्य भेद एवं मुहावरे',
    },
    bossName: { en: 'Vyakaran Knight', hi: 'व्याकरण महायोद्धा' },
    summaryPoints: [
      {
        en: '6 Samas types (Dvigu = numeral; Dvandva = hyphenated equal; Bahuvrihi = third meaning).',
        hi: 'समास के 6 भेद: अव्ययीभाव, तत्पुरुष, कर्मधारय, द्विगु (संख्यावाची), द्वंद्व (योजक), बहुव्रीहि (तीसरा अर्थ)।',
      },
      {
        en: '3 Vachya (Kartri, Karma, Bhava) and 3 Vakya Rachana types (Saral, Sanyukt, Mishra).',
        hi: 'वाच्य के 3 भेद (कर्तृ, कर्म, भाव) तथा रचना के आधार पर वाक्य के 3 भेद (सरल, संयुक्त, मिश्र)।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Samas & Sandhi Identification Rules', hi: 'समास व संधि पहचान के अचूक नियम' },
        summary: {
          en: 'Swar, Vyanjan & Visarga Sandhi. Watch for Dashanan Bahuvrihi vs Dvigu.',
          hi: 'विद्या+आलय (दीर्घ संधि), त्रिभुवन (द्विगु समास), पर दशानन (दस हैं आनन जिसके अर्थात् रावण = बहुव्रीहि)।',
        },
        keyPoints: [
          { en: 'Bhavavachya is always singular, masculine, 3rd person.', hi: 'भाववाच्य में क्रिया सदैव एकवचन, पुल्लिंग व अकर्मक होती है।' },
        ],
      },
    ],
    questionIds: ['10-hi-4', '10-hi-6', '10-hi-12', '10-hi-tricky-1'],
    secondsPerQuestion: 10,
    baseXP: 175,
    mapCoords: { x: 90, y: 36 },
  },

  // ==================== CLASS 10 · ENGLISH (8 STAGES) ====================
  {
    id: '10-en-ff1',
    grade: '10',
    subjectId: 'english',
    subsectionId: 'first-flight',
    order: 1,
    chapterCode: { en: 'First Flight · Ch. 1 & Poems 1–2', hi: 'First Flight · पाठ 1 व कविता 1–2' },
    title: {
      en: 'A Letter to God, Dust of Snow & Fire and Ice',
      hi: 'A Letter to God, Dust of Snow एवं Fire and Ice',
    },
    bossName: { en: 'Frost & Faith Warden', hi: 'लेंचो व फ्रॉस्ट प्रहरी' },
    summaryPoints: [
      {
        en: 'Lencho asked God for 100 pesos after hailstones ruined his crop; post office employees collected 70 pesos.',
        hi: 'लेंचो ने ईश्वर से 100 पेसो माँगे; पोस्ट ऑफिस कर्मचारियों ने 70 पेसो इकट्ठा करके भेजे।',
      },
      {
        en: 'Robert Frost symbolizes Desire as "Fire" and Hatred as "Ice" in Fire and Ice.',
        hi: 'रॉबर्ट फ्रॉस्ट की कविता "Fire and Ice" में Fire = इच्छा (Desire) व Ice = घृणा (Hatred) के प्रतीक हैं।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 1 A Letter to God & Frost Poems', hi: 'पाठ 1 व रॉबर्ट फ्रॉस्ट की कविताएँ' },
        summary: {
          en: 'G.L. Fuentes shows Lencho calling helpers "a bunch of crooks"; Crow & Hemlock tree represent uplifting hope in Dust of Snow.',
          hi: 'लेंचो की अटूट आस्था तथा कौए व हेमलॉक वृक्ष से कवि का मूड बदलने का सुंदर वर्णन।',
        },
        keyPoints: [
          { en: 'Postmaster raised 70 pesos (more than half) so Lencho’s faith stayed alive.', hi: 'पोस्टमास्टर ने अपने वेतन का हिस्सा देकर 70 पेसो जुटाए थे।' },
        ],
      },
    ],
    questionIds: ['10-en-1', '10-en-2', '10-en-m-1', '10-en-m-2'],
    secondsPerQuestion: 10,
    baseXP: 120,
    mapCoords: { x: 14, y: 66 },
  },
  {
    id: '10-en-mandela',
    grade: '10',
    subjectId: 'english',
    subsectionId: 'first-flight',
    order: 2,
    chapterCode: { en: 'First Flight · Ch. 2–3', hi: 'First Flight · पाठ 2–3' },
    title: {
      en: 'Nelson Mandela & Two Stories About Flying',
      hi: 'Nelson Mandela एवं Two Stories About Flying',
    },
    bossName: { en: 'Liberty Storm Keeper', hi: 'लिबर्टी व उड़ान प्रहरी' },
    summaryPoints: [
      {
        en: 'Nelson Mandela took oath on 10 May 1994; Young Seagull conquered fear when hunger drove him to dive for fish.',
        hi: 'मंडेला ने 10 मई 1994 को शपथ ली; भूख ने नन्हे सीगल को पहली उड़ान भरना सिखाया।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Long Walk to Freedom & Flying Chapters', hi: 'मंडेला व उड़ान के दोनों पाठ' },
        summary: {
          en: 'Mandela’s Twin Obligations: 1) Family, 2) Country/People. Forsyth’s Black Aeroplane guides Old Dakota through storm clouds.',
          hi: 'मंडेला के दो दायित्व व ब्लैक एयरोप्लेन द्वारा डकोटा विमान की सुरक्षित लैंडिंग।',
        },
        keyPoints: [
          { en: 'Young Seagull was driven by maddening hunger at fish in his mother’s beak.', hi: '24 घंटे की भूख ने सीगल के पंख स्वतः खोल दिए।' },
        ],
      },
    ],
    questionIds: ['10-en-3', '10-en-m-3', '10-en-m-9', '10-en-extra-1'],
    secondsPerQuestion: 10,
    baseXP: 130,
    mapCoords: { x: 26, y: 44 },
  },
  {
    id: '10-en-ff2',
    grade: '10',
    subjectId: 'english',
    subsectionId: 'first-flight',
    order: 3,
    chapterCode: { en: 'First Flight · Ch. 4–6 & Poems', hi: 'First Flight · पाठ 4–6 व कविताएँ' },
    title: {
      en: 'Anne Frank, Glimpses of India, Mijbil & Amanda!',
      hi: 'Anne Frank, Coorg/Goa/Assam, Mijbil व Amanda!',
    },
    bossName: { en: 'Coorg Chronicle Warden', hi: 'कुर्ग व ऐन फ्रैंक रक्षक' },
    summaryPoints: [
      {
        en: 'Anne Frank named her diary "Kitty"; Coorg (smallest Karnataka district) gave General K.M. Cariappa.',
        hi: 'ऐन फ्रैंक की डायरी का नाम "किटी" था; कुर्ग ने भारतीय सेना को जनरल करियप्पा दिए।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Anne Frank, Glimpses of India & Poems', hi: 'ऐन फ्रैंक, भारत की झलकियाँ व कविताएँ' },
        summary: {
          en: 'Baker from Goa (Pader), Coorg coffee/Kodavu valour, Assam tea legends; Amanda craves silent freedom.',
          hi: 'गोवा का पैडर बेकर, कुर्ग की कॉफी, असम की चाय और अमंडा कविता का सार।',
        },
        keyPoints: [
          { en: 'Carl Sandburg compares "Fog" to a silent cat; Custard proves brave against pirate.', hi: 'कार्ल सैंडबर्ग ने कोहरे (Fog) की तुलना बिल्ली से की है।' },
        ],
      },
    ],
    questionIds: ['10-en-5', '10-en-8', '10-en-11', '10-en-m-10'],
    secondsPerQuestion: 10,
    baseXP: 135,
    mapCoords: { x: 38, y: 64 },
  },
  {
    id: '10-en-bus',
    grade: '10',
    subjectId: 'english',
    subsectionId: 'first-flight',
    order: 4,
    chapterCode: { en: 'First Flight · Ch. 7–9', hi: 'First Flight · पाठ 7–9' },
    title: {
      en: 'Madam Rides the Bus, Sermon at Benares & The Proposal',
      hi: 'Madam Rides the Bus, Sermon at Benares एवं The Proposal',
    },
    bossName: { en: 'Benares Harbour Warden', hi: 'बनारस व प्रपोज़ल रक्षक' },
    summaryPoints: [
      {
        en: 'Valli saved 60 paise (30 paise each way); Kisa Gotami learned death is universal; Lomov & Natalya quarrel over Oxen Meadows.',
        hi: 'वल्ली ने 60 पैसे (30 पैसे एक तरफ) बचाए; किसा गौतमी को मृत्यु का सत्य ज्ञात हुआ; ऑक्सन मीडोज़ विवाद।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'First Flight Ch. 7–9 Core Facts', hi: 'पाठ 7–9 मुख्य परीक्षा बिंदु' },
        summary: {
          en: 'Buddha asked for mustard seeds from a house where no loved one had ever died; Chekhov’s farce satirizes landed marriage.',
          hi: 'गौतम बुद्ध ने मृत्यु-रहित घर से सरसों के दाने लाने को कहा जिससे किसा गौतमी को ज्ञान मिला।',
        },
        keyPoints: [
          { en: 'Valli’s round-trip bus fare: 30 + 30 = 60 paise.', hi: 'वल्ली का एक तरफ का किराया 30 पैसे था।' },
        ],
      },
    ],
    questionIds: ['10-en-m-4', '10-en-m-5', '10-en-extra-2', '10-en-m-12'],
    secondsPerQuestion: 10,
    baseXP: 145,
    mapCoords: { x: 48, y: 38 },
  },
  {
    id: '10-en-fp1',
    grade: '10',
    subjectId: 'english',
    subsectionId: 'footprints',
    order: 5,
    chapterCode: { en: 'Footprints · Ch. 1–5', hi: 'Footprints · पाठ 1–5' },
    title: {
      en: 'Tricki, Thief’s Story, Midnight Visitor, Trust & Invisible Griffin',
      hi: 'Tricki, Hari Singh, Ausable, Horace Danby व Griffin',
    },
    bossName: { en: 'Invisible Footprints Boss', hi: 'अदृश्य वैज्ञानिक प्रहरी' },
    summaryPoints: [
      {
        en: 'Dr. Herriot cured overfed Tricki with water & exercise; Anil’s trust reformed Hari Singh; Griffin discovered invisibility.',
        hi: 'डॉ. हेरियट ने ट्रिकी को पानी व व्यायाम से ठीक किया; अनिल के विश्वास ने हरि सिंह को बदला; ग्रिफिन का आविष्कार।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Footprints Ch. 1–5 Notes', hi: 'फुटप्रिंट्स पाठ 1–5 मुख्य बिंदु' },
        summary: {
          en: 'Ausable outsmarts Max using a fake balcony story; Horace Danby is tricked by a lady in red; Griffin burns landlord’s house.',
          hi: 'ऑसेबल की नकली बालकनी युक्ति व ग्रिफिन द्वारा अदृश्य होने की दवा का दुरुपयोग।',
        },
        keyPoints: [
          { en: 'Tricki’s only illness was over-pampering and zero exercise.', hi: 'ट्रिकी की बीमारी अधिक खाने व आलस्य से थी।' },
        ],
      },
    ],
    questionIds: ['10-en-6', '10-en-13', '10-en-14', '10-en-m-6'],
    secondsPerQuestion: 10,
    baseXP: 150,
    mapCoords: { x: 60, y: 64 },
  },
  {
    id: '10-en-fp2',
    grade: '10',
    subjectId: 'english',
    subsectionId: 'footprints',
    order: 6,
    chapterCode: { en: 'Footprints · Ch. 6–9', hi: 'Footprints · पाठ 6–9' },
    title: {
      en: 'Making of a Scientist, The Necklace, Bholi & Book That Saved Earth',
      hi: 'Ebright, The Necklace, Bholi (सुलेखा) व Think-Tank',
    },
    bossName: { en: 'Shadow Citadel Lord', hi: 'नेकलेस व भोली प्रहरी' },
    summaryPoints: [
      {
        en: 'Ebright studied monarch butterflies; Matilda’s borrowed necklace was fake worth 500 francs; Bholi’s real name was Sulekha.',
        hi: 'ईब्राइट के तितली प्रयोग; मटिल्डा का नकली हार (500 फ्रैंक); भोली का वास्तविक नाम सुलेखा था।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Footprints Ch. 6–9 Complete Highlights', hi: 'फुटप्रिंट्स पाठ 6–9 सार' },
        summary: {
          en: 'Richard Ebright’s "The Travels of Monarch X", Maupassant’s twist in "The Necklace", Sulekha rejecting dowry, & Mother Goose stopping Think-Tank.',
          hi: 'मटिल्डा ने नकली हार के बदले 10 साल कर्ज चुकाया; भोली ने लालची बिशंबर का विवाह ठुकराया।',
        },
        keyPoints: [
          { en: 'Think-Tank ruler of Mars feared nursery rhyme "Humpty Dumpty".', hi: 'थिंक-टैंक नर्सरी कविता पुस्तक से डरकर पृथ्वी आक्रमण रद्द कर देता है।' },
        ],
      },
    ],
    questionIds: ['10-en-extra-3', '10-en-m-7', '10-en-m-11', '10-en-m-13'],
    secondsPerQuestion: 10,
    baseXP: 155,
    mapCoords: { x: 70, y: 38 },
  },
  {
    id: '10-en-g1',
    grade: '10',
    subjectId: 'english',
    subsectionId: 'grammar-book',
    order: 7,
    chapterCode: { en: 'Grammar Section · Determiners & Modals', hi: 'ग्रामर खंड · डिटरमिनर, मोडल, टेंस' },
    title: {
      en: 'Articles, Determiners, Modals & Tense Sequencing',
      hi: 'आर्टिकल्स, डिटरमिनर्स, मोडल्स एवं टेंस संयोजन',
    },
    bossName: { en: 'Syntax Gatekeeper', hi: 'वाक्य-रचना द्वारपाल' },
    summaryPoints: [
      {
        en: 'Articles depend on initial phonetic sound (an honest man, a university, an M.L.A.); "lest" takes "should".',
        hi: 'आर्टिकल ध्वनि पर निर्भर करते हैं (an M.L.A., a university); "lest" के साथ सदैव "should" आता है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'MP Board Fillers & Tricky Grammar Rules', hi: 'MP बोर्ड रिक्त स्थान व Do-As-Directed नियम' },
        summary: {
          en: 'Distinguish some vs any, much vs many, little/a little/the little, and Past Perfect + Simple Past sequence.',
          hi: 'some (सकारात्मक) बनाम any (नकारात्मक/प्रश्नवाचक), और दो भूतकाल कार्यों में पहले कार्य हेतु had + V3।',
        },
        keyPoints: [
          { en: '"No sooner did he see... than he ran" (Always pair No sooner with "than", Hardly with "when").', hi: 'No sooner के साथ "than" तथा Hardly के साथ "when" लगता है।' },
        ],
      },
    ],
    questionIds: ['10-en-4', '10-en-7', '10-en-9', '10-en-tricky-1'],
    secondsPerQuestion: 10,
    baseXP: 165,
    mapCoords: { x: 80, y: 60 },
  },
  {
    id: '10-en-g2',
    grade: '10',
    subjectId: 'english',
    subsectionId: 'grammar-book',
    order: 8,
    chapterCode: { en: 'Grammar Section · Voice & Clauses', hi: 'ग्रामर खंड · वॉइस व क्लॉज़' },
    title: {
      en: 'Active-Passive Voice, Unless/If & Relative Clauses',
      hi: 'एक्टिव-पैसिव वॉइस, कंडीशनल एवं रिलेटिव क्लॉज़',
    },
    bossName: { en: 'Grammar Sphinx', hi: 'ग्रामर स्फिंक्स' },
    summaryPoints: [
      {
        en: 'Simple Present → is/am/are + V3; Simple Past → was/were + V3; "Unless" replaces "If ... not".',
        hi: 'Simple Present Passive में is/am/are + V3; Simple Past में was/were + V3; "Unless" = "If not"।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Transformation Playbook', hi: 'वाक्य रूपांतरण नियम (Voice & Clauses)' },
        summary: {
          en: 'Relative pronouns: "who" for people (subject), "whose" (possession), "which/that" for things.',
          hi: 'व्यक्ति कर्ता के लिए "who", वस्तु के लिए "which", व "so...that" से "too...to" रूपांतरण।',
        },
        keyPoints: [
          { en: 'Never use "will" inside an "if" or "unless" conditional clause.', hi: 'If या Unless वाले क्लॉज़ में भविष्यकाल (will) का प्रयोग नहीं करते।' },
        ],
      },
    ],
    questionIds: ['10-en-10', '10-en-12', '10-en-15', '10-en-tricky-2', '10-en-m-8'],
    secondsPerQuestion: 10,
    baseXP: 175,
    mapCoords: { x: 90, y: 40 },
  },

  // ==================== CLASS 10 · MATHS (8 STAGES COVERING ALL 14 CHAPTERS) ====================
  {
    id: '10-ma-1',
    grade: '10',
    subjectId: 'maths',
    subsectionId: 'maths-algebra',
    order: 1,
    chapterCode: { en: 'NCERT Maths · Ch. 1', hi: 'NCERT गणित · अध्याय 1' },
    title: {
      en: 'Ch. 1: Real Numbers (Euclid, HCF×LCM & Irrationality)',
      hi: 'अध्याय 1: वास्तविक संख्याएँ (HCF × LCM व अपरिमेयता)',
    },
    bossName: { en: 'Prime Factor Warden', hi: 'अभाज्य गुणनखंड रक्षक' },
    summaryPoints: [
      {
        en: 'Fundamental Theorem of Arithmetic: HCF(a,b) × LCM(a,b) = a × b; HCF(2, 4) = 2.',
        hi: 'HCF(a,b) × LCM(a,b) = a × b; सबसे छोटी अभाज्य (2) व भाज्य (4) संख्या का HCF = 2।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 1 Key Theorems & Traps', hi: 'अध्याय 1 मुख्य सूत्र व प्रमेय' },
        summary: {
          en: '√2, √3, √5 are irrational. Every composite number factors uniquely as a product of primes.',
          hi: 'अंकगणित की आधारभूत प्रमेय से प्रत्येक भाज्य संख्या अभाज्य गुणनफल के रूप में अद्वितीय होती है।',
        },
        keyPoints: [
          { en: 'HCF(6, 20) = 2, LCM(6, 20) = 60 → 2 × 60 = 6 × 20.', hi: 'सबसे छोटी अभाज्य संख्या 2 तथा सबसे छोटी भाज्य संख्या 4 का HCF = 2 होता है।' },
        ],
      },
    ],
    questionIds: ['10-ma-1', '10-ma-13', '10-ma-m-12', '10-ma-m-14'],
    secondsPerQuestion: 10,
    baseXP: 120,
    mapCoords: { x: 14, y: 66 },
  },
  {
    id: '10-ma-poly',
    grade: '10',
    subjectId: 'maths',
    subsectionId: 'maths-algebra',
    order: 2,
    chapterCode: { en: 'NCERT Maths · Ch. 2', hi: 'NCERT गणित · अध्याय 2' },
    title: {
      en: 'Ch. 2: Polynomials (Zeroes, Coefficients & Graphs)',
      hi: 'अध्याय 2: बहुपद (शून्यक, गुणांक संबंध व ग्राफ़)',
    },
    bossName: { en: 'Parabola Zero Keeper', hi: 'बहुपद शून्यक प्रहरी' },
    summaryPoints: [
      {
        en: 'Quadratic zeroes: α + β = −b/a and αβ = c/a; number of zeroes = x-axis intersections.',
        hi: 'शून्यकों का योग α + β = −b/a तथा गुणनफल αβ = c/a; ग्राफ़ x-अक्ष को जितनी बार काटे उतने शून्यक।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 2 Polynomial Formulas', hi: 'अध्याय 2 बहुपद सूत्र' },
        summary: {
          en: 'Form quadratic polynomial as k[x² − (α+β)x + αβ]. Degree of linear = 1, quadratic = 2, cubic = 3.',
          hi: 'द्विघात बहुपद x² − (α+β)x + αβ; x-अक्ष प्रतिच्छेद बिंदु = वास्तविक शून्यकों की संख्या।',
        },
        keyPoints: [
          { en: 'For x² − 5x + 6: α + β = 5 and αβ = 6.', hi: 'x² − 5x + 6 के लिए योग = 5 व गुणनफल = 6।' },
        ],
      },
    ],
    questionIds: ['10-ma-2', '10-ma-m-1', '10-ma-m-2', '10-ma-m-15'],
    secondsPerQuestion: 10,
    baseXP: 125,
    mapCoords: { x: 24, y: 44 },
  },
  {
    id: '10-ma-2',
    grade: '10',
    subjectId: 'maths',
    subsectionId: 'maths-algebra',
    order: 3,
    chapterCode: { en: 'NCERT Maths · Ch. 3 & 4', hi: 'NCERT गणित · अध्याय 3 व 4' },
    title: {
      en: 'Ch. 3 Linear Equations & Ch. 4 Quadratic Equations',
      hi: 'अध्याय 3: दो चर रैखिक समीकरण व अध्याय 4: द्विघात समीकरण',
    },
    bossName: { en: 'Algebra Forge Golem', hi: 'बीजगणित महाबली' },
    summaryPoints: [
      {
        en: 'a₁/a₂ ≠ b₁/b₂ (Unique); a₁/a₂ = b₁/b₂ ≠ c₁/c₂ (Parallel/No Solution); all equal (Coincident).',
        hi: 'प्रतिच्छेदी (अद्वितीय हल), समांतर (कोई हल नहीं) व संपाती (अनंत हल) की शर्तें।',
      },
      {
        en: 'Quadratic Discriminant D = b² − 4ac: D = 0 yields two equal real roots.',
        hi: 'विविक्तकर D = b² − 4ac = 0 होने पर दो बराबर वास्तविक मूल होते हैं।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 3 & 4 Consistency & Discriminant', hi: 'अध्याय 3 व 4 समीकरण शर्तें' },
        summary: {
          en: 'D > 0 gives 2 distinct real roots, D = 0 gives equal real roots, D < 0 gives no real roots.',
          hi: 'Sridharacharya formula: x = [−b ± √(b² − 4ac)] / 2a।',
        },
        keyPoints: [
          { en: 'Parallel lines condition: a₁/a₂ = b₁/b₂ ≠ c₁/c₂.', hi: 'समांतर रेखाएँ (कोई हल नहीं): a₁/a₂ = b₁/b₂ ≠ c₁/c₂।' },
        ],
      },
    ],
    questionIds: ['10-ma-8', '10-ma-3', '10-ma-m-3', '10-ma-m-9'],
    secondsPerQuestion: 10,
    baseXP: 135,
    mapCoords: { x: 36, y: 66 },
  },
  {
    id: '10-ma-ap',
    grade: '10',
    subjectId: 'maths',
    subsectionId: 'maths-algebra',
    order: 4,
    chapterCode: { en: 'NCERT Maths · Ch. 5', hi: 'NCERT गणित · अध्याय 5' },
    title: {
      en: 'Ch. 5: Arithmetic Progressions (nth Term & Sum Sₙ)',
      hi: 'अध्याय 5: समांतर श्रेढ़ियाँ (nवाँ पद व योगफल Sₙ)',
    },
    bossName: { en: 'Sequence Progression Warden', hi: 'समांतर श्रेढ़ी प्रहरी' },
    summaryPoints: [
      {
        en: 'AP nth term: aₙ = a + (n−1)d; Sum of n terms: Sₙ = (n/2)[2a + (n−1)d] = (n/2)(a + l).',
        hi: 'AP का nवाँ पद aₙ = a + (n−1)d; प्रथम n पदों का योग Sₙ = (n/2)[2a + (n−1)d]।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 5 AP Key Formulas', hi: 'अध्याय 5 AP सूत्र' },
        summary: {
          en: 'Common difference d = a₂ − a₁; Sum of first n positive integers = n(n+1)/2.',
          hi: 'प्रथम n प्राकृत संख्याओं का योग n(n+1)/2 होता है।',
        },
        keyPoints: [
          { en: 'Sₙ − Sₙ₋₁ = aₙ retrieves the nth term directly from the sum formula.', hi: 'S₁₀ = 10 × 11 / 2 = 55।' },
        ],
      },
    ],
    questionIds: ['10-ma-4', '10-ma-m-4', '10-ma-m-13', '10-ma-m-16'],
    secondsPerQuestion: 10,
    baseXP: 140,
    mapCoords: { x: 48, y: 38 },
  },
  {
    id: '10-ma-3',
    grade: '10',
    subjectId: 'maths',
    subsectionId: 'maths-geometry-trig',
    order: 5,
    chapterCode: { en: 'NCERT Maths · Ch. 6 & 7', hi: 'NCERT गणित · अध्याय 6 व 7' },
    title: {
      en: 'Ch. 6 Similar Triangles (BPT) & Ch. 7 Coordinate Geometry',
      hi: 'अध्याय 6: त्रिभुज (थेल्स प्रमेय) व अध्याय 7: निर्देशांक ज्यामिति',
    },
    bossName: { en: 'Coordinate Thales Warden', hi: 'थेल्स व निर्देशांक रक्षक' },
    summaryPoints: [
      {
        en: 'Thales Theorem (BPT): Line parallel to one side divides the other two in equal ratio (AD/DB = AE/EC).',
        hi: 'थेल्स प्रमेय (BPT): त्रिभुज की एक भुजा के समांतर रेखा अन्य दोनों भुजाओं को समान अनुपात में बाँटती है।',
      },
      {
        en: 'Distance = √[(x₂−x₁)² + (y₂−y₁)²]; From origin O(0,0): √(x² + y²); Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2).',
        hi: 'मूल बिंदु से दूरी √(x² + y²); मध्यबिंदु = ((x₁+x₂)/2, (y₁+y₂)/2)।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 6 & 7 Theorems & Section Formula', hi: 'अध्याय 6 व 7 प्रमेय एवं विभाजन सूत्र' },
        summary: {
          en: 'All circles are similar; all squares are similar; Section formula: ((m₁x₂+m₂x₁)/(m₁+m₂), (m₁y₂+m₂y₁)/(m₁+m₂)).',
          hi: 'सभी वृत्त व वर्ग समरूप होते हैं; थेल्स प्रमेय पर आधारित 4-नंबर प्रश्न बोर्ड में आते हैं।',
        },
        keyPoints: [
          { en: 'Distance of P(3, 4) from origin = √(3² + 4²) = 5.', hi: 'बिंदु P(3, 4) की मूल बिंदु से दूरी = 5 इकाई।' },
        ],
      },
    ],
    questionIds: ['10-ma-5', '10-ma-m-5', '10-ma-m-11', '10-ma-tricky-1'],
    secondsPerQuestion: 10,
    baseXP: 150,
    mapCoords: { x: 60, y: 64 },
  },
  {
    id: '10-ma-4',
    grade: '10',
    subjectId: 'maths',
    subsectionId: 'maths-geometry-trig',
    order: 6,
    chapterCode: { en: 'NCERT Maths · Ch. 8 & 9', hi: 'NCERT गणित · अध्याय 8 व 9' },
    title: {
      en: 'Ch. 8 Intro to Trigonometry & Ch. 9 Heights & Distances',
      hi: 'अध्याय 8: त्रिकोणमिति का परिचय व अध्याय 9: ऊँचाई एवं दूरी',
    },
    bossName: { en: 'Trigon Titan', hi: 'त्रिकोणमिति दानव' },
    summaryPoints: [
      {
        en: 'Three Pythagorean identities: sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ, 1 + cot²θ = cosec²θ.',
        hi: 'सर्वसमिकाएँ: sin²θ + cos²θ = 1, sec²θ − tan²θ = 1, cosec²θ − cot²θ = 1।',
      },
      {
        en: 'Angle of Elevation = Angle of Depression; if height = shadow length, Sun elevation = 45°.',
        hi: 'उन्नयन कोण = अवनमन कोण; ऊँचाई और छाया बराबर होने पर कोण = 45°।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Trig Table & Ch. 9 Applications', hi: 'त्रिकोणमितीय सारणी व ऊँचाई-दूरी नियम' },
        summary: {
          en: 'Memorize standard values (0°, 30°, 45°, 60°, 90°). Remember 9(sec²A − tan²A) = 9(1) = 9.',
          hi: '9 sec²A − 9 tan²A = 9; sin 30° = ½, tan 45° = 1, tan 60° = √3।',
        },
        keyPoints: [
          { en: 'tan θ = sin θ / cos θ; sec θ = 1 / cos θ; tan 90° is undefined.', hi: 'tan 45° = 1, cot 45° = 1, sin 60° = √3/2।' },
        ],
      },
    ],
    questionIds: ['10-ma-7', '10-ma-9', '10-ma-15', '10-ma-m-6'],
    secondsPerQuestion: 10,
    baseXP: 160,
    mapCoords: { x: 70, y: 38 },
  },
  {
    id: '10-ma-circles',
    grade: '10',
    subjectId: 'maths',
    subsectionId: 'maths-mensuration-stats',
    order: 7,
    chapterCode: { en: 'NCERT Maths · Ch. 10 & 11', hi: 'NCERT गणित · अध्याय 10 व 11' },
    title: {
      en: 'Ch. 10 Circles (Tangents) & Ch. 11 Areas Related to Circles',
      hi: 'अध्याय 10: वृत्त (स्पर्श रेखाएँ) व अध्याय 11: वृत्तों से संबंधित क्षेत्रफल',
    },
    bossName: { en: 'Tangent Arc Sentinel', hi: 'स्पर्शरेखा व त्रिज्यखंड प्रहरी' },
    summaryPoints: [
      {
        en: 'Tangents from external point are equal (Theorem 10.2) & ⊥ to radius; at most 2 parallel tangents to a circle.',
        hi: 'बाह्य बिंदु से दोनों स्पर्श रेखाएँ बराबर व त्रिज्या पर लंब होती हैं; अधिकतम 2 समांतर स्पर्श रेखाएँ संभव।',
      },
      {
        en: 'Sector area = (θ/360)πr², Arc length = (θ/360)2πr.',
        hi: 'त्रिज्यखंड क्षेत्रफल (θ/360)πr² व चाप लंबाई (θ/360)2πr।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 10–11 Tangents & Sector Areas', hi: 'अध्याय 10–11 प्रमेय व सूत्र' },
        summary: {
          en: 'From an interior point, 0 tangents; on circle, 1; from outside, 2 tangents can be drawn.',
          hi: 'वृत्त को 2 बिंदुओं पर काटने वाली रेखा "छेदक रेखा (Secant)" कहलाती है।',
        },
        keyPoints: [
          { en: 'Tangent touches circle at exactly 1 point (Point of Contact).', hi: 'स्पर्श बिंदु पर स्पर्श रेखा त्रिज्या के साथ 90° कोण बनाती है।' },
        ],
      },
    ],
    questionIds: ['10-ma-6', '10-ma-14', '10-ma-12', '10-ma-m-7'],
    secondsPerQuestion: 10,
    baseXP: 165,
    mapCoords: { x: 80, y: 60 },
  },
  {
    id: '10-ma-5',
    grade: '10',
    subjectId: 'maths',
    subsectionId: 'maths-mensuration-stats',
    order: 8,
    chapterCode: { en: 'NCERT Maths · Ch. 12–14', hi: 'NCERT गणित · अध्याय 12–14' },
    title: {
      en: 'Ch. 12 Volumes, Ch. 13 Statistics & Ch. 14 Probability',
      hi: 'अध्याय 12: आयतन, 13: सांख्यिकी व 14: प्रायिकता',
    },
    bossName: { en: 'Oracle of Chance', hi: 'सांख्यिकी व प्रायिकता सम्राट' },
    summaryPoints: [
      {
        en: 'Cylinder V = πr²h, Cone V = ⅓πr²h, Hemisphere TSA = 3πr²; Empirical Rule: Mode = 3 Median − 2 Mean.',
        hi: 'ठोस अर्धगोला TSA = 3πr²; बहुलक = 3 माध्यिका − 2 माध्य; निश्चित घटना P=1, असंभव=0।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Mensuration, Statistics & Probability Summary', hi: 'क्षेत्रमिति, सांख्यिकी व प्रायिकता सूत्र' },
        summary: {
          en: 'P(E) + P(not E) = 1 always; Probability can never be negative or > 1.',
          hi: 'ठोस अर्धगोले का संपूर्ण पृष्ठीय क्षेत्रफल 3πr² व वक्र पृष्ठ 2πr² होता है।',
        },
        keyPoints: [
          { en: 'Class mark (मध्य-बिंदु) = (Upper limit + Lower limit) / 2.', hi: 'वर्ग चिह्न = (ऊपरी सीमा + निचली सीमा) / 2।' },
        ],
      },
    ],
    questionIds: ['10-ma-10', '10-ma-11', '10-ma-m-8', '10-ma-m-10', '10-ma-tricky-2'],
    secondsPerQuestion: 10,
    baseXP: 175,
    mapCoords: { x: 90, y: 40 },
  },

  // ==================== CLASS 10 · PHYSICS (5 STAGES COVERING SCIENCE CH. 9–12) ====================
  {
    id: '10-ph-1',
    grade: '10',
    subjectId: 'physics',
    subsectionId: 'optics-section',
    order: 1,
    chapterCode: { en: 'NCERT Science · Ch. 9A', hi: 'NCERT विज्ञान · पाठ 9A' },
    title: { en: 'Ch. 9A: Light — Reflection & Spherical Mirrors', hi: 'अध्याय 9A: प्रकाश — परावर्तन एवं गोलीय दर्पण' },
    bossName: { en: 'Mirror Mirage Keeper', hi: 'दर्पण प्रतिबिंब प्रहरी' },
    summaryPoints: [
      {
        en: 'Mirror Formula: 1/v + 1/u = 1/f; f = R/2; Magnification m = −v/u = hᵢ/hₒ.',
        hi: 'दर्पण सूत्र: 1/v + 1/u = 1/f; फोकस दूरी f = R/2।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Concave vs Convex Mirror Uses & Sign Convention', hi: 'अवतल बनाम उत्तल दर्पण उपयोग व चिह्न परिपाटी' },
        summary: {
          en: 'Concave mirrors form magnified erect images between P & F (used by dentists, shaving, headlights); Convex gives wide erect rear-view.',
          hi: 'दाढ़ी बनाने/दंत चिकित्सक/सौर भट्टी में अवतल दर्पण; वाहनों के साइड मिरर में उत्तल दर्पण।',
        },
        keyPoints: [
          { en: 'Focal length of Concave mirror is negative (−); Convex mirror is positive (+).', hi: 'अवतल दर्पण की फोकस दूरी ऋणात्मक (−) तथा उत्तल की धनात्मक (+) होती है।' },
        ],
      },
    ],
    questionIds: ['10-ph-2', '10-ph-5', '10-ph-13', '10-ph-m-1'],
    secondsPerQuestion: 10,
    baseXP: 125,
    mapCoords: { x: 14, y: 66 },
  },
  {
    id: '10-ph-2',
    grade: '10',
    subjectId: 'physics',
    subsectionId: 'optics-section',
    order: 2,
    chapterCode: { en: 'NCERT Science · Ch. 9B', hi: 'NCERT विज्ञान · पाठ 9B' },
    title: { en: 'Ch. 9B: Light — Refraction & Lens Power', hi: 'अध्याय 9B: प्रकाश — अपवर्तन एवं लेंस क्षमता' },
    bossName: { en: 'Refraction Prism Warden', hi: 'अपवर्तन लेंस रक्षक' },
    summaryPoints: [
      {
        en: 'Snell’s Law: sin i / sin r = n₂₁; Lens Formula: 1/v − 1/u = 1/f; Power P = 1/f (in metres) in Dioptre (D).',
        hi: 'लेंस सूत्र 1/v − 1/u = 1/f; क्षमता P = 1/f (डायोप्टर D)।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Refractive Index & Lens Power Notes', hi: 'अपवर्तनांक व लेंस क्षमता नोट्स' },
        summary: {
          en: 'Speed of light in vacuum c = 3 × 10⁸ m/s. Refractive index of diamond is highest (~2.42).',
          hi: 'निर्वात में प्रकाश की चाल 3 × 10⁸ m/s; हीरे का अपवर्तनांक सर्वाधिक (2.42) होता है।',
        },
        keyPoints: [
          { en: 'Lens of f = +50 cm = +0.5 m has Power P = +2.0 D (Convex).', hi: 'फोकस दूरी 2 मीटर वाले अवतल लेंस की क्षमता −0.5 D होगी।' },
        ],
      },
    ],
    questionIds: ['10-ph-1', '10-ph-12', '10-ph-14', '10-ph-m-2'],
    secondsPerQuestion: 10,
    baseXP: 140,
    mapCoords: { x: 34, y: 40 },
  },
  {
    id: '10-ph-3',
    grade: '10',
    subjectId: 'physics',
    subsectionId: 'optics-section',
    order: 3,
    chapterCode: { en: 'NCERT Science · Ch. 10', hi: 'NCERT विज्ञान · पाठ 10' },
    title: { en: 'Ch. 10: Human Eye & Colourful World', hi: 'अध्याय 10: मानव नेत्र तथा रंगबिरंगा संसार' },
    bossName: { en: 'Spectrum Eye Sentinel', hi: 'नेत्र व वर्णक्रम प्रहरी' },
    summaryPoints: [
      {
        en: 'Myopia (near-sighted) → Concave lens; Hypermetropia (far-sighted) → Convex lens; Least distance = 25 cm.',
        hi: 'निकट दृष्टि दोष → अवतल लेंस; दूर दृष्टि दोष → उत्तल लेंस; स्पष्ट दृष्टि दूरी = 25 cm।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Vision Defects, Dispersion & Atmospheric Scattering', hi: 'दृष्टि दोष, वर्ण विक्षेपण व प्रकीर्णन' },
        summary: {
          en: 'Twinkling of stars is due to atmospheric refraction; blue sky & red sunrise are due to scattering.',
          hi: 'तारों का टिमटिमाना वायुमंडलीय अपवर्तन से, तथा आकाश का नीला रंग प्रकीर्णन से होता है।',
        },
        keyPoints: [
          { en: 'Violet bends the most (shortest λ); Red bends the least (longest λ) in a glass prism.', hi: 'प्रिज्म में बैंगनी रंग का विचलन सर्वाधिक व लाल रंग का सबसे कम होता है।' },
        ],
      },
    ],
    questionIds: ['10-ph-3', '10-ph-8', '10-ph-10', '10-ph-m-3'],
    secondsPerQuestion: 10,
    baseXP: 150,
    mapCoords: { x: 54, y: 64 },
  },
  {
    id: '10-ph-4',
    grade: '10',
    subjectId: 'physics',
    subsectionId: 'electromagnetism-section',
    order: 4,
    chapterCode: { en: 'NCERT Science · Ch. 11', hi: 'NCERT विज्ञान · पाठ 11' },
    title: { en: 'Ch. 11: Electricity — Circuits, Joule Heating & kWh', hi: 'अध्याय 11: विद्युत — ओम का नियम, प्रतिरोध व ऊर्जा' },
    bossName: { en: 'Ohm Volt Guardian', hi: 'ओम-वोल्ट महाप्रहरी' },
    summaryPoints: [
      {
        en: 'V = IR, R = ρL/A; Series R = R₁+R₂; Parallel 1/R = 1/R₁+1/R₂; 1 kWh = 3.6 × 10⁶ J.',
        hi: 'V = IR, श्रेणीक्रम R = R₁+R₂, समांतर 1/R = 1/R₁+1/R₂, 1 kWh = 3.6 × 10⁶ J।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Resistance Stretch Trap & Electric Power', hi: 'प्रतिरोध खिंचाव नियम व विद्युत शक्ति' },
        summary: {
          en: 'Stretching a wire to double length (volume constant) halves area, multiplying Resistance by n² = 4×!',
          hi: 'तार को खींचकर लंबाई दोगुनी करने पर क्षेत्रफल आधा होता है, अतः नया प्रतिरोध 4 गुना हो जाता है।',
        },
        keyPoints: [
          { en: 'P = VI = I²R = V²/R; Ammeter is connected in Series, Voltmeter in Parallel.', hi: 'ऐमीटर श्रेणीक्रम में तथा वोल्टमीटर समांतर क्रम में जुड़ता है; फ्यूज़ सदैव लाइव तार में श्रेणी में।' },
        ],
      },
    ],
    questionIds: ['10-ph-7', '10-ph-4', '10-ph-9', '10-ph-tricky-1'],
    secondsPerQuestion: 10,
    baseXP: 165,
    mapCoords: { x: 72, y: 36 },
  },
  {
    id: '10-ph-5',
    grade: '10',
    subjectId: 'physics',
    subsectionId: 'electromagnetism-section',
    order: 5,
    chapterCode: { en: 'NCERT Science · Ch. 12', hi: 'NCERT विज्ञान · पाठ 12' },
    title: { en: 'Ch. 12: Magnetic Effects of Electric Current', hi: 'अध्याय 12: विद्युत धारा के चुंबकीय प्रभाव' },
    bossName: { en: 'Dynamo Coil Sovereign', hi: 'चुंबकीय क्षेत्र अधिपति' },
    summaryPoints: [
      {
        en: 'Magnetic field lines form closed loops and NEVER intersect; Fleming’s Left-Hand Rule gives motor force.',
        hi: 'चुंबकीय क्षेत्र रेखाएँ बंद वक्र होती हैं और कभी एक-दूसरे को नहीं काटतीं।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Solenoid, Left-Hand Rule & Domestic Wiring', hi: 'परिनालिका, वामहस्त नियम व घरेलू परिपथ' },
        summary: {
          en: 'Indian domestic AC is 220V at 50 Hz. Red = Live, Black = Neutral, Green = Earth wire.',
          hi: 'भारत में घरेलू AC 220V, 50Hz होती है; हरा तार भूसंपर्क (Earthing) सुरक्षा हेतु होता है।',
        },
        keyPoints: [
          { en: 'Field inside a current-carrying solenoid is uniform and parallel to its axis.', hi: 'धारावाही परिनालिका के भीतर चुंबकीय क्षेत्र एकसमान होता है।' },
        ],
      },
    ],
    questionIds: ['10-ph-6', '10-ph-11', '10-ph-15', '10-ph-tricky-2'],
    secondsPerQuestion: 10,
    baseXP: 175,
    mapCoords: { x: 86, y: 58 },
  },

  // ==================== CLASS 10 · CHEMISTRY (5 STAGES COVERING SCIENCE CH. 1–4) ====================
  {
    id: '10-ch-1',
    grade: '10',
    subjectId: 'chemistry',
    subsectionId: 'chem-inorganic',
    order: 1,
    chapterCode: { en: 'NCERT Science · Ch. 1', hi: 'NCERT विज्ञान · पाठ 1' },
    title: { en: 'Ch. 1: Chemical Reactions, Redox & Rancidity', hi: 'अध्याय 1: रासायनिक अभिक्रियाएँ एवं समीकरण' },
    bossName: { en: 'Reaction Catalyst Guardian', hi: 'अभिक्रिया उत्प्रेरक प्रहरी' },
    summaryPoints: [
      {
        en: 'Respiration is exothermic; CaO + H₂O → Ca(OH)₂; Nitrogen prevents chip rancidity; BaCl₂ + Na₂SO₄ → BaSO₄↓.',
        hi: 'श्वसन ऊष्माक्षेपी अभिक्रिया है; चिप्स में नाइट्रोजन गैस भरी जाती है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '5 Reaction Types & Redox Rules', hi: '5 अभिक्रिया प्रकार व रेडॉक्स नियम' },
        summary: {
          en: 'Combination, Decomposition (AgBr in B&W photography), Displacement, Double Displacement (BaSO₄ white ppt), Redox.',
          hi: 'संयोजन, वियोजन (AgBr सूर्यप्रकाश में श्वेत-श्याम फोटोग्राफी), विस्थापन, द्विविस्थापन व उपचयन-अपचयन।',
        },
        keyPoints: [
          { en: 'Loss of oxygen / gain of hydrogen = Reduction; Gain of oxygen = Oxidation.', hi: 'ऑक्सीजन की वृद्धि = उपचयन (Oxidation); कमी = अपचयन (Reduction)।' },
        ],
      },
    ],
    questionIds: ['10-ch-2', '10-ch-13', '10-ch-10', '10-ch-m-1'],
    secondsPerQuestion: 10,
    baseXP: 125,
    mapCoords: { x: 14, y: 66 },
  },
  {
    id: '10-ch-2',
    grade: '10',
    subjectId: 'chemistry',
    subsectionId: 'chem-inorganic',
    order: 2,
    chapterCode: { en: 'NCERT Science · Ch. 2A', hi: 'NCERT विज्ञान · पाठ 2A' },
    title: { en: 'Ch. 2A: Acids, Bases & pH Scale', hi: 'अध्याय 2A: अम्ल, क्षारक एवं pH स्केल' },
    bossName: { en: 'Litmus Alchemist Warden', hi: 'लिटमस व pH रक्षक' },
    summaryPoints: [
      {
        en: 'Acids give H⁺ only in aqueous medium (Dry HCl gas does not change dry litmus!); Ant sting = Methanoic acid.',
        hi: 'शुष्क HCl गैस सूखे लिटमस का रंग नहीं बदलती; चींटी के डंक में मेथेनॉइक अम्ल होता है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'pH in Daily Life & Natural Acids Table', hi: 'दैनिक जीवन में pH व प्राकृतिक अम्ल' },
        summary: {
          en: 'Tooth decay starts below pH 5.5; Acid rain pH < 5.6; Curd = Lactic acid; Vinegar = Acetic acid; Tomato = Oxalic acid.',
          hi: 'दंत-क्षय pH 5.5 से कम पर; सिरका = ऐसीटिक अम्ल; इमली = टार्टरिक; दही = लैक्टिक; टमाटर = ऑक्सैलिक।',
        },
        keyPoints: [
          { en: 'Always add acid slowly to water because dilution is highly exothermic.', hi: 'तनुकरण ऊष्माक्षेपी होने से अम्ल को धीरे-धीरे जल में मिलाते हैं।' },
        ],
      },
    ],
    questionIds: ['10-ch-1', '10-ch-6', '10-ch-14', '10-ch-m-2', '10-ch-tricky-2'],
    secondsPerQuestion: 10,
    baseXP: 140,
    mapCoords: { x: 34, y: 40 },
  },
  {
    id: '10-ch-3',
    grade: '10',
    subjectId: 'chemistry',
    subsectionId: 'chem-inorganic',
    order: 3,
    chapterCode: { en: 'NCERT Science · Ch. 2B', hi: 'NCERT विज्ञान · पाठ 2B' },
    title: { en: 'Ch. 2B: Chlor-Alkali Salts, Bleaching Powder & POP', hi: 'अध्याय 2B: बेकिंग सोडा, विरंजक चूर्ण व POP' },
    bossName: { en: 'Crystal Salt Sentinel', hi: 'लवण क्रिस्टल प्रहरी' },
    summaryPoints: [
      {
        en: 'Bleaching powder CaOCl₂; Baking soda NaHCO₃; Washing soda Na₂CO₃·10H₂O; POP CaSO₄·½H₂O.',
        hi: 'विरंजक चूर्ण CaOCl₂; बेकिंग सोडा NaHCO₃; धावन सोडा Na₂CO₃·10H₂O; POP = CaSO₄·½H₂O।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '4 Essential Board Salts & Equations', hi: 'चार प्रमुख लवण व निर्माण समीकरण' },
        summary: {
          en: 'Heating Gypsum (CaSO₄·2H₂O) at 373 K yields POP; Chlor-alkali electrolysis of brine gives NaOH + Cl₂ + H₂.',
          hi: 'जिप्सम को 373 K पर गर्म करने से प्लास्टर ऑफ पेरिस बनता है।',
        },
        keyPoints: [
          { en: 'Washing soda removes permanent hardness of water.', hi: 'धावन सोडा जल की स्थायी कठोरता दूर करने में प्रयुक्त होता है।' },
        ],
      },
    ],
    questionIds: ['10-ch-3', '10-ch-7', '10-ch-15', '10-ch-m-4'],
    secondsPerQuestion: 10,
    baseXP: 150,
    mapCoords: { x: 54, y: 64 },
  },
  {
    id: '10-ch-4',
    grade: '10',
    subjectId: 'chemistry',
    subsectionId: 'chem-carbon',
    order: 4,
    chapterCode: { en: 'NCERT Science · Ch. 3', hi: 'NCERT विज्ञान · पाठ 3' },
    title: { en: 'Ch. 3: Metals, Non-Metals, Alloys & Extraction', hi: 'अध्याय 3: धातु एवं अधातु — निष्कर्षण व मिश्रधातु' },
    bossName: { en: 'Metallurgy Forge Golem', hi: 'धातु कर्म महाप्रहरी' },
    summaryPoints: [
      {
        en: 'Mercury = liquid metal; Bromine = liquid non-metal; Brass (Cu+Zn), Bronze (Cu+Sn); Al₂O₃ & ZnO = Amphoteric.',
        hi: 'पारा द्रव धातु, ब्रोमीन द्रव अधातु; पीतल = Cu+Zn, काँसा = Cu+Sn; Al₂O₃ व ZnO उभयधर्मी।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Reactivity Series, Roasting vs Calcination', hi: 'सक्रियता श्रेढ़ी, भर्जन व निस्तापन' },
        summary: {
          en: 'Roasting heats sulphide ores in excess air; Calcination heats carbonate ores in limited air. Thermit reaction uses Fe₂O₃ + 2Al.',
          hi: 'सल्फाइड अयस्क का भर्जन (वायु की उपस्थिति) व कार्बोनेट अयस्क का निस्तापन (सीमित वायु) किया जाता है।',
        },
        keyPoints: [
          { en: 'Aqua Regia = 3 parts conc. HCl + 1 part conc. HNO₃ (dissolves Gold & Platinum).', hi: 'अम्लराज (Aqua Regia) = 3 HCl : 1 HNO₃ सोने को गला सकता है।' },
        ],
      },
    ],
    questionIds: ['10-ch-4', '10-ch-8', '10-ch-11', '10-ch-m-3'],
    secondsPerQuestion: 10,
    baseXP: 165,
    mapCoords: { x: 72, y: 36 },
  },
  {
    id: '10-ch-5',
    grade: '10',
    subjectId: 'chemistry',
    subsectionId: 'chem-carbon',
    order: 5,
    chapterCode: { en: 'NCERT Science · Ch. 4', hi: 'NCERT विज्ञान · पाठ 4' },
    title: { en: 'Ch. 4: Carbon & Compounds, Functional Groups & Soaps', hi: 'अध्याय 4: कार्बन एवं उसके यौगिक' },
    bossName: { en: 'Carbon Forge Lord', hi: 'कार्बन स्वामी' },
    summaryPoints: [
      {
        en: 'Alkanes CₙH₂ₙ₊₂, Alkenes CₙH₂ₙ, Alkynes CₙH₂ₙ₋₂; Homologous step = –CH₂– (14 u); Ketone –CO–, Acid –COOH.',
        hi: 'समजातीय श्रेढ़ी में –CH₂– (14 u) का अंतर होता है; कीटोन (>C=O) व कार्बोक्सिलिक अम्ल (–COOH)।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ethanol, Ethanoic Acid & Micelle Action', hi: 'एथेनॉल, एथेनॉइक अम्ल व साबुन मिसेल' },
        summary: {
          en: 'Esterification: CH₃COOH + C₂H₅OH → CH₃COOC₂H₅ + H₂O (sweet fruity smell); Saponification produces soap + glycerol.',
          hi: 'एस्टरीकरण से मीठी गंध वाला एस्टर बनता है; कठोर जल में साबुन की जगह अपमार्जक (Detergent) प्रभावी रहते हैं।',
        },
        keyPoints: [
          { en: 'Smallest possible Ketone is Propanone (CH₃COCH₃, 3 carbons), never 1 or 2 carbons!', hi: 'सबसे छोटा कीटोन प्रोपेनोन (3 कार्बन) होता है—यह सबसे प्रमुख ट्रिकी बोर्ड प्रश्न है।' },
        ],
      },
    ],
    questionIds: ['10-ch-5', '10-ch-9', '10-ch-12', '10-ch-tricky-1'],
    secondsPerQuestion: 10,
    baseXP: 175,
    mapCoords: { x: 86, y: 58 },
  },
];
