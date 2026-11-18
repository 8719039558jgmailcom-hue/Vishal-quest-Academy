import { MPQuestion } from '../types/quiz';

// Dedicated additional bilingual MP Board PYQs (2023–2026), 2027 IMPs, and Tricky Conceptual Questions
// ensuring every single individual NCERT chapter across Class 10th & Class 12th has authentic combat questions.
export const EXTRA_MP_QUESTIONS: MPQuestion[] = [
  // ================= CLASS 12 HINDI EXTRA CHAPTERS =================
  {
    id: '12-hi-kamre-1',
    grade: '12',
    subjectId: 'hindi',
    stage: 'chapter1',
    sourceTag: 'PYQ 2025',
    ncertChapter: {
      en: 'Aaroh-2 Kavya Ch. 4: Kamre Mein Band Apahij',
      hi: 'आरोह-2 काव्य पाठ 4: कैमरे में बंद अपाहिज',
    },
    topic: { en: 'Raghuvir Sahay — Media Irony', hi: 'रघुवीर सहाय — मीडिया व्यंग्य' },
    prompt: {
      en: 'In "Kamre Mein Band Apahij", whose perspective does the poet Raghuvir Sahay expose inside the closed TV studio?',
      hi: '"कैमरे में बंद अपाहिज" कविता में कवि रघुवीर सहाय किसकी संवेदनहीन व्यावसायिकता पर करारा व्यंग्य करते हैं?',
    },
    options: [
      { en: 'Sensationalist electronic media & TV presenters', hi: 'संवेदनहीन इलेक्ट्रॉनिक मीडिया व दूरदर्शन संचालक' },
      { en: 'Village panchayat leaders', hi: 'ग्राम पंचायत के सरपंच' },
      { en: 'Classical court poets', hi: 'दरबारी रीतिकालीन कवि' },
      { en: 'Railway ticket inspectors', hi: 'रेलवे टिकट निरीक्षक' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Raghuvir Sahay exposes how television studios commercialize a disabled person’s suffering under the guise of "human sympathy" just to boost TRPs.',
      hi: 'कवि बताते हैं कि मीडिया करुणा के नाम पर दिव्यांग व्यक्ति की पीड़ा का व्यावसायिक तमाशा बनाता है।',
    },
    hint: {
      en: 'Notice the recurring phrase: "हम समर्थ शक्तिवान, हम एक दुर्बल को लाएँगे।"',
      hi: '"हम दूरदर्शन पर बोलेंगे... एक बंद कमरे में" पंक्ति पर ध्यान दें।',
    },
    points: 45,
  },
  {
    id: '12-hi-kamre-2',
    grade: '12',
    subjectId: 'hindi',
    stage: 'boss',
    sourceTag: 'TRICKY 2027',
    isTricky: true,
    ncertChapter: {
      en: 'Aaroh-2 Kavya Ch. 4: Kamre Mein Band Apahij',
      hi: 'आरोह-2 काव्य पाठ 4: कैमरे में बंद अपाहिज',
    },
    topic: { en: 'Hidden Empathy vs TRP', hi: 'छद्म करुणा बनाम टीआरपी' },
    prompt: {
      en: 'Why does the interviewer say "Chaliye, parde par waqt ki keemat hai" at the end of "Kamre Mein Band Apahij"?',
      hi: 'कविता के अंत में साक्षात्कारकर्ता "बस कीजिए, पर्दे पर वक्त की कीमत है" क्यों कहता है?',
    },
    options: [
      { en: 'Because true compassion is secondary to costly broadcast airtime', hi: 'क्योंकि मीडिया के लिए सच्ची करुणा से अधिक प्रसारण समय का मूल्य है' },
      { en: 'Because the studio lights broke down', hi: 'क्योंकि स्टूडियो की लाइट खराब हो गई थी' },
      { en: 'Because the guest won a prize', hi: 'क्योंकि अतिथि ने कोई पुरस्कार जीत लिया था' },
      { en: 'Because the audience left early', hi: 'क्योंकि दर्शक जल्दी चले गए थे' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Once failed attempts to make both guest and viewer cry waste expensive studio minutes, the host abruptly cuts off the program, proving fake empathy.',
      hi: 'प्रसारण का हर मिनट बिकाऊ होता है; दर्शक व अपाहिज को साथ न रुला पाने पर कार्यक्रम तुरंत बंद कर दिया जाता है।',
    },
    points: 60,
  },
  {
    id: '12-hi-usha-1',
    grade: '12',
    subjectId: 'hindi',
    stage: 'chapter1',
    sourceTag: 'PYQ 2024',
    ncertChapter: {
      en: 'Aaroh-2 Kavya Ch. 5: Usha & Ch. 6: Badal Raag',
      hi: 'आरोह-2 काव्य पाठ 5: उषा एवं पाठ 6: बादल राग',
    },
    topic: { en: 'Shamsher Bahadur Singh — Dawn Similes', hi: 'शमशेर बहादुर सिंह — उषा के उपमान' },
    prompt: {
      en: 'In "Usha", Shamsher Bahadur Singh compares the pre-dawn sky to a "Neel Shankh" (blue conch) and what household surface?',
      hi: '"उषा" कविता में कवि ने भोर के आकाश को "नीला शंख" तथा किस घरेलू वस्तु के समान बताया है?',
    },
    options: [
      { en: 'Rakh se leepa hua chauka (ash-plastered wet hearth)', hi: 'राख से लीपा हुआ चौका (अभी गीला पड़ा है)' },
      { en: 'Golden palace mirror', hi: 'राजमहल का सुनहरा दर्पण' },
      { en: 'Copper temple bell', hi: 'ताँबे का मंदिर घंटा' },
      { en: 'Marble fountain', hi: 'संगमरमर का फव्वारा' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Shamsher uses rural Indian imagery: wet ash-plastered kitchen floor, dark sil smeared with red saffron (kesar), and slate rubbed with red chalk.',
      hi: '"प्रात नभ था बहुत नीला शंख जैसे... राख से लीपा हुआ चौका (अभी गीला पड़ा है)" शमशेर की प्रसिद्ध बिंब-योजना है।',
    },
    points: 45,
  },
  {
    id: '12-hi-kavya-tulsidas-1',
    grade: '12',
    subjectId: 'hindi',
    stage: 'chapter2',
    sourceTag: 'PYQ 2026',
    ncertChapter: {
      en: 'Aaroh-2 Kavya Ch. 7–9: Kavitavali, Rubaiyan & Chhota Mera Khet',
      hi: 'आरोह-2 काव्य पाठ 7–9: कवितावली, रुबाइयाँ व छोटा मेरा खेत',
    },
    topic: { en: 'Tulsidas & Umashankar Joshi', hi: 'तुलसीदास, फ़िराक़ व उमाशंकर जोशी' },
    prompt: {
      en: 'Which poetic crop does Umashankar Joshi describe as NEVER getting exhausted even after harvesting for ages in "Chhota Mera Khet"?',
      hi: '"छोटा मेरा खेत" कविता में उमाशंकर जोशी ने किस अनंत फसल (रस) को लुटते रहने पर भी कभी समाप्त न होने वाला बताया है?',
    },
    options: [
      { en: 'Kavyamaya Ras (aesthetic joy of poetry)', hi: 'काव्य-रस (रस का अक्षय पात्र)' },
      { en: 'Winter wheat harvest', hi: 'शीतकालीन गेहूँ की फसल' },
      { en: 'Sugarcane juice', hi: 'गन्ने का रस' },
      { en: 'Gold treasury coins', hi: 'राजकोष के स्वर्ण सिक्के' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Umashankar Joshi compares the square paper to a small field where sowing a seed of emotion blossoms into an inexhaustible vessel of poetic Ras.',
      hi: 'कवि कागज़ के चौकोर पन्ने को छोटा खेत तथा भावना के बीज से उपजे काव्य-रस को "अक्षय पात्र" कहते हैं।',
    },
    points: 45,
  },
  {
    id: '12-hi-gadya-renu-1',
    grade: '12',
    subjectId: 'hindi',
    stage: 'chapter2',
    sourceTag: 'IMP 2027',
    ncertChapter: {
      en: 'Aaroh-2 Gadya Ch. 13–15: Pahalwan ki Dholak, Shirish & Ambedkar',
      hi: 'आरोह-2 गद्य पाठ 13–15: पहलवान की ढोलक, शिरीष के फूल व श्रम विभाजन',
    },
    topic: { en: 'Luttan Singh & Shirish Tree', hi: 'लुट्टन सिंह पहलवान व शिरीष का अजेय स्वभाव' },
    prompt: {
      en: 'Who was the wrestling champion defeated by Luttan Singh at Shyamnagar fair, earning him the title of Royal Wrestler?',
      hi: '"पहलवान की ढोलक" में श्यामनगर दंगल में लुट्टन सिंह ने किस प्रसिद्ध पहलवान को हराकर राज-पहलवान की पदवी पाई?',
    },
    options: [
      { en: 'Chand Singh (Sher ka Bachcha)', hi: 'चाँद सिंह ("शेर का बच्चा")' },
      { en: 'Kala Khan', hi: 'काला खाँ' },
      { en: 'Badal Singh', hi: 'बादल सिंह' },
      { en: 'Sheru Pahalwan', hi: 'शेरू पहलवान' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Guided only by the rhythmic beats of his dholak guru, village orphan Luttan Singh defeated Chand Singh at Shyamnagar Dangal.',
      hi: 'ढोलक को अपना गुरु मानकर लुट्टन सिंह ने श्यामनगर दंगल में "चाँद सिंह" को पराजित किया था।',
    },
    points: 45,
  },

  // ================= CLASS 10 HINDI EXTRA CHAPTERS =================
  {
    id: '10-hi-utsah-1',
    grade: '10',
    subjectId: 'hindi',
    stage: 'chapter1',
    sourceTag: 'PYQ 2025',
    ncertChapter: {
      en: 'Kshitij-2 Kavya Ch. 4–6: Utsah, Danturit Muskan & Sangatkar',
      hi: 'क्षितिज-2 काव्य पाठ 4–6: उत्साह, यह दंतुरित मुसकान व संगतकार',
    },
    topic: { en: 'Nirala, Nagarjun & Manglesh Dabral', hi: 'निराला, नागार्जुन एवं मंगलेश डबराल' },
    prompt: {
      en: 'In Nirala’s poem "Utsah", the cloud symbolizes what dual power in the poet’s vision?',
      hi: 'निराला की "उत्साह" कविता में "बादल" किस दोहरे भाव का प्रतीक है?',
    },
    options: [
      { en: 'Soothing relief for parched earth & revolutionary new creation', hi: 'पीड़ितों की प्यास बुझाने वाला व क्रांति/नवसृजन का वाहक' },
      { en: 'Passive sleep & lethargy', hi: 'आलस्य और निद्रा का प्रतीक' },
      { en: 'Royal tax collection', hi: 'राजकीय कर वसूली का प्रतीक' },
      { en: 'Autumn leaf shedding', hi: 'पतझड़ के पत्तों का प्रतीक' },
    ],
    correctIndex: 0,
    explanation: {
      en: '"Utsah" is an Ahvan Geet calling thunderous clouds to inspire poets and awaken social transformation.',
      hi: '"उत्साह" एक आह्वान गीत है जिसमें बादल नूतन सृजन और क्रांति चेतना दोनों का प्रतीक हैं।',
    },
    points: 45,
  },
  {
    id: '10-hi-ekkahani-1',
    grade: '10',
    subjectId: 'hindi',
    stage: 'chapter2',
    sourceTag: 'PYQ 2024',
    ncertChapter: {
      en: 'Kshitij-2 Gadya Ch. 10–12: Ek Kahani Yah Bhi, Naubatkhane & Sanskriti',
      hi: 'क्षितिज-2 गद्य पाठ 10–12: एक कहानी यह भी, नौबतखाने में इबादत व संस्कृति',
    },
    topic: { en: 'Manu Bhandari & Bismillah Khan', hi: 'मन्नू भंडारी व उस्ताद बिस्मिल्ला खाँ' },
    prompt: {
      en: 'In "Naubatkhane Mein Ibadat", which musical instrument did Bharat Ratna Ustad Bismillah Khan pray for mastery over in Kashi?',
      hi: '"नौबतखाने में इबादत" पाठ के अनुसार भारत रत्न उस्ताद बिस्मिल्ला खाँ किस वाद्ययंत्र के साधक थे?',
    },
    options: [
      { en: 'Shehnai', hi: 'शहनाई' },
      { en: 'Sitar', hi: 'सितार' },
      { en: 'Tabla', hi: 'तबला' },
      { en: 'Sarod', hi: 'सरोद' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Ustad Bismillah Khan was India’s legendary Shehnai maestro who lived in Kashi and revered Ganga-Jamuni tehzeeb.',
      hi: 'उस्ताद बिस्मिल्ला खाँ काशी की सांस्कृतिक परंपरा के अमर शहनाई वादक थे।',
    },
    points: 45,
  },

  // ================= CLASS 10 ENGLISH EXTRA CHAPTERS =================
  {
    id: '10-en-extra-1',
    grade: '10',
    subjectId: 'english',
    stage: 'chapter1',
    sourceTag: 'PYQ 2025',
    ncertChapter: {
      en: 'First Flight Ch. 3, 5, 6: Two Stories About Flying, Glimpses & Mijbil',
      hi: 'First Flight पाठ 3, 5, 6: उड़ान, भारत की झलकियाँ व मिजबिल',
    },
    topic: { en: 'Young Seagull & Black Aeroplane', hi: 'यंग सीगल व ब्लैक एयरोप्लेन' },
    prompt: {
      en: 'What finally compelled the young seagull to take his very first flight off the ledge?',
      hi: 'नन्हे सीगल को चट्टान के किनारे से अपनी पहली उड़ान भरने के लिए किसने विवश किया?',
    },
    options: [
      { en: 'Maddened by hunger, diving at the fish in his mother’s beak', hi: 'भूख से व्याकुल होकर माँ की चोंच में दबी मछली पर झपटना' },
      { en: 'A sudden earthquake', hi: 'अचानक आए भूकंप ने' },
      { en: 'A fisherman’s net', hi: 'मछुआरे के जाल ने' },
      { en: 'Heavy snowfall', hi: 'भारी बर्फबारी ने' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'After starving for 24 hours, intense hunger made the young seagull dive toward the piece of fish held by his mother, overcoming his fear of flying.',
      hi: '24 घंटे की भूख ने नन्हे सीगल का डर दूर किया और वह मछली के टुकड़े की ओर झपटते हुए उड़ना सीख गया।',
    },
    points: 45,
  },
  {
    id: '10-en-extra-2',
    grade: '10',
    subjectId: 'english',
    stage: 'chapter2',
    sourceTag: 'IMP 2027',
    ncertChapter: {
      en: 'First Flight Ch. 7–9: Madam Rides the Bus, Sermon at Benares & Proposal',
      hi: 'First Flight पाठ 7–9: वल्ली की बस यात्रा, बनारस उपदेश व प्रपोज़ल',
    },
    topic: { en: 'Valli, Kisa Gotami & Lomov', hi: 'वल्ली, किसा गौतमी व लोमोव' },
    prompt: {
      en: 'In "The Sermon at Benares", why did Kisa Gotami fail to bring mustard seeds to Gautama Buddha?',
      hi: '"The Sermon at Benares" में किसा गौतमी को बिना मृत्यु वाला घर क्यों नहीं मिला?',
    },
    options: [
      { en: 'No household had escaped the loss of a loved one (death is universal)', hi: 'किसी भी घर में ऐसा कोई न था जहाँ कभी मृत्यु न हुई हो' },
      { en: 'Mustard was out of season', hi: 'सरसों का मौसम नहीं था' },
      { en: 'Shopkeepers refused to sell seeds', hi: 'दुकानदारों ने बीज बेचने से मना कर दिया' },
      { en: 'She lost her way in Benares', hi: 'वह बनारस में रास्ता भटक गई थी' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Buddha asked Kisa Gotami for mustard seeds from a house where no one had died, guiding her to realize that death is inevitable for all mortals.',
      hi: 'बुद्ध ने मृत्यु की सार्वभौमिक सच्चाई समझाने हेतु किसा गौतमी को यह कार्य दिया था।',
    },
    points: 45,
  },
  {
    id: '10-en-extra-3',
    grade: '10',
    subjectId: 'english',
    stage: 'chapter2',
    sourceTag: 'PYQ 2024',
    ncertChapter: {
      en: 'Footprints Ch. 6–9: Scientist, Necklace, Bholi & Book That Saved Earth',
      hi: 'Footprints पाठ 6–9: ईब्राइट, द नेकलेस, भोली व पृथ्वी को बचाने वाली किताब',
    },
    topic: { en: 'Bholi (Sulekha) & Matilda Loisel', hi: 'भोली (सुलेखा) व मटिल्डा' },
    prompt: {
      en: 'In "Bholi", what was Bholi’s real childhood name, and why did she refuse to marry Bishamber Nath?',
      hi: '"भोली" कहानी में भोली का वास्तविक नाम क्या था और उसने बिशंभर नाथ से विवाह क्यों ठुकराया?',
    },
    options: [
      { en: 'Sulekha; he greedily demanded ₹5,000 dowry seeing her pockmarks', hi: 'सुलेखा; चेहरे के दाग देखकर बिशंभर ने लालच में ₹5,000 दहेज माँगा' },
      { en: 'Radha; he was too young', hi: 'राधा; वह बहुत छोटा था' },
      { en: 'Kamla; he wanted to move abroad', hi: 'कमला; वह विदेश जाना चाहता था' },
      { en: 'Meera; her teacher forbade her', hi: 'मीरा; उसकी शिक्षिका ने मना किया' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Empowered by education from her kind teacher, Sulekha (Bholi) boldly rejected the greedy, mean-spirited Bishamber in front of all wedding guests.',
      hi: 'शिक्षा से मिले आत्मविश्वास के कारण सुलेखा (भोली) ने लालची बिशंभर से शादी करने से इनकार कर दिया।',
    },
    points: 45,
  },

  // ================= CLASS 12 EXTRA MATHS / PHYSICS / CHEM =================
  {
    id: '12-ma-lpp-1',
    grade: '12',
    subjectId: 'maths',
    stage: 'boss',
    sourceTag: 'IMP 2027',
    ncertChapter: {
      en: 'NCERT Maths Ch. 12: Linear Programming (LPP)',
      hi: 'NCERT गणित अध्याय 12: रैखिक प्रोग्रामन',
    },
    topic: { en: 'Feasible Region & Corner Point Theorem', hi: 'सुसंगत क्षेत्र व कोनीय बिंदु प्रमेय' },
    prompt: {
      en: 'In a bounded feasible region of a Linear Programming Problem (LPP), where does the optimal value of the objective function Z = ax + by always occur?',
      hi: 'रैखिक प्रोग्रामन समस्या के परिबद्ध सुसंगत क्षेत्र में उद्देश्य फलन Z = ax + by का इष्टतम मान सदैव कहाँ प्राप्त होता है?',
    },
    options: [
      { en: 'At a corner point (vertex) of the feasible region', hi: 'सुसंगत क्षेत्र के कोनीय बिंदु (शीर्ष) पर' },
      { en: 'Only at the centroid of the region', hi: 'केवल क्षेत्र के केंद्रक पर' },
      { en: 'At any interior point outside constraints', hi: 'अवरोधों के बाहर किसी भी बिंदु पर' },
      { en: 'At infinity always', hi: 'सदैव अनंत पर' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'By the Fundamental Corner Point Theorem, every bounded feasible polygon achieves its maximum and minimum Z values at one or more vertices.',
      hi: 'कोनीय बिंदु प्रमेय के अनुसार परिबद्ध क्षेत्र में अधिकतम व न्यूनतम मान शीर्ष बिंदुओं पर ही मिलते हैं।',
    },
    points: 50,
  },
  {
    id: '12-ph-atoms-1',
    grade: '12',
    subjectId: 'physics',
    stage: 'chapter2',
    sourceTag: 'PYQ 2025',
    ncertChapter: {
      en: 'NCERT Physics Ch. 12 & 13: Atoms & Nuclei',
      hi: 'NCERT भौतिकी पाठ 12 व 13: परमाणु एवं नाभिक',
    },
    topic: { en: 'Bohr Radius & Nuclear Binding Energy', hi: 'बोर त्रिज्या व नाभिकीय बंधन ऊर्जा' },
    prompt: {
      en: 'According to Bohr’s atomic model, how does the radius rₙ of the n-th stationary orbit of a hydrogen atom depend on principal quantum number n?',
      hi: 'बोर के परमाणु मॉडल के अनुसार हाइड्रोजन परमाणु की nवीं स्थायी कक्षा की त्रिज्या rₙ, मुख्य क्वांटम संख्या n पर कैसे निर्भर करती है?',
    },
    options: [
      { en: 'rₙ ∝ n²', hi: 'rₙ ∝ n²' },
      { en: 'rₙ ∝ 1/n', hi: 'rₙ ∝ 1/n' },
      { en: 'rₙ ∝ n', hi: 'rₙ ∝ n' },
      { en: 'rₙ ∝ 1/n²', hi: 'rₙ ∝ 1/n²' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'In Bohr’s model, rₙ = (0.529 Å) × n², so the second orbit is 4 times larger than the ground-state orbit.',
      hi: 'बोर मॉडल में rₙ = n² r₁ होता है, अतः त्रिज्या n² के अनुक्रमानुपाती होती है।',
    },
    points: 45,
  },
  {
    id: '12-ch-alcohols-1',
    grade: '12',
    subjectId: 'chemistry',
    stage: 'chapter2',
    sourceTag: 'PYQ 2024',
    ncertChapter: {
      en: 'NCERT Chemistry Ch. 7 & 8: Alcohols, Phenols, Aldehydes & Ketones',
      hi: 'NCERT रसायन पाठ 7 व 8: ऐल्कोहॉल, फीनॉल व ऐल्डिहाइड-कीटोन',
    },
    topic: { en: 'Lucas Test & Tollens Reagent', hi: 'ल्यूकास परीक्षण एवं टॉलेन अभिकर्मक' },
    prompt: {
      en: 'Which alcohol produces immediate turbidity at room temperature when treated with Lucas reagent (conc. HCl + anhydrous ZnCl₂)?',
      hi: 'कमरे के ताप पर ल्यूकास अभिकर्मक (सांद्र HCl + निर्जल ZnCl₂) के साथ कौन-सा ऐल्कोहॉल तुरंत धुँधलापन (अवक्षेप) देता है?',
    },
    options: [
      { en: 'Tertiary (3°) alcohol', hi: 'तृतीयक (3°) ऐल्कोहॉल' },
      { en: 'Primary (1°) alcohol', hi: 'प्राथमिक (1°) ऐल्कोहॉल' },
      { en: 'Methanol only', hi: 'केवल मेथेनॉल' },
      { en: 'Phenol', hi: 'फीनॉल' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Tertiary alcohols form stable 3° carbocations immediately, producing instant cloudiness of insoluble alkyl chloride with Lucas reagent.',
      hi: 'तृतीयक (3°) ऐल्कोहॉल स्थायी 3° कार्बोधनायन बनाने के कारण ल्यूकास अभिकर्मक से तुरंत धुँधलापन देते हैं।',
    },
    points: 50,
  },
];
