import { SpeakingTopicCategory } from '@/types/ielts';

export interface CueCardTopic {
  id: string;
  category: SpeakingTopicCategory;
  title: string;
  cueCard: string;
  part: 'part_1' | 'part_2' | 'part_3';
  followUps?: string[];
}

export const speakingTopicBank: CueCardTopic[] = [
  {
    id: 'sp-top-1',
    category: 'people',
    title: 'An inspiring teacher or mentor',
    part: 'part_2',
    cueCard: `Describe a teacher or mentor who has had a significant impact on your life.\n\nYou should say:\n- Who this person was\n- How you met them\n- What subject or skills they taught you\n- And explain why this person left such a lasting impression on you.`,
    followUps: [
      'What qualities make an exceptional educator in the 21st century?',
      'Do you think AI can replace human mentors in higher education?'
    ]
  },
  {
    id: 'sp-top-2',
    category: 'places',
    title: 'A historical city or landmark',
    part: 'part_2',
    cueCard: `Describe a historic town or monument you visited.\n\nYou should say:\n- Where it is located\n- When and with whom you went there\n- What the architecture and surroundings were like\n- And explain how you felt while exploring this site.`,
    followUps: [
      'Why is it important for countries to invest in preserving ancient architecture?',
      'How does mass tourism affect historical landmarks?'
    ]
  },
  {
    id: 'sp-top-3',
    category: 'technology',
    title: 'A technological device you find indispensable',
    part: 'part_2',
    cueCard: `Describe a technological gadget that significantly simplifies your daily life.\n\nYou should say:\n- What device it is\n- How often you use it\n- What primary features you rely on\n- And explain how your life would be different without it.`,
    followUps: [
      'Are modern children becoming overly dependent on touchscreens?',
      'How might automation and AI transform workplaces in the next decade?'
    ]
  },
  {
    id: 'sp-top-4',
    category: 'experiences',
    title: 'A challenging decision that took time to make',
    part: 'part_2',
    cueCard: `Describe an important decision you made that required careful deliberation.\n\nYou should say:\n- What the decision was about\n- Why it was difficult or complex\n- What advice or factors you considered\n- And explain whether you believe it was the right choice.`,
    followUps: [
      'Do young people prefer making major life decisions independently or consulting parents?',
      'Why do some individuals struggle with chronic indecisiveness?'
    ]
  },
  {
    id: 'sp-top-5',
    category: 'environment',
    title: 'An environmental initiative or green project',
    part: 'part_2',
    cueCard: `Describe an environmental program or green space in your city.\n\nYou should say:\n- What the initiative or place is\n- Who created or maintains it\n- How citizens interact with it\n- And explain why you consider this beneficial for the environment.`,
    followUps: [
      'Who bears greater responsibility for climate change: individuals or multinational corporations?',
      'What sustainable energy alternatives hold the most promise for developing nations?'
    ]
  },
  {
    id: 'sp-top-6',
    category: 'work',
    title: 'An ideal profession or career ambition',
    part: 'part_2',
    cueCard: `Describe a job or career field you would find deeply rewarding.\n\nYou should say:\n- What the profession is\n- What skills and education it demands\n- Why this field appeals to your strengths\n- And explain what contribution you hope to make through it.`,
    followUps: [
      'Is job satisfaction more critical than monetary compensation in modern careers?',
      'How has remote telecommuting impacted team productivity?'
    ]
  },
  {
    id: 'sp-top-7',
    category: 'hometown',
    title: 'A memorable development in your hometown',
    part: 'part_2',
    cueCard: `Describe a major change or development that took place in your hometown.\n\nYou should say:\n- What change occurred\n- When it was completed\n- How local residents reacted to it\n- And explain how it has altered the atmosphere or economy of your area.`,
    followUps: [
      'Why are so many rural youths migrating towards metropolises?',
      'How can city councils balance urbanization with ecological protection?'
    ]
  },
  {
    id: 'sp-top-8',
    category: 'travel',
    title: 'A journey that was unexpectedly memorable',
    part: 'part_2',
    cueCard: `Describe a journey or road trip that did not go exactly as planned.\n\nYou should say:\n- Where you were traveling to\n- What unexpected event or delay occurred\n- How you resolved the problem\n- And explain why this journey remains memorable to you.`,
    followUps: [
      'What benefits do people gain from solo travel compared to group tours?',
      'Will high-speed rail replace domestic flights in the near future?'
    ]
  },
  {
    id: 'sp-top-9',
    category: 'activities',
    title: 'A creative or athletic activity you enjoy',
    part: 'part_2',
    cueCard: `Describe a hobby, sport, or creative pursuit that helps you decompress.\n\nYou should say:\n- What the activity is\n- When and where you practice it\n- What equipment or skills are needed\n- And explain why this activity refreshes your mind.`,
    followUps: [
      'Why is regular physical leisure essential for high-stress corporate workers?',
      'Should schools dedicate equal instructional time to arts and sciences?'
    ]
  },
  {
    id: 'sp-top-10',
    category: 'food',
    title: 'A traditional meal or culinary experience',
    part: 'part_2',
    cueCard: `Describe a traditional dish from your culture that you enjoy preparing or eating.\n\nYou should say:\n- What dish it is\n- What ingredients are required\n- On what special occasions it is eaten\n- And explain why this dish holds cultural significance.`,
    followUps: [
      'Why has fast-food culture gained popularity among younger generations?',
      'How does culinary tradition preserve ethnic identity in globalized societies?'
    ]
  }
];
