/**
 * Static exam question bank with correct answers, used to actually
 * grade a submission client-side. A real backend would keep the
 * answer key server-side to prevent inspection, but for this
 * frontend-only stage we grade locally and persist the result.
 */
export const examBank = {
  title: 'Mathematics — Grade 8A Mid-term',
  minutes: 15,
  questions: [
    {
      id: 1,
      prompt: 'Solve for x: 2x² − 8 = 0',
      options: ['x = 2 or x = −2', 'x = 4 or x = −4', 'x = 2 only', 'x = 8'],
      correctIndex: 0,
    },
    {
      id: 2,
      prompt: 'Which of the following is a factor of x² − 9?',
      options: ['x + 3', 'x + 9', 'x − 1', 'x + 1'],
      correctIndex: 0,
    },
    {
      id: 3,
      prompt: 'The sum of the roots of x² − 5x + 6 = 0 is:',
      options: ['5', '6', '−5', '1'],
      correctIndex: 0,
    },
    {
      id: 4,
      prompt: 'Factorize: x² + 7x + 12',
      options: ['(x + 3)(x + 4)', '(x + 2)(x + 6)', '(x + 1)(x + 12)', '(x − 3)(x − 4)'],
      correctIndex: 0,
    },
  ],
};
