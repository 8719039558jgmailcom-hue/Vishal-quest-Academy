import { ChapterNodeDefinition } from '../types/quiz';

// Complete Class 10th New MP Board NCERT Syllabus Nodes (Zero Skipped Chapters)
// Organized by official NCERT books & subsections, each with dedicated Topic Study Notes.
export const SYLLABUS_NODES_10: ChapterNodeDefinition[] = [
  // ==================== CLASS 10 · HINDI ====================
  {
    id: '10-hi-k1',
    grade: '10',
    subjectId: 'hindi',
    subsectionId: 'kavya-khand',
    order: 1,
    chapterCode: { en: 'Kshitij-2 Kavya · Ch. 1–2', hi: 'क्षितिज-2 काव्य · पाठ 1–2' },
    title: {
      en: 'Surdas ke Pad & Ram-Lakshman-Parashuram Samvad',
      hi: 'सूरदास के पद एवं राम-लक्ष्मण-परशुराम संवाद',
    },
    bossName: { en: 'Sur-Tulasi Kavya Guardian', hi: 'सूर-तुलसी काव्य प्रहरी' },
    summaryPoints: [
      {
        en: 'Gopis address Uddhav as "Badbhagi" ironically because he remains untouched by Krishna’s divine love.',
        hi: 'गोपियाँ उद्धव को व्यंग्य में "बड़भागी" कहती हैं क्योंकि वे प्रेम-बंधन से अछूते हैं।',
      },
      {
        en: 'Tulsidas uses Awadhi language and Chaupai-Doha metre to depict Lakshman’s fearless wit before Parashuram.',
        hi: 'तुलसीदास ने अवधी भाषा तथा चौपाई-दोहा छंद में लक्ष्मण-परशुराम संवाद रचा है।',
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
          { en: 'Language: Braj Bhasha · Style: Geeya Pad', hi: 'भाषा: ब्रजभाषा · प्रमुख रस: वियोग शृंगार' },
          { en: 'Metaphors: Lotus leaf in water (प्रीति नदी में पाँव न बोरयो) and Gur-Chanti (ants stuck to jaggery).', hi: 'दृष्टांत: जल में कमल का पत्ता व गुड़ से चिपकी चींटियाँ।' },
        ],
        examTip: { en: 'MP Board PYQ: Who is called "Badbhagi"? → Uddhav.', hi: 'बोर्ड मुख्य प्रश्न: "बड़भागी" किसे कहा गया? → उद्धव को।' },
      },
      {
        topicTitle: { en: '2. Ram-Lakshman-Parashuram Samvad', hi: '2. राम-लक्ष्मण-परशुराम संवाद (तुलसीदास)' },
        summary: {
          en: 'Taken from Balakand of Ramcharitmanas after Ram breaks Shiva’s bow at Sita’s Swayamvara.',
          hi: 'रामचरितमानस के बालकांड से उद्धृत; शिव-धनुष भंग के बाद परशुराम का क्रोध व लक्ष्मण का व्यंग्य।',
        },
        keyPoints: [
          { en: 'Shri Ram calms the sage humbly calling himself "your servant", while Lakshman uses Vyangya.', hi: 'श्रीराम विनम्रता से धनुष टूटने की ज़िम्मेदारी "दास" बनकर स्वीकारते हैं।' },
          { en: 'Ras: Veer & Raudra Ras · Chhand: Chaupai & Doha.', hi: 'प्रमुख रस: रौद्र व वीर रस · भाषा: अवधी।' },
        ],
      },
    ],
    questionIds: ['10-hi-1', '10-hi-2'],
    secondsPerQuestion: 45,
    baseXP: 115,
    mapCoords: { x: 14, y: 68 },
  },
  {
    id: '10-hi-k2',
    grade: '10',
    subjectId: 'hindi',
    subsectionId: 'kavya-khand',
    order: 2,
    chapterCode: { en: 'Kshitij-2 Kavya · Ch. 3–6', hi: 'क्षितिज-2 काव्य · पाठ 3–6' },
    title: {
      en: 'Aatmakathya, Utsah, Yah Danturit Muskan & Sangatkar',
      hi: 'आत्मकथ्य, उत्साह, यह दंतुरित मुसकान व संगतकार',
    },
    bossName: { en: 'Chhayavad Lyric Warden', hi: 'छायावाद काव्य रक्षक' },
    summaryPoints: [
      {
        en: 'Jaishankar Prasad declined writing an autobiography for Premchand’s "Hans" magazine.',
        hi: 'जयशंकर प्रसाद ने प्रेमचंद की "हंस" पत्रिका के लिए आत्मकथा न लिखने के कारण "आत्मकथ्य" रचा।',
      },
      {
        en: 'Nirala invokes thunderous clouds in "Utsah" for social awakening; Nagarjun celebrates a baby’s first teeth.',
        hi: 'निराला ने "उत्साह" में बादल को नवसृजन व क्रांति का प्रतीक माना; "संगतकार" सहयोगियों के महत्व को दर्शाता है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '3. Aatmakathya (Jaishankar Prasad)', hi: '3. आत्मकथ्य (जयशंकर प्रसाद)' },
        summary: {
          en: 'Poet views his life as an ordinary empty pitcher (रीति गागर) unworthy of boastful memoir.',
          hi: 'प्रसाद जी अपने जीवन को सरल व अभावग्रस्त मानकर आत्मकथा लिखने से विनम्रतापूर्वक इनकार करते हैं।',
        },
        keyPoints: [
          { en: 'Published in 1932 in "Hans" edited by Munshi Premchand.', hi: 'सन् 1932 में "हंस" पत्रिका के आत्मकथा विशेषांक में प्रकाशित।' },
        ],
      },
      {
        topicTitle: { en: '4–6. Utsah, Danturit Muskan & Sangatkar', hi: '4–6. उत्साह, दंतुरित मुसकान, फसल व संगतकार' },
        summary: {
          en: 'Nirala portrays clouds as destroyers of agony; Nagarjun praises farmers in "Fasal"; Manglesh Dabral honors backing vocalists.',
          hi: '"उत्साह" आह्वान गीत है, "फसल" पानी-मिट्टी-श्रम का रूपांतरण है, और "संगतकार" मुख्य गायक के सहायक की निष्ठा बताता है।',
        },
        keyPoints: [
          { en: 'Sangatkar’s lowered voice during Tar-Saptak preserves the main singer’s dignity—it is humanity, not failure.', hi: 'संगतकार का स्वर जानबूझकर धीमा रखना उसकी विफलता नहीं बल्कि मानवीय संवेदनशीलता है।' },
        ],
      },
    ],
    questionIds: ['10-hi-11', '10-hi-utsah-1'],
    secondsPerQuestion: 42,
    baseXP: 130,
    mapCoords: { x: 32, y: 42 },
  },
  {
    id: '10-hi-g1',
    grade: '10',
    subjectId: 'hindi',
    subsectionId: 'gadya-khand',
    order: 3,
    chapterCode: { en: 'Kshitij-2 Gadya · Ch. 7–9', hi: 'क्षितिज-2 गद्य · पाठ 7–9' },
    title: {
      en: 'Netaji ka Chashma, Balgovin Bhagat & Lakhnavi Andaz',
      hi: 'नेताजी का चश्मा, बालगोबिन भगत व लखनवी अंदाज़',
    },
    bossName: { en: 'Gadya Patra Warden', hi: 'गद्य चरित्र रक्षक' },
    summaryPoints: [
      {
        en: 'Captain Chashmewala was a patriotic lame hawker who fitted frames on Subhas Chandra Bose’s stone statue.',
        hi: 'कैप्टन चश्मेवाला देशभक्ति से प्रेरित होकर नेताजी की मूर्ति पर असली चश्मा लगाता था।',
      },
      {
        en: 'Balgovin Bhagat followed Kabir as "Sahab" and got his widowed daughter-in-law remarried.',
        hi: 'बालगोबिन भगत कबीर को "साहब" मानते थे और उन्होंने विधवा पुत्रवधू का पुनर्विवाह कराया।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '7–8. Netaji ka Chashma & Balgovin Bhagat', hi: '7–8. नेताजी का चश्मा व बालगोबिन भगत' },
        summary: {
          en: 'Swayam Prakash shows everyday patriotism; Benipuri depicts a householder ascetic transcending orthodoxy.',
          hi: 'स्वयं प्रकाश आम नागरिकों की देशभक्ति व बेनीपुरी जी गृहस्थ साधु भगत की समाज-सुधारक भावना दिखाते हैं।',
        },
        keyPoints: [
          { en: 'At the end of Netaji ka Chashma, children put a Sarkanda (reed) spectacle on the statue.', hi: 'कहानी के अंत में बच्चों द्वारा बनाया सरकंडे का चश्मा नई पीढ़ी की देशभक्ति का प्रतीक है।' },
        ],
      },
      {
        topicTitle: { en: '9. Lakhnavi Andaz (Yashpal)', hi: '9. लखनवी अंदाज़ (यशपाल)' },
        summary: {
          en: 'Satire on decaying feudal nobility pretending to be satisfied merely by smelling spiced cucumber slices.',
          hi: 'पतनशील सामंती वर्ग के बनावटी आडंबर और खोखली रईसी पर व्यंग्य।',
        },
        keyPoints: [
          { en: 'Prompts the idea of "Nayi Kahani" without traditional plot.', hi: 'यशपाल व्यंग्य करते हैं कि क्या बिना विचार-पात्र के "नई कहानी" लिखी जा सकती है!' },
        ],
      },
    ],
    questionIds: ['10-hi-3', '10-hi-5', '10-hi-13'],
    secondsPerQuestion: 40,
    baseXP: 140,
    mapCoords: { x: 48, y: 66 },
  },
  {
    id: '10-hi-g2',
    grade: '10',
    subjectId: 'hindi',
    subsectionId: 'gadya-khand',
    order: 4,
    chapterCode: { en: 'Kshitij Gadya Ch. 10–12 & Kritika-2', hi: 'क्षितिज गद्य 10–12 व कृतिका-2' },
    title: {
      en: 'Ek Kahani Yah Bhi, Naubatkhane, Sanskriti & Kritika-2 (Ch. 1–3)',
      hi: 'एक कहानी यह भी, नौबतखाने, संस्कृति एवं कृतिका-2 (पाठ 1–3)',
    },
    bossName: { en: 'Kritika Memoir Sentinel', hi: 'कृतिका स्मृति प्रहरी' },
    summaryPoints: [
      {
        en: 'Manu Bhandari’s teacher Sheela Agrawal ignited her political voice; Bismillah Khan revered Kashi’s Shehnai.',
        hi: 'मन्नू भंडारी पर प्राध्यापिका शीला अग्रवाल का गहरा प्रभाव था; बिस्मिल्ला खाँ काशी के अमर शहनाई वादक थे।',
      },
      {
        en: 'Kritika-2 covers Mata ka Anchal (Tarkeshwarnath), Sana Sana Hath Jodi (Gangtok), and Main Kyon Likhta Hoon.',
        hi: 'कृतिका-2 में माता का अँचल (भोलानाथ/तारकेश्वरनाथ), साना-साना हाथ जोड़ि (गंतोक) व मैं क्यों लिखता हूँ शामिल हैं।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '10–12. Ek Kahani Yah Bhi, Naubatkhane & Sanskriti', hi: '10–12. एक कहानी यह भी, नौबतखाने व संस्कृति' },
        summary: {
          en: 'Covers women’s awakening in Ajmer, Ustad Bismillah Khan’s syncretic devotion, and Civilization vs Culture.',
          hi: 'अजमेर के स्वतंत्रता आंदोलन, उस्ताद बिस्मिल्ला खाँ की संगीत साधना व सभ्यता-संस्कृति का अंतर।',
        },
        keyPoints: [
          { en: 'Sabhyata is the outer result of inner Sanskriti (invention of needle/fire = Sanskriti).', hi: 'आग और सुई का आविष्कार करने वाली कल्याणकारी बुद्धि "संस्कृति" है।' },
        ],
      },
      {
        topicTitle: { en: 'Kritika-2 Complete (Ch. 1, 2 & 3)', hi: 'कृतिका-2 संपूर्ण (पाठ 1, 2 व 3)' },
        summary: {
          en: 'Bholanath runs into his mother’s lap when frightened by a snake; Gangtok is called "city of hardworking kings".',
          hi: 'साँप से डरकर भोलानाथ माँ के अँचल में छिपता है; "गंतोक" को मेहनतकश बादशाहों का शहर कहा गया है।',
        },
        keyPoints: [
          { en: 'Agyeya wrote "Main Kyon Likhta Hoon" reflecting on his Hiroshima experience.', hi: 'अज्ञेय जी ने हिरोशिमा के परमाणु अनुभव से "मैं क्यों लिखता हूँ" की आभ्यंतर विवशता बताई।' },
        ],
      },
    ],
    questionIds: ['10-hi-ekkahani-1', '10-hi-8', '10-hi-14', '10-hi-15'],
    secondsPerQuestion: 40,
    baseXP: 150,
    mapCoords: { x: 64, y: 34 },
  },
  {
    id: '10-hi-ras-alankar',
    grade: '10',
    subjectId: 'hindi',
    subsectionId: 'kavyabodh-vyakaran',
    order: 5,
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
        en: 'Alankar: Anupras (sound repetition), Yamak (word repeated with new meaning), Shlesh (puns), Atishayokti.',
        hi: 'अलंकार: अनुप्रास (वर्ण आवृत्ति), यमक (भिन्न अर्थों में शब्द आवृत्ति), श्लेष (एक शब्द के अनेक अर्थ), अतिशयोक्ति।',
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
          { en: 'Yamak: "कनक-कनक ते सौ गुनी" (gold vs dhatura); Utpreksha markers: मनु, मानो, जनु, जानो.', hi: 'उत्प्रेक्षा के वाचक शब्द: मनु, मानो, जनु, जानो, मनहुँ; अतिशयोक्ति में लोक-सीमा से बढ़ाकर वर्णन।' },
        ],
      },
    ],
    questionIds: ['10-hi-7', '10-hi-9', '10-hi-10', '10-hi-tricky-2'],
    secondsPerQuestion: 35,
    baseXP: 165,
    mapCoords: { x: 78, y: 58 },
  },
  {
    id: '10-hi-vyakaran',
    grade: '10',
    subjectId: 'hindi',
    subsectionId: 'kavyabodh-vyakaran',
    order: 6,
    chapterCode: { en: 'Vyakaran · Complete Grammar', hi: 'हिन्दी व्याकरण · संपूर्ण खंड' },
    title: {
      en: 'Samas, Sandhi, Vachya, Kriya, Vakya Bhed & Muhavare',
      hi: 'समास, संधि, वाच्य, क्रिया, वाक्य भेद एवं मुहावरे',
    },
    bossName: { en: 'Vyakaran Knight', hi: 'व्याकरण महायोद्धा' },
    summaryPoints: [
      {
        en: '6 Samas types (Dvigu = numeral first word; Dvandva = hyphenated both equal; Bahuvrihi = third meaning).',
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
          en: 'Swar Sandhi (Dirgha, Gun, Vriddhi, Yan, Ayadi) + Vyanjan + Visarga Sandhi. Watch for Dashanan Bahuvrihi vs Dvigu.',
          hi: 'विद्या+आलय (दीर्घ संधि), त्रिभुवन (द्विगु समास), पर दशानन (दस हैं आनन जिसके अर्थात् रावण = बहुव्रीहि)।',
        },
        keyPoints: [
          { en: 'Kartrivachya uses transitive/intransitive active verbs; Bhavavachya is always singular, masculine, 3rd person.', hi: 'भाववाच्य में क्रिया सदैव एकवचन, पुल्लिंग व अकर्मक होती है (जैसे—मुझसे चला नहीं जाता)।' },
        ],
      },
    ],
    questionIds: ['10-hi-4', '10-hi-6', '10-hi-12', '10-hi-tricky-1'],
    secondsPerQuestion: 34,
    baseXP: 175,
    mapCoords: { x: 88, y: 36 },
  },

  // ==================== CLASS 10 · ENGLISH ====================
  {
    id: '10-en-ff1',
    grade: '10',
    subjectId: 'english',
    subsectionId: 'first-flight',
    order: 1,
    chapterCode: { en: 'First Flight · Ch. 1–3', hi: 'First Flight · पाठ 1–3' },
    title: {
      en: 'A Letter to God, Mandela, Two Stories About Flying & Poems',
      hi: 'A Letter to God, Nelson Mandela व Two Stories About Flying',
    },
    bossName: { en: 'Liberty Storm Keeper', hi: 'लिबर्टी द्वीप प्रहरी' },
    summaryPoints: [
      {
        en: 'Lencho asked God for 100 pesos after hailstones ruined his crop; Robert Frost wrote Dust of Snow & Fire and Ice.',
        hi: 'लेंचो ने ईश्वर से 100 पेसो माँगे; रॉबर्ट फ्रॉस्ट ने "Dust of Snow" व "Fire and Ice" लिखी।',
      },
      {
        en: 'Nelson Mandela became South Africa’s first Black President on 10 May 1994; Young Seagull conquered his fear by hunger.',
        hi: 'मंडेला 10 मई 1994 को राष्ट्रपति बने; भूख ने नन्हे सीगल को उड़ना सिखाया।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'First Flight Ch. 1–3 Complete Notes', hi: 'First Flight पाठ 1–3 मुख्य बिंदु' },
        summary: {
          en: 'Covers G.L. Fuentes (Letter to God), Nelson Mandela (Long Walk to Freedom), Liam O’Flaherty (His First Flight), and Frederick Forsyth (Black Aeroplane).',
          hi: 'लेंचो की अटूट आस्था, मंडेला के "ट्विन ऑब्लिगेशंस", तथा सीगल व ब्लैक एयरोप्लेन के रहस्य।',
        },
        keyPoints: [
          { en: 'Mandela’s Two Obligations: 1) Family, 2) People & Community. Post office employees collected 70 pesos for Lencho.', hi: 'पोस्ट ऑफिस कर्मचारियों ने मिलकर 70 पेसो इकट्ठा किए जिन्हें लेंचो ने गलती से "bunch of crooks" समझा।' },
        ],
      },
    ],
    questionIds: ['10-en-1', '10-en-2', '10-en-3', '10-en-extra-1'],
    secondsPerQuestion: 44,
    baseXP: 125,
    mapCoords: { x: 14, y: 66 },
  },
  {
    id: '10-en-ff2',
    grade: '10',
    subjectId: 'english',
    subsectionId: 'first-flight',
    order: 2,
    chapterCode: { en: 'First Flight · Ch. 4–9', hi: 'First Flight · पाठ 4–9' },
    title: {
      en: 'Anne Frank, Glimpses of India, Mijbil, Valli, Benares & Proposal',
      hi: 'Anne Frank, Coorg, Mijbil, Madam Rides the Bus, Benares व Proposal',
    },
    bossName: { en: 'Chronicle Harbour Warden', hi: 'क्रॉनिकल बंदरगाह रक्षक' },
    summaryPoints: [
      {
        en: 'Anne Frank called her diary "Kitty"; Coorg is Karnataka’s smallest district famous for coffee & Kodavu valor.',
        hi: 'ऐन फ्रैंक की डायरी का नाम "किटी" था; कुर्ग कॉफी के लिए प्रसिद्ध है।',
      },
      {
        en: 'Kisa Gotami learns death’s universality at Benares; Lomov & Natalya quarrel over Oxen Meadows in Chekhov’s farce.',
        hi: 'किसा गौतमी को मृत्यु की सच्चाई का बोध हुआ; चेखव के नाटक में ऑक्सन मीडोज़ पर झगड़ा होता है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'First Flight Ch. 4–9 & Poems (Amanda, Trees, Fog, Custard, Anne Gregory)', hi: 'First Flight पाठ 4–9 व सभी कविताएँ' },
        summary: {
          en: 'Baker from Goa (Pader), Coorg (General Cariappa), Tea from Assam; Valli saves 60 paise for a two-way bus ride.',
          hi: 'गोवा का बेकर (पैडर), असम की चाय, मैक्सवेल का ऊदबिलाव मिजबिल, तथा वल्ली की 60 पैसे वाली बस यात्रा।',
        },
        keyPoints: [
          { en: 'Carl Sandburg compares "Fog" to a silent cat; Ogden Nash’s "Custard the Dragon" proves brave when a pirate attacks.', hi: 'कार्ल सैंडबर्ग ने कोहरे (Fog) की तुलना दबे पाँव आने वाली बिल्ली से की है।' },
        ],
      },
    ],
    questionIds: ['10-en-5', '10-en-8', '10-en-11', '10-en-extra-2'],
    secondsPerQuestion: 42,
    baseXP: 140,
    mapCoords: { x: 34, y: 40 },
  },
  {
    id: '10-en-fp1',
    grade: '10',
    subjectId: 'english',
    subsectionId: 'footprints',
    order: 3,
    chapterCode: { en: 'Footprints Without Feet · Ch. 1–9', hi: 'Footprints · संपूर्ण पाठ 1–9' },
    title: {
      en: 'Tricki, Thief’s Story, Griffin, Ebright, Necklace, Bholi & Think-Tank',
      hi: 'Tricki, Thief’s Story, Griffin, Ebright, Necklace, Bholi व Think-Tank',
    },
    bossName: { en: 'Shadow Footprints Lord', hi: 'अदृश्य पदचिह्न स्वामी' },
    summaryPoints: [
      {
        en: 'All 9 chapters: Dr. Herriot’s Surgery, Anil & Hari Singh, Ausable’s Midnight Balcony trick, Horace Danby & Griffin.',
        hi: 'सभी 9 पाठ: ट्रिकी का इलाज, हरि सिंह, ऑसेबल की सूझबूझ, ग्रिफिन का अदृश्य होना।',
      },
      {
        en: 'Ebright’s monarch butterflies, Matilda’s 10-year debt over an imitation necklace, Sulekha (Bholi), & Mother Goose.',
        hi: 'मटिल्डा का नकली हार, सुलेखा (भोली) का दहेज विरोध, व नर्सरी राइम्स किताब द्वारा मंगल आक्रमण से बचाव।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Complete Footprints Reader Highlights (Ch. 1–9)', hi: 'फुटप्रिंट्स विदाउट फीट (सभी 9 पाठ) सार' },
        summary: {
          en: 'Covers Richard Ebright’s "The Travels of Monarch X", Guy de Maupassant’s twist in "The Necklace" (paste diamond worth 500 francs), and Bholi.',
          hi: 'मटिल्डा को अंत में पता चलता है कि फॉरेस्टियर का हार नकली (500 फ्रैंक) था; भोली का असली नाम सुलेखा था।',
        },
        keyPoints: [
          { en: 'Think-Tank, ruler of Mars, misinterpreted nursery rhyme "Humpty Dumpty" as a warning of Earth invasion.', hi: '"The Book That Saved the Earth" में थिंक-टैंक नर्सरी कविता से डरकर मंगल ग्रह की सेना वापस बुला लेता है।' },
        ],
      },
    ],
    questionIds: ['10-en-6', '10-en-13', '10-en-14', '10-en-extra-3'],
    secondsPerQuestion: 40,
    baseXP: 155,
    mapCoords: { x: 56, y: 64 },
  },
  {
    id: '10-en-g1',
    grade: '10',
    subjectId: 'english',
    subsectionId: 'grammar-book',
    order: 4,
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
          { en: '"No sooner did he see... than he ran" (Always pair No sooner with "than", Hardly/Scarcely with "when").', hi: 'No sooner के साथ "than" तथा Hardly के साथ "when" लगता है।' },
        ],
      },
    ],
    questionIds: ['10-en-4', '10-en-7', '10-en-9', '10-en-tricky-1'],
    secondsPerQuestion: 36,
    baseXP: 165,
    mapCoords: { x: 74, y: 36 },
  },
  {
    id: '10-en-g2',
    grade: '10',
    subjectId: 'english',
    subsectionId: 'grammar-book',
    order: 5,
    chapterCode: { en: 'Grammar Section · Voice & Clauses', hi: 'ग्रामर खंड · वॉइस व क्लॉज़' },
    title: {
      en: 'Active-Passive Voice, Unless/If & Relative Clauses',
      hi: 'एक्टिव-पैसिव वॉइस, कंडीशनल एवं रिलेटिव क्लॉज़',
    },
    bossName: { en: 'Grammar Sphinx', hi: 'ग्रामर स्फिंक्स' },
    summaryPoints: [
      {
        en: 'Simple Present → is/am/are + V3; "Unless" replaces "If ... not" cleanly without double negative.',
        hi: 'Simple Present Passive में is/am/are + V3; "Unless" = "If not"।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Transformation Playbook', hi: 'वाक्य रूपांतरण नियम (Voice & Clauses)' },
        summary: {
          en: 'Relative pronouns: "who" for people (subject), "whom" (object), "whose" (possession), "which/that" for things.',
          hi: 'व्यक्ति कर्ता के लिए "who", वस्तु के लिए "which", व "so...that" से "too...to" रूपांतरण।',
        },
        keyPoints: [
          { en: 'Never use "will" inside an "if" or "unless" conditional clause.', hi: 'If या Unless वाले क्लॉज़ में भविष्यकाल (will) का प्रयोग नहीं करते।' },
        ],
      },
    ],
    questionIds: ['10-en-10', '10-en-12', '10-en-15', '10-en-tricky-2'],
    secondsPerQuestion: 34,
    baseXP: 175,
    mapCoords: { x: 86, y: 58 },
  },

  // ==================== CLASS 10 · MATHS (ALL 14 NEW NCERT CHAPTERS) ====================
  {
    id: '10-ma-1',
    grade: '10',
    subjectId: 'maths',
    subsectionId: 'maths-algebra',
    order: 1,
    chapterCode: { en: 'NCERT Maths · Ch. 1 & 2', hi: 'NCERT गणित · अध्याय 1 व 2' },
    title: {
      en: 'Ch. 1 Real Numbers & Ch. 2 Polynomials',
      hi: 'अध्याय 1: वास्तविक संख्याएँ एवं अध्याय 2: बहुपद',
    },
    bossName: { en: 'Prime Factor Warden', hi: 'अभाज्य गुणनखंड रक्षक' },
    summaryPoints: [
      {
        en: 'Fundamental Theorem of Arithmetic: HCF(a,b) × LCM(a,b) = a × b; √2, √3, √5 are irrational.',
        hi: 'HCF(a,b) × LCM(a,b) = a × b; अपरिमेय संख्या सिद्ध करना।',
      },
      {
        en: 'Quadratic polynomial zeroes: α + β = −b/a and αβ = c/a; number of zeroes = x-axis intersections.',
        hi: 'शून्यकों का योग α + β = −b/a तथा गुणनफल αβ = c/a।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 1–2 Formulas & Board Theorems', hi: 'अध्याय 1–2 मुख्य सूत्र व प्रमेय' },
        summary: {
          en: 'Degree of linear = 1, quadratic = 2, cubic = 3. If k divides p², prime p divides k.',
          hi: 'द्विघात बहुपद x² − (α+β)x + αβ; ग्राफ़ x-अक्ष को जितनी बार काटे उतने शून्यक।',
        },
        keyPoints: [
          { en: 'HCF(6, 20) = 2, LCM(6, 20) = 60 → 2 × 60 = 6 × 20.', hi: 'सबसे छोटी अभाज्य संख्या 2 तथा सबसे छोटी भाज्य संख्या 4 का HCF = 2 होता है।' },
        ],
      },
    ],
    questionIds: ['10-ma-1', '10-ma-2', '10-ma-13'],
    secondsPerQuestion: 45,
    baseXP: 125,
    mapCoords: { x: 14, y: 66 },
  },
  {
    id: '10-ma-2',
    grade: '10',
    subjectId: 'maths',
    subsectionId: 'maths-algebra',
    order: 2,
    chapterCode: { en: 'NCERT Maths · Ch. 3, 4 & 5', hi: 'NCERT गणित · अध्याय 3, 4 व 5' },
    title: {
      en: 'Ch. 3 Linear Equations, Ch. 4 Quadratics & Ch. 5 Arithmetic Progressions',
      hi: 'अध्याय 3: दो चर रैखिक, 4: द्विघात समीकरण व 5: समांतर श्रेढ़ियाँ',
    },
    bossName: { en: 'Algebra Forge Golem', hi: 'बीजगणित महाबली' },
    summaryPoints: [
      {
        en: 'a₁/a₂ ≠ b₁/b₂ (Unique/Intersecting); a₁/a₂ = b₁/b₂ ≠ c₁/c₂ (Parallel/No Solution); all equal (Coincident).',
        hi: 'प्रतिच्छेदी (अद्वितीय हल), समांतर (कोई हल नहीं) व संपाती (अनंत हल) की शर्तें।',
      },
      {
        en: 'Quadratic Discriminant D = b² − 4ac; AP nth term aₙ = a + (n−1)d, Sₙ = (n/2)[2a + (n−1)d].',
        hi: 'विविक्तकर D = b² − 4ac; AP का nवाँ पद aₙ = a + (n−1)d।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 3, 4 & 5 Key Identities', hi: 'अध्याय 3, 4 व 5 के बोर्ड सूत्र' },
        summary: {
          en: 'D > 0 gives 2 distinct real roots, D = 0 gives 2 equal real roots, D < 0 gives no real roots.',
          hi: 'D = 0 होने पर दो बराबर वास्तविक मूल (−b/2a, −b/2a) मिलते हैं।',
        },
        keyPoints: [
          { en: 'Quadratic Formula (Sridharacharya): x = [−b ± √(b² − 4ac)] / 2a.', hi: 'Sₙ − Sₙ₋₁ = aₙ का उपयोग किसी AP का nवाँ पद निकालने में होता है।' },
        ],
      },
    ],
    questionIds: ['10-ma-8', '10-ma-3', '10-ma-4'],
    secondsPerQuestion: 42,
    baseXP: 140,
    mapCoords: { x: 34, y: 40 },
  },
  {
    id: '10-ma-3',
    grade: '10',
    subjectId: 'maths',
    subsectionId: 'maths-geometry-trig',
    order: 3,
    chapterCode: { en: 'NCERT Maths · Ch. 6, 7 & 10', hi: 'NCERT गणित · अध्याय 6, 7 व 10' },
    title: {
      en: 'Ch. 6 Triangles, Ch. 7 Coordinate Geometry & Ch. 10 Circles',
      hi: 'अध्याय 6: त्रिभुज, अध्याय 7: निर्देशांक ज्यामिति व अध्याय 10: वृत्त',
    },
    bossName: { en: 'Tangent Sentinel', hi: 'स्पर्शरेखा व प्रमेय प्रहरी' },
    summaryPoints: [
      {
        en: 'Thales Theorem (BPT): Line parallel to one side divides the other two in equal ratio (AD/DB = AE/EC).',
        hi: 'थेल्स प्रमेय (BPT): त्रिभुज की एक भुजा के समांतर रेखा अन्य दोनों भुजाओं को समान अनुपात में बाँटती है।',
      },
      {
        en: 'Distance = √[(x₂−x₁)² + (y₂−y₁)²]; Tangents from external point are equal (Theorem 10.2) & ⊥ to radius.',
        hi: 'दूरी सूत्र, मध्यबिंदु सूत्र, तथा बाह्य बिंदु से वृत्त पर खींची गई दोनों स्पर्श रेखाएँ बराबर होती हैं।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 6, 7 & 10 Theorems & Section Formula', hi: 'अध्याय 6, 7 व 10 प्रमेय एवं विभाजन सूत्र' },
        summary: {
          en: 'All circles are similar; all squares are similar; Section formula: ((m₁x₂+m₂x₁)/(m₁+m₂), (m₁y₂+m₂y₁)/(m₁+m₂)).',
          hi: 'सभी वृत्त व वर्ग समरूप होते हैं। मध्यबिंदु = ((x₁+x₂)/2, (y₁+y₂)/2)।',
        },
        keyPoints: [
          { en: 'From an interior point, 0 tangents can be drawn; from a point on the circle, 1; from outside, 2.', hi: 'वृत्त के अंदर स्थित बिंदु से 0, परिधि पर स्थित बिंदु से 1, व बाह्य बिंदु से 2 स्पर्श रेखाएँ।' },
        ],
      },
    ],
    questionIds: ['10-ma-5', '10-ma-6', '10-ma-14'],
    secondsPerQuestion: 40,
    baseXP: 155,
    mapCoords: { x: 54, y: 64 },
  },
  {
    id: '10-ma-4',
    grade: '10',
    subjectId: 'maths',
    subsectionId: 'maths-geometry-trig',
    order: 4,
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
        en: 'Angle of Elevation = Angle of Depression (alternate interior angles); sin 30° = ½, tan 45° = 1, tan 60° = √3.',
        hi: 'उन्नयन कोण = अवनमन कोण; sin 30° = ½, cos 60° = ½, tan 45° = 1।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Trig Table & Ch. 9 Applications', hi: 'त्रिकोणमितीय सारणी व ऊँचाई-दूरी नियम' },
        summary: {
          en: 'Memorize standard values (0°, 30°, 45°, 60°, 90°). Remember 9(sec²A − tan²A) = 9(1) = 9.',
          hi: '9 sec²A − 9 tan²A = 9; छाया और मीनार की लंबाई बराबर होने पर सूर्य का उन्नयन कोण 45° होता है।',
        },
        keyPoints: [
          { en: 'tan θ = sin θ / cos θ; sec θ = 1 / cos θ; tan 90° is undefined.', hi: 'tan 45° = 1, cot 45° = 1, sin 60° = √3/2।' },
        ],
      },
    ],
    questionIds: ['10-ma-7', '10-ma-9', '10-ma-15', '10-ma-tricky-1'],
    secondsPerQuestion: 36,
    baseXP: 165,
    mapCoords: { x: 72, y: 36 },
  },
  {
    id: '10-ma-5',
    grade: '10',
    subjectId: 'maths',
    subsectionId: 'maths-mensuration-stats',
    order: 5,
    chapterCode: { en: 'NCERT Maths · Ch. 11–14', hi: 'NCERT गणित · अध्याय 11–14' },
    title: {
      en: 'Ch. 11 Sector Areas, Ch. 12 Volumes, Ch. 13 Statistics & Ch. 14 Probability',
      hi: 'अध्याय 11: त्रिज्यखंड, 12: आयतन, 13: सांख्यिकी व 14: प्रायिकता',
    },
    bossName: { en: 'Oracle of Chance', hi: 'सांख्यिकी व प्रायिकता सम्राट' },
    summaryPoints: [
      {
        en: 'Sector area = (θ/360)πr², Arc length = (θ/360)2πr; Cylinder V = πr²h, Cone V = ⅓πr²h, Sphere V = 4/3πr³.',
        hi: 'त्रिज्यखंड क्षेत्रफल (θ/360)πr²; शंकु आयतन = ⅓πr²h; बेलन आयतन = πr²h।',
      },
      {
        en: 'Empirical Rule: 3 Median = Mode + 2 Mean; Sure event P = 1, Impossible event P = 0, 0 ≤ P(E) ≤ 1.',
        hi: 'बहुलक = 3 माध्यिका − 2 माध्य; निश्चित घटना की प्रायिकता = 1, असंभव घटना = 0।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Mensuration, Statistics & Probability Summary', hi: 'क्षेत्रमिति, सांख्यिकी व प्रायिकता सूत्र' },
        summary: {
          en: 'Total surface area of hemisphere = 3πr² (curved = 2πr²). P(E) + P(not E) = 1 always.',
          hi: 'ठोस अर्धगोले का संपूर्ण पृष्ठीय क्षेत्रफल 3πr² व वक्र पृष्ठ 2πr² होता है।',
        },
        keyPoints: [
          { en: 'Class mark (मध्य-बिंदु) = (Upper limit + Lower limit) / 2.', hi: 'वर्ग चिह्न = (ऊपरी सीमा + निचली सीमा) / 2।' },
        ],
      },
    ],
    questionIds: ['10-ma-12', '10-ma-11', '10-ma-10', '10-ma-tricky-2'],
    secondsPerQuestion: 34,
    baseXP: 175,
    mapCoords: { x: 86, y: 58 },
  },

  // ==================== CLASS 10 · PHYSICS (SCIENCE CH. 9–12) ====================
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
          en: 'Concave mirrors form real/inverted images (except between P & F) used in torches, headlights, dentists. Convex gives wide erect rear-view.',
          hi: 'दाढ़ी बनाने/दंत चिकित्सक/सौर भट्टी में अवतल दर्पण; वाहनों के साइड मिरर में उत्तल दर्पण।',
        },
        keyPoints: [
          { en: 'Focal length of Concave mirror is negative (−); Convex mirror is positive (+).', hi: 'अवतल दर्पण की फोकस दूरी ऋणात्मक (−) तथा उत्तल की धनात्मक (+) होती है।' },
        ],
      },
    ],
    questionIds: ['10-ph-2', '10-ph-5', '10-ph-13'],
    secondsPerQuestion: 45,
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
          { en: 'Lens of f = +50 cm = +0.5 m has Power P = +2 D (Convex).', hi: 'फोकस दूरी 2 मीटर वाले अवतल लेंस की क्षमता −0.5 D होगी।' },
        ],
      },
    ],
    questionIds: ['10-ph-1', '10-ph-12', '10-ph-14'],
    secondsPerQuestion: 42,
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
    questionIds: ['10-ph-3', '10-ph-8', '10-ph-10'],
    secondsPerQuestion: 40,
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
    secondsPerQuestion: 36,
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
    secondsPerQuestion: 34,
    baseXP: 175,
    mapCoords: { x: 86, y: 58 },
  },

  // ==================== CLASS 10 · CHEMISTRY (SCIENCE CH. 1–4) ====================
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
          en: 'Combination, Decomposition (thermal/electrolytic/photochemical AgBr in B&W photography), Displacement, Double Displacement (BaSO₄ white ppt), Redox.',
          hi: 'संयोजन, वियोजन (AgBr सूर्यप्रकाश में श्वेत-श्याम फोटोग्राफी), विस्थापन, द्विविस्थापन व उपचयन-अपचयन।',
        },
        keyPoints: [
          { en: 'Loss of oxygen / gain of hydrogen = Reduction; Gain of oxygen = Oxidation.', hi: 'ऑक्सीजन की वृद्धि = उपचयन (Oxidation); कमी = अपचयन (Reduction)।' },
        ],
      },
    ],
    questionIds: ['10-ch-2', '10-ch-13', '10-ch-10'],
    secondsPerQuestion: 45,
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
          { en: 'Always add acid slowly to water (never water to conc. acid) because dilution is highly exothermic.', hi: 'तनुकरण ऊष्माक्षेपी होने से अम्ल को धीरे-धीरे जल में मिलाते हैं।' },
        ],
      },
    ],
    questionIds: ['10-ch-1', '10-ch-6', '10-ch-14'],
    secondsPerQuestion: 42,
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
          en: 'Heating Gypsum (CaSO₄·2H₂O) at 373 K yields POP; Chlor-alkali electrolysis of brine gives NaOH + Cl₂ (anode) + H₂ (cathode).',
          hi: 'जिप्सम को 373 K पर गर्म करने से प्लास्टर ऑफ पेरिस बनता है।',
        },
        keyPoints: [
          { en: 'Washing soda removes permanent hardness of water.', hi: 'धावन सोडा जल की स्थायी कठोरता दूर करने में प्रयुक्त होता है।' },
        ],
      },
    ],
    questionIds: ['10-ch-3', '10-ch-7', '10-ch-15'],
    secondsPerQuestion: 40,
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
    questionIds: ['10-ch-4', '10-ch-8', '10-ch-11', '10-ch-tricky-1'],
    secondsPerQuestion: 36,
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
    questionIds: ['10-ch-5', '10-ch-9', '10-ch-12', '10-ch-tricky-2'],
    secondsPerQuestion: 34,
    baseXP: 175,
    mapCoords: { x: 86, y: 58 },
  },
];
