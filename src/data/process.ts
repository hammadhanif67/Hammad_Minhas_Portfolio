import type { ProcessStep } from '../types';

export const processSteps: readonly ProcessStep[] = [
  {
    n: '01',
    icon: 'msgsq',
    title: 'We talk',
    body: "Twenty minutes on chat or a call. You tell me the goal, the deadline and the budget range. If I'm not the right fit, I say so straight away.",
  },
  {
    n: '02',
    icon: 'file',
    title: 'Written scope',
    body: 'A document listing every page, feature and revision round, with a fixed price and a delivery date. You approve it before any code exists.',
  },
  {
    n: '03',
    icon: 'code',
    title: 'Build with previews',
    body: 'A live staging link updated as I go. You see progress daily and can flag anything early, while changing it is still cheap.',
  },
  {
    n: '04',
    icon: 'rocket',
    title: 'Deploy & hand over',
    body: 'Deployed to your hosting, repository transferred to you, and a short written guide. Then fourteen days of free bug fixes.',
  },
];
