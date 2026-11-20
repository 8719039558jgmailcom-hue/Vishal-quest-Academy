import { CHAPTER_NODES } from './chapterNodes';
import { MP_BOARD_10_QUESTIONS } from './mpboard10';
import { MP_BOARD_12_QUESTIONS } from './mpboard12';
import { EXTRA_MP_QUESTIONS } from './mpboardExtraQuestions';
import { MORE_MP_10_QUESTIONS } from './mpboardMore10';
import { MORE_MP_12_QUESTIONS } from './mpboardMore12';
import { CHAPTER_STAGES, SUBJECT_REALMS } from './questConfig';
import {
  BookSubsection,
  ChapterNodeDefinition,
  GradeLevel,
  MPQuestion,
  StageDefinition,
  StageType,
  SubjectId,
  SubjectRealm,
} from '../types/quiz';

export const ALL_MP_QUESTIONS: MPQuestion[] = [
  ...MP_BOARD_10_QUESTIONS,
  ...MP_BOARD_12_QUESTIONS,
  ...EXTRA_MP_QUESTIONS,
  ...MORE_MP_10_QUESTIONS,
  ...MORE_MP_12_QUESTIONS,
];

const QUESTION_MAP = new Map<string, MPQuestion>(
  ALL_MP_QUESTIONS.map((q) => [q.id, q])
);

export function getSubjectRealm(subjectId: SubjectId): SubjectRealm {
  return SUBJECT_REALMS.find((s) => s.id === subjectId) ?? SUBJECT_REALMS[0];
}

export function getStageDef(stage: StageType): StageDefinition {
  return CHAPTER_STAGES.find((s) => s.stage === stage) ?? CHAPTER_STAGES[0];
}

export function getSubjectBookSections(
  grade: GradeLevel,
  subjectId: SubjectId
): BookSubsection[] {
  if (subjectId === 'hindi') {
    if (grade === '10') {
      return [
        {
          id: 'kavya-khand',
          label: { en: 'Kavya Khand (Kshitij-2 Ch. 1–6)', hi: 'काव्य खंड (क्षितिज-2 पाठ 1–6)' },
          description: {
            en: 'Surdas, Tulsidas, Jaishankar Prasad, Nirala, Nagarjun & Manglesh Dabral',
            hi: 'सूरदास, तुलसीदास, जयशंकर प्रसाद, निराला, नागार्जुन व मंगलेश डबराल',
          },
          chapterOrders: [1, 2, 3],
        },
        {
          id: 'gadya-khand',
          label: { en: 'Gadya Khand & Kritika-2 (Ch. 7–12 + Kritika)', hi: 'गद्य खंड एवं कृतिका-2' },
          description: {
            en: 'Netaji ka Chashma, Balgovin Bhagat, Ek Kahani Yah Bhi, Mata ka Anchal & Gangtok',
            hi: 'नेताजी का चश्मा, बालगोबिन भगत, एक कहानी यह भी, माता का अँचल व साना-साना हाथ जोड़ि',
          },
          chapterOrders: [4, 5, 6, 7],
        },
        {
          id: 'kavyabodh-vyakaran',
          label: { en: 'Kavya Bodh (Ras, Alankar) & Vyakaran', hi: 'काव्य बोध (रस, अलंकार) व व्याकरण' },
          description: {
            en: 'Dedicated Ras & Alankar subsections, Doha-Chaupai Chhand, Samas, Sandhi & Vachya',
            hi: 'रस व अलंकार समर्पित उपखंड, दोहा-चौपाई छंद, समास, संधि व वाच्य',
          },
          chapterOrders: [8, 9],
        },
      ];
    }
    return [
      {
        id: 'kavya-khand',
        label: { en: 'Kavya Khand (Aaroh-2 Ch. 1–9)', hi: 'काव्य खंड (आरोह-2 पाठ 1–9)' },
        description: {
          en: 'Atmaparichay, Patang, Kavita ke Bahane, Kamre Mein Band Apahij, Usha, Badal Raag & Rubaiyan',
          hi: 'आत्मपरिचय, पतंग, कविता के बहाने, कैमरे में बंद अपाहिज, उषा, बादल राग व रुबाइयाँ',
        },
        chapterOrders: [1, 2, 3, 4, 5, 6],
      },
      {
        id: 'gadya-khand',
        label: { en: 'Gadya Khand (Aaroh-2 Ch. 10–15)', hi: 'गद्य खंड (आरोह-2 पाठ 10–15)' },
        description: {
          en: 'Bhaktin, Bazar Darshan, Kale Megha, Pahalwan ki Dholak, Shirish & Ambedkar',
          hi: 'भक्तिन, बाज़ार दर्शन, काले मेघा, पहलवान की ढोलक, शिरीष के फूल व श्रम विभाजन',
        },
        chapterOrders: [7, 8],
      },
      {
        id: 'vitan-khand',
        label: { en: 'Vitan-2 (All 3 Chapters)', hi: 'वितान-2 (संपूर्ण 3 पाठ)' },
        description: {
          en: 'Silver Wedding, Jujh & Ateet Mein Dabe Paon',
          hi: 'सिल्वर वेडिंग, जूझ व अतीत में दबे पाँव',
        },
        chapterOrders: [9],
      },
      {
        id: 'kavyabodh-vyakaran',
        label: { en: 'Kavya Bodh: Ras, Alankar & Shabd Shakti', hi: 'काव्य बोध: रस, अलंकार व शब्द-शक्ति' },
        description: {
          en: 'Dedicated Ras & Alankar subsections, Chhand, Kavya Gun & Shabd Shakti',
          hi: 'रस, भ्रांतिमान-संदेह-विरोधाभास अलंकार, छंद व शब्द-शक्ति',
        },
        chapterOrders: [10],
      },
      {
        id: 'abhivyakti-khand',
        label: { en: 'Abhivyakti aur Madhyam & Vyakaran', hi: 'अभिव्यक्ति-माध्यम व व्याकरण' },
        description: {
          en: 'Journalism, Inverted Pyramid, 6 Kakar, Feature-Aalekh & Nipat',
          hi: 'पत्रकारिता, उल्टा पिरामिड, 6 ककार, फीचर-आलेख व निपात',
        },
        chapterOrders: [11],
      },
    ];
  }

  if (subjectId === 'english') {
    if (grade === '10') {
      return [
        {
          id: 'first-flight',
          label: { en: 'Book 1: First Flight (Ch. 1–9 & Poems)', hi: 'पुस्तक 1: First Flight (सभी 9 पाठ)' },
          description: {
            en: 'A Letter to God, Mandela, Flying, Anne Frank, Coorg, Valli, Benares & Proposal',
            hi: 'लेंचो, मंडेला, यंग सीगल, ऐन फ्रैंक, कुर्ग, वल्ली, बनारस व प्रपोज़ल',
          },
          chapterOrders: [1, 2, 3, 4],
        },
        {
          id: 'footprints',
          label: { en: 'Book 2: Footprints Without Feet (Ch. 1–9)', hi: 'पुस्तक 2: Footprints (सभी 9 पाठ)' },
          description: {
            en: 'Tricki, Thief’s Story, Griffin, Ebright, Necklace, Bholi & Book That Saved Earth',
            hi: 'ट्रिकी, हरि सिंह, ग्रिफिन, ईब्राइट, द नेकलेस, भोली व मंगल आक्रमण',
          },
          chapterOrders: [5, 6],
        },
        {
          id: 'grammar-book',
          label: { en: 'Section C: Applied English Grammar', hi: 'खंड C: व्यावहारिक अंग्रेज़ी ग्रामर' },
          description: {
            en: 'Articles, Modals, Tenses, Voice, Relative Clauses & Trap Rules',
            hi: 'आर्टिकल, मोडल, टेंस, वॉइस व क्लॉज़ नियम',
          },
          chapterOrders: [7, 8],
        },
      ];
    }
    return [
      {
        id: 'flamingo-book',
        label: { en: 'Book 1: Flamingo (Ch. 1–8 & All 5 Poems)', hi: 'पुस्तक 1: Flamingo (सभी 8 गद्य व 5 कविताएँ)' },
        description: {
          en: 'Last Lesson, Lost Spring, Deep Water, Rattrap, Indigo, Gemini, Interview & Poems',
          hi: 'द लास्ट लेसन, लॉस्ट स्प्रिंग, डीप वॉटर, रैटट्रैप, इंडिगो व पाँचों कविताएँ',
        },
        chapterOrders: [1, 2, 3, 4],
      },
      {
        id: 'vistas-book',
        label: { en: 'Book 2: Vistas (All 6 Chapters)', hi: 'पुस्तक 2: Vistas (सभी 6 पाठ)' },
        description: {
          en: 'Third Level, Tiger King, Antarctica, The Enemy, On the Face of It & Memories',
          hi: 'थर्ड लेवल, टाइगर किंग, अंटार्कटिका, द एनेमी व मेमोरीज़',
        },
        chapterOrders: [5, 6],
      },
      {
        id: 'grammar-book',
        label: { en: 'Section C: Advanced Grammar & Syntax', hi: 'खंड C: उच्च स्तरीय ग्रामर' },
        description: {
          en: 'No sooner...than, Determiners, Prepositions & Non-finite Traps',
          hi: 'No sooner...than, प्रीपोज़िशन, डिटरमिनर व जेरंड नियम',
        },
        chapterOrders: [7],
      },
    ];
  }

  if (subjectId === 'maths') {
    if (grade === '10') {
      return [
        {
          id: 'maths-algebra',
          label: { en: 'Unit I: Number System & Algebra (Ch. 1–5)', hi: 'इकाई 1: संख्या पद्धति व बीजगणित (अध्याय 1–5)' },
          description: {
            en: 'Real Numbers, Polynomials, Linear Equations, Quadratics & AP',
            hi: 'वास्तविक संख्याएँ, बहुपद, रैखिक, द्विघात व समांतर श्रेढ़ी',
          },
          chapterOrders: [1, 2, 3, 4],
        },
        {
          id: 'maths-geometry-trig',
          label: { en: 'Unit II: Geometry & Trigonometry (Ch. 6–9)', hi: 'इकाई 2: ज्यामिति व त्रिकोणमिति (अध्याय 6–9)' },
          description: {
            en: 'Triangles, Coordinate Geometry, Trig Identities & Heights',
            hi: 'त्रिभुज, निर्देशांक ज्यामिति, त्रिकोणमिति व ऊँचाई-दूरी',
          },
          chapterOrders: [5, 6],
        },
        {
          id: 'maths-mensuration-stats',
          label: { en: 'Unit III: Circles, Mensuration & Probability (Ch. 10–14)', hi: 'इकाई 3: वृत्त, क्षेत्रमिति व प्रायिकता (अध्याय 10–14)' },
          description: {
            en: 'Circles, Sector Areas, Cone/Cylinder Volumes, Statistics & Probability',
            hi: 'वृत्त स्पर्शरेखा, त्रिज्यखंड, आयतन, सांख्यिकी व प्रायिकता',
          },
          chapterOrders: [7, 8],
        },
      ];
    }
    return [
      {
        id: 'maths-part-1',
        label: { en: 'Book 1: NCERT Maths Part I (Ch. 1–6)', hi: 'पुस्तक 1: NCERT गणित भाग 1 (अध्याय 1–6)' },
        description: {
          en: 'Relations, Inverse Trig, Matrices, Determinants, Continuity & Derivative Apps',
          hi: 'संबंध-फलन, प्रतिलोम त्रिकोणमिति, आव्यूह, सारणिक, सांतत्य व अवकलज अनुप्रयोग',
        },
        chapterOrders: [1, 2, 3],
      },
      {
        id: 'maths-part-2',
        label: { en: 'Book 2: NCERT Maths Part II (Ch. 7–13)', hi: 'पुस्तक 2: NCERT गणित भाग 2 (अध्याय 7–13)' },
        description: {
          en: 'Integrals, Curve Areas, Differential Equations, Vectors, 3D, LPP & Probability',
          hi: 'समाकलन, क्षेत्रफल, अवकल समीकरण, सदिश, 3D ज्यामिति, LPP व प्रायिकता',
        },
        chapterOrders: [4, 5, 6, 7],
      },
    ];
  }

  if (subjectId === 'physics') {
    if (grade === '10') {
      return [
        {
          id: 'optics-section',
          label: { en: 'Section A: Optics & Human Eye (Ch. 9–10)', hi: 'खंड A: प्रकाशिकी व मानव नेत्र (अध्याय 9–10)' },
          description: {
            en: 'Spherical Mirrors, Lenses, Power & Vision Defects',
            hi: 'गोलीय दर्पण, लेंस, क्षमता व दृष्टि दोष',
          },
          chapterOrders: [1, 2, 3],
        },
        {
          id: 'electromagnetism-section',
          label: { en: 'Section B: Electricity & Magnetism (Ch. 11–12)', hi: 'खंड B: विद्युत व चुंबकत्व (अध्याय 11–12)' },
          description: {
            en: 'Ohm’s Law, Resistance Stretch Traps, AC 50 Hz & Magnetic Field Lines',
            hi: 'ओम का नियम, प्रतिरोध खिंचाव व चुंबकीय रेखाएँ',
          },
          chapterOrders: [4, 5],
        },
      ];
    }
    return [
      {
        id: 'physics-part-1',
        label: { en: 'Book 1: NCERT Physics Part I (Ch. 1–8)', hi: 'पुस्तक 1: NCERT भौतिकी भाग 1 (अध्याय 1–8)' },
        description: {
          en: 'Charges, Capacitance, Current, Moving Charges, Magnetism, EMI, AC & EM Waves',
          hi: 'स्थिरवैद्युत, धारा, गतिमान आवेश, चुंबकत्व, प्रेरण, AC व EM तरंगें',
        },
        chapterOrders: [1, 2, 3],
      },
      {
        id: 'physics-part-2',
        label: { en: 'Book 2: NCERT Physics Part II (Ch. 9–14)', hi: 'पुस्तक 2: NCERT भौतिकी भाग 2 (अध्याय 9–14)' },
        description: {
          en: 'Ray & Wave Optics, Dual Nature, Atoms, Nuclei & Semiconductors',
          hi: 'किरण-तरंग प्रकाशिकी, प्रकाश-विद्युत, परमाणु, नाभिक व अर्धचालक',
        },
        chapterOrders: [4, 5, 6],
      },
    ];
  }

  // Chemistry subsections
  if (grade === '10') {
    return [
      {
        id: 'chem-inorganic',
        label: { en: 'Section A: Chemical Reactions, Acids & Salts (Ch. 1–2)', hi: 'खंड A: अभिक्रियाएँ, अम्ल व लवण (अध्याय 1–2)' },
        description: {
          en: 'Displacement, Precipitates, pH Scale, Bleaching Powder & Dry HCl Trap',
          hi: 'विस्थापन, अवक्षेपण, pH स्केल, विरंजक चूर्ण व शुष्क HCl प्रयोग',
        },
        chapterOrders: [1, 2, 3],
      },
      {
        id: 'chem-carbon',
        label: { en: 'Section B: Metals & Carbon Compounds (Ch. 3–4)', hi: 'खंड B: धातु व कार्बन के यौगिक (अध्याय 3–4)' },
        description: {
          en: 'Amphoteric Oxides, Homologous Series, Ketones & Reactivity Series',
          hi: 'उभयधर्मी ऑक्साइड, सजातीय श्रेढ़ी व क्रियाशीलता',
        },
        chapterOrders: [4, 5],
      },
    ];
  }

  return [
    {
      id: 'chem-part-1',
      label: { en: 'Book 1: NCERT Chemistry Part I (Ch. 1–5)', hi: 'पुस्तक 1: NCERT रसायन भाग 1 (अध्याय 1–5)' },
      description: {
        en: 'Solutions, Electrochemistry, Chemical Kinetics, d & f Block & Coordination',
        hi: 'विलयन, वैद्युतरसायन, बलगतिकी, d-f ब्लॉक व उपसहसंयोजन यौगिक',
      },
      chapterOrders: [1, 2, 3],
    },
    {
      id: 'chem-part-2',
      label: { en: 'Book 2: NCERT Chemistry Part II (Ch. 6–10)', hi: 'पुस्तक 2: NCERT रसायन भाग 2 (अध्याय 6–10)' },
      description: {
        en: 'Haloalkanes, Alcohols/Phenols, Aldehydes/Ketones, Amines & Biomolecules',
        hi: 'हैलोऐल्केन, ऐल्कोहॉल-फीनॉल, ऐल्डिहाइड-कीटोन, ऐमीन व जैव-अणु',
      },
      chapterOrders: [4, 5, 6],
    },
  ];
}

export function getSubsectionForNode(node: ChapterNodeDefinition): BookSubsection {
  const sections = getSubjectBookSections(node.grade, node.subjectId);
  return (
    sections.find((sec) => sec.id === node.subsectionId) ??
    sections.find((sec) => sec.chapterOrders.includes(node.order)) ??
    sections[0]
  );
}

export function getChapterNodesForSubject(
  grade: GradeLevel,
  subjectId: SubjectId
): ChapterNodeDefinition[] {
  return CHAPTER_NODES.filter(
    (node) => node.grade === grade && node.subjectId === subjectId
  ).sort((a, b) => a.order - b.order);
}

export function getChapterNodeById(nodeId: string): ChapterNodeDefinition | undefined {
  return CHAPTER_NODES.find((node) => node.id === nodeId);
}

export function getChapterNodeQuestions(node: ChapterNodeDefinition): MPQuestion[] {
  return node.questionIds
    .map((id) => QUESTION_MAP.get(id))
    .filter((q): q is MPQuestion => Boolean(q));
}

export function buildSubjectBossQuestions(
  grade: GradeLevel,
  subjectId: SubjectId
): MPQuestion[] {
  const nodes = getChapterNodesForSubject(grade, subjectId);
  const picked: MPQuestion[] = [];
  for (const node of nodes) {
    const qs = getChapterNodeQuestions(node);
    const preferred =
      qs.find((q) => q.sourceTag === 'TRICKY 2027') ??
      qs.find((q) => q.sourceTag === 'IMP 2027') ??
      qs.find((q) => q.sourceTag === 'PYQ 2026') ??
      qs[0];
    if (preferred) picked.push(preferred);
  }
  return picked;
}

export function getStageQuestions(
  grade: GradeLevel,
  subjectId: SubjectId,
  stage: StageType
): MPQuestion[] {
  return ALL_MP_QUESTIONS.filter(
    (q) => q.grade === grade && q.subjectId === subjectId && q.stage === stage
  );
}

export function getSubjectQuestions(grade: GradeLevel, subjectId: SubjectId): MPQuestion[] {
  return ALL_MP_QUESTIONS.filter((q) => q.grade === grade && q.subjectId === subjectId);
}

export function buildGrandBossQuestions(grade: GradeLevel): MPQuestion[] {
  const picked: MPQuestion[] = [];
  for (const realm of SUBJECT_REALMS) {
    const bossQs = getSubjectQuestions(grade, realm.id);
    const pyq = bossQs.find((q) => q.sourceTag === 'PYQ 2026' || q.sourceTag === 'PYQ 2025');
    const trickyOrImp =
      bossQs.find((q) => q.sourceTag === 'TRICKY 2027') ??
      bossQs.find((q) => q.sourceTag === 'IMP 2027');
    if (pyq) picked.push(pyq);
    if (trickyOrImp && trickyOrImp.id !== pyq?.id) picked.push(trickyOrImp);
  }
  return picked;
}
