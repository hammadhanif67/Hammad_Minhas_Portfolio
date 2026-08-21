import type { FaqEntry } from '../types';

export const faqEntries: readonly FaqEntry[] = [
  {
    id: 'backend',
    question: 'Do you do back-end work too?',
    answer:
      "No, and I'd rather tell you that up front than learn on your budget. I'm front-end: React, TypeScript, Tailwind, animation, responsive layout and API integration. If your project needs a back end, I'll work alongside whoever builds it and consume their endpoints cleanly.",
  },
  {
    id: 'timezone',
    question: 'What timezone are you in?',
    answer:
      'Pakistan Standard Time, UTC+5, based in Faisalabad. That gives solid daytime overlap with Europe, the Gulf and Australia, plus early-morning overlap with US East Coast. I keep flexible hours for calls and usually reply within a few hours regardless.',
  },
  {
    id: 'figma',
    question: 'Can you build from a Figma file?',
    answer:
      "Yes, that's my favourite way to work. Give me the file and I'll build it to spec, flag anything that won't survive a real breakpoint or a long piece of content, and suggest a fix rather than silently changing your design.",
  },
  {
    id: 'ownership',
    question: 'Who owns the code at the end?',
    answer:
      'You do, completely, on final payment. The repository transfers to your account and I keep no rights over it. Happy to sign an NDA before we discuss anything if your project needs one.',
  },
  {
    id: 'student',
    question: "You're still a student — is that a problem?",
    answer:
      "It hasn't been one yet. VistechBot is a full SaaS platform front end running on a live domain for a paying client, delivered on someone else's deadline. Judge the work rather than the year I'm in — and start me on something small if you'd rather see it first.",
  },
];
