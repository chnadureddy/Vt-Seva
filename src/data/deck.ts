export type Voice = "youth" | "adult";

export type SampleVoice = {
  id: string;
  voice: Voice;
  text: string;
};

export type DeckCard = {
  id: string;
  title: string;
  question: string;
  samples: SampleVoice[];
};

export const deck: DeckCard[] = [
  {
    id: "misunderstood",
    title: "Misunderstood",
    question: "What is a student problem that parents usually misunderstand?",
    samples: [
      {
        id: "misunderstood-youth",
        voice: "youth",
        text: "The problem is not the homework, the phone, or the grade. It is feeling alone with it while everyone around me already has a solution.",
      },
      {
        id: "misunderstood-adult",
        voice: "adult",
        text: "I misunderstand it because I only see the part that looks like a choice. I do not see the hours they spent carrying it before I walked in.",
      },
    ],
  },
  {
    id: "school-weight",
    title: "Too much school",
    question: "When school feels like too much, what do you wish the other side understood?",
    samples: [
      {
        id: "school-youth",
        voice: "youth",
        text: "I am not avoiding the work. I am out of room. Ask how the day was before you ask where the assignment is.",
      },
      {
        id: "school-adult",
        voice: "adult",
        text: "I ask about homework because it is the part I can see and the part I know how to help with. The feeling is harder for me to find.",
      },
    ],
  },
  {
    id: "phone",
    title: "The phone",
    question: "After a long day, what is the phone actually for?",
    samples: [
      {
        id: "phone-youth",
        voice: "youth",
        text: "It is how I come down. Taking it away feels like losing the only quiet place that is mine.",
      },
      {
        id: "phone-adult",
        voice: "adult",
        text: "I see the glow at midnight and I see tomorrow getting harder. I am trying to protect sleep, not win a fight.",
      },
    ],
  },
  {
    id: "im-fine",
    title: "I'm fine",
    question: 'When someone says "I\'m fine," what does it usually mean?',
    samples: [
      {
        id: "fine-youth",
        voice: "youth",
        text: "It means I do not have the energy to explain, or I do not think I will be heard without a lecture.",
      },
      {
        id: "fine-adult",
        voice: "adult",
        text: "I hear fine and I want to believe it. Later I worry I missed the real sentence, and I do not know how to ask twice.",
      },
    ],
  },
  {
    id: "grade",
    title: "The grade",
    question: "A grade drops. What should happen next at home?",
    samples: [
      {
        id: "grade-youth",
        voice: "youth",
        text: "I already know. Another speech does not add information. It adds shame, and then I hide the next one too.",
      },
      {
        id: "grade-adult",
        voice: "adult",
        text: "A grade is often the only signal the school gives me. If I stay quiet, I feel like I am letting it slide.",
      },
    ],
  },
  {
    id: "argument",
    title: "The argument",
    question: "A hard conversation at home starts. What makes it worse?",
    samples: [
      {
        id: "argument-youth",
        voice: "youth",
        text: "It stops being a conversation when the lesson arrives before I finish the story.",
      },
      {
        id: "argument-adult",
        voice: "adult",
        text: "I jump to the lesson because I am scared of where the story might go. I talk faster when I am worried.",
      },
    ],
  },
  {
    id: "friends",
    title: "Friend problems",
    question: "A problem with friends comes up. What kind of help is useful?",
    samples: [
      {
        id: "friends-youth",
        voice: "youth",
        text: "Not every friend problem needs a parent solution. Sometimes I need a witness, not a manager.",
      },
      {
        id: "friends-adult",
        voice: "adult",
        text: "I have watched small things become unsafe. I am trying to tell the difference, and I often guess wrong.",
      },
    ],
  },
  {
    id: "future",
    title: "The future",
    question: "Who should decide what the future looks like?",
    samples: [
      {
        id: "future-youth",
        voice: "youth",
        text: "The plan you are proud of can be the plan that makes me feel already behind. Ask what I want before you build the path.",
      },
      {
        id: "future-adult",
        voice: "adult",
        text: "I push because the world is expensive and unforgiving. I call it care. I am hearing that it can sound like control.",
      },
    ],
  },
  {
    id: "support",
    title: "Real support",
    question: "What does real support look like this week?",
    samples: [
      {
        id: "support-youth",
        voice: "youth",
        text: "Ten minutes without fixing it. Ask what I need, then do that one thing.",
      },
      {
        id: "support-adult",
        voice: "adult",
        text: "Give me one concrete way to help. I will do it. A closed door leaves me guessing, and guessing comes out as pressure.",
      },
    ],
  },
];
