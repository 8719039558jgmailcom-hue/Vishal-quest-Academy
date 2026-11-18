import { ChapterNodeDefinition } from '../types/quiz';
import { SYLLABUS_NODES_10 } from './syllabusNodes10';
import { SYLLABUS_NODES_12 } from './syllabusNodes12';

export const SUBJECT_BOSS_COORDS = { x: 89, y: 28 };

export const CHAPTER_NODES: ChapterNodeDefinition[] = [
  ...SYLLABUS_NODES_10,
  ...SYLLABUS_NODES_12,
];
