import { ReadingPracticeSet, ListeningPracticeSet, WritingPracticeSet, SpeakingPracticeSet } from '@/types/practice';
import ielts16Data from '@/data/ielts16_academic_reading_test1.json';

export const ielts16ReadingPassages: ReadingPracticeSet[] = ielts16Data.passages as unknown as ReadingPracticeSet[];

export const sampleReadingTests: ReadingPracticeSet[] = [
  ...ielts16ReadingPassages,
  {
    id: 'cam-18-read-1',
    bookSource: 'Cambridge 18 Academic — Test 1 Passage 1',
    passageNumber: 1,
    title: 'The Urban Forest: Microclimates, Human Health, and City Planning',
    recommendedMinutes: 20,
    readingPassage: `[A] As urbanization accelerates worldwide, metropolises face intensifying thermal challenges known collectively as the Urban Heat Island (UHI) effect. Concrete, asphalt, and dense structural geometry absorb and trap solar radiation during daylight hours, re-radiating heat well into the night. Consequently, city centers frequently register ambient temperatures 3°C to 8°C higher than adjacent rural countryside. In response, municipal landscape architects are championing urban forestry not merely as aesthetic embellishments, but as foundational civic infrastructure.

[B] The primary cooling mechanism provided by mature trees is evapotranspiration. Roots draw groundwater through the vascular xylem, transporting it to foliage where solar energy converts liquid water into vapor through microscopic stomata. This thermodynamic phase transition absorbs ambient thermal energy, yielding a measurable drop in surrounding air temperatures. A solitary mature deciduous tree can transpire upwards of 400 liters of water daily, imparting a cooling effect comparable to ten continuous residential air conditioning units running for twenty hours.

[C] Crucially, scientific research indicates that tree canopy density exerts far greater environmental impact than tree height. A study conducted across sixteen European cities revealed that contiguous tree canopies reduce ground surface temperatures by up to 12°C, shielding sidewalks and building facades from direct UV radiation. In contrast, dispersed or sparse tree distributions offer negligible microclimatic stabilization because solar penetration quickly reheats uncovered pavement.

[D] Beyond thermal mitigation, urban canopies act as biological bio-filters for particulate matter (PM2.5 and PM10). Airborne pollutants emitted from vehicular combustion adhere to waxy leaf cuticles and microscopic trichomes. Rain subsequently washes these trapped contaminants harmlessly into root-zone filtration soils. Urban districts with extensive canopy coverage observe a 24% reduction in childhood respiratory hospitalizations relative to deforested metropolitan sectors.

[E] However, city foresters encounter significant logistical obstacles. Modern street sub-bases are heavily compacted to support multi-ton vehicular traffic, restricting root expansion and suffocating essential gas exchange. Furthermore, subterranean utility corridors—including fiber-optic conduits, gas mains, and storm sewers—frequently collide with root development. As a consequence, urban trees suffer an average lifespan of just 19 to 28 years, compared to over a century in unconstrained natural woodlands.

[F] To circumvent these urban constraints, progressive civil planners are utilizing structural soil matrices—engineered aggregates combining uncompacted loam with load-bearing crushed granite. These matrices provide porous subterranean voids that allow roots to penetrate deep beneath pavement without compromising the structural integrity of overlying roadways. By harmonizing civil engineering with arboricultural science, future sustainable cities can guarantee resilient urban canopies for future generations.`,
    questions: [
      {
        id: 'q-1',
        number: 1,
        type: 'true_false_not_given',
        prompt: 'The Urban Heat Island effect causes city centers to be warmer than surrounding rural areas during both day and night.',
        correctAnswer: 'TRUE',
        explanation: 'Paragraph [A] states: "Concrete, asphalt, and dense structural geometry absorb and trap solar radiation during daylight hours, re-radiating heat well into the night. Consequently, city centers frequently register ambient temperatures 3°C to 8°C higher than adjacent rural countryside."',
        paragraphReference: 'Paragraph [A]',
      },
      {
        id: 'q-2',
        number: 2,
        type: 'true_false_not_given',
        prompt: 'A tree\'s height is more crucial for microclimate cooling than the density of its foliage canopy.',
        correctAnswer: 'FALSE',
        explanation: 'Paragraph [C] directly contradicts this claim: "Crucially, scientific research indicates that tree canopy density exerts far greater environmental impact than tree height."',
        paragraphReference: 'Paragraph [C]',
      },
      {
        id: 'q-3',
        number: 3,
        type: 'true_false_not_given',
        prompt: 'The European city study investigated the impact of trees in both residential and industrial zones.',
        correctAnswer: 'NOT GIVEN',
        explanation: 'Paragraph [C] mentions "A study conducted across sixteen European cities revealed that contiguous tree canopies reduce ground surface temperatures...", but does NOT mention whether it compared residential vs industrial zones.',
        paragraphReference: 'Paragraph [C]',
      },
      {
        id: 'q-4',
        number: 4,
        type: 'true_false_not_given',
        prompt: 'Rain washes particulate pollutants off waxy leaves into the surrounding soil.',
        correctAnswer: 'TRUE',
        explanation: 'Paragraph [D] states: "Airborne pollutants emitted from vehicular combustion adhere to waxy leaf cuticles and microscopic trichomes. Rain subsequently washes these trapped contaminants harmlessly into root-zone filtration soils."',
        paragraphReference: 'Paragraph [D]',
      },
      {
        id: 'q-5',
        number: 5,
        type: 'true_false_not_given',
        prompt: 'Urban trees typically live as long as trees located in natural forest reserves.',
        correctAnswer: 'FALSE',
        explanation: 'Paragraph [E] states: "As a consequence, urban trees suffer an average lifespan of just 19 to 28 years, compared to over a century in unconstrained natural woodlands."',
        paragraphReference: 'Paragraph [E]',
      },
      {
        id: 'q-6',
        number: 6,
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD ONLY: Groundwater travels upward through the tree\'s vascular _____ to reach leaves.',
        correctAnswer: 'xylem',
        acceptedAnswers: ['xylem', 'the xylem'],
        explanation: 'Paragraph [B] states: "Roots draw groundwater through the vascular xylem, transporting it to foliage..."',
        paragraphReference: 'Paragraph [B]',
      },
      {
        id: 'q-7',
        number: 7,
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD ONLY: Civil engineers utilize _____ soil matrices to create subterranean voids for unconstrained root growth.',
        correctAnswer: 'structural',
        acceptedAnswers: ['structural'],
        explanation: 'Paragraph [F] states: "To circumvent these urban constraints, progressive civil planners are utilizing structural soil matrices..."',
        paragraphReference: 'Paragraph [F]',
      },
    ],
  },
  {
    id: 'cam-17-read-2',
    bookSource: 'Cambridge 17 Academic — Test 2 Passage 2',
    passageNumber: 2,
    title: 'Biomimicry: Engineering Solutions Inspired by Evolutionary Biology',
    recommendedMinutes: 20,
    readingPassage: `[A] Nature has conducted four billion years of rigorous research and development through natural selection. Organisms that engineered inefficient thermal insulation, fragile structural skeletons, or energy-intensive locomotion have long disappeared from the fossil record. Biomimicry—the practice of emulating biological models, systems, and elements to solve complex human engineering challenges—is rapidly superseding traditional subtractive industrial paradigms.

[B] Perhaps the most celebrated commercial triumph of biomimicry is the Japanese Shinkansen bullet train. In the early 1990s, the 500 Series train generated a deafening sonic boom whenever exiting tunnels at 300 km/h due to the sudden atmospheric pressure displacement. The chief design engineer, an avid ornithologist, observed the kingfisher: a bird capable of diving seamlessly from air into dense water with virtually undetectable splashing. By redesigning the train's nose to mirror the elongated, hydrodynamic geometry of the kingfisher's beak, engineers not only eradicated the tunnel noise but also diminished electrical power consumption by 15%.

[C] In civil architecture, the Eastgate Shopping Centre in Harare, Zimbabwe, exemplifies nature-inspired thermal regulation. Designed without conventional air conditioning, the multi-story complex mimics the convective ventilation towers of indigenous termite mounds. Termites maintain internal fungi gardens at precisely 30.5°C amidst external ambient fluctuations from 2°C to 42°C. The structure utilizes a network of low-power subterranean ducts and vertical chimneys to siphon warm air outward, consuming 90% less energy than conventionally cooled commercial facilities.

[D] At the microscopic scale, marine scientists have unraveled the anti-fouling mysteries of shark skin. While whales and ship hulls are constantly colonized by barnacles and noxious bacterial slime, fast-moving sharks remain remarkably clean. Electron microscopy uncovered 'dermal denticles'—microscopic riblets featuring a diamond-shaped tooth architecture that physically disrupts the formation of bacterial biofilms. Medical researchers have adapted this topography to create sterile hospital surfaces that inhibit pathogen colonization without toxic antibacterial biocides.`,
    questions: [
      {
        id: 'q-bm-1',
        number: 1,
        type: 'true_false_not_given',
        prompt: 'The redesign of the Shinkansen train front nose reduced both noise levels and energy expenditure.',
        correctAnswer: 'TRUE',
        explanation: 'Paragraph [B] confirms: "engineers not only eradicated the tunnel noise but also diminished electrical power consumption by 15%."',
        paragraphReference: 'Paragraph [B]',
      },
      {
        id: 'q-bm-2',
        number: 2,
        type: 'true_false_not_given',
        prompt: 'The Eastgate Centre in Zimbabwe requires high-powered electric fans to maintain temperature during winter.',
        correctAnswer: 'FALSE',
        explanation: 'Paragraph [C] notes: "Designed without conventional air conditioning... consumes 90% less energy than conventionally cooled commercial facilities," utilizing passive convective chimneys.',
        paragraphReference: 'Paragraph [C]',
      },
      {
        id: 'q-bm-3',
        number: 3,
        type: 'true_false_not_given',
        prompt: 'Shark skin relies on chemical secretion rather than physical surface texture to prevent bacterial colonization.',
        correctAnswer: 'FALSE',
        explanation: 'Paragraph [D] explicitly clarifies that "microscopic riblets featuring a diamond-shaped tooth architecture... physically disrupts the formation of bacterial biofilms... without toxic antibacterial biocides."',
        paragraphReference: 'Paragraph [D]',
      },
      {
        id: 'q-bm-4',
        number: 4,
        type: 'sentence_completion',
        prompt: 'Complete with ONE WORD ONLY: The engineer who redesigned the bullet train derived inspiration from the beak of the _____.',
        correctAnswer: 'kingfisher',
        acceptedAnswers: ['kingfisher', 'the kingfisher'],
        explanation: 'Paragraph [B] mentions: "observed the kingfisher... redesigning the train\'s nose to mirror the elongated, hydrodynamic geometry of the kingfisher\'s beak".',
        paragraphReference: 'Paragraph [B]',
      },
    ],
  },
];

export const sampleListeningTests: ListeningPracticeSet[] = [
  {
    id: 'cam-18-list-1',
    bookSource: 'Cambridge 18 Academic — Test 1 Section 1',
    sectionNumber: 1,
    title: 'Community Conservation & Volunteer Registration Form',
    recommendedMinutes: 10,
    transcriptText: `OFFICER: Good morning, Green Horizon Environmental Trust. How can I help you?
CALLER: Hello, I'm calling to inquire about participating in your weekend conservation volunteering scheme.
OFFICER: Excellent! Let me take down a few registration details. First, could I have your full name?
CALLER: Yes, it's David Thornton. That's T-H-O-R-N-T-O-N.
OFFICER: Thank you, David. And what is the best contact telephone number for you?
CALLER: You can reach me on mobile: 07945 321890.
OFFICER: Got that: 07945 321890. Which residential area of the city do you live in?
CALLER: In Westgate, just off High Street.
OFFICER: Perfect. Our Saturday restoration session meets at the botanical wetlands. Volunteers are asked to bring sturdy footwear, preferably waterproof boots. We supply all the gloves and safety helmets.
CALLER: Sturdy waterproof boots, understood. Is there a minimum commitment required?
CALLER: We ask that new volunteers attend at least four hours each month to maintain project momentum.
CALLER: Four hours monthly is very manageable for me. Thank you!`,
    questions: [
      {
        id: 'lq-1',
        number: 1,
        type: 'sentence_completion',
        prompt: 'Volunteer Full Name: David _____ (Write spelling carefully)',
        correctAnswer: 'Thornton',
        acceptedAnswers: ['Thornton', 'THORNTON'],
        explanation: 'The speaker spells out: "That\'s T-H-O-R-N-T-O-N."',
      },
      {
        id: 'lq-2',
        number: 2,
        type: 'sentence_completion',
        prompt: 'Contact Telephone Number: _____',
        correctAnswer: '07945 321890',
        acceptedAnswers: ['07945 321890', '07945321890'],
        explanation: 'The caller states: "You can reach me on mobile: 07945 321890."',
      },
      {
        id: 'lq-3',
        number: 3,
        type: 'sentence_completion',
        prompt: 'Residential Area: _____',
        correctAnswer: 'Westgate',
        acceptedAnswers: ['Westgate', 'WESTGATE'],
        explanation: 'The caller answers: "In Westgate, just off High Street."',
      },
      {
        id: 'lq-4',
        number: 4,
        type: 'sentence_completion',
        prompt: 'Equipment volunteers must bring: waterproof _____ (One word only)',
        correctAnswer: 'boots',
        acceptedAnswers: ['boots', 'Boots'],
        explanation: 'The officer states: "Volunteers are asked to bring sturdy footwear, preferably waterproof boots."',
      },
      {
        id: 'lq-5',
        number: 5,
        type: 'sentence_completion',
        prompt: 'Minimum monthly commitment: _____ hours',
        correctAnswer: '4',
        acceptedAnswers: ['4', 'four', 'Four'],
        explanation: 'The officer says: "We ask that new volunteers attend at least four hours each month..."',
      },
    ],
  },
];

export const sampleWritingTests: WritingPracticeSet[] = [
  {
    id: 'cam-18-w-1',
    bookSource: 'Cambridge 18 Academic — Test 1 Task 1',
    taskType: 'task_1',
    title: 'Water Consumption by Sector: Agriculture, Industry, and Domestic',
    prompt: 'The chart below shows the percentage of water used for different purposes in six areas of the world. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    dataDescription: `Sector Breakdown Overview:\n- Central Asia: Agriculture accounts for 88% of water consumption, Industry 5%, Domestic 7%.\n- Africa: Agriculture 84%, Industry 7%, Domestic 9%.\n- Southeast Asia: Agriculture 81%, Industry 12%, Domestic 7%.\n- North America: Industry dominates at 48%, Agriculture 39%, Domestic 13%.\n- Europe: Industry 53%, Agriculture 32%, Domestic 15%.\n- South America: Agriculture 71%, Domestic 19%, Industry 10%.`,
    keyPointsToCover: [
      'Overview highlighting that agricultural consumption vastly dominates in developing/Asian regions, while industrial usage peaks in North America and Europe.',
      'Comparison between Central Asia (88% agriculture) and Europe (only 32% agriculture).',
      'Domestic consumption remains the smallest share globally (7% to 19%).',
    ],
    modelEssayBand8: `The bar graph compares water utilization across three primary sectors—agriculture, industry, and domestic consumption—in six distinct geographic regions.\n\nOverall, it is readily apparent that agricultural requirements constitute the vast majority of water usage in less industrialized regions such as Central Asia, Africa, and Southeast Asia. In sharp contrast, developed economies in North America and Europe allocate the preeminent portion of their water reserves to industrial applications, whereas domestic demand consistently represents the minor share across all six regions.\n\nLooking first at agricultural use, Central Asia exhibits the highest proportion at 88%, closely followed by Africa and Southeast Asia at 84% and 81% respectively. South America likewise directs 71% of its water resources to agriculture. Conversely, in Europe and North America, agricultural allocation drops sharply to 32% and 39%.\n\nTurning to industrial usage, Europe leads substantially, deploying 53% of its water for manufacturing and power generation, with North America trailing marginally at 48%. Conversely, in Central Asia and Africa, industrial extraction amounts to a negligible 5% and 7%. Finally, domestic water consumption ranges from a modest 7% in Southeast Asia and Central Asia to a peak of 19% in South America.`,
    recommendedMinutes: 20,
  },
  {
    id: 'cam-18-w-2',
    bookSource: 'Cambridge 18 Academic — Test 1 Task 2',
    taskType: 'task_2',
    title: 'Compulsory Unpaid Community Service for Secondary Students',
    prompt: 'Some people believe that unpaid community service should be a compulsory part of high school programmes (for example, helping a charity, improving the neighborhood, or teaching sports to younger children). To what extent do you agree or disagree?',
    keyPointsToCover: [
      'Clear thesis statement in introduction taking a distinct stance (agree, disagree, or balanced).',
      'Body Paragraph 1: Civic responsibility, real-world empathy, and collaborative life skills beyond academic exams.',
      'Body Paragraph 2: Addressing counter-arguments (academic overload, potential resentment if coerced) and how structured integration overcomes this.',
      'Conclusion summarizing key arguments and reinforcing final position.',
    ],
    recommendedMinutes: 40,
  },
];

export const sampleSpeakingTests: SpeakingPracticeSet[] = [
  {
    id: 'cam-18-sp-1',
    bookSource: 'Cambridge 18 Academic — Test 2',
    part: 'part_2',
    topic: 'A digital application or software that enhanced your productivity',
    cueCard: `Describe a website or software application that has substantially improved your personal productivity or learning.\n\nYou should say:\n- What the application is and when you began using it\n- What specific features you rely on\n- How it alters your workflow or study efficiency\n- And explain why you consider this software indispensable to your daily routine.`,
    questions: [
      'What technological innovations have revolutionized personal time management in recent years?',
      'Do productivity applications foster genuine discipline, or do they create synthetic reliance?',
      'How can educators balance computer-aided instruction with traditional critical thinking?',
    ],
    recommendedVocabulary: [
      { word: 'indispensable', meaning: 'absolutely necessary', collocation: 'indispensable tool' },
      { word: 'streamline', meaning: 'make an organization or process simpler and more effective', collocation: 'streamline my daily workflow' },
      { word: 'cognitive load', meaning: 'the amount of mental effort being used in the working memory', collocation: 'diminishes cognitive load' },
    ],
  },
];
