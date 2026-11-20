import { BilingualText, MPQuestion } from '../types/quiz';

/**
 * Pure Fisher-Yates (Knuth) shuffle — returns a new shuffled array without mutating input.
 */
export function fisherYatesShuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Shuffles the 4 options of an MPQuestion using Fisher-Yates and remaps `correctIndex`
 * to the new slot of the correct option so answer validation remains 100% exact.
 */
export function shuffleQuestionOptions(question: MPQuestion): MPQuestion {
  const taggedOptions = question.options.map((option, idx) => ({
    option,
    isCorrect: idx === question.correctIndex,
  }));

  const shuffled = fisherYatesShuffle(taggedOptions);
  const newCorrectIndex = shuffled.findIndex((entry) => entry.isCorrect);

  return {
    ...question,
    options: shuffled.map((entry) => entry.option) as [
      BilingualText,
      BilingualText,
      BilingualText,
      BilingualText,
    ],
    correctIndex: (newCorrectIndex >= 0 ? newCorrectIndex : 0) as 0 | 1 | 2 | 3,
  };
}

/**
 * Shuffles BOTH the order of questions AND the 4 options of every question.
 * Invoke once when launching or restarting an encounter / duel round set.
 */
export function shuffleEncounterQuestions(questions: readonly MPQuestion[]): MPQuestion[] {
  return fisherYatesShuffle(questions).map(shuffleQuestionOptions);
}
