import { ChapterNodeDefinition } from '../types/quiz';

// Complete Class 12th New MP Board NCERT Syllabus Nodes (Zero Skipped Chapters)
// Explicitly features dedicated subsections for Kamre Mein Band Apahij, Ras, Alankar, and all Book I/II divisions.
export const SYLLABUS_NODES_12: ChapterNodeDefinition[] = [
  // ==================== CLASS 12 · HINDI ====================
  {
    id: '12-hi-k1',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'kavya-khand',
    order: 1,
    chapterCode: { en: 'Aaroh-2 Kavya · Ch. 1–3', hi: 'आरोह-2 काव्य · पाठ 1–3' },
    title: {
      en: 'Ch. 1 Aatmaparichay / Ek Geet, Ch. 2 Patang & Ch. 3 Kavita ke Bahane',
      hi: 'पाठ 1: आत्मपरिचय / एक गीत, पाठ 2: पतंग व पाठ 3: कविता के बहाने',
    },
    bossName: { en: 'Aaroh Kavya Warden', hi: 'आरोह काव्य प्रहरी' },
    summaryPoints: [
      {
        en: 'Harivansh Rai Bachchan ("Aatmaparichay" & "Din Jaldi Jaldi Dhalta Hai") pioneered Halavad.',
        hi: 'हालावाद के प्रवर्तक हरिवंशराय बच्चन की रचनाएँ "आत्मपरिचय" व "दिन जल्दी-जल्दी ढलता है"।',
      },
      {
        en: 'Alok Dhanva’s "Patang" celebrates autumn’s bright sky; Kunwar Narayan compares poetry’s boundless flight to birds & flowers.',
        hi: 'आलोक धन्वा की "पतंग" शरद ऋतु व बाल-मन की उमंग, तथा कुँवर नारायण की "कविता के बहाने" कविता की असीम उड़ान दर्शाती है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '1. Harivansh Rai Bachchan — Aatmaparichay', hi: '1. आत्मपरिचय व एक गीत (हरिवंशराय बच्चन)' },
        summary: {
          en: 'Balances worldly responsibility with inner love ("मैं जग-जीवन का भार लिए फिरता हूँ, फिर भी जीवन में प्यार लिए फिरता हूँ").',
          hi: 'कवि संसार के दुखों के बीच भी "स्नेह-सुरा" (प्रेम) का पान कर मस्त रहने की बात करते हैं।',
        },
        keyPoints: [
          { en: 'In "Ek Geet", birds hurry home thinking of waiting nestlings—while the poet feels lonely without anyone waiting.', hi: '"दिन जल्दी-जल्दी ढलता है" में पथिक के लक्ष्य पर समय बीतने की व्याकुलता दर्शायी गई है।' },
        ],
      },
      {
        topicTitle: { en: '2–3. Patang (Alok Dhanva) & Kavita ke Bahane (Kunwar Narayan)', hi: '2–3. पतंग (आलोक धन्वा) व कविता के बहाने / बात सीधी थी पर' },
        summary: {
          en: 'Poems soar beyond physical wings or seasonal wilting; "Baat Seedhi Thi Par" warns against forced, artificial jargon.',
          hi: 'चिड़िया व फूल की सीमा है पर कविता व बच्चे का खेल असीमित हैं; "बात सीधी थी पर" भाषा के आडंबर पर व्यंग्य है।',
        },
        keyPoints: [
          { en: 'Sharpest season after Bhado monsoon in "Patang": Sharad Ritu riding his bicycle ringing bright bells.', hi: '"पतंग" में भादो के बाद चमकीली साइकिल चलाते हुए "शरद" ऋतु के आगमन का मानवीकरण है।' },
        ],
      },
    ],
    questionIds: ['12-hi-1', '12-hi-6', '12-hi-13'],
    secondsPerQuestion: 44,
    baseXP: 125,
    mapCoords: { x: 12, y: 68 },
  },
  {
    id: '12-hi-kamre',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'kavya-khand',
    order: 2,
    chapterCode: { en: 'Aaroh-2 Kavya · Ch. 4 (Dedicated)', hi: 'आरोह-2 काव्य · पाठ 4 (समर्पित)' },
    title: {
      en: 'Kamre Mein Band Apahij (Raghuvir Sahay)',
      hi: 'कैमरे में बंद अपाहिज (रघुवीर सहाय)',
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
          en: 'The presenter calls himself "Samarth Shaktivan" and treats the guest as "Durbal", firing cruel questions ("क्या आप अपाहिज क्यों हैं? आपका अपाहिजपन तो दुख देता होगा?").',
          hi: 'संचालक स्वयं को "समर्थ शक्तिवान" मानकर बंद कमरे में अपाहिज से बेतुके व चुभने वाले प्रश्न पूछता है।',
        },
        keyPoints: [
          { en: 'Camera zoom instructions: "कैमरा दिखाओ इसे बड़ा-बड़ा" tries to force tears simultaneously from guest and viewers.', hi: 'संपादक का असली उद्देश्य "सामाजिक उद्देश्य से युक्त कार्यक्रम" के नाम पर दर्शक व पीड़ित दोनों को एक साथ रुलाना है।' },
          { en: 'Climax irony: "बस कीजिए... पर्दे पर वक्त की कीमत है" proves empathy ends wherever studio airtime costs rise.', hi: 'अंतिम पंक्ति "पर्दे पर वक्त की कीमत है" मीडिया के बाज़ारवाद पर सबसे तीखा प्रहार है।' },
        ],
        examTip: { en: 'MP Board PYQ: Anthology source = "Log Bhool Gaye Hain".', hi: 'बोर्ड मुख्य प्रश्न: यह कविता "लोग भूल गए हैं" काव्य संग्रह से ली गई है।' },
      },
    ],
    questionIds: ['12-hi-kamre-1', '12-hi-kamre-2'],
    secondsPerQuestion: 42,
    baseXP: 140,
    mapCoords: { x: 26, y: 40 },
  },
  {
    id: '12-hi-k3',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'kavya-khand',
    order: 3,
    chapterCode: { en: 'Aaroh-2 Kavya · Ch. 5–9', hi: 'आरोह-2 काव्य · पाठ 5–9' },
    title: {
      en: 'Ch. 5 Usha, Ch. 6 Badal Raag, Ch. 7 Kavitavali, Ch. 8 Rubaiyan & Ch. 9 Chhota Mera Khet',
      hi: 'पाठ 5: उषा, 6: बादल राग, 7: कवितावली, 8: रुबाइयाँ व 9: छोटा मेरा खेत',
    },
    bossName: { en: 'Usha-Tulasi Poetry Sovereign', hi: 'काव्य बिंब महाप्रहरी' },
    summaryPoints: [
      {
        en: 'Shamsher’s "Usha" paints dawn via blue conch & wet hearth; Nirala’s "Badal Raag" rallies oppressed farmers.',
        hi: 'शमशेर की "उषा" में नील शंख व राख से लीपा चौका, और निराला के "बादल राग" में शोषित कृषक का आह्वान है।',
      },
      {
        en: 'Tulsidas describes famine & Lakshman Murcha; Firaq depicts maternal love; Umashankar Joshi celebrates eternal poetic Ras.',
        hi: 'तुलसीदास की कवितावली, फ़िराक़ का वात्सल्य व उमाशंकर जोशी का "रस का अक्षय पात्र" इस खंड में पूर्ण होते हैं।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 5–6: Usha & Badal Raag Imagery', hi: 'पाठ 5–6: उषा एवं बादल राग' },
        summary: {
          en: 'Nirala calls clouds "विप्लव के वीर" terrifying rich exploiters ("अट्टालिका नहीं है रे, आतंक-भवन है") while sprouting tiny farmer seeds.',
          hi: '"उषा" में सूर्योदय से "जादू टूटता है इस उषा का अब"; "बादल राग" में "छोटे ही हैं शोभा पाते" क्रांति का संदेश है।',
        },
        keyPoints: [
          { en: 'In "Usha", saffron-washed black sil & red chalk on dark slate precede the golden sunrise.', hi: '"लाल केसर से धुली काली सिल" और "नील जल में झिलमिलाती गौर देह" उषा के प्रसिद्ध बिंब हैं।' },
        ],
      },
      {
        topicTitle: { en: 'Ch. 7–9: Kavitavali, Rubaiyan & Chhota Mera Khet', hi: 'पाठ 7–9: कवितावली, रुबाइयाँ व छोटा मेरा खेत / बगुलों के पंख' },
        summary: {
          en: 'Tulsidas uses Kavitt-Savaiya; Firaq uses Urdu/Persian Rubaiyat metre (1st, 2nd & 4th lines rhyme); Umashankar Joshi compares page to small field.',
          hi: 'तुलसीदास कवित्त-सवैया में "पेट की आग" को सबसे बड़ी बताते हैं; फ़िराक़ की रुबाई में आँगन में चाँद दिखाकर माँ बच्चे को बहलाती है।',
        },
        keyPoints: [
          { en: 'Chhota Mera Khet harvests the inexhaustible nectar (अक्षय पात्र) of poetic Ras that grows the more it is shared.', hi: 'काव्य-रस को जितना बाँटा या पढ़ा जाए, वह कम नहीं होता।' },
        ],
      },
    ],
    questionIds: ['12-hi-usha-1', '12-hi-kavya-tulsidas-1'],
    secondsPerQuestion: 40,
    baseXP: 150,
    mapCoords: { x: 41, y: 64 },
  },
  {
    id: '12-hi-g1',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'gadya-khand',
    order: 4,
    chapterCode: { en: 'Aaroh-2 Gadya · Ch. 10–15', hi: 'आरोह-2 गद्य · पाठ 10–15' },
    title: {
      en: 'Bhaktin, Bazar Darshan, Kale Megha, Pahalwan, Shirish & Ambedkar',
      hi: 'भक्तिन, बाज़ार दर्शन, काले मेघा, पहलवान की ढोलक, शिरीष व श्रम विभाजन',
    },
    bossName: { en: 'Gadya Archive Guardian', hi: 'आरोह गद्य रक्षक' },
    summaryPoints: [
      {
        en: 'All 6 Aaroh Gadya chapters: Lachhmin (Bhaktin), Purchasing Power trap, Inder Sena, Luttan Singh vs Chand Singh, Shirish & Caste critique.',
        hi: 'सभी 6 गद्य पाठ: भक्तिन (लछमिन), बाज़ार का जादू, इंदर सेना, लुट्टन सिंह पहलवान, शिरीष का अवधूत रूप व डॉ. आंबेडकर।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 10–12: Bhaktin, Bazar Darshan & Kale Megha', hi: 'पाठ 10–12: भक्तिन, बाज़ार दर्शन व काले मेघा पानी दे' },
        summary: {
          en: 'Bhaktin’s real name was Lakshmi; Jainendra introduces "Bhagat Ji" (churan seller who stays free from Bazar’s spell by keeping mind full); Dharmveer Bharati contrasts science vs folk faith.',
          hi: 'चूरन बेचने वाले भगत जी संतोषी होने से "बाज़ार के जादू" से बचे रहते हैं; बिना कुछ खरीदे खाली हाथ लौटना मन को भर देता है।',
        },
        keyPoints: [
          { en: 'Boy water-beggars were praised as Inder Sena and mocked by rationalists as Mendhak Mandali.', hi: 'अंधविश्वास विरोधियों ने किशोर टोली को "मेंढक मंडली" तथा आस्थावानों ने "इंदर सेना" कहा।' },
        ],
      },
      {
        topicTitle: { en: 'Ch. 13–15: Pahalwan ki Dholak, Shirish ke Phool & Shram Vibhajan', hi: 'पाठ 13–15: पहलवान की ढोलक, शिरीष के फूल व डॉ. आंबेडकर' },
        summary: {
          en: 'Luttan Singh defeated Chand Singh inspired only by dholak beats; Shirish blooms fearlessly in Jeth scorching heat like Kalidasa & Gandhi; Ambedkar argues democracy requires freedom, equality & fraternity.',
          hi: 'शिरीष का वृक्ष जेठ की प्रचंड गर्मी में भी अजेय खड़ा रहता है; आंबेडकर के आदर्श समाज का आधार स्वतंत्रता, समता व भ्रातृता है।',
        },
        keyPoints: [
          { en: 'In Shirish ke Phool, Dwivedi compares Gandhi and Shirish as steadfast Avadhuts unshaken by crisis.', hi: 'हजारीप्रसाद द्विवेदी ने शिरीष के फूल की तुलना महात्मा गांधी के अडिग व्यक्तित्व से की है।' },
        ],
      },
    ],
    questionIds: ['12-hi-2', '12-hi-7', '12-hi-14', '12-hi-gadya-renu-1'],
    secondsPerQuestion: 40,
    baseXP: 155,
    mapCoords: { x: 56, y: 34 },
  },
  {
    id: '12-hi-vitan',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'vitan-khand',
    order: 5,
    chapterCode: { en: 'Vitan-2 · Ch. 1, 2 & 3', hi: 'वितान-2 · पाठ 1, 2 व 3' },
    title: {
      en: 'Ch. 1 Silver Wedding, Ch. 2 Jujh & Ch. 3 Ateet Mein Dabe Paon',
      hi: 'पाठ 1: सिल्वर वेडिंग, पाठ 2: जूझ एवं पाठ 3: अतीत में दबे पाँव',
    },
    bossName: { en: 'Vitan Heritage Keeper', hi: 'वितान धरोहर प्रहरी' },
    summaryPoints: [
      {
        en: 'Yashodhar Babu’s "Samhau Improper" conflict with modern family; Anand Yadav’s struggle to study & write poetry under Saundalgekar; Mohenjo-Daro urban drainage.',
        hi: 'यशोधर बाबू का किशनदा आदर्श; आनंद यादव का संघर्ष व मराठी शिक्षक सौंदलगेकर; मोहनजोदड़ो की नियोजित सभ्यता।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Vitan-2 Complete Study Notes (All 3 Long Stories)', hi: 'वितान-2 संपूर्ण नोट्स (तीनों पाठ)' },
        summary: {
          en: 'Silver Wedding explores generation gap (Yashodhar Babu’s 25th anniversary); Jujh depicts father’s hostility vs Dattaji Rao’s intervention; Mohenjo-Daro had Stupa mound & Great Bath (महाकुंड) without weapons.',
          hi: 'दत्ताजी राव की मदद से आनंदा को पाठशाला जाने मिला; मोहनजोदड़ो से हथियार नहीं बल्कि नगर नियोजन व बौद्ध स्तूप मिले।',
        },
        keyPoints: [
          { en: 'Yashodhar Babu’s two catchphrases: "Samhau Improper" and "Jo hua hoga".', hi: 'यशोधर बाबू के दो तकिया कलाम: "समहाउ इम्प्रॉपर" और "जो हुआ होगा"।' },
        ],
      },
    ],
    questionIds: ['12-hi-4', '12-hi-8', '12-hi-12'],
    secondsPerQuestion: 38,
    baseXP: 160,
    mapCoords: { x: 70, y: 60 },
  },
  {
    id: '12-hi-ras-alankar',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'kavyabodh-vyakaran',
    order: 6,
    chapterCode: { en: 'Kavya Bodh · Ras, Alankar & Shabd Shakti', hi: 'काव्य बोध · रस, अलंकार व शब्द-शक्ति' },
    title: {
      en: 'Dedicated Subsections: Ras, Alankar, Chhand & Shabd Shakti',
      hi: 'समर्पित उपखंड: रस, अलंकार, छंद एवं शब्द-शक्ति / काव्य-गुण',
    },
    bossName: { en: 'Rhetoric Sovereign Boss', hi: 'रस-अलंकार-काव्यगुण सम्राट' },
    summaryPoints: [
      {
        en: 'Dedicated coverage of Bharatmuni’s Ras Sutra ("विभावानुभावव्यभिचारिसंयोगाद्रसनिष्पत्तिः"), 10 Ras, Alankars (Bhrantiman, Sandeh, Virodhabhas, Utpreksha), and 3 Shabd Shakti.',
        hi: 'भरतमुनि का रस-सूत्र, 10 रस, भ्रांतिमान-संदेह-विरोधाभास-उत्प्रेक्षा अलंकार, तथा अभिधा-लक्षणा-व्यंजना शब्द शक्तियाँ।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Subsection A: Ras Theory & Sthayi Bhava', hi: 'उपखंड A: रस — भरतमुनि सूत्र, अंग व भेद' },
        summary: {
          en: 'Acharya Bharatmuni gave 8 Ras in Natyashastra; Shant (Nirved) & Vatsalya (Vatsalya Rati) complete the 10-Ras school curriculum.',
          hi: 'भरतमुनि ने नाट्यशास्त्र में 8 रस माने; शांत (स्थायी भाव: निर्वेद) 9वाँ व वात्सल्य 10वाँ रस है।',
        },
        keyPoints: [
          { en: '4 Limbs: स्थायी भाव (dormant emotion), विभाव (आलंबन + उद्दीपन), अनुभाव (physical reactions), संचारी भाव (33 transient emotions).', hi: 'संचारी भावों की कुल संख्या 33 मानी गई है (पानी के बुलबुलों जैसे क्षणिक भाव)।' },
        ],
      },
      {
        topicTitle: { en: 'Subsection B: Alankar (Bhrantiman vs Sandeh & Virodhabhas)', hi: 'उपखंड B: अलंकार — संदेह, भ्रांतिमान, सांगरूपक, विरोधाभास, व्यतिरेक' },
        summary: {
          en: 'Sandeh leaves doubt unresolved ("सारी बीच नारी है कि नारी बीच सारी है"); Bhrantiman mistakes one object confidently for another; Virodhabhas shows apparent contradiction that resolves logically.',
          hi: 'संदेह में निश्चय नहीं हो पाता; भ्रांतिमान में भ्रमवश एक वस्तु को दूसरी मानकर क्रिया कर ली जाती है; विरोधाभास में विरोध का आभास होता है (जैसे—"या अनुरागी चित्त की... ज्यों-ज्यों बूड़े स्याम रंग त्यों-त्यों उज्ज्वल होय")।',
        },
        keyPoints: [
          { en: 'Chhand: Rubai (4 lines, 1-2-4 rhyme), Kabitt (31 varna Varnik), Savaiya (22–26 varna), Doha (13-11), Sortha (11-13). Shabd Shakti: Abhidha (literal), Lakshana (idiomatic/secondary), Vyanjana (suggested).', hi: 'कवित्त (31 वर्ण) व सवैया (22–26 वर्ण) वर्णिक छंद हैं; दोहा का उल्टा सोरठा (11-13 मात्राएँ) होता है।' },
        ],
      },
    ],
    questionIds: ['12-hi-3', '12-hi-5', '12-hi-11', '12-hi-tricky-2'],
    secondsPerQuestion: 34,
    baseXP: 170,
    mapCoords: { x: 82, y: 36 },
  },
  {
    id: '12-hi-abhivyakti',
    grade: '12',
    subjectId: 'hindi',
    subsectionId: 'abhivyakti-khand',
    order: 7,
    chapterCode: { en: 'Abhivyakti aur Madhyam & Vyakaran', hi: 'अभिव्यक्ति-माध्यम व व्याकरण' },
    title: {
      en: 'Print/Electronic Media, Inverted Pyramid, 6 Kakar, Feature & Nipat',
      hi: 'पत्रकारिता, उल्टा पिरामिड, 6 ककार, फीचर-आलेख एवं निपात-वाक्य',
    },
    bossName: { en: 'Chronicle Press Warden', hi: 'संपादकीय द्वारपाल' },
    summaryPoints: [
      {
        en: 'Inverted Pyramid arranges news as Intro/Lead (climax first) → Body → Closing; 6 Kakar = What, Who, Where, When, Why, How.',
        hi: 'उल्टा पिरामिड शैली के 3 भाग (इंट्रो, बॉडी, समापन) व समाचार के 6 ककार (क्या, कौन, कहाँ, कब, क्यों, कैसे)।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Journalism, Radio/TV & Grammar Core', hi: 'जनसंचार माध्यम, स्तंभ लेखन व निपात' },
        summary: {
          en: 'Breaking News (Flash), Dry Anchor, Anchor Byte, Live, Sting Operation; Feature is creative/entertaining vs Aalekh is factual/analytical.',
          hi: 'निपात वे अव्यय हैं जो किसी पद पर अतिरिक्त बल देते हैं (ही, भी, तो, तक, भर)।',
        },
        keyPoints: [
          { en: 'First 4 Kakar (What, Who, Where, When) go into the Lead/Intro; Why & How are explained in Body.', hi: 'इंट्रो में पहले 4 ककार (तथ्यात्मक) तथा बॉडी में आखिरी 2 ककार (क्यों, कैसे) आते हैं।' },
        ],
      },
    ],
    questionIds: ['12-hi-9', '12-hi-10', '12-hi-15', '12-hi-tricky-1'],
    secondsPerQuestion: 34,
    baseXP: 175,
    mapCoords: { x: 90, y: 54 },
  },

  // ==================== CLASS 12 · ENGLISH (FLAMINGO, VISTAS & GRAMMAR) ====================
  {
    id: '12-en-fl1',
    grade: '12',
    subjectId: 'english',
    subsectionId: 'flamingo-book',
    order: 1,
    chapterCode: { en: 'Flamingo Prose · Ch. 1–4', hi: 'Flamingo गद्य · पाठ 1–4' },
    title: {
      en: 'Ch. 1 The Last Lesson, Ch. 2 Lost Spring, Ch. 3 Deep Water & Ch. 4 Rattrap',
      hi: 'पाठ 1: The Last Lesson, 2: Lost Spring, 3: Deep Water व 4: The Rattrap',
    },
    bossName: { en: 'Flamingo Prose Warden', hi: 'फ्लेमिंगो गद्य प्रहरी' },
    summaryPoints: [
      {
        en: 'M. Hamel writes "Vive La France!"; Saheb finds ruins of Seemapuri & Mukesh dreams of driving cars in Firozabad.',
        hi: 'एम. हेमेल की अंतिम फ्रेंच कक्षा; सीमापुरी के साहेब व फिरोज़ाबाद के मुकेश की कहानी।',
      },
      {
        en: 'William Douglas overcomes Yakima River / YMCA pool trauma; Edla Willmansson transforms the Rattrap peddler with kindness.',
        hi: 'विलियम डगलस का जल-भय पर विजय; एडला विलमैन्सन की करुणा से रैटट्रैप फेरीवाले का हृदय परिवर्तन।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Flamingo Prose Ch. 1–4 Revision Scrolls', hi: 'Flamingo पाठ 1–4 नोट्स' },
        summary: {
          en: 'Berlin ordered only German be taught in Alsace & Lorraine; "All we have to fear is fear itself" (Roosevelt) inspired Douglas.',
          hi: 'बर्लिन के आदेश पर अलसैस-लोरेन में जर्मन अनिवार्य हुई; रैटट्रैप में पेडलर "कैप्टन वॉन स्टैहले" के नाम से क्रिसमस उपहार छोड़ता है।',
        },
        keyPoints: [
          { en: 'In Lost Spring, garbage means gold/daily bread for children and survival for elders.', hi: 'सीमापुरी के बच्चों के लिए कचरा "आश्चर्य में लिपटा" और बड़ों के लिए जीविका है।' },
        ],
      },
    ],
    questionIds: ['12-en-1', '12-en-2', '12-en-6', '12-en-7'],
    secondsPerQuestion: 42,
    baseXP: 130,
    mapCoords: { x: 14, y: 66 },
  },
  {
    id: '12-en-fl2',
    grade: '12',
    subjectId: 'english',
    subsectionId: 'flamingo-book',
    order: 2,
    chapterCode: { en: 'Flamingo Prose · Ch. 5–8 & All 5 Poems', hi: 'Flamingo गद्य 5–8 व सभी 5 कविताएँ' },
    title: {
      en: 'Indigo, Poets & Pancakes, Interview, Going Places & All 5 Poems',
      hi: 'Indigo, Poets & Pancakes, Interview, Going Places व सभी कविताएँ',
    },
    bossName: { en: 'Champaran & Keats Guardian', hi: 'चंपारण व काव्य रक्षक' },
    summaryPoints: [
      {
        en: 'Gandhi’s Champaran Satyagraha (Rajkumar Shukla, 25% refund); Gemini Studios (Asokamitran); Umberto Eco & Sophie’s fantasy.',
        hi: 'गांधीजी का चंपारण सत्याग्रह (25% वापसी); जेमिनी स्टूडियो; अम्बर्टो इको व सोफी के दिवास्वप्न।',
      },
      {
        en: 'All 5 Flamingo Poems: My Mother at Sixty-Six, Keeping Quiet, A Thing of Beauty, A Roadside Stand & Aunt Jennifer’s Tigers.',
        hi: 'सभी 5 कविताएँ: कमला दास, पाब्लो नेरुदा, जॉन कीट्स, रॉबर्ट फ्रॉस्ट व एड्रिएन रिच।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Indigo, Gemini Studios & 5 Flamingo Poems', hi: 'Indigo एवं पाँचों कविताओं का सार' },
        summary: {
          en: 'Gandhi accepted 25% landlord refund because breaking landlord prestige mattered more than money; John Keats opens "A Thing of Beauty is a joy forever".',
          hi: 'कमला दास ने माँ के चेहरे की तुलना "late winter’s moon" से की; नेरुदा 12 तक गिनकर आत्ममंथन की मौन शांति माँगते हैं।',
        },
        keyPoints: [
          { en: 'Sophie daydreamed about Irish football star Danny Casey in "Going Places".', hi: 'सोफी "Going Places" में आयरिश फुटबॉलर डैनी केसी से मिलने की कल्पना करती है।' },
        ],
      },
    ],
    questionIds: ['12-en-8', '12-en-5', '12-en-11', '12-en-14'],
    secondsPerQuestion: 40,
    baseXP: 145,
    mapCoords: { x: 38, y: 38 },
  },
  {
    id: '12-en-vis',
    grade: '12',
    subjectId: 'english',
    subsectionId: 'vistas-book',
    order: 3,
    chapterCode: { en: 'Vistas · All 6 Chapters', hi: 'Vistas · संपूर्ण पाठ 1–6' },
    title: {
      en: 'Third Level, Tiger King, Journey to Earth’s End, The Enemy, Face of It & Memories',
      hi: 'Third Level, Tiger King, Antarctica, The Enemy, On the Face of It व Memories',
    },
    bossName: { en: 'Vistas Citadel Sentinel', hi: 'विस्टास समय-लोक प्रहरी' },
    summaryPoints: [
      {
        en: 'Charley’s Galesburg 1894 ticket; Maharaja Jilani Jung Jung Bahadur killed 99 tigers then fell to a wooden toy tiger sliver.',
        hi: 'चार्ली का थर्ड लेवल; टाइगर किंग के 99 बाघ और लकड़ी का 100वाँ बाघ; डॉ. सदाओ का शत्रु-बचाव।',
      },
      {
        en: 'Tishani Doshi’s Antarctica expedition (Students on Ice); Dr. Sadao & Hana saving Tom; Mr. Lamb & Derry; Zitkala-Sa & Bama.',
        hi: 'मिस्टर लैम्ब व डेरी की मित्रता; ज़िटकला-सा और बामा के बचपन का भेदभाव विरोध।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Complete Vistas Chapters 1–6 Notes', hi: 'विस्टास संपूर्ण 6 अध्याय मुख्य बिंदु' },
        summary: {
          en: 'Psychiatrist Sam declared Third Level a "waking-dream wish fulfillment"—yet bought 1894 old currency himself! Dr. Sadao saved the American POW because his medical oath stood above war hatred.',
          hi: 'गोंडवाना महाद्वीप व अंटार्कटिका से पृथ्वी का अतीत दिखता है; डॉ. सदाओ ने चिकित्सक धर्म निभाकर अमेरिकी युद्धबंदी की जान बचाई।',
        },
        keyPoints: [
          { en: 'The wooden toy tiger cost only two annas and a quarter, yet its rough quill infected the King’s arm.', hi: 'लकड़ी के बाघ की कील से संक्रमण होने पर मद्रास के सर्जनों ने ऑपरेशन किया पर राजा नहीं बचा।' },
        ],
      },
    ],
    questionIds: ['12-en-4', '12-en-12', '12-en-13'],
    secondsPerQuestion: 38,
    baseXP: 160,
    mapCoords: { x: 64, y: 62 },
  },
  {
    id: '12-en-grm',
    grade: '12',
    subjectId: 'english',
    subsectionId: 'grammar-book',
    order: 4,
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
          en: 'Latin comparatives (junior, senior, superior, inferior, prior) and "prefer" take "to", NEVER "than". Passive after "know" takes "to" ("known to me", not "by me").',
          hi: 'Senior/Junior/Prefer के बाद "than" नहीं बल्कि "to" लगता है; "known by" की जगह "known to" होता है।',
        },
        keyPoints: [
          { en: '"Too...to" transforms to "So...that...cannot/could not".', hi: 'जैसे: "He is too weak to walk" → "He is so weak that he cannot walk".' },
        ],
      },
    ],
    questionIds: ['12-en-3', '12-en-9', '12-en-10', '12-en-15', '12-en-tricky-1', '12-en-tricky-2'],
    secondsPerQuestion: 34,
    baseXP: 175,
    mapCoords: { x: 86, y: 40 },
  },

  // ==================== CLASS 12 · MATHS (PART I CH. 1–6 & PART II CH. 7–13) ====================
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
          en: 'One-one (injective) + Onto (surjective) = Bijective (invertible). Watch domain trap: sin⁻¹(sin 2π/3) = π/3, NOT 2π/3!',
          hi: 'सावधानी: sin⁻¹(sin 2π/3) का मान 2π/3 नहीं बल्कि π/3 होगा क्योंकि यह मुख्य शाखा के बाहर है।',
        },
        keyPoints: [
          { en: 'tan⁻¹(1) + cos⁻¹(−½) + sin⁻¹(−½) = π/4 + 2π/3 − π/6 = 3π/4.', hi: 'sin⁻¹x + cos⁻¹x = π/2 सभी x ∈ [−1, 1] के लिए सत्य है।' },
        ],
      },
    ],
    questionIds: ['12-ma-1', '12-ma-12', '12-ma-tricky-1'],
    secondsPerQuestion: 42,
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
          hi: '|adj(A)| = |A|ⁿ⁻¹ होता है; किसी 3×3 आव्यूह के लिए |3A| = 27|A| होगा।',
        },
        keyPoints: [
          { en: 'Area of triangle using determinant is ½ |x₁(y₂−y₃)...|.', hi: '(AB)⁻¹ = B⁻¹A⁻¹ तथा (AB)ᵀ = BᵀAᵀ (उल्टा क्रम)।' },
        ],
      },
    ],
    questionIds: ['12-ma-2', '12-ma-3', '12-ma-13'],
    secondsPerQuestion: 40,
    baseXP: 145,
    mapCoords: { x: 30, y: 40 },
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
        en: 'Every differentiable function is continuous, but converse need not hold (e.g. |x| at x=0); Rate of change, Maxima/Minima.',
        hi: 'प्रत्येक अवकलनीय फलन संतत होता है पर विलोम आवश्यक नहीं (जैसे |x|, x=0 पर); उच्चतम व निम्नतम मान।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Derivatives, Increasing/Decreasing & Maxima', hi: 'अवकलन, वर्धमान-ह्रासमान व उच्चिष्ठ-निम्निष्ठ' },
        summary: {
          en: 'Second Derivative Test: at critical point f′(c)=0, f″(c) < 0 → Local Maximum; f″(c) > 0 → Local Minimum.',
          hi: 'यदि f′(c) = 0 और f″(c) < 0 तो स्थानीय उच्चिष्ठ; f″(c) > 0 तो स्थानीय निम्निष्ठ।',
        },
        keyPoints: [
          { en: 'd/dx(aˣ) = aˣ logₑ a; d/dx(tan⁻¹x) = 1/(1+x²).', hi: 'd/dx(sin⁻¹x + cos⁻¹x) = 0 क्योंकि इनका योग अचर π/2 होता है।' },
        ],
      },
    ],
    questionIds: ['12-ma-6', '12-ma-14'],
    secondsPerQuestion: 38,
    baseXP: 155,
    mapCoords: { x: 48, y: 64 },
  },
  {
    id: '12-ma-p2a',
    grade: '12',
    subjectId: 'maths',
    subsectionId: 'maths-part-2',
    order: 4,
    chapterCode: { en: 'NCERT Part II · Ch. 7, 8 & 9', hi: 'NCERT भाग 2 · अध्याय 7, 8 व 9' },
    title: {
      en: 'Ch. 7 Integrals, Ch. 8 Application of Integrals & Ch. 9 Differential Equations',
      hi: 'अध्याय 7: समाकलन, 8: समाकलन अनुप्रयोग व 9: अवकल समीकरण',
    },
    bossName: { en: 'Integral Colossus', hi: 'समाकलन महारथी' },
    summaryPoints: [
      {
        en: '∫ eˣ[f(x)+f′(x)]dx = eˣf(x)+C; King’s property ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a−x)dx; Order vs Degree of ODE.',
        hi: '∫ eˣ[f(x)+f′(x)]dx = eˣf(x)+C; अवकल समीकरण की कोटि (Order) व घात (Degree)।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Integrals, Areas Under Curves & ODE Order/Degree', hi: 'निश्चित समाकलन, क्षेत्रफल व अवकल समीकरण' },
        summary: {
          en: 'An odd function f(−x)=−f(x) integrates to 0 over [−a, a]. Integrating Factor for dy/dx + Py = Q is e^∫Pdx.',
          hi: 'विषम फलन का [−a, a] पर समाकलन सदैव 0 होता है; रैखिक अवकल समीकरण में IF = e^∫Pdx।',
        },
        keyPoints: [
          { en: 'Watch ODE degree trap: degree is NOT defined if derivatives appear inside sin(dy/dx) or e^(dy/dx).', hi: 'यदि अवकलज sin(dy/dx) या log में फँसा हो तो घात (Degree) परिभाषित नहीं होती।' },
        ],
      },
    ],
    questionIds: ['12-ma-4', '12-ma-5', '12-ma-10', '12-ma-11', '12-ma-tricky-2'],
    secondsPerQuestion: 36,
    baseXP: 165,
    mapCoords: { x: 66, y: 34 },
  },
  {
    id: '12-ma-p2b',
    grade: '12',
    subjectId: 'maths',
    subsectionId: 'maths-part-2',
    order: 5,
    chapterCode: { en: 'NCERT Part II · Ch. 10–13', hi: 'NCERT भाग 2 · अध्याय 10–13' },
    title: {
      en: 'Ch. 10 Vectors, Ch. 11 3D Geometry, Ch. 12 Linear Programming & Ch. 13 Probability',
      hi: 'अध्याय 10: सदिश, 11: 3D ज्यामिति, 12: रैखिक प्रोग्रामन व 13: प्रायिकता',
    },
    bossName: { en: 'Vector & Probability Sovereign', hi: 'सदिश व प्रायिकता सम्राट' },
    summaryPoints: [
      {
        en: 'Direction Cosines satisfy l² + m² + n² = 1; a·b = |a||b|cosθ; Corner Point Theorem in LPP; Bayes’ Theorem.',
        hi: 'दिक्-कोसाइन l² + m² + n² = 1; कोनीय बिंदु प्रमेय (LPP) व बेज़ प्रमेय।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: '3D Lines, LPP Corner Theorem & Conditional Probability', hi: 'सदिश, 3D रेखाएँ, LPP व सप्रतिबंध प्रायिकता' },
        summary: {
          en: 'i·i = j·j = k·k = 1; i×j = k; P(A|B) = P(A∩B)/P(B); for independent events P(A∩B) = P(A)P(B).',
          hi: 'परस्पर लंब सदिशों के लिए a·b = 0 तथा समांतर के लिए a×b = 0; स्वतंत्र घटनाओं में P(A∩B) = P(A)P(B)।',
        },
        keyPoints: [
          { en: 'In bounded LPP, maximum/minimum value of Z = ax + by always lies at a corner vertex of feasible region.', hi: 'परिबद्ध LPP में इष्टतम मान सदैव सुसंगत क्षेत्र के शीर्ष (कोनीय बिंदु) पर मिलता है।' },
        ],
      },
    ],
    questionIds: ['12-ma-7', '12-ma-8', '12-ma-9', '12-ma-15', '12-ma-lpp-1'],
    secondsPerQuestion: 34,
    baseXP: 175,
    mapCoords: { x: 86, y: 58 },
  },

  // ==================== CLASS 12 · PHYSICS (PART I CH. 1–8 & PART II CH. 9–14) ====================
  {
    id: '12-ph-p1a',
    grade: '12',
    subjectId: 'physics',
    subsectionId: 'physics-part-1',
    order: 1,
    chapterCode: { en: 'NCERT Part I · Ch. 1, 2 & 3', hi: 'NCERT भाग 1 · अध्याय 1, 2 व 3' },
    title: {
      en: 'Ch. 1 Electric Charges, Ch. 2 Potential & Capacitance, Ch. 3 Current Electricity',
      hi: 'अध्याय 1: विद्युत आवेश, 2: विभव व संधारित्र तथा 3: विद्युत धारा',
    },
    bossName: { en: 'Electrostatic Bastion Boss', hi: 'स्थिरवैद्युत दुर्ग प्रहरी' },
    summaryPoints: [
      {
        en: 'Gauss Law Φ = q/ε₀; Dipole E ∝ 1/r³; Capacitance C = ε₀A/d; Kirchhoff Junction Law (Charge) & Loop Law (Energy).',
        hi: 'गॉस प्रमेय Φ = q/ε₀; धारिता C = ε₀A/d; किरचॉफ का पहला नियम (आवेश संरक्षण) व दूसरा नियम (ऊर्जा संरक्षण)।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Gauss Law, Capacitors & Drift Velocity Traps', hi: 'गॉस नियम, संधारित्र व अनुगमन वेग' },
        summary: {
          en: 'Equatorial potential of a dipole is ZERO (V=0, though E≠0!). Series capacitance reduces 1/C = 1/C₁+1/C₂; Parallel adds C = C₁+C₂.',
          hi: 'विद्युत द्विध्रुव की निरक्षीय रेखा पर विभव शून्य (V=0) होता है जबकि क्षेत्र E शून्य नहीं होता!',
        },
        keyPoints: [
          { en: 'Conductance unit: Mho / Siemens (Ω⁻¹); Wheatstone bridge balances when P/Q = R/S.', hi: 'व्हीटस्टोन सेतु संतुलन शर्त: P/Q = R/S; विशिष्ट प्रतिरोध (ρ) केवल पदार्थ व ताप पर निर्भर करता है।' },
        ],
      },
    ],
    questionIds: ['12-ph-1', '12-ph-2', '12-ph-3', '12-ph-13', '12-ph-tricky-1'],
    secondsPerQuestion: 42,
    baseXP: 135,
    mapCoords: { x: 14, y: 66 },
  },
  {
    id: '12-ph-p1b',
    grade: '12',
    subjectId: 'physics',
    subsectionId: 'physics-part-1',
    order: 2,
    chapterCode: { en: 'NCERT Part I · Ch. 4–8', hi: 'NCERT भाग 1 · अध्याय 4–8' },
    title: {
      en: 'Ch. 4 Moving Charges, Ch. 5 Magnetism, Ch. 6 EMI, Ch. 7 AC & Ch. 8 EM Waves',
      hi: 'अध्याय 4: गतिमान आवेश, 5: चुंबकत्व, 6: प्रेरण, 7: AC व 8: विद्युतचुंबकीय तरंगें',
    },
    bossName: { en: 'Maxwell Flux Overlord', hi: 'फ्लक्स व तरंग अधिपति' },
    summaryPoints: [
      {
        en: 'Lorentz Force F = q(v×B); Faraday-Lenz Law e = −dΦ/dt (energy conservation); Wattless current in pure L/C; Maxwell EM waves.',
        hi: 'लॉरेंज़ बल; लेन्ज़ नियम (ऊर्जा संरक्षण); शुद्ध प्रेरक/संधारित्र में वाटहीन धारा; विस्थापन धारा व EM तरंगें।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Ch. 4–8 Galvanometer Conversion, Transformer & EM Spectrum', hi: 'गैल्वेनोमीटर रूपांतरण, ट्रांसफॉर्मर व EM स्पेक्ट्रम' },
        summary: {
          en: 'Ammeter = low shunt resistance in parallel; Voltmeter = high resistance in series; Gamma rays have shortest wavelength, Radio longest.',
          hi: 'शंट (अल्प प्रतिरोध) समांतर में लगाने पर गैल्वेनोमीटर ऐमीटर बनता है; आदर्श वोल्टमीटर का प्रतिरोध अनंत होता है।',
        },
        keyPoints: [
          { en: 'At AC series resonance, X_L = X_C, Z = R (minimum), power factor cos φ = 1.', hi: 'अनुनाद पर प्रतिबाधा Z = R न्यूनतम व शक्ति गुणांक cos φ = 1 अधिकतम होता है।' },
        ],
      },
    ],
    questionIds: ['12-ph-4', '12-ph-6', '12-ph-7', '12-ph-8', '12-ph-14'],
    secondsPerQuestion: 38,
    baseXP: 155,
    mapCoords: { x: 38, y: 38 },
  },
  {
    id: '12-ph-p2a',
    grade: '12',
    subjectId: 'physics',
    subsectionId: 'physics-part-2',
    order: 3,
    chapterCode: { en: 'NCERT Part II · Ch. 9, 10 & 11', hi: 'NCERT भाग 2 · अध्याय 9, 10 व 11' },
    title: {
      en: 'Ch. 9 Ray Optics, Ch. 10 Wave Optics & Ch. 11 Dual Nature of Radiation',
      hi: 'अध्याय 9: किरण प्रकाशिकी, 10: तरंग प्रकाशिकी व 11: द्रव्य की द्वैत प्रकृति',
    },
    bossName: { en: 'Wave Photon Warden', hi: 'प्रकाशिकी व फोटॉन रक्षक' },
    summaryPoints: [
      {
        en: 'Total Internal Reflection (Optical fibre, mirage); Huygens Wavefront & YDSE interference; Einstein Photoelectric Eq.',
        hi: 'पूर्ण आंतरिक परावर्तन (ऑप्टिकल फाइबर); यंग द्वि-स्लिट व्यतिकरण; आइंस्टीन प्रकाश-विद्युत समीकरण।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Optics Power Trap, Interference & De Broglie Wavelength', hi: 'माध्यम में लेंस फोकस दूरी, व्यतिकरण व डी-ब्रॉग्ली तरंगदैर्ध्य' },
        summary: {
          en: 'Glass lens (μ=1.5) dipped in liquid of μ=1.5 has infinite focal length (invisible!); λ = h/mv; Kinetic energy & work function depend on frequency.',
          hi: 'लेंस को समान अपवर्तनांक के द्रव में डुबोने पर उसकी फोकस दूरी अनंत व क्षमता शून्य हो जाती है।',
        },
        keyPoints: [
          { en: 'Threshold frequency (ν₀) is the minimum frequency needed to eject photoelectrons.', hi: 'देहेली आवृत्ति से कम आवृत्ति पर प्रकाश-इलेक्ट्रॉन उत्सर्जित नहीं होते, चाहे तीव्रता कितनी भी हो।' },
        ],
      },
    ],
    questionIds: ['12-ph-9', '12-ph-10', '12-ph-11', '12-ph-tricky-2'],
    secondsPerQuestion: 36,
    baseXP: 165,
    mapCoords: { x: 64, y: 62 },
  },
  {
    id: '12-ph-p2b',
    grade: '12',
    subjectId: 'physics',
    subsectionId: 'physics-part-2',
    order: 4,
    chapterCode: { en: 'NCERT Part II · Ch. 12, 13 & 14', hi: 'NCERT भाग 2 · अध्याय 12, 13 व 14' },
    title: {
      en: 'Ch. 12 Atoms, Ch. 13 Nuclei & Ch. 14 Semiconductor Electronics',
      hi: 'अध्याय 12: परमाणु, 13: नाभिक एवं 14: अर्धचालक इलेक्ट्रॉनिकी',
    },
    bossName: { en: 'Quantum Logic Overlord', hi: 'परमाणु व लॉजिक गेट सम्राट' },
    summaryPoints: [
      {
        en: 'Bohr radius rₙ ∝ n², Energy Eₙ = −13.6/n² eV; Mass defect Δm c²; p-n diode rectifier & NAND/NOR Universal Gates.',
        hi: 'बोर कक्षा त्रिज्या rₙ ∝ n²; बंधन ऊर्जा Δm c²; p-n डायोड दिष्टकारी व NAND/NOR सार्वत्रिक गेट।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Atoms, Nuclei Binding Energy & Logic Gates', hi: 'परमाणु, नाभिक व अर्धचालक नोट्स' },
        summary: {
          en: 'Nuclear density is independent of mass number A; Fe-56 has highest binding energy per nucleon (~8.75 MeV); NAND and NOR are Universal Logic Gates.',
          hi: 'नाभिकीय घनत्व द्रव्यमान संख्या A पर निर्भर नहीं करता; n-type अर्धचालक में पंचसंयोजी (P, As) व p-type में त्रिसंयोजी (B, Al) मिलाते हैं।',
        },
        keyPoints: [
          { en: 'At absolute zero (0 K), pure intrinsic Silicon behaves as a perfect insulator.', hi: 'परम शून्य ताप (0 K) पर शुद्ध अर्धचालक पूर्णतः कुचालक की भाँति व्यवहार करता है।' },
        ],
      },
    ],
    questionIds: ['12-ph-5', '12-ph-12', '12-ph-15', '12-ph-atoms-1'],
    secondsPerQuestion: 34,
    baseXP: 175,
    mapCoords: { x: 86, y: 40 },
  },

  // ==================== CLASS 12 · CHEMISTRY (ALL 10 NEW NCERT CHAPTERS) ====================
  {
    id: '12-ch-p1a',
    grade: '12',
    subjectId: 'chemistry',
    subsectionId: 'chem-part-1',
    order: 1,
    chapterCode: { en: 'NCERT Part I · Ch. 1, 2 & 3', hi: 'NCERT भाग 1 · अध्याय 1, 2 व 3' },
    title: {
      en: 'Ch. 1 Solutions, Ch. 2 Electrochemistry & Ch. 3 Chemical Kinetics',
      hi: 'अध्याय 1: विलयन, 2: वैद्युतरसायन व 3: रासायनिक बलगतिकी',
    },
    bossName: { en: 'Nernst Kinetics Warden', hi: 'विलयन व बलगतिकी प्रहरी' },
    summaryPoints: [
      {
        en: 'Henry’s Law, Raoult’s Law & Van’t Hoff i (ΔT_b = i K_b m); Nernst Eq & Kohlrausch Law; Zero vs First-Order half-life.',
        hi: 'राउल्ट नियम, वॉन्ट हॉफ गुणांक i; नेर्नस्ट समीकरण, कोलराउश नियम व प्रथम कोटि अर्द्ध-आयु (t₁/₂ = 0.693/k)।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Colligative Properties, Cells & Rate Constants', hi: 'अणुसंख्य गुणधर्म, सेल व अभिक्रिया कोटि' },
        summary: {
          en: '1 M NaCl has i=2 (higher boiling point than 1 M glucose/urea where i=1!); First-order rate constant unit is s⁻¹, Zero-order is mol L⁻¹ s⁻¹.',
          hi: '1 M NaCl का क्वथनांक 1 M ग्लूकोज़ से अधिक होता है क्योंकि NaCl दो आयनों में टूटता है (i=2)।',
        },
        keyPoints: [
          { en: 'Arrhenius Eq: k = A e^(−Ea/RT); catalyst lowers activation energy Eₐ without changing ΔH.', hi: 'उत्प्रेरक सक्रियण ऊर्जा (Eₐ) घटाता है लेकिन ΔH या साम्य स्थिरांक नहीं बदलता।' },
        ],
      },
    ],
    questionIds: ['12-ch-1', '12-ch-2', '12-ch-3', '12-ch-11', '12-ch-tricky-1'],
    secondsPerQuestion: 40,
    baseXP: 140,
    mapCoords: { x: 14, y: 66 },
  },
  {
    id: '12-ch-p1b',
    grade: '12',
    subjectId: 'chemistry',
    subsectionId: 'chem-part-1',
    order: 2,
    chapterCode: { en: 'NCERT Part I · Ch. 4 & 5', hi: 'NCERT भाग 1 · अध्याय 4 व 5' },
    title: {
      en: 'Ch. 4 d- & f-Block Elements and Ch. 5 Coordination Compounds',
      hi: 'अध्याय 4: d व f-ब्लॉक के तत्व तथा अध्याय 5: उपसहसंयोजन यौगिक',
    },
    bossName: { en: 'Ligand Crystal Sentinel', hi: 'संक्रमण तत्व व लिगैंड रक्षक' },
    summaryPoints: [
      {
        en: 'Zn, Cd, Hg have full d¹⁰ so not true transition elements; Lanthanoid Contraction; EDTA⁴⁻ hexadentate ligand & CFT.',
        hi: 'Zn, Cd, Hg संक्रमण तत्व नहीं हैं; लैंथेनॉयड संकुचन; EDTA⁴⁻ षट्दंतुर लिगैंड व उपसहसंयोजन संख्या।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Magnetic Moment, Lanthanoid Contraction & Werner Theory', hi: 'चुंबकीय आघूर्ण, लैंथेनॉयड संकुचन व वर्नर सिद्धांत' },
        summary: {
          en: 'Spin-only magnetic moment μ = √[n(n+2)] BM where n = unpaired electrons. KMnO₄ acts as strong oxidizer in acidic medium.',
          hi: 'चुंबकीय आघूर्ण μ = √[n(n+2)] BM; Zr और Hf की त्रिज्या लैंथेनॉयड संकुचन के कारण लगभग समान होती है।',
        },
        keyPoints: [
          { en: 'In [Ni(CO)₄], oxidation state of Nickel is 0 (tetrahedral, diamagnetic).', hi: '[Ni(CO)₄] में निकेल की ऑक्सीकरण अवस्था 0 तथा यह प्रतिचुंबकीय होता है।' },
        ],
      },
    ],
    questionIds: ['12-ch-4', '12-ch-5', '12-ch-13', '12-ch-14'],
    secondsPerQuestion: 38,
    baseXP: 155,
    mapCoords: { x: 38, y: 38 },
  },
  {
    id: '12-ch-p2a',
    grade: '12',
    subjectId: 'chemistry',
    subsectionId: 'chem-part-2',
    order: 3,
    chapterCode: { en: 'NCERT Part II · Ch. 6, 7 & 8', hi: 'NCERT भाग 2 · अध्याय 6, 7 व 8' },
    title: {
      en: 'Ch. 6 Haloalkanes, Ch. 7 Alcohols/Phenols & Ch. 8 Aldehydes/Ketones/Acids',
      hi: 'अध्याय 6: हैलोऐल्केन, 7: ऐल्कोहॉल-फीनॉल व 8: ऐल्डिहाइड-कीटोन-अम्ल',
    },
    bossName: { en: 'Carbonyl Synthesis Warden', hi: 'कार्बोनिल व क्रियाविधि प्रहरी' },
    summaryPoints: [
      {
        en: 'SN1 (3° fastest, racemization) vs SN2 (1° fastest, inversion); Lucas test (3° instant); Aldol, Cannizzaro & Tollens mirror.',
        hi: 'SN1 (3° तीव्रतम) बनाम SN2 (1° तीव्रतम); ल्यूकास परीक्षण (3° तुरंत); ऐल्डोल व कैनिज़ारो अभिक्रिया।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Named Organic Reactions & Distinction Tests', hi: 'प्रमुख नाम अभिक्रियाएँ व पहचान परीक्षण' },
        summary: {
          en: 'Reimer-Tiemann converts Phenol → Salicylaldehyde; Kolbe → Salicylic acid; Rosenmund reduces RCOCl → RCHO; Aldehydes lacking α-H give Cannizzaro.',
          hi: 'राइमर-टीमैन अभिक्रिया में फीनॉल से सैलिसिलैल्डिहाइड बनता है; जिन ऐल्डिहाइड में α-H न हो (HCHO) वे कैनिज़ारो देते हैं।',
        },
        keyPoints: [
          { en: 'Chloroform kept in dark coloured bottles filled to brim to prevent toxic Phosgene (COCl₂) formation.', hi: 'क्लोरोफॉर्म को प्रकाश व वायु से बचाने हेतु गहरे रंग की बोतल में रखते हैं ताकि फॉस्जीन (COCl₂) न बने।' },
        ],
      },
    ],
    questionIds: ['12-ch-6', '12-ch-7', '12-ch-8', '12-ch-alcohols-1'],
    secondsPerQuestion: 36,
    baseXP: 165,
    mapCoords: { x: 64, y: 62 },
  },
  {
    id: '12-ch-p2b',
    grade: '12',
    subjectId: 'chemistry',
    subsectionId: 'chem-part-2',
    order: 4,
    chapterCode: { en: 'NCERT Part II · Ch. 9 & 10', hi: 'NCERT भाग 2 · अध्याय 9 व 10' },
    title: {
      en: 'Ch. 9 Amines (Carbylamine, Hinsberg) & Ch. 10 Biomolecules (DNA/RNA, Vitamins)',
      hi: 'अध्याय 9: ऐमीन एवं अध्याय 10: जैव-अणु (DNA/RNA व विटामिन)',
    },
    bossName: { en: 'Catalyst Warden', hi: 'उत्प्रेरक व जैव-अणु सम्राट' },
    summaryPoints: [
      {
        en: 'Carbylamine test (1° amines give foul isocyanide); Aniline fails Friedel-Crafts due to salt with AlCl₃; RNA has Uracil, DNA has Thymine.',
        hi: 'कार्बिलऐमीन केवल 1° ऐमीन देते हैं; ऐनिलीन AlCl₃ से लवण बनाने के कारण फ्रीडेल-क्राफ्ट्स नहीं देता; RNA में यूरेसिल होता है।',
      },
    ],
    studyNotes: [
      {
        topicTitle: { en: 'Amines Basicity, Aniline Trap & Biomolecules', hi: 'ऐमीन क्षारीयता, फ्रीडेल-क्राफ्ट्स अपवाद व जैव-अणु' },
        summary: {
          en: 'Hinsberg reagent (C₆H₅SO₂Cl) distinguishes 1°, 2°, 3° amines; Gabriel phthalimide prepares pure 1° aliphatic amines (not aniline). Peptide bond links amino acids.',
          hi: 'हिन्सबर्ग अभिकर्मक से 1°, 2°, 3° ऐमीन की पहचान; विटामिन C (एस्कॉर्बिक अम्ल) जल में विलेय है।',
        },
        keyPoints: [
          { en: 'Denaturation destroys 2° & 3° protein structures while leaving 1° sequence intact (e.g., boiling egg).', hi: 'प्रोटीन विकृतीकरण (Denaturation) से द्वितीयक व तृतीयक संरचना नष्ट होती है पर प्राथमिक बनी रहती है।' },
        ],
      },
    ],
    questionIds: ['12-ch-9', '12-ch-10', '12-ch-12', '12-ch-15', '12-ch-tricky-2'],
    secondsPerQuestion: 34,
    baseXP: 175,
    mapCoords: { x: 86, y: 40 },
  },
];
