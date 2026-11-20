import { ChapterNodeDefinition } from '../types/quiz';

// Complete Class 12th New MP Board NCERT Syllabus Nodes (Zero Skipped Chapters)
// Every subject is organized into individual playable & sequentially unlockable chapter levels, explicitly featuring Kamre Mein Band Apahij, Ras, Alankar, and Part I/II divisions.
export const SYLLABUS_NODES_12: ChapterNodeDefinition[] = [
  // ==================== CLASS 12 · HINDI (11 STAGES) ====================
  {
    id: '12-hi-k1',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'kavya-khand',
    order: 1,
    chapterCode: { en: 'Aaroh-2 Kavya · Ch. 1', hi: 'आरोह-2 काव्य · पाठ 1' },
    title: {
      en: 'Ch. 1: Aatmaparichay & Ek Geet (Harivansh Rai Bachchan)',
      hi: 'पाठ 1: आत्मपरिचय एवं एक गीत (हरिवंशराय बच्चन)',
    },
    bossName: { en: 'Halavad Kavya Warden', hi: 'हालावाद काव्य प्रहरी' },
    summaryPoints: [
      {
        en: 'Harivansh Rai Bachchan ("Aatmaparichay" & "Din Jaldi Jaldi Dhalta Hai") pioneered Halavad.',
        hi: 'हालावाद के प्रवर्तक हरिवंशराय बच्चन की रचनाएँ "आत्मपरिचय" व "दिन जल्दी-जल्दी ढलता है"।',
      },
      {
        en: 'Poet drinks "Sneh-Sura" (wine of love) amidst worldly burdens; birds fly faster remembering waiting nestlings.',
        hi: 'कवि जग-भार लिए भी "स्नेह-सुरा" का पान करते हैं; नीड़ों से झाँकते बच्चों की याद चिड़ियों में चंचलता भरती है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '1. Harivansh Rai Bachchan — Aatmaparichay & Ek Geet', hi: '1. आत्मपरिचय व दिन जल्दी-जल्दी ढलता है' },
        summary: {
          en: 'Balances worldly duty with inner love ("मैं जग-जीवन का भार लिए फिरता हूँ, फिर भी जीवन में प्यार लिए फिरता हूँ").',
          hi: 'कवि संसार के दुखों के बीच भी "स्नेह-सुरा" (प्रेम) का पान कर मस्त रहने की बात करते हैं।',
        },
        keyPoints: [
          { en: 'In "Ek Geet", birds hurry home thinking of waiting nestlings—while the poet feels lonely without anyone waiting.', hi: '"दिन जल्दी-जल्दी ढलता है" में पथिक के लक्ष्य पर समय बीतने की व्याकुलता दर्शायी गई है।' },
        ],
      },
    ],
    questionIds: ['12-hi-1', '12-hi-m-1', '12-hi-m-12', '12-hi-m-17'],
    secondsPerQuestion: 10,
    baseXP: 120,
    mapCoords: { x: 12, y: 68 },
  },
  {
    id: '12-hi-patang',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'kavya-khand',
    order: 2,
    chapterCode: { en: 'Aaroh-2 Kavya · Ch. 2', hi: 'आरोह-2 काव्य · पाठ 2' },
    title: {
      en: 'Ch. 2: Patang (Alok Dhanva)',
      hi: 'पाठ 2: पतंग (आलोक धन्वा)',
    },
    bossName: { en: 'Sharad Kite Warden', hi: 'शरद पतंग प्रहरी' },
    summaryPoints: [
      {
        en: 'Alok Dhanva personifies bright Sharad Ritu riding a shiny bicycle after Bhado rains.',
        hi: 'आलोक धन्वा की "पतंग" में भादो के बाद चमकीली साइकिल चलाते हुए "शरद" ऋतु का मानवीकरण है।',
      },
      {
        en: 'Children’s flexible, soft bodies are compared to cotton ("जन्म से ही वे अपने साथ लाते हैं कपास").',
        hi: 'बच्चों के कोमल व लचीले शरीर की तुलना "कपास" से की गई है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '2. Patang — Imagery & Child Psychology', hi: '2. पतंग — बिंब व बाल-मनोविज्ञान' },
        summary: {
          en: 'Captures roofs softening under little running feet and kites carrying children’s delicate dreams skyward.',
          hi: 'छतों को भी नरम बनाते दौड़ते बच्चे और रंगीन पतंग के साथ उड़ती उनकी कल्पना का सुंदर चित्रण।',
        },
        keyPoints: [
          { en: 'Sharpest season after Bhado monsoon: Sharad Ritu ringing bright bells.', hi: 'भादो जाने के बाद शरद ऋतु में दुनिया की सबसे हल्की और रंगीन चीज़ "पतंग" उड़ती है।' },
        ],
      },
    ],
    questionIds: ['12-hi-6', '12-hi-m-2', '12-hi-m-3', '12-hi-m-18'],
    secondsPerQuestion: 10,
    baseXP: 125,
    mapCoords: { x: 20, y: 46 },
  },
  {
    id: '12-hi-kavita-bahane',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'kavya-khand',
    order: 3,
    chapterCode: { en: 'Aaroh-2 Kavya · Ch. 3', hi: 'आरोह-2 काव्य · पाठ 3' },
    title: {
      en: 'Ch. 3: Kavita ke Bahane & Baat Seedhi Thi Par (Kunwar Narayan)',
      hi: 'पाठ 3: कविता के बहाने व बात सीधी थी पर (कुँवर नारायण)',
    },
    bossName: { en: 'Limitless Verse Sentinel', hi: 'काव्य-उड़ान रक्षक' },
    summaryPoints: [
      {
        en: 'Kunwar Narayan compares poetry’s boundless flight to a child’s play—unrestricted by wings or seasons.',
        hi: 'चिड़िया व फूल की सीमा है, किंतु "कविता एक खेल है बच्चों के बहाने" जो सब घर एक कर देती है।',
      },
      {
        en: '"Baat Seedhi Thi Par" compares forced artificial language to stripping a screw’s threads ("पेंच की चूड़ी मर जाना").',
        hi: '"बात सीधी थी पर" भाषा के आडंबर से कथ्य के नष्ट होने की तुलना पेंच की चूड़ी मर जाने से करती है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '3. Kavita ke Bahane & Baat Seedhi Thi Par', hi: '3. कविता के बहाने / बात सीधी थी पर' },
        summary: {
          en: 'Poems bloom without wilting unlike flowers; simplicity is superior to forced verbal gymnastics.',
          hi: 'बिना मुरझाए महकने का अर्थ कविता की अमरता है; सहज बात को सहज शब्दों में ही कहना श्रेष्ठ है।',
        },
        keyPoints: [
          { en: 'Collection source: In Dino & Koi Doosra Nahin.', hi: 'संग्रह: "इन दिनों" (कविता के बहाने) व "कोई दूसरा नहीं" (बात सीधी थी पर)।' },
        ],
      },
    ],
    questionIds: ['12-hi-13', '12-hi-m-4', '12-hi-m-5', '12-hi-m-19'],
    secondsPerQuestion: 10,
    baseXP: 130,
    mapCoords: { x: 28, y: 66 },
  },
  {
    id: '12-hi-kamre',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'kavya-khand',
    order: 4,
    chapterCode: { en: 'Aaroh-2 Kavya · Ch. 4 (Dedicated)', hi: 'आरोह-2 काव्य · पाठ 4 (समर्पित)' },
    title: {
      en: 'Ch. 4: Kamre Mein Band Apahij (Raghuvir Sahay)',
      hi: 'पाठ 4: कैमरे में बंद अपाहिज (रघुवीर सहाय)',
    },
    bossName: { en: 'Studio TRP Warden', hi: 'दूरदर्शन व्यंग्य प्रहरी' },
    summaryPoints: [
      {
        en: 'Dedicated topic exposing how electronic TV studios exploit a differently-abled guest’s pain for commercial TRP.',
        hi: 'यह पाठ इलेक्ट्रॉनिक मीडिया की संवेदनहीनता उजागर करता है जो दिव्यांग व्यक्ति की पीड़ा को मुनाफ़े का साधन बनाता है।',
      },
      {
        en: 'Curated from Raghuvir Sahay’s collection "Log Bhool Gaye Hain" in free verse (Muktak Chhand).',
        hi: '"लोग भूल गए हैं" संग्रह से उद्धृत, मुक्तक छंद व नाटकीय व्यंग्य शैली में रचित।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Kamre Mein Band Apahij — Full Conceptual Notes', hi: 'कैमरे में बंद अपाहिज — संपूर्ण व्याख्या व मुख्य बिंदु' },
        summary: {
          en: 'The presenter calls himself "Samarth Shaktivan" and treats the guest as "Durbal", firing cruel questions.',
          hi: 'संचालक स्वयं को "समर्थ शक्तिवान" मानकर बंद कमरे में अपाहिज से बेतुके व चुभने वाले प्रश्न पूछता है।',
        },
        keyPoints: [
          { en: 'Camera zoom instructions try to force tears simultaneously from guest and viewers.', hi: 'संपादक का उद्देश्य "सामाजिक उद्देश्य से युक्त कार्यक्रम" के नाम पर दर्शक व पीड़ित दोनों को एक साथ रुलाना है।' },
          { en: 'Climax irony: "बस कीजिए... पर्दे पर वक्त की कीमत है" exposes media commercial greed.', hi: 'अंतिम पंक्ति "पर्दे पर वक्त की कीमत है" मीडिया के बाज़ारवाद पर सबसे तीखा प्रहार है।' },
        ],
        examTip: { en: 'MP Board PYQ: Anthology source = "Log Bhool Gaye Hain".', hi: 'बोर्ड मुख्य प्रश्न: यह कविता "लोग भूल गए हैं" काव्य संग्रह से ली गई है।' },
      },
    ],
    questionIds: ['12-hi-kamre-1', '12-hi-kamre-2', '12-hi-m-13', '12-hi-m-20'],
    secondsPerQuestion: 10,
    baseXP: 140,
    mapCoords: { x: 36, y: 40 },
  },
  {
    id: '12-hi-k3',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'kavya-khand',
    order: 5,
    chapterCode: { en: 'Aaroh-2 Kavya · Ch. 5–6', hi: 'आरोह-2 काव्य · पाठ 5–6' },
    title: {
      en: 'Ch. 5 Usha (Shamsher) & Ch. 6 Badal Raag (Nirala)',
      hi: 'पाठ 5: उषा (शमशेर बहादुर सिंह) व पाठ 6: बादल राग (निराला)',
    },
    bossName: { en: 'Usha & Viplav Warden', hi: 'उषा व विप्लव रक्षक' },
    summaryPoints: [
      {
        en: 'Shamsher’s "Usha" paints dawn via blue conch & wet ash-plastered hearth ("राख से लीपा हुआ चौका").',
        hi: 'शमशेर की "उषा" में नील शंख व "राख से लीपा हुआ गीला चौका" प्रमुख उपमान हैं।',
      },
      {
        en: 'Nirala’s "Badal Raag" hails clouds as "विप्लव के वीर" awakening exploited farmers.',
        hi: 'निराला के "बादल राग" में बादल "विप्लव के वीर" बनकर शोषित किसान को नवजीवन देते हैं।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 5–6: Usha & Badal Raag Imagery', hi: 'पाठ 5–6: उषा एवं बादल राग' },
        summary: {
          en: 'Nirala contrasts capitalists’ terror ("आतंक-भवन") with tiny resilient sprouts ("छोटे ही हैं शोभा पाते").',
          hi: '"उषा" में सूर्योदय से "जादू टूटता है इस उषा का अब"; "बादल राग" क्रांति व नवनिर्माण का गीत है।',
        },
        keyPoints: [
          { en: 'In "Usha", saffron-washed black sil & red chalk precede golden sunrise.', hi: '"लाल केसर से धुली काली सिल" उषा का प्रसिद्ध प्रयोगवादी बिंब है।' },
        ],
      },
    ],
    questionIds: ['12-hi-usha-1', '12-hi-m-14', '12-hi-m-6', '12-hi-m-21'],
    secondsPerQuestion: 10,
    baseXP: 145,
    mapCoords: { x: 44, y: 64 },
  },
  {
    id: '12-hi-rubaiyan',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'kavya-khand',
    order: 6,
    chapterCode: { en: 'Aaroh-2 Kavya · Ch. 7–9', hi: 'आरोह-2 काव्य · पाठ 7–9' },
    title: {
      en: 'Ch. 7 Kavitavali, Ch. 8 Rubaiyan & Ch. 9 Chhota Mera Khet',
      hi: 'पाठ 7: कवितावली, पाठ 8: रुबाइयाँ व पाठ 9: छोटा मेरा खेत',
    },
    bossName: { en: 'Tulasi-Firaq Poetry Lord', hi: 'कवितावली व रुबाई सम्राट' },
    summaryPoints: [
      {
        en: 'Tulsidas uses Kavitt-Savaiya for hunger ("पेट की आग"); Firaq shows mother calming baby with moon inside mirror.',
        hi: 'तुलसीदास ने "पेट की आग" को समुद्र की आग से बड़ा कहा; फ़िराक़ की रुबाई में माँ दर्पण में चाँद दिखाती है।',
      },
      {
        en: 'Umashankar Joshi calls poetic Ras an "अक्षय पात्र" (inexhaustible vessel) that never diminishes.',
        hi: 'उमाशंकर जोशी ने कागज़ रूपी खेत के काव्य-रस को "अक्षय पात्र" कहा है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 7–9: Kavitavali, Rubaiyan & Chhota Mera Khet', hi: 'पाठ 7–9: कवितावली, रुबाइयाँ व छोटा मेरा खेत' },
        summary: {
          en: 'Rubai metre has 4 lines with 1st, 2nd & 4th rhyming; Joshi pairs Chhota Mera Khet with Bagulon ke Pankh.',
          hi: 'रुबाई उर्दू-फारसी छंद है (पहली, दूसरी व चौथी पंक्ति में तुक); काव्य-रस बाँटने पर कभी घटता नहीं।',
        },
        keyPoints: [
          { en: 'Maternal Vatsalya Ras shines in Firaq’s Rubaiyan.', hi: 'फ़िराक़ की रुबाइयों में वात्सल्य रस की सजीव झाँकी है।' },
        ],
      },
    ],
    questionIds: ['12-hi-kavya-tulsidas-1', '12-hi-m-15', '12-hi-m-7', '12-hi-m-22'],
    secondsPerQuestion: 10,
    baseXP: 150,
    mapCoords: { x: 52, y: 40 },
  },
  {
    id: '12-hi-g1',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'gadya-khand',
    order: 7,
    chapterCode: { en: 'Aaroh-2 Gadya · Ch. 10–11', hi: 'आरोह-2 गद्य · पाठ 10–11' },
    title: {
      en: 'Ch. 10 Bhaktin (Mahadevi) & Ch. 11 Bazar Darshan (Jainendra)',
      hi: 'पाठ 10: भक्तिन (महादेवी वर्मा) व पाठ 11: बाज़ार दर्शन (जैनेंद्र)',
    },
    bossName: { en: 'Bhaktin & Bazar Guardian', hi: 'भक्तिन व बाज़ार प्रहरी' },
    summaryPoints: [
      {
        en: 'Bhaktin’s real name was Lakshmi (Lachhmin), kept secret because poverty mocked her name’s meaning.',
        hi: 'भक्तिन का वास्तविक नाम लछमिन (लक्ष्मी) था, जिसे वह दरिद्र जीवन के विरोधाभास के कारण छिपाती थी।',
      },
      {
        en: 'Churan seller Bhagat Ji stayed immune to "Bazar ka Jadu" because his mind was contented and purposeful.',
        hi: 'चूरन बेचने वाले भगत जी संतोषी होने से "बाज़ार के जादू" से अछूते रहते हैं।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 10–11: Bhaktin & Bazar Darshan', hi: 'पाठ 10–11: भक्तिन व बाज़ार दर्शन' },
        summary: {
          en: 'Mahadevi’s memoir praises Bhaktin’s selfless loyalty; Jainendra contrasts empty mind vs contented mind when shopping.',
          hi: 'भक्तिन सेवा में हनुमान जी से स्पर्धा करती है; जैनेंद्र जी "पर्चेजिंग पावर" के दुरुपयोग पर चेतावनी देते हैं।',
        },
        keyPoints: [
          { en: 'Bhagat Ji earned only 6 annas and gave leftover churan free to children.', hi: 'भगत जी केवल छह आने की कमाई कर बचा चूरन बच्चों में बाँट देते थे।' },
        ],
      },
    ],
    questionIds: ['12-hi-2', '12-hi-m-16', '12-hi-7', '12-hi-m-8'],
    secondsPerQuestion: 10,
    baseXP: 155,
    mapCoords: { x: 60, y: 64 },
  },
  {
    id: '12-hi-kalemegha',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'gadya-khand',
    order: 8,
    chapterCode: { en: 'Aaroh-2 Gadya · Ch. 12–15', hi: 'आरोह-2 गद्य · पाठ 12–15' },
    title: {
      en: 'Kale Megha, Pahalwan ki Dholak, Shirish ke Phool & Ambedkar',
      hi: 'काले मेघा, पहलवान की ढोलक, शिरीष के फूल व श्रम विभाजन',
    },
    bossName: { en: 'Gadya Archive Sovereign', hi: 'आरोह गद्य अधिपति' },
    summaryPoints: [
      {
        en: 'Jiji called Inder Sena’s water offering "पानी की बुवाई" (sacrifice before harvest); Luttan Singh defeated Chand Singh via dholak rhythm.',
        hi: 'जीजी ने इंदर सेना पर जल अर्पण को "पानी की बुवाई" कहा; लुट्टन सिंह के गुरु ढोलक की थाप थे।',
      },
      {
        en: 'Shirish blooms fearlessly in Jeth heat like Mahatma Gandhi; Ambedkar champions Liberty, Equality & Fraternity.',
        hi: 'शिरीष के अजेय अवधूत की तुलना गांधीजी से की गई; डॉ. आंबेडकर ने स्वतंत्रता, समता व भ्रातृता का आदर्श दिया।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 12–15: Kale Megha, Pahalwan, Shirish & Ambedkar', hi: 'पाठ 12–15 संपूर्ण गद्य सार' },
        summary: {
          en: 'Covers Dharmveer Bharati’s faith-reason debate, Renu’s tragic wrestler against cholera, Dwivedi’s Avadhut essay, and Ambedkar’s Annihilation of Caste.',
          hi: 'लोक-आस्था व विज्ञान का द्वंद्व, महामारी में ढोलक का साहस, शिरीष का अडिग सौंदर्य व जाति-प्रथा का खंडन।',
        },
        keyPoints: [
          { en: 'Boys were called "Inder Sena" by believers and "Mendhak Mandali" by rationalists.', hi: 'आस्थावानों ने किशोर टोली को "इंदर सेना" तथा तर्कवादियों ने "मेंढक मंडली" कहा।' },
        ],
      },
    ],
    questionIds: ['12-hi-14', '12-hi-m-9', '12-hi-gadya-renu-1', '12-hi-m-10'],
    secondsPerQuestion: 10,
    baseXP: 160,
    mapCoords: { x: 68, y: 38 },
  },
  {
    id: '12-hi-vitan',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'vitan-khand',
    order: 9,
    chapterCode: { en: 'Vitan-2 · Ch. 1, 2 & 3', hi: 'वितान-2 · पाठ 1, 2 व 3' },
    title: {
      en: 'Ch. 1 Silver Wedding, Ch. 2 Jujh & Ch. 3 Ateet Mein Dabe Paon',
      hi: 'पाठ 1: सिल्वर वेडिंग, पाठ 2: जूझ एवं पाठ 3: अतीत में दबे पाँव',
    },
    bossName: { en: 'Vitan Heritage Keeper', hi: 'वितान धरोहर प्रहरी' },
    summaryPoints: [
      {
        en: 'Yashodhar Babu’s "Samhau Improper" conflict; Anand Yadav inspired to poetry by Marathi teacher N.V. Saundalgekar; Mohenjo-Daro urban glory.',
        hi: 'यशोधर बाबू का किशनदा आदर्श; आनंद यादव के प्रेरक शिक्षक न. वा. सौंदलगेकर; मोहनजोदड़ो की नियोजित सभ्यता।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Vitan-2 Complete Study Notes (All 3 Long Stories)', hi: 'वितान-2 संपूर्ण नोट्स (तीनों पाठ)' },
        summary: {
          en: 'Silver Wedding explores generation gap; Jujh depicts Dattaji Rao helping Ananda resume school; Mohenjo-Daro had Stupa & Great Bath without weapons.',
          hi: 'दत्ताजी राव की मदद से आनंदा को पाठशाला जाने मिला; मोहनजोदड़ो से हथियार नहीं बल्कि नगर नियोजन व बौद्ध स्तूप मिले।',
        },
        keyPoints: [
          { en: 'Yashodhar Babu’s two catchphrases: "Samhau Improper" and "Jo hua hoga".', hi: 'यशोधर बाबू के दो तकिया कलाम: "समहाउ इम्प्रॉपर" और "जो हुआ होगा"।' },
        ],
      },
    ],
    questionIds: ['12-hi-4', '12-hi-8', '12-hi-m-11', '12-hi-12'],
    secondsPerQuestion: 10,
    baseXP: 165,
    mapCoords: { x: 76, y: 60 },
  },
  {
    id: '12-hi-ras-alankar',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'kavyabodh-vyakaran',
    order: 10,
    chapterCode: { en: 'Kavya Bodh · Ras, Alankar & Shabd Shakti', hi: 'काव्य बोध · रस, अलंकार व शब्द-शक्ति' },
    title: {
      en: 'Dedicated Subsections: Ras, Alankar, Chhand & Shabd Shakti',
      hi: 'समर्पित उपखंड: रस, अलंकार, छंद एवं शब्द-शक्ति / काव्य-गुण',
    },
    bossName: { en: 'Rhetoric Sovereign Boss', hi: 'रस-अलंकार-काव्यगुण सम्राट' },
    summaryPoints: [
      {
        en: 'Bharatmuni’s Ras Sutra, 10 Ras, Alankars (Bhrantiman, Sandeh, Virodhabhas, Sangrupak), and 3 Shabd Shakti.',
        hi: 'भरतमुनि का रस-सूत्र, 10 रस, भ्रांतिमान-संदेह-विरोधाभास-सांगरूपक अलंकार, तथा अभिधा-लक्षणा-व्यंजना शब्द शक्तियाँ।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Subsection A: Ras Theory & Sthayi Bhava', hi: 'उपखंड A: रस — भरतमुनि सूत्र, अंग व भेद' },
        summary: {
          en: 'Acharya Bharatmuni gave 8 Ras in Natyashastra; Shant (Nirved) & Vatsalya complete the 10-Ras school curriculum.',
          hi: 'भरतमुनि ने नाट्यशास्त्र में 8 रस माने; शांत (स्थायी भाव: निर्वेद) 9वाँ व वात्सल्य 10वाँ रस है।',
        },
        keyPoints: [
          { en: '4 Limbs: स्थायी भाव, विभाव, अनुभाव, संचारी भाव (33 transient emotions).', hi: 'संचारी भावों की कुल संख्या 33 मानी गई है।' },
        ],
      },
      {
        topicTitle: { en: 'Subsection B: Alankar (Bhrantiman vs Sandeh & Virodhabhas)', hi: 'उपखंड B: अलंकार — संदेह, भ्रांतिमान, सांगरूपक, विरोधाभास' },
        summary: {
          en: 'Sandeh leaves doubt unresolved; Bhrantiman mistakes one object confidently for another; Virodhabhas shows apparent contradiction.',
          hi: 'संदेह में अनिश्चय बना रहता है; भ्रांतिमान में भ्रमवश निश्चयपूर्वक क्रिया हो जाती है; विरोधाभास में विरोध का आभास होता है।',
        },
        keyPoints: [
          { en: 'Chhand: Rubai (1-2-4 rhyme), Kabitt (31 varna), Savaiya (22–26 varna), Doha (13-11), Sortha (11-13).', hi: 'कवित्त (31 वर्ण) व सवैया (22–26 वर्ण) वर्णिक छंद हैं; दोहा का उल्टा सोरठा (11-13 मात्राएँ) होता है।' },
        ],
      },
    ],
    questionIds: ['12-hi-3', '12-hi-5', '12-hi-11', '12-hi-tricky-1'],
    secondsPerQuestion: 10,
    baseXP: 170,
    mapCoords: { x: 84, y: 38 },
  },
  {
    id: '12-hi-abhivyakti',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'abhivyakti-khand',
    order: 11,
    chapterCode: { en: 'Abhivyakti aur Madhyam & Vyakaran', hi: 'अभिव्यक्ति-माध्यम व व्याकरण' },
    title: {
      en: 'Print/Electronic Media, Inverted Pyramid, 6 Kakar, Feature & Nipat',
      hi: 'पत्रकारिता, उल्टा पिरामिड, 6 ककार, फीचर-आलेख एवं निपात-वाक्य',
    },
    bossName: { en: 'Chronicle Press Warden', hi: 'संपादकीय द्वारपाल' },
    summaryPoints: [
      {
        en: 'Inverted Pyramid arranges news as Intro/Lead → Body → Closing; 6 Kakar = What, Who, Where, When, Why, How.',
        hi: 'उल्टा पिरामिड शैली के 3 भाग (इंट्रो, बॉडी, समापन) व समाचार के 6 ककार।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Journalism, Radio/TV & Grammar Core', hi: 'जनसंचार माध्यम, स्तंभ लेखन व निपात' },
        summary: {
          en: 'Breaking News (Flash), Dry Anchor, Anchor Byte, Live, Sting Operation; Feature vs Aalekh; Nipat particles.',
          hi: 'निपात वे अव्यय हैं जो किसी पद पर अतिरिक्त बल देते हैं (ही, भी, तो, तक, भर)।',
        },
        keyPoints: [
          { en: 'First 4 Kakar (What, Who, Where, When) go into the Lead/Intro; Why & How into Body.', hi: 'इंट्रो में पहले 4 ककार तथा बॉडी में आखिरी 2 ककार (क्यों, कैसे) आते हैं।' },
        ],
      },
    ],
    questionIds: ['12-hi-9', '12-hi-10', '12-hi-15', '12-hi-tricky-2'],
    secondsPerQuestion: 10,
    baseXP: 175,
    mapCoords: { x: 92, y: 56 },
  },

  // ==================== CLASS 12 · ENGLISH (6 STAGES) ====================
  {
    id: '12-en-fl1',
    grade: '12',
    subjectId: 'english',
    subsectionId: 'flamingo-book',
    order: 1,
    chapterCode: { en: 'Flamingo Prose · Ch. 1–2', hi: 'Flamingo गद्य · पाठ 1–2' },
    title: {
      en: 'Ch. 1 The Last Lesson & Ch. 2 Lost Spring',
      hi: 'पाठ 1: The Last Lesson एवं पाठ 2: Lost Spring',
    },
    bossName: { en: 'Alsace & Seemapuri Warden', hi: 'अलसैस व सीमापुरी प्रहरी' },
    summaryPoints: [
      {
        en: 'M. Hamel writes "Vive La France!" as German replaces French; Saheb & Mukesh (who dreams of becoming a motor mechanic).',
        hi: 'एम. हेमेल ने ब्लैकबोर्ड पर "Vive La France!" लिखा; फिरोज़ाबाद का मुकेश मोटर मैकेनिक बनना चाहता है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Flamingo Ch. 1–2 Core Notes', hi: 'Flamingo पाठ 1–2 मुख्य बिंदु' },
        summary: {
          en: 'Berlin ordered only German be taught in Alsace & Lorraine; Anees Jung contrasts Seemapuri ragpickers with Firozabad bangle-makers.',
          hi: 'लार्ड मेयर या बर्लिन आदेश से अंतिम फ्रेंच पाठ; बच्चों के लिए कचरा "आश्चर्य में लिपटा" और बड़ों के लिए रोज़ी-रोटी है।',
        },
        keyPoints: [
          { en: 'Mukesh insists on being his own master as a motor mechanic.', hi: 'मुकेश चूड़ी बनाने की परंपरा तोड़कर मोटर मैकेनिक बनने का सपना देखता है।' },
        ],
      },
    ],
    questionIds: ['12-en-1', '12-en-m-8', '12-en-2', '12-en-m-1'],
    secondsPerQuestion: 10,
    baseXP: 125,
    mapCoords: { x: 14, y: 66 },
  },
  {
    id: '12-en-fl-deep',
    grade: '12',
    subjectId: 'english',
    subsectionId: 'flamingo-book',
    order: 2,
    chapterCode: { en: 'Flamingo Prose · Ch. 3–4', hi: 'Flamingo गद्य · पाठ 3–4' },
    title: {
      en: 'Ch. 3 Deep Water & Ch. 4 The Rattrap',
      hi: 'पाठ 3: Deep Water एवं पाठ 4: The Rattrap',
    },
    bossName: { en: 'Ramsjo & YMCA Warden', hi: 'YMCA पूल व रैटट्रैप रक्षक' },
    summaryPoints: [
      {
        en: 'William Douglas overcame YMCA pool trauma recalling Roosevelt’s "All we have to fear is fear itself".',
        hi: 'विलियम डगलस ने जल-भय पर विजय पाकर रूज़वेल्ट का प्रसिद्ध कथन उद्धृत किया।',
      },
      {
        en: 'Edla Willmansson’s kindness transformed the Rattrap peddler, who signed his letter "Captain von Stahle".',
        hi: 'एडला की करुणा से बदलकर रैटट्रैप फेरीवाले ने पत्र पर "Captain von Stahle" हस्ताक्षर किए।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Flamingo Ch. 3–4 Revision Scrolls', hi: 'Flamingo पाठ 3–4 नोट्स' },
        summary: {
          en: 'Selma Lagerlof’s theme: essential goodness can be awakened through love; Douglas hired an instructor for 6 months.',
          hi: 'स्नेह और सम्मान से बुरे से बुरे व्यक्ति के भीतर की अच्छाई को जगाया जा सकता है।',
        },
        keyPoints: [
          { en: 'Peddler returned stolen 30 kronor as Christmas present to Edla.', hi: 'फेरीवाले ने चुराए हुए 30 क्रोनोर एडला को वापस लौटा दिए।' },
        ],
      },
    ],
    questionIds: ['12-en-6', '12-en-m-2', '12-en-7', '12-en-m-3'],
    secondsPerQuestion: 10,
    baseXP: 135,
    mapCoords: { x: 28, y: 42 },
  },
  {
    id: '12-en-fl2',
    grade: '12',
    subjectId: 'english',
    subsectionId: 'flamingo-book',
    order: 3,
    chapterCode: { en: 'Flamingo Prose · Ch. 5–8', hi: 'Flamingo गद्य · पाठ 5–8' },
    title: {
      en: 'Indigo, Poets & Pancakes, The Interview & Going Places',
      hi: 'Indigo, Poets & Pancakes, The Interview व Going Places',
    },
    bossName: { en: 'Champaran & Gemini Warden', hi: 'चंपारण व जेमिनी रक्षक' },
    summaryPoints: [
      {
        en: 'Gandhi’s Champaran Satyagraha (Rajkumar Shukla, 25% refund); Gemini Studios (Asokamitran); Umberto Eco & Danny Casey.',
        hi: 'गांधीजी का चंपारण सत्याग्रह (25% वापसी); जेमिनी स्टूडियो; अम्बर्टो इको व डैनी केसी।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Flamingo Prose Ch. 5–8 Summary', hi: 'Indigo से Going Places तक सार' },
        summary: {
          en: 'Gandhi accepted 25% landlord refund because breaking landlord prestige mattered more than money; Sophie daydreamed about Irish footballer Danny Casey.',
          hi: 'सोफी आयरिश फुटबॉलर डैनी केसी से मिलने की कल्पना करती थी।',
        },
        keyPoints: [
          { en: 'Champaran marked the beginning of Gandhi’s civil disobedience in India.', hi: 'चंपारण से किसानों का भय समाप्त हुआ और आत्मनिर्भरता का पाठ मिला।' },
        ],
      },
    ],
    questionIds: ['12-en-8', '12-en-13', '12-en-m-4', '12-en-m-10'],
    secondsPerQuestion: 10,
    baseXP: 145,
    mapCoords: { x: 44, y: 64 },
  },
  {
    id: '12-en-poems',
    grade: '12',
    subjectId: 'english',
    subsectionId: 'flamingo-book',
    order: 4,
    chapterCode: { en: 'Flamingo Poetry · Poems 1–5', hi: 'Flamingo काव्य · सभी 5 कविताएँ' },
    title: {
      en: 'Mother at 66, Keeping Quiet, Thing of Beauty, Roadside Stand & Aunt Jennifer',
      hi: 'कमला दास, नेरुदा, जॉन कीट्स, रॉबर्ट फ्रॉस्ट व एड्रिएन रिच',
    },
    bossName: { en: 'Keats Lyric Guardian', hi: 'फ्लेमिंगो काव्य रक्षक' },
    summaryPoints: [
      {
        en: 'All 5 Flamingo Poems: late winter’s moon simile, count to 12 silence, Keats’ eternal beauty removing dark "pall", Aunt Jennifer’s fearless tigers.',
        hi: 'पाँचों कविताएँ: "late winter’s moon" उपमा, 12 तक गिनने की शांति, कीट्स का शाश्वत सौंदर्य व आंट जेनिफर के निडर बाघ।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'All 5 Flamingo Poems Poetic Devices', hi: 'पाँचों कविताओं के मुख्य बिंदु व अलंकार' },
        summary: {
          en: 'Kamala Das uses smile to hide parting fear; Pablo Neruda advocates introspection without total inactivity (not death); Keats opens "A Thing of Beauty is a joy forever".',
          hi: 'पाब्लो नेरुदा निष्क्रियता नहीं बल्कि आत्ममंथन की मौन शांति की बात करते हैं; कीट्स कहते हैं सुंदरता निराशा का पर्दा (pall) हटाती है।',
        },
        keyPoints: [
          { en: 'Tigers stitched by Aunt Jennifer remain proud and unafraid even after her death.', hi: 'आंट जेनिफर के बनाए बाघ उनके जीवन के विपरीत निडर और स्वतंत्र हैं।' },
        ],
      },
    ],
    questionIds: ['12-en-5', '12-en-11', '12-en-14', '12-en-m-5'],
    secondsPerQuestion: 10,
    baseXP: 150,
    mapCoords: { x: 58, y: 40 },
  },
  {
    id: '12-en-vis',
    grade: '12',
    subjectId: 'english',
    subsectionId: 'vistas-book',
    order: 5,
    chapterCode: { en: 'Vistas · Ch. 1–3', hi: 'Vistas · पाठ 1–3' },
    title: {
      en: 'The Third Level, The Tiger King & Journey to End of Earth',
      hi: 'The Third Level, The Tiger King व Antarctica यात्रा',
    },
    bossName: { en: 'Galesburg & Tiger Warden', hi: 'थर्ड लेवल व टाइगर किंग प्रहरी' },
    summaryPoints: [
      {
        en: 'Charley’s Galesburg 1894 ticket; Maharaja killed 99 live tigers then fell to a splinter from a wooden toy tiger!',
        hi: 'चार्ली का थर्ड लेवल; 99 बाघ मारने के बाद लकड़ी के खिलौने वाले बाघ की फांस से टाइगर किंग की मृत्यु हुई।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Vistas Ch. 1–3 Core Highlights', hi: 'विस्टास पाठ 1–3 मुख्य बिंदु' },
        summary: {
          en: 'Psychiatrist Sam declared Third Level a "waking-dream wish fulfillment"—yet bought 1894 currency himself; Antarctica reveals Gondwana’s past.',
          hi: 'मनोचिकित्सक सैम ने इसे "waking-dream wish fulfillment" कहा पर स्वयं 1894 की मुद्रा खरीद ली।',
        },
        keyPoints: [
          { en: 'The wooden toy tiger cost only two annas and a quarter.', hi: 'लकड़ी के बाघ की कील से हुए संक्रमण ने राजा की जान ली।' },
        ],
      },
    ],
    questionIds: ['12-en-15', '12-en-4', '12-en-m-9', '12-en-m-11'],
    secondsPerQuestion: 10,
    baseXP: 155,
    mapCoords: { x: 70, y: 64 },
  },
  {
    id: '12-en-vis2',
    grade: '12',
    subjectId: 'english',
    subsectionId: 'vistas-book',
    order: 6,
    chapterCode: { en: 'Vistas · Ch. 4–6', hi: 'Vistas · पाठ 4–6' },
    title: {
      en: 'The Enemy, On the Face of It & Memories of Childhood',
      hi: 'The Enemy (डॉ. सदाओ), On the Face of It व Memories of Childhood',
    },
    bossName: { en: 'Vistas Citadel Sentinel', hi: 'डॉ. सदाओ व मिस्टर लैम्ब रक्षक' },
    summaryPoints: [
      {
        en: 'Dr. Sadao saved American POW Tom placing medical oath above war; Mr. Lamb had a tin leg and welcomed Derry.',
        hi: 'डॉ. सदाओ ने चिकित्सक धर्म निभाकर अमेरिकी युद्धबंदी टॉम को बचाया; मिस्टर लैम्ब टिन का पैर लगाते थे।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Vistas Ch. 4–6 Notes', hi: 'विस्टास पाठ 4–6 सार' },
        summary: {
          en: 'Pearl S. Buck’s humanism in wartime Japan; Susan Hill’s message against isolation; Zitkala-Sa & Bama’s resistance to racial/caste oppression.',
          hi: 'मानवता युद्ध की शत्रुता से बड़ी है; ज़िटकला-सा व बामा ने अन्याय के विरुद्ध शिक्षा को हथियार बनाया।',
        },
        keyPoints: [
          { en: 'Children teased Mr. Lamb as "Lamey-Lamb" because of his tin leg lost in war.', hi: 'युद्ध में एक पैर कटने से मिस्टर लैम्ब टिन का पैर लगाते थे।' },
        ],
      },
    ],
    questionIds: ['12-en-12', '12-en-m-6', '12-en-m-7', '12-en-m-12'],
    secondsPerQuestion: 10,
    baseXP: 165,
    mapCoords: { x: 80, y: 38 },
  },
  {
    id: '12-en-grm',
    grade: '12',
    subjectId: 'english',
    subsectionId: 'grammar-book',
    order: 7,
    chapterCode: { en: 'Section C · Grammar & Transformations', hi: 'खंड C · उच्च स्तरीय ग्रामर' },
    title: {
      en: 'Determiners, Prepositions, Non-Finites, Clauses & Voice Traps',
      hi: 'डिटरमिनर्स, प्रीपोज़िशन, नॉन-फाइनाइट्स व क्लॉज़ नियम',
    },
    bossName: { en: 'Rhetoric Sovereign', hi: 'वाक् सम्राट' },
    summaryPoints: [
      {
        en: '"Fond of", "Senior/Junior/Inferior + to", "Hardly...when", "No sooner...than", gerund vs infinitive traps.',
        hi: '"Senior/Prefer + to", "No sooner...than", "Hardly...when" एवं "little / a little" नियम।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Class 12th Board Exam Grammar Precision', hi: 'कक्षा 12वीं बोर्ड ग्रामर अचूक नियम' },
        summary: {
          en: 'Latin comparatives (junior, senior, superior, inferior, prior) and "prefer" take "to", NEVER "than". Passive after "know" takes "to" ("known to me").',
          hi: 'Senior/Junior/Prefer के बाद "than" नहीं बल्कि "to" लगता है; "known by" की जगह "known to" होता है।',
        },
        keyPoints: [
          { en: '"Too...to" transforms to "So...that...cannot/could not".', hi: 'जैसे: "He is too weak to walk" → "He is so weak that he cannot walk".' },
        ],
      },
    ],
    questionIds: ['12-en-3', '12-en-9', '12-en-10', '12-en-15', '12-en-tricky-1', '12-en-tricky-2'],
    secondsPerQuestion: 10,
    baseXP: 175,
    mapCoords: { x: 90, y: 58 },
  },

  // ==================== CLASS 12 · MATHS (7 STAGES COVERING PART I CH. 1–6 & PART II CH. 7–13) ====================
  {
    id: '12-ma-p1a',
    grade: '12',
    subjectId: 'maths',
    subsectionId: 'maths-part-1',
    order: 1,
    chapterCode: { en: 'NCERT Part I · Ch. 1 & 2', hi: 'NCERT भाग 1 · अध्याय 1 व 2' },
    title: {
      en: 'Ch. 1 Relations & Functions and Ch. 2 Inverse Trigonometric Functions',
      hi: 'अध्याय 1: संबंध एवं फलन तथा अध्याय 2: प्रतिलोम त्रिकोणमितीय फलन',
    },
    bossName: { en: 'Bijection Sentinel', hi: 'तुल्यता व प्रतिलोम प्रहरी' },
    summaryPoints: [
      {
        en: 'Equivalence relation = Reflexive + Symmetric + Transitive; sin⁻¹x principal branch = [−π/2, π/2], cos⁻¹x = [0, π].',
        hi: 'तुल्यता संबंध = स्वतुल्य + सममित + संक्रामक; sin⁻¹x का मुख्य मान [−π/2, π/2]।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 1 & 2 Principal Values & Bijections', hi: 'अध्याय 1–2 मुख्य मान शाखाएँ व फलन' },
        summary: {
          en: 'One-one + Onto = Bijective (invertible). Watch domain trap: sin⁻¹(sin 2π/3) = π/3, NOT 2π/3!',
          hi: 'सावधानी: sin⁻¹(sin 2π/3) का मान 2π/3 नहीं बल्कि π/3 होगा क्योंकि यह मुख्य शाखा के बाहर है।',
        },
        keyPoints: [
          { en: 'tan⁻¹(1) + cos⁻¹(−½) + sin⁻¹(−½) = π/4 + 2π/3 − π/6 = 3π/4.', hi: 'sin⁻¹x + cos⁻¹x = π/2 सभी x ∈ [−1, 1] के लिए सत्य है।' },
        ],
      },
    ],
    questionIds: ['12-ma-12', '12-ma-m-1', '12-ma-1', '12-ma-13', '12-ma-m-2'],
    secondsPerQuestion: 10,
    baseXP: 130,
    mapCoords: { x: 14, y: 66 },
  },
  {
    id: '12-ma-p1b',
    grade: '12',
    subjectId: 'maths',
    subsectionId: 'maths-part-1',
    order: 2,
    chapterCode: { en: 'NCERT Part I · Ch. 3 & 4', hi: 'NCERT भाग 1 · अध्याय 3 व 4' },
    title: {
      en: 'Ch. 3 Matrices and Ch. 4 Determinants',
      hi: 'अध्याय 3: आव्यूह एवं अध्याय 4: सारणिक',
    },
    bossName: { en: 'Matrix Determinant Warden', hi: 'आव्यूह व सारणिक रक्षक' },
    summaryPoints: [
      {
        en: 'Skew-symmetric matrix Aᵀ = −A always has all diagonal elements = 0; |kA| = kⁿ|A| for n×n matrix.',
        hi: 'विषम सममित आव्यूह के मुख्य विकर्ण के सभी अवयव शून्य होते हैं; |kA| = kⁿ|A|।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 3–4 Matrix & Adjoint Laws', hi: 'अध्याय 3–4 आव्यूह व सहखंडज सूत्र' },
        summary: {
          en: 'A⁻¹ = adj(A)/|A| exists iff |A| ≠ 0 (non-singular). Notice |adj(A)| = |A|ⁿ⁻¹.',
          hi: '|adj(A)| = |A|ⁿ⁻¹ होता है; किसी 3×3 आव्यूह के लिए |2A| = 8|A| होगा।',
        },
        keyPoints: [
          { en: 'Area of triangle using determinant is ½ |x₁(y₂−y₃)...|.', hi: '(AB)⁻¹ = B⁻¹A⁻¹ तथा (AB)ᵀ = BᵀAᵀ (उल्टा क्रम)।' },
        ],
      },
    ],
    questionIds: ['12-ma-3', '12-ma-14', '12-ma-2', '12-ma-m-3'],
    secondsPerQuestion: 10,
    baseXP: 145,
    mapCoords: { x: 28, y: 42 },
  },
  {
    id: '12-ma-p1c',
    grade: '12',
    subjectId: 'maths',
    subsectionId: 'maths-part-1',
    order: 3,
    chapterCode: { en: 'NCERT Part I · Ch. 5 & 6', hi: 'NCERT भाग 1 · अध्याय 5 व 6' },
    title: {
      en: 'Ch. 5 Continuity & Differentiability and Ch. 6 Applications of Derivatives',
      hi: 'अध्याय 5: सांतत्य व अवकलनीयता तथा अध्याय 6: अवकलज के अनुप्रयोग',
    },
    bossName: { en: 'Derivative Summit Guardian', hi: 'अवकलन शिखर प्रहरी' },
    summaryPoints: [
      {
        en: 'Every differentiable function is continuous, converse need not hold (|x| at x=0); Circle Area rate dA/dr = 2πr.',
        hi: 'प्रत्येक अवकलनीय फलन संतत होता है पर विलोम आवश्यक नहीं (जैसे |x|, x=0 पर); dA/dr = 2πr।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Derivatives, Increasing/Decreasing & Maxima', hi: 'अवकलन, वर्धमान-ह्रासमान व उच्चिष्ठ-निम्निष्ठ' },
        summary: {
          en: 'Second Derivative Test: at f′(c)=0, f″(c) < 0 → Local Max; f″(c) > 0 → Local Min.',
          hi: 'यदि f′(c) = 0 और f″(c) < 0 तो स्थानीय उच्चिष्ठ; f″(c) > 0 तो स्थानीय निम्निष्ठ।',
        },
        keyPoints: [
          { en: 'd/dx(aˣ) = aˣ logₑ a; d/dx(tan⁻¹x) = 1/(1+x²).', hi: 'd/dx(sin⁻¹x + cos⁻¹x) = 0 क्योंकि इनका योग अचर π/2 होता है।' },
        ],
      },
    ],
    questionIds: ['12-ma-6', '12-ma-tricky-1', '12-ma-m-4', '12-ma-m-9'],
    secondsPerQuestion: 10,
    baseXP: 150,
    mapCoords: { x: 44, y: 64 },
  },
  {
    id: '12-ma-p2a',
    grade: '12',
    subjectId: 'maths',
    subsectionId: 'maths-part-2',
    order: 4,
    chapterCode: { en: 'NCERT Part II · Ch. 7 & 8', hi: 'NCERT भाग 2 · अध्याय 7 व 8' },
    title: {
      en: 'Ch. 7 Integrals & Ch. 8 Application of Integrals (Curve Areas)',
      hi: 'अध्याय 7: समाकलन व अध्याय 8: समाकलनों के अनुप्रयोग',
    },
    bossName: { en: 'Integral Colossus', hi: 'समाकलन महारथी' },
    summaryPoints: [
      {
        en: '∫ eˣ[f(x)+f′(x)]dx = eˣf(x)+C; Odd function f(−x)=−f(x) integrates to 0 over [−a, a].',
        hi: '∫ eˣ[f(x)+f′(x)]dx = eˣf(x)+C; विषम फलन का [−a, a] पर समाकलन सदैव 0 होता है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Indefinite, Definite Integrals & King’s Property', hi: 'निश्चित व अनिश्चित समाकलन गुणधर्म' },
        summary: {
          en: 'King’s property ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a−x)dx solves tricky sin/cos fractions in seconds.',
          hi: 'प्रगुण ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a−x)dx से sin/(sin+cos) वाले प्रश्न सीधे π/4 या π/2 देते हैं।',
        },
        keyPoints: [
          { en: 'Area of ellipse x²/a² + y²/b² = 1 is πab; Circle x²+y²=r² is πr².', hi: 'दीर्घवृत्त का क्षेत्रफल = πab।' },
        ],
      },
    ],
    questionIds: ['12-ma-4', '12-ma-10', '12-ma-11', '12-ma-tricky-2'],
    secondsPerQuestion: 10,
    baseXP: 160,
    mapCoords: { x: 58, y: 40 },
  },
  {
    id: '12-ma-ode',
    grade: '12',
    subjectId: 'maths',
    subsectionId: 'maths-part-2',
    order: 5,
    chapterCode: { en: 'NCERT Part II · Ch. 9', hi: 'NCERT भाग 2 · अध्याय 9' },
    title: {
      en: 'Ch. 9: Differential Equations (Order, Degree, IF & Solutions)',
      hi: 'अध्याय 9: अवकल समीकरण (कोटि, घात व समाकलन गुणांक)',
    },
    bossName: { en: 'ODE Order-Degree Warden', hi: 'अवकल समीकरण प्रहरी' },
    summaryPoints: [
      {
        en: 'Order = highest derivative; Degree = highest power when equation is polynomial in derivatives (else Not Defined!).',
        hi: 'उच्चतम अवकलज की संख्या कोटि है; यदि अवकलज sin/cos/log में फँसा हो तो घात परिभाषित नहीं होती।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 9 Order, Degree & Linear ODE', hi: 'अध्याय 9 कोटि, घात व रैखिक समीकरण' },
        summary: {
          en: 'Integrating Factor (IF) for dy/dx + Py = Q is e^∫Pdx.',
          hi: 'रैखिक अवकल समीकरण dy/dx + Py = Q के लिए समाकलन गुणांक IF = e^∫Pdx होता है।',
        },
        keyPoints: [
          { en: 'Watch trap: (d²y/dx²)³ + cos(dy/dx) = 0 has Order = 2, Degree = Not Defined.', hi: 'cos(dy/dx) होने पर घात (Degree) परिभाषित नहीं होती।' },
        ],
      },
    ],
    questionIds: ['12-ma-5', '12-ma-15', '12-ma-m-5', '12-ma-m-10'],
    secondsPerQuestion: 10,
    baseXP: 165,
    mapCoords: { x: 70, y: 64 },
  },
  {
    id: '12-ma-vec',
    grade: '12',
    subjectId: 'maths',
    subsectionId: 'maths-part-2',
    order: 6,
    chapterCode: { en: 'NCERT Part II · Ch. 10 & 11', hi: 'NCERT भाग 2 · अध्याय 10 व 11' },
    title: {
      en: 'Ch. 10 Vector Algebra & Ch. 11 Three-Dimensional Geometry',
      hi: 'अध्याय 10: सदिश बीजगणित व अध्याय 11: त्रिविमीय ज्यामिति',
    },
    bossName: { en: 'Vector Space Sentinel', hi: 'सदिश व 3D ज्यामिति रक्षक' },
    summaryPoints: [
      {
        en: 'Direction Cosines satisfy l² + m² + n² = 1; Perpendicular vectors satisfy a⃗ · b⃗ = 0; Parallel satisfy a⃗ × b⃗ = 0⃗.',
        hi: 'दिक्-कोसाइन l² + m² + n² = 1; लंबवत सदिशों के लिए a⃗ · b⃗ = 0।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Dot, Cross Products & 3D Lines', hi: 'अदिश-सदिश गुणनफल व 3D रेखाएँ' },
        summary: {
          en: 'i·i = j·j = k·k = 1; i×j = k; Shortest distance between skew lines uses |(a₂−a₁)·(b₁×b₂)| / |b₁×b₂|.',
          hi: 'विषमतलीय रेखाओं के बीच की न्यूनतम दूरी का सूत्र MP बोर्ड 4/5-अंक में अत्यंत महत्वपूर्ण है।',
        },
        keyPoints: [
          { en: 'Unit vector along a⃗ is a⃗ / |a⃗|.', hi: 'दो लंबवत सदिशों का डॉट गुणनफल सदैव शून्य होता है।' },
        ],
      },
    ],
    questionIds: ['12-ma-7', '12-ma-m-7', '12-ma-8', '12-ma-m-6'],
    secondsPerQuestion: 10,
    baseXP: 170,
    mapCoords: { x: 80, y: 38 },
  },
  {
    id: '12-ma-p2b',
    grade: '12',
    subjectId: 'maths',
    subsectionId: 'maths-part-2',
    order: 7,
    chapterCode: { en: 'NCERT Part II · Ch. 12 & 13', hi: 'NCERT भाग 2 · अध्याय 12 व 13' },
    title: {
      en: 'Ch. 12 Linear Programming (LPP) & Ch. 13 Probability (Bayes)',
      hi: 'अध्याय 12: रैखिक प्रोग्रामन (LPP) व अध्याय 13: प्रायिकता',
    },
    bossName: { en: 'Vector & Probability Sovereign', hi: 'LPP व प्रायिकता सम्राट' },
    summaryPoints: [
      {
        en: 'Corner Point Theorem in LPP; Conditional P(A|B) = P(A∩B)/P(B); Independent events P(A∩B) = P(A)P(B); Bayes’ Theorem.',
        hi: 'कोनीय बिंदु प्रमेय (LPP); स्वतंत्र घटनाओं में P(A∩B) = P(A)P(B) व बेज़ प्रमेय।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'LPP Corner Theorem & Probability Rules', hi: 'LPP कोनीय बिंदु प्रमेय व प्रायिकता नियम' },
        summary: {
          en: 'In bounded LPP, maximum/minimum value of Z = ax + by always lies at a corner vertex of feasible region.',
          hi: 'परिबद्ध LPP में इष्टतम मान सदैव सुसंगत क्षेत्र के शीर्ष (कोनीय बिंदु) पर मिलता है।',
        },
        keyPoints: [
          { en: 'For independent A & B with P(A)=0.4, P(B)=0.5 → P(A∩B) = 0.2.', hi: 'स्वतंत्र घटनाओं के लिए P(A∩B) = P(A)·P(B)।' },
        ],
      },
    ],
    questionIds: ['12-ma-lpp-1', '12-ma-9', '12-ma-m-8', '12-ma-m-11'],
    secondsPerQuestion: 10,
    baseXP: 175,
    mapCoords: { x: 90, y: 58 },
  },

  // ==================== CLASS 12 · PHYSICS (6 STAGES COVERING PART I CH. 1–8 & PART II CH. 9–14) ====================
  {
    id: '12-ph-p1a',
    grade: '12',
    subjectId: 'physics',
    subsectionId: 'physics-part-1',
    order: 1,
    chapterCode: { en: 'NCERT Part I · Ch. 1 & 2', hi: 'NCERT भाग 1 · अध्याय 1 व 2' },
    title: {
      en: 'Ch. 1 Electric Charges & Fields and Ch. 2 Potential & Capacitance',
      hi: 'अध्याय 1: विद्युत आवेश-क्षेत्र व अध्याय 2: विभव व संधारित्र',
    },
    bossName: { en: 'Electrostatic Bastion Boss', hi: 'स्थिरवैद्युत दुर्ग प्रहरी' },
    summaryPoints: [
      {
        en: 'Gauss Law Φ = q/ε₀; Dipole equatorial V = 0 (while E ≠ 0!); Parallel plate Capacitance C = ε₀A/d.',
        hi: 'गॉस प्रमेय Φ = q/ε₀; निरक्षीय रेखा पर विभव V = 0; समांतर प्लेट संधारित्र C = ε₀A/d।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Gauss Law, Dipole Potential & Capacitors', hi: 'गॉस नियम, विभव व संधारित्र संयोजन' },
        summary: {
          en: 'Series capacitance reduces 1/C = 1/C₁+1/C₂; Parallel adds C = C₁+C₂. Energy stored U = ½CV².',
          hi: 'विद्युत द्विध्रुव की निरक्षीय स्थिति में विभव शून्य (V=0) होता है जबकि विद्युत क्षेत्र शून्य नहीं होता!',
        },
        keyPoints: [
          { en: 'Gauss surface flux depends only on enclosed charge, never on surface size or shape.', hi: 'गौसीय पृष्ठ से निकलने वाला फ्लक्स केवल परिबद्ध आवेश पर निर्भर करता है।' },
        ],
      },
    ],
    questionIds: ['12-ph-1', '12-ph-tricky-1', '12-ph-2', '12-ph-13', '12-ph-m-1'],
    secondsPerQuestion: 10,
    baseXP: 130,
    mapCoords: { x: 14, y: 66 },
  },
  {
    id: '12-ph-current',
    grade: '12',
    subjectId: 'physics',
    subsectionId: 'physics-part-1',
    order: 2,
    chapterCode: { en: 'NCERT Part I · Ch. 3, 4 & 5', hi: 'NCERT भाग 1 · अध्याय 3, 4 व 5' },
    title: {
      en: 'Ch. 3 Current Electricity, Ch. 4 Moving Charges & Ch. 5 Magnetism',
      hi: 'अध्याय 3: विद्युत धारा, 4: गतिमान आवेश व 5: चुंबकत्व',
    },
    bossName: { en: 'Kirchhoff & Lorentz Warden', hi: 'किरचॉफ व चुंबकत्व प्रहरी' },
    summaryPoints: [
      {
        en: 'Kirchhoff Junction Rule (Charge) & Loop Rule (Energy); Lorentz Force F = q(v×B); Shunt converts Galvanometer to Ammeter.',
        hi: 'किरचॉफ का 1st नियम (आवेश संरक्षण) व 2nd नियम (ऊर्जा संरक्षण); शंट द्वारा ऐमीटर रूपांतरण।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Kirchhoff, Wheatstone & Galvanometer Conversion', hi: 'धारा, व्हीटस्टोन सेतु व गैल्वेनोमीटर' },
        summary: {
          en: 'Ammeter = low shunt resistance in parallel; Voltmeter = high resistance in series; Wheatstone balance P/Q = R/S.',
          hi: 'कम प्रतिरोध (शंट) समांतर में लगाने पर गैल्वेनोमीटर ऐमीटर बनता है; आदर्श वोल्टमीटर का प्रतिरोध अनंत होता है।',
        },
        keyPoints: [
          { en: 'Specific resistance (resistivity ρ) depends only on material & temperature, not wire length.', hi: 'विशिष्ट प्रतिरोध (ρ) केवल पदार्थ की प्रकृति व ताप पर निर्भर करता है।' },
        ],
      },
    ],
    questionIds: ['12-ph-3', '12-ph-m-2', '12-ph-7', '12-ph-14'],
    secondsPerQuestion: 10,
    baseXP: 145,
    mapCoords: { x: 28, y: 42 },
  },
  {
    id: '12-ph-p1b',
    grade: '12',
    subjectId: 'physics',
    subsectionId: 'physics-part-1',
    order: 3,
    chapterCode: { en: 'NCERT Part I · Ch. 6, 7 & 8', hi: 'NCERT भाग 1 · अध्याय 6, 7 व 8' },
    title: {
      en: 'Ch. 6 EM Induction, Ch. 7 Alternating Current & Ch. 8 EM Waves',
      hi: 'अध्याय 6: विद्युतचुंबकीय प्रेरण, 7: प्रत्यावर्ती धारा व 8: EM तरंगें',
    },
    bossName: { en: 'Maxwell Flux Overlord', hi: 'फ्लक्स व तरंग अधिपति' },
    summaryPoints: [
      {
        en: 'Faraday-Lenz Law (conservation of energy); AC Resonance X_L = X_C (cos φ = 1); Maxwell EM waves.',
        hi: 'लेन्ज़ नियम (ऊर्जा संरक्षण); AC अनुनाद पर शक्ति गुणांक cos φ = 1; विस्थापन धारा व EM तरंगें।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Lenz Law, AC Resonance, Transformer & EM Spectrum', hi: 'प्रेरण, अनुनाद, ट्रांसफॉर्मर व EM स्पेक्ट्रम' },
        summary: {
          en: 'Transformer works ONLY on AC via mutual induction; Gamma rays have shortest wavelength, Radio waves longest.',
          hi: 'ट्रांसफॉर्मर अन्योन्य प्रेरण पर केवल AC में कार्य करता है; गामा किरणों की तरंगदैर्ध्य न्यूनतम व रेडियो की अधिकतम।',
        },
        keyPoints: [
          { en: 'At AC series resonance, Z = R (minimum impedance) and current is maximum.', hi: 'अनुनाद पर प्रतिबाधा Z = R न्यूनतम व धारा अधिकतम होती है।' },
        ],
      },
    ],
    questionIds: ['12-ph-4', '12-ph-m-3', '12-ph-8', '12-ph-6'],
    secondsPerQuestion: 10,
    baseXP: 155,
    mapCoords: { x: 46, y: 64 },
  },
  {
    id: '12-ph-p2a',
    grade: '12',
    subjectId: 'physics',
    subsectionId: 'physics-part-2',
    order: 4,
    chapterCode: { en: 'NCERT Part II · Ch. 9 & 10', hi: 'NCERT भाग 2 · अध्याय 9 व 10' },
    title: {
      en: 'Ch. 9 Ray Optics & Optical Instruments and Ch. 10 Wave Optics',
      hi: 'अध्याय 9: किरण प्रकाशिकी व अध्याय 10: तरंग प्रकाशिकी',
    },
    bossName: { en: 'Optics Prism Warden', hi: 'किरण व तरंग प्रकाशिकी प्रहरी' },
    summaryPoints: [
      {
        en: 'Total Internal Reflection (Optical fibre); Lens in equal-μ liquid → f = ∞ (invisible); YDSE β = λD/d.',
        hi: 'पूर्ण आंतरिक परावर्तन (ऑप्टिकल फाइबर); समान अपवर्तनांक द्रव में लेंस f = ∞; YDSE फ्रिंज चौड़ाई β = λD/d।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ray & Wave Optics Key Board Formulas', hi: 'प्रकाशिकी व व्यतिकरण मुख्य नियम' },
        summary: {
          en: 'Glass lens (μ=1.5) dipped in liquid of μ=1.5 has infinite focal length (acts like plane glass plate). Halving slit spacing d doubles fringe width β.',
          hi: 'लेंस को समान अपवर्तनांक के द्रव में डुबोने पर फोकस दूरी अनंत व क्षमता शून्य हो जाती है; d आधा करने पर फ्रिंज चौड़ाई दोगुनी।',
        },
        keyPoints: [
          { en: 'Lens Maker’s Formula: 1/f = (μ₂/μ₁ − 1)(1/R₁ − 1/R₂).', hi: 'तरंगाग्र (Wavefront) के लंबवत किरणें चलती हैं।' },
        ],
      },
    ],
    questionIds: ['12-ph-9', '12-ph-15', '12-ph-m-6', '12-ph-11', '12-ph-m-4'],
    secondsPerQuestion: 10,
    baseXP: 165,
    mapCoords: { x: 64, y: 38 },
  },
  {
    id: '12-ph-dual',
    grade: '12',
    subjectId: 'physics',
    subsectionId: 'physics-part-2',
    order: 5,
    chapterCode: { en: 'NCERT Part II · Ch. 11, 12 & 13', hi: 'NCERT भाग 2 · अध्याय 11, 12 व 13' },
    title: {
      en: 'Ch. 11 Dual Nature, Ch. 12 Atoms (Bohr) & Ch. 13 Nuclei',
      hi: 'अध्याय 11: द्रव्य द्वैत प्रकृति, 12: परमाणु व 13: नाभिक',
    },
    bossName: { en: 'Bohr Photon Sentinel', hi: 'फोटॉन व नाभिक रक्षक' },
    summaryPoints: [
      {
        en: 'Einstein Eq: K_max = hν − Φ₀ (depends on frequency, not intensity); Bohr rₙ ∝ n², Eₙ = −13.6/n² eV; Nuclear density independent of A.',
        hi: 'आइंस्टीन समीकरण K_max = hν − Φ₀; बोर त्रिज्या rₙ ∝ n²; नाभिकीय घनत्व द्रव्यमान संख्या A पर निर्भर नहीं करता।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Photoelectric Effect, Bohr Atom & Nuclear Binding', hi: 'प्रकाश-विद्युत, बोर मॉडल व नाभिकीय बंधन ऊर्जा' },
        summary: {
          en: 'De Broglie λ = h/mv; Fe-56 has highest binding energy per nucleon (~8.75 MeV); Threshold frequency ν₀ is minimum required.',
          hi: 'देहेली आवृत्ति से कम पर प्रकाश-इलेक्ट्रॉन उत्सर्जित नहीं होते, चाहे तीव्रता कितनी भी हो।',
        },
        keyPoints: [
          { en: 'Stopping potential V₀ increases linearly with incident light frequency ν.', hi: 'निरोधी विभव प्रकाश की आवृत्ति पर निर्भर करता है।' },
        ],
      },
    ],
    questionIds: ['12-ph-10', '12-ph-m-7', '12-ph-atoms-1', '12-ph-m-8'],
    secondsPerQuestion: 10,
    baseXP: 170,
    mapCoords: { x: 78, y: 62 },
  },
  {
    id: '12-ph-p2b',
    grade: '12',
    subjectId: 'physics',
    subsectionId: 'physics-part-2',
    order: 6,
    chapterCode: { en: 'NCERT Part II · Ch. 14', hi: 'NCERT भाग 2 · अध्याय 14' },
    title: {
      en: 'Ch. 14: Semiconductor Electronics, Diodes & Logic Gates',
      hi: 'अध्याय 14: अर्धचालक इलेक्ट्रॉनिकी, डायोड व लॉजिक गेट',
    },
    bossName: { en: 'Quantum Logic Overlord', hi: 'अर्धचालक व लॉजिक गेट सम्राट' },
    summaryPoints: [
      {
        en: 'At 0 K intrinsic semiconductor acts as perfect insulator; n-type (pentavalent P, As), p-type (trivalent B, In); NAND & NOR = Universal Gates.',
        hi: '0 K पर शुद्ध अर्धचालक कुचालक होता है; NAND व NOR सार्वत्रिक लॉजिक गेट हैं।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Semiconductors, Rectifiers, Zener & Logic Gates', hi: 'अर्धचालक, दिष्टकारी, ज़ेनर व लॉजिक गेट' },
        summary: {
          en: 'p-n junction diode works as Half/Full-wave Rectifier; Zener diode regulates voltage in reverse breakdown.',
          hi: 'n-type में मुख्य आवेश वाहक इलेक्ट्रॉन व p-type में होल्स (विवर) होते हैं।',
        },
        keyPoints: [
          { en: 'NAND and NOR gates can construct NOT, AND, and OR gates.', hi: 'NAND व NOR सार्वत्रिक (Universal) गेट कहलाते हैं।' },
        ],
      },
    ],
    questionIds: ['12-ph-5', '12-ph-12', '12-ph-tricky-2', '12-ph-m-5'],
    secondsPerQuestion: 10,
    baseXP: 175,
    mapCoords: { x: 90, y: 40 },
  },

  // ==================== CLASS 12 · CHEMISTRY (6 STAGES COVERING ALL 10 NEW NCERT CHAPTERS) ====================
  {
    id: '12-ch-p1a',
    grade: '12',
    subjectId: 'chemistry',
    subsectionId: 'chem-part-1',
    order: 1,
    chapterCode: { en: 'NCERT Part I · Ch. 1', hi: 'NCERT भाग 1 · अध्याय 1' },
    title: {
      en: 'Ch. 1: Solutions (Henry, Raoult, Colligative & Van’t Hoff i)',
      hi: 'अध्याय 1: विलयन (हेनरी, राउल्ट, अणुसंख्य गुणधर्म व i)',
    },
    bossName: { en: 'Osmosis Pressure Warden', hi: 'विलयन व परासरण प्रहरी' },
    summaryPoints: [
      {
        en: '1 M NaCl has i=2 (higher boiling point than 1 M glucose/urea where i=1!); Henry’s Law p = K_H x.',
        hi: '1 M NaCl (i=2) का क्वथनांक 1 M ग्लूकोज़/यूरिया (i=1) से अधिक होता है; हेनरी नियम p = K_H x।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 1 Solutions & Colligative Properties', hi: 'अध्याय 1 अणुसंख्य गुणधर्म व वॉन्ट हॉफ गुणांक' },
        summary: {
          en: '4 Colligative properties depend on number of solute particles, NOT nature: RLVP, ΔT_b, ΔT_f, Osmotic Pressure π = CRT.',
          hi: 'चार अणुसंख्य गुणधर्म विलेय कणों की संख्या पर निर्भर करते हैं (प्रकृति पर नहीं)।',
        },
        keyPoints: [
          { en: 'Molarity depends on volume (varies with T); Molality (m) is temperature-independent.', hi: 'मोललता (m) ताप से स्वतंत्र रहती है, जबकि मोलरता ताप बदलने पर बदलती है।' },
        ],
      },
    ],
    questionIds: ['12-ch-1', '12-ch-12', '12-ch-tricky-2', '12-ch-m-7'],
    secondsPerQuestion: 10,
    baseXP: 130,
    mapCoords: { x: 14, y: 66 },
  },
  {
    id: '12-ch-kinetics',
    grade: '12',
    subjectId: 'chemistry',
    subsectionId: 'chem-part-1',
    order: 2,
    chapterCode: { en: 'NCERT Part I · Ch. 2 & 3', hi: 'NCERT भाग 1 · अध्याय 2 व 3' },
    title: {
      en: 'Ch. 2 Electrochemistry (Nernst, Kohlrausch) & Ch. 3 Chemical Kinetics',
      hi: 'अध्याय 2: वैद्युतरसायन व अध्याय 3: रासायनिक बलगतिकी',
    },
    bossName: { en: 'Nernst Kinetics Warden', hi: 'नेर्नस्ट व बलगतिकी रक्षक' },
    summaryPoints: [
      {
        en: 'Kohlrausch Law computes Λ°ₘ of weak electrolytes; First-order half-life t₁/₂ = 0.693/k (independent of initial conc.).',
        hi: 'कोलराउश नियम से दुर्बल अपघट्य की सीमांत मोलर चालकता; प्रथम कोटि अर्द्ध-आयु t₁/₂ = 0.693/k।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Electrochemical Cells & Rate Constant Units', hi: 'सेल समीकरण व अभिक्रिया कोटि के मात्रक' },
        summary: {
          en: 'First-order rate constant unit = s⁻¹, Zero-order = mol L⁻¹ s⁻¹. Catalyst lowers activation energy Eₐ without changing ΔH.',
          hi: 'प्रथम कोटि वेग स्थिरांक मात्रक = s⁻¹; शून्य कोटि = mol L⁻¹ s⁻¹। उत्प्रेरक सक्रियण ऊर्जा घटाता है।',
        },
        keyPoints: [
          { en: 'Arrhenius Eq: k = A e^(−Ea/RT).', hi: 'शून्य कोटि की अर्द्ध-आयु प्रारंभिक सान्द्रता के समानुपाती होती है।' },
        ],
      },
    ],
    questionIds: ['12-ch-2', '12-ch-m-1', '12-ch-3', '12-ch-13', '12-ch-14'],
    secondsPerQuestion: 10,
    baseXP: 145,
    mapCoords: { x: 28, y: 42 },
  },
  {
    id: '12-ch-p1b',
    grade: '12',
    subjectId: 'chemistry',
    subsectionId: 'chem-part-1',
    order: 3,
    chapterCode: { en: 'NCERT Part I · Ch. 4 & 5', hi: 'NCERT भाग 1 · अध्याय 4 व 5' },
    title: {
      en: 'Ch. 4 d- & f-Block Elements and Ch. 5 Coordination Compounds',
      hi: 'अध्याय 4: d व f-ब्लॉक के तत्व तथा अध्याय 5: उपसहसंयोजन यौगिक',
    },
    bossName: { en: 'Ligand Crystal Sentinel', hi: 'संक्रमण तत्व व लिगैंड रक्षक' },
    summaryPoints: [
      {
        en: 'Zn, Cd, Hg have full d¹⁰ so not true transition elements; Lanthanoid Contraction makes Zr & Hf radii equal; EDTA⁴⁻ = hexadentate.',
        hi: 'Zn, Cd, Hg संक्रमण तत्व नहीं हैं; लैंथेनॉयड संकुचन से Zr-Hf त्रिज्या समान; EDTA⁴⁻ षट्दंतुर लिगैंड।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Magnetic Moment, Lanthanoid Contraction & Werner Theory', hi: 'चुंबकीय आघूर्ण, लैंथेनॉयड संकुचन व वर्नर सिद्धांत' },
        summary: {
          en: 'Spin-only magnetic moment μ = √[n(n+2)] BM where n = unpaired electrons. [Ni(CO)₄] has Ni(0), tetrahedral.',
          hi: 'चुंबकीय आघूर्ण μ = √[n(n+2)] BM; Zr और Hf की त्रिज्या लैंथेनॉयड संकुचन के कारण लगभग समान होती है।',
        },
        keyPoints: [
          { en: 'Chelate complexes with polydentate ligands (en, EDTA) show extra stability.', hi: '[Ni(CO)₄] में निकेल की ऑक्सीकरण अवस्था 0 होती है।' },
        ],
      },
    ],
    questionIds: ['12-ch-8', '12-ch-m-2', '12-ch-4', '12-ch-15'],
    secondsPerQuestion: 10,
    baseXP: 155,
    mapCoords: { x: 46, y: 64 },
  },
  {
    id: '12-ch-p2a',
    grade: '12',
    subjectId: 'chemistry',
    subsectionId: 'chem-part-2',
    order: 4,
    chapterCode: { en: 'NCERT Part II · Ch. 6 & 7', hi: 'NCERT भाग 2 · अध्याय 6 व 7' },
    title: {
      en: 'Ch. 6 Haloalkanes/Haloarenes & Ch. 7 Alcohols, Phenols, Ethers',
      hi: 'अध्याय 6: हैलोऐल्केन-ऐरीन व अध्याय 7: ऐल्कोहॉल, फीनॉल, ईथर',
    },
    bossName: { en: 'SN1 & Lucas Warden', hi: 'हैलोऐल्केन व फीनॉल रक्षक' },
    summaryPoints: [
      {
        en: 'SN1 (3° > 2° > 1°, racemization) vs SN2 (1° > 2° > 3°, inversion); Lucas test (3° instant); Reimer-Tiemann Phenol → Salicylaldehyde.',
        hi: 'SN1 क्रम 3° > 2° > 1°; ल्यूकास परीक्षण (3° तुरंत); राइमर-टीमैन से फीनॉल → सैलिसिलैल्डिहाइड।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'SN1/SN2 Mechanisms & Phenol Name Reactions', hi: 'SN1/SN2, ल्यूकास परीक्षण व नाम अभिक्रियाएँ' },
        summary: {
          en: 'Chloroform kept in dark coloured bottles filled to brim to prevent Phosgene (COCl₂); Williamson Ether synthesis works best with 1° halide.',
          hi: 'क्लोरोफॉर्म को गहरे रंग की बोतल में भरते हैं ताकि विषैली फॉस्जीन (COCl₂) गैस न बने।',
        },
        keyPoints: [
          { en: 'Lucas reagent = conc. HCl + anhydrous ZnCl₂ (3° alcohol gives instant turbidity).', hi: 'ल्यूकास अभिकर्मक से 1°, 2°, 3° ऐल्कोहॉल में अंतर करते हैं।' },
        ],
      },
    ],
    questionIds: ['12-ch-6', '12-ch-m-6', '12-ch-7', '12-ch-alcohols-1'],
    secondsPerQuestion: 10,
    baseXP: 165,
    mapCoords: { x: 64, y: 38 },
  },
  {
    id: '12-ch-carbonyl',
    grade: '12',
    subjectId: 'chemistry',
    subsectionId: 'chem-part-2',
    order: 5,
    chapterCode: { en: 'NCERT Part II · Ch. 8 & 9', hi: 'NCERT भाग 2 · अध्याय 8 व 9' },
    title: {
      en: 'Ch. 8 Aldehydes/Ketones/Acids & Ch. 9 Amines',
      hi: 'अध्याय 8: ऐल्डिहाइड-कीटोन-अम्ल व अध्याय 9: ऐमीन',
    },
    bossName: { en: 'Carbonyl & Carbylamine Warden', hi: 'कार्बोनिल व ऐमीन प्रहरी' },
    summaryPoints: [
      {
        en: 'Aldehydes without α-H (HCHO, C₆H₅CHO) give Cannizzaro; Carbylamine (1° amines only); Aniline fails Friedel-Crafts due to AlCl₃ salt.',
        hi: 'बिना α-H वाले ऐल्डिहाइड (HCHO) कैनिज़ारो देते हैं; कार्बिलऐमीन केवल 1° ऐमीन देते हैं; ऐनिलीन AlCl₃ से लवण बनाता है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Aldol/Cannizzaro & Amines Distinction Tests', hi: 'ऐल्डोल, कैनिज़ारो, कार्बिलऐमीन व हिन्सबर्ग' },
        summary: {
          en: 'Hinsberg reagent (C₆H₅SO₂Cl) distinguishes 1°, 2°, 3° amines; Gabriel phthalimide prepares pure 1° aliphatic amines (not aniline).',
          hi: 'हिन्सबर्ग अभिकर्मक से 1°, 2°, 3° ऐमीन की पहचान होती है; टॉलेन अभिकर्मक रजत दर्पण देता है।',
        },
        keyPoints: [
          { en: 'Tollens reagent reduces aldehydes to silver mirror (Ag↓), ketones do not respond.', hi: 'ऐनिलीन फ्रीडेल-क्राफ्ट्स अभिक्रिया नहीं देता।' },
        ],
      },
    ],
    questionIds: ['12-ch-9', '12-ch-m-3', '12-ch-10', '12-ch-m-4', '12-ch-tricky-1'],
    secondsPerQuestion: 10,
    baseXP: 170,
    mapCoords: { x: 78, y: 62 },
  },
  {
    id: '12-ch-p2b',
    grade: '12',
    subjectId: 'chemistry',
    subsectionId: 'chem-part-2',
    order: 6,
    chapterCode: { en: 'NCERT Part II · Ch. 10', hi: 'NCERT भाग 2 · अध्याय 10' },
    title: {
      en: 'Ch. 10: Biomolecules (Carbohydrates, Proteins, DNA/RNA & Vitamins)',
      hi: 'अध्याय 10: जैव-अणु (कार्बोहाइड्रेट, प्रोटीन, DNA/RNA व विटामिन)',
    },
    bossName: { en: 'Catalyst Biomolecule Lord', hi: 'उत्प्रेरक व जैव-अणु सम्राट' },
    summaryPoints: [
      {
        en: 'RNA has Uracil instead of DNA’s Thymine; Peptide bond links amino acids; Water-soluble Vitamins B & C.',
        hi: 'RNA में थाइमिन की जगह यूरेसिल होता है; पेप्टाइड बंध अमीनो अम्लों को जोड़ता है; विटामिन B व C जल में विलेय।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Biomolecules Complete Board Review', hi: 'जैव-अणु संपूर्ण बोर्ड रिवीज़न' },
        summary: {
          en: 'Denaturation destroys 2° & 3° protein structures while leaving 1° sequence intact (e.g. boiling egg). Vitamin C deficiency causes Scurvy.',
          hi: 'प्रोटीन विकृतीकरण से 2° व 3° संरचना टूटती है पर प्राथमिक संरचना बनी रहती है; विटामिन C की कमी से स्कर्वी।',
        },
        keyPoints: [
          { en: 'DNA bases: A, G, C, T · RNA bases: A, G, C, U.', hi: 'विटामिन A, D, E, K वसा में विलेय (Fat-soluble) होते हैं।' },
        ],
      },
    ],
    questionIds: ['12-ch-5', '12-ch-11', '12-ch-m-5', '12-ch-m-8'],
    secondsPerQuestion: 10,
    baseXP: 175,
    mapCoords: { x: 90, y: 40 },
  },
];
