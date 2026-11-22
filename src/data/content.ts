/**
 * All site content lives in this file. Components only render it.
 *
 * Rules for editing:
 * - Use only facts that can be shown (letters, press, websites).
 * - Typography: curly quotes “ ” ’, en dash – for ranges (2025–2026),
 *   and a non-breaking space ( ) between a number and its unit.
 * - Anything still unconfirmed is marked with a `TODO:` comment and
 *   listed in TODO.md.
 */

export type LinkKind = 'website' | 'press' | 'letter' | 'paper';

export interface ExternalLink {
  label: string;
  href: string;
  kind: LinkKind;
}

export interface Fact {
  /** The number or short value, set in mono (e.g. "200+"). */
  value: string;
  /** What the value counts (e.g. "children taught"). */
  label: string;
}

export type ProjectStatus = 'active' | 'completed' | 'upcoming' | 'concept' | 'prototype';

export interface Project {
  slug: string;
  title: string;
  /** One line under the title in the list. */
  summary: string;
  /** Who the project is for; shown as “For: …”. */
  audience: string;
  /** Display range, e.g. "2026–present". Omit when unknown. */
  years?: string;
  /** Longer date range for the detail page, if more precise than `years`. */
  dates?: string;
  status: ProjectStatus;
  /** Extra text for the status badge, e.g. "Dec 2026". */
  statusNote?: string;
  role: string;
  description: string;
  facts: Fact[];
  /** Recognition lines shown on the project page. */
  recognition?: string[];
  links: ExternalLink[];
  /**
   * Long-form text for the project page. A missing field renders as a
   * visible “Placeholder: Ilyas to write” block, never as invented text.
   */
  detail: {
    problem?: string;
    built?: string;
    myRole?: string;
    learned?: string;
  };
}

const nb = ' ';

export const site = {
  name: 'Ilyas Taghiyev',
  title: 'Ilyas Taghiyev — Finding the child the average hides',
  description:
    'Ilyas Taghiyev, a student from Baku, builds learning projects for children and young people and uses statistics to find out what works for each of them.',
  meta: ['Baku, Azerbaijan', 'Statistics & Data Science', 'Class of 2027'],
  tagline: 'Finding the child the average hides.',
  lead: 'I build learning projects for children and young people, and I use statistics to find out what works for each of them.',
  email: 'ilyastagiyev1@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ilyas-taghiyev-166301412',
  year: 2026,
};

export const nav = [
  { href: '#projects', label: 'Projects' },
  { href: '#research', label: 'Research' },
  { href: '#recognition', label: 'Recognition' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

/**
 * Projects, in order: from the one that best shows the core idea
 * (help for children and young people) to the one that shows it least.
 * Reorder this array to reorder the site.
 */
export const projects: Project[] = [
  {
    slug: 'mathroutes',
    title: 'MathRoutes',
    summary: 'A free, hands-on math program for children with ADHD.',
    audience: `Children aged 5–9 with${nb}ADHD`,
    years: '2026–present',
    status: 'active',
    role: 'Founder, Curriculum Designer & Mentor Lead',
    description:
      'Children learn math through short interactive task cards (drawing, coloring, cutting, building) and choose their own card in each lesson, so learning follows their attention instead of fighting it.',
    facts: [
      { value: '10', label: 'teen mentors trained' },
      { value: '200+', label: 'children taught' },
      { value: `3×${nb}a${nb}week`, label: '1-hour lessons' },
    ],
    recognition: ['Featured on Medeniyyet TV (national television)'],
    links: [
      { label: 'mathroutes.vercel.app', href: 'https://mathroutes.vercel.app', kind: 'website' },
      // TODO: add a link to the Medeniyyet TV segment if one is online.
    ],
    detail: {
      built:
        'A free math program built around short interactive task cards: children draw, color, cut and build. In each lesson every child chooses their own card, so learning follows their attention instead of fighting it. Lessons last one hour and run three times a week.',
      myRole:
        'I founded MathRoutes, designed the curriculum and lead the mentors: I trained 10 teenage mentors, who together have taught more than 200 children.',
    },
  },
  {
    slug: 'kumiho-hunters',
    title: 'Kumiho Hunters',
    summary: 'Cybersecurity education for primary-school children.',
    audience: 'Primary-school children',
    years: '2026–present',
    status: 'active',
    role: 'Chief Analytics Officer (team of 10 students)',
    description:
      'A 21-week program teaching children to recognize online scams and protect their personal data. Ilyas analyzed the pre/post test results.',
    facts: [
      { value: '450', label: 'children' },
      { value: '18', label: 'primary schools' },
      { value: '21', label: 'weeks' },
    ],
    recognition: ['Presented at the Embassy of the Republic of Korea in Azerbaijan'],
    links: [
      { label: 'kumihohunters.site', href: 'https://kumihohunters.site', kind: 'website' },
      {
        label: 'AZERTAC',
        href: 'https://azertag.az/en/xeber/azerbaijani_school_students_present_kumiho_hunters_cybersecurity_project_at_south_korean_embassy-4471836',
        kind: 'press',
      },
      {
        label: 'Uzbekistan News Gazette',
        href: 'https://uzbekistannewsgazette.com/azerbaijani-students-showcase-kumiho-hunters-cybersecurity-project-at-south-korean-embassy/',
        kind: 'press',
      },
    ],
    detail: {
      built:
        'A 21-week program that teaches primary-school children to recognize online scams and protect their personal data. It reached 450 children in 18 primary schools.',
      myRole:
        'I am the Chief Analytics Officer of a team of 10 students. I analyzed the program’s pre- and post-test results.',
    },
  },
  {
    slug: 'numbers-club',
    title: 'Numbers Club',
    summary: 'Data skills for younger students.',
    audience: `Students in grades${nb}8–9`,
    years: '2024–2026',
    status: 'completed',
    role: 'Founder & Instructor',
    description:
      'Weekly sessions teaching younger students to build spreadsheets, make charts and write simple Python programs. Also organized free math tutoring before exams.',
    facts: [
      { value: '60+', label: 'students in grades 8–9' },
      { value: '2', label: 'academic years' },
      { value: '100+', label: 'pupils tutored' },
    ],
    links: [],
    detail: {
      built:
        'Weekly sessions in which younger students learned to build spreadsheets, make charts and write simple Python programs. Before exams, the club also organized free math tutoring.',
      myRole:
        'I founded the club and taught it for two academic years: more than 60 students in grades 8–9, plus more than 100 pupils in the free tutoring sessions.',
    },
  },
  {
    slug: 'soleshift-kids',
    title: 'SoleShift Kids',
    summary: 'Early foot-health screening for children.',
    audience: 'Children and their parents',
    years: '2026–present',
    status: 'active',
    role: 'Co-Founder & Workshop Instructor',
    description:
      'A screening tool with 8 pressure sensors and an ESP32 microcontroller that maps a child’s foot shape and weight distribution in seconds and gives parents a simple report. Developed under the scientific supervision of an orthopedic surgeon from Azerbaijan Medical University (ATU). It is a screening tool, not a medical diagnosis.',
    facts: [
      { value: '8', label: 'pressure sensors' },
      { value: 'Seconds', label: 'to a report for parents' },
      { value: '2,000+', label: 'students in workshops' },
    ],
    recognition: ['Scientific support from Azerbaijan Medical University (ATU)'],
    links: [
      { label: 'sole-shift.com', href: 'https://sole-shift.com', kind: 'website' },
      {
        label: 'Azerbaijan Medical University',
        href: 'https://amu.edu.az/news/6266/atu-dan-elmi-destek-mekteblilerden-innovativ-layihe-soleshift-kids',
        kind: 'press',
      },
    ],
    detail: {
      built:
        'A screening tool with 8 pressure sensors and an ESP32 microcontroller. It maps a child’s foot shape and weight distribution in seconds and gives parents a simple report. It was developed under the scientific supervision of an orthopedic surgeon from Azerbaijan Medical University (ATU). It is a screening tool, not a medical diagnosis.',
      myRole:
        'I am a co-founder and lead the workshops. More than 2,000 students have taken part in SoleShift Kids workshops.',
    },
  },
  {
    slug: 'science-club',
    title: 'Science Club',
    summary: 'Hands-on biology for younger students.',
    audience: 'Younger students',
    years: '2025–present',
    status: 'active',
    role: 'Founder & Biology Instructor',
    description:
      'Teaches biology to younger students through lab work (microscopy, freshwater organisms, DNA). Wrote a practical microscopy guide in Azerbaijani and shared it with schools for free.',
    facts: [
      { value: '82', label: 'lab hours in one year' },
      { value: 'Free', label: 'microscopy guide in Azerbaijani' },
    ],
    links: [],
    detail: {
      built:
        'A club where younger students learn biology through lab work: microscopy, freshwater organisms and DNA. In one year we spent 82 hours in the lab.',
      myRole:
        'I founded the club and teach it. I also wrote a practical microscopy guide in Azerbaijani and shared it with schools for free.',
    },
  },
  {
    slug: 'stem-van-thuis',
    title: 'Stem van Thuis',
    summary: 'Picture cards that give toddlers a voice.',
    audience: 'Non-Dutch-speaking toddlers',
    years: '2025–present',
    status: 'active',
    role: 'Founder & Print/Audio Designer',
    description:
      '12 picture cards that let non-Dutch-speaking toddlers show their needs, each linked by QR code to a recording of a parent’s voice.',
    facts: [{ value: '12', label: 'picture cards, each with a parent’s voice' }],
    links: [],
    detail: {
      built:
        'A set of 12 picture cards that let toddlers who do not speak Dutch show what they need. Each card is linked by QR code to a recording of a parent’s voice.',
      myRole: 'I started the project and designed the printed cards and the audio.',
    },
  },
  {
    slug: 'click',
    title: 'CLICK: Children Rewrite the Instructions',
    summary: 'AI-based learning tools for Roma children.',
    audience: 'Roma children',
    status: 'upcoming',
    statusNote: 'Dec 2026',
    role: 'Project lead (invited by the Embassy of Romania)',
    description:
      'Invited by the Embassy of Romania to lead the project. Implementation is planned for December 2026.',
    facts: [],
    // TODO: https://click-alpha-give.vercel.app returned 404 on 2026-10-31, so the link is hidden.
    // Restore it here once the site is live:
    // { label: 'click-alpha-give.vercel.app', href: 'https://click-alpha-give.vercel.app', kind: 'website' },
    links: [],
    detail: {
      built:
        'CLICK will create AI-based learning tools for Roma children. It has not started yet: implementation is planned for December 2026.',
      myRole: 'The Embassy of Romania invited me to lead the project.',
    },
  },
  {
    slug: 'youth-collective',
    title: 'The Youth Collective',
    summary: 'Data-science workshops linking ecology, sport and health.',
    audience: 'Students',
    years: '2025–present',
    status: 'active',
    role: 'Data Science Educator & Student Mentor',
    description: 'Data-science workshops that link ecology, sport and health.',
    facts: [],
    links: [{ label: 'youth-collective.com', href: 'https://youth-collective.com', kind: 'website' }],
    detail: {
      built: 'Data-science workshops for students that link ecology, sport and health.',
      myRole: 'I teach data science in the workshops and mentor students.',
    },
  },
  {
    slug: 'school-voice',
    title: 'School Voice',
    summary: 'An anonymous survey that changed how my school listens to students.',
    audience: 'Students at my school',
    years: '2024–present',
    status: 'active',
    role: 'Initiator & Data Analyst',
    description:
      'Anonymous survey of 400+ students on workload, facilities and activities; analyzed the responses and presented recommendations to the school’s pedagogical council. Changes were adopted, and the survey became an annual practice.',
    facts: [
      { value: '400+', label: 'students surveyed' },
      { value: 'Annual', label: 'now a yearly school practice' },
    ],
    links: [],
    detail: {
      built:
        'An anonymous survey of more than 400 students about workload, facilities and activities.',
      myRole:
        'I started the survey, analyzed the responses and presented recommendations to the school’s pedagogical council. Changes were adopted, and the survey became an annual practice.',
    },
  },
  {
    slug: 'loomlock',
    title: 'LoomLock',
    summary: 'Role-based cybersecurity for artisan family shops.',
    audience: 'Teens and adults in family shops',
    years: '2025–present',
    status: 'active',
    role: 'Founder, Software Developer & User Training Lead',
    description: 'Role-based cybersecurity for artisan family shops: teens run sales, adults control payments.',
    facts: [],
    links: [],
    detail: {
      built: 'Role-based cybersecurity for artisan family shops: teenagers run sales, while adults control payments.',
      myRole: 'I founded LoomLock, develop the software and train its users.',
    },
  },
  {
    slug: 'rehand-loom',
    title: 'ReHand Loom',
    summary: 'A sensor glove to reduce strain in traditional carpet weavers.',
    audience: 'Traditional carpet weavers',
    years: '2025–2026',
    dates: 'Dec 2025 – Aug 2026',
    status: 'completed',
    role: 'Co-Founder & Data/Reporting Lead',
    description:
      'Sensor glove that tracks finger bending, wrist movement and pressure to reduce strain in traditional carpet weavers; six device versions refined with feedback from craftspeople.',
    facts: [{ value: '6', label: 'device versions' }],
    recognition: [
      'Presented at the Azerbaijan National Carpet Museum',
      'Recognized by the Ministry of Culture of Azerbaijan',
    ],
    links: [
      {
        label: 'AZERTAC',
        href: 'https://azertag.az/en/xeber/azerbaijani_school_students_develop_smart_glove_to_support_traditional_carpet_weavers-4468590',
        kind: 'press',
      },
    ],
    detail: {
      built:
        'A sensor glove that tracks finger bending, wrist movement and pressure to reduce strain in traditional carpet weavers. We refined it through six device versions with feedback from craftspeople.',
      myRole: 'I co-founded the project and built the data pipeline and the reports.',
    },
  },
  {
    slug: 'athena-band',
    title: 'Athena Band',
    summary: 'A screen-free wearable band and dashboard for sport.',
    audience: 'Sport teams',
    // TODO: add years once confirmed.
    status: 'prototype',
    role: 'Software Developer & User Guidance',
    description:
      'Screen-free wearable band and digital dashboard for movement- and heart-rate-related readings in sport. Prototype tested with Sabah FC personnel. It is a prototype, not a medical device.',
    facts: [],
    recognition: ['Letter of recommendation from Sabah FC'],
    links: [{ label: 'athenaband.com', href: 'https://athenaband.com', kind: 'website' }],
    detail: {
      built:
        'A screen-free wearable band and a digital dashboard for movement- and heart-rate-related readings in sport. The prototype was tested with Sabah FC personnel. It is a prototype, not a medical device.',
      myRole: 'I develop the software and wrote the user guidance.',
    },
  },
  {
    slug: 'sessiz-sifaris',
    title: 'Sessiz Sifaris',
    summary: 'An accessible restaurant-ordering concept.',
    audience: 'Guests with disabilities and communication barriers',
    // TODO: add years once confirmed.
    status: 'concept',
    role: 'Co-Founder',
    description:
      'Accessible restaurant-ordering concept for guests with disabilities and communication barriers, presented to McDonald’s Azerbaijan.',
    facts: [],
    recognition: ['Letter of recommendation from the Chief Marketing Officer of McDonald’s Azerbaijan'],
    links: [{ label: 'sessizsifaris.com', href: 'https://sessizsifaris.com', kind: 'website' }],
    detail: {
      built:
        'A concept for accessible restaurant ordering for guests with disabilities and communication barriers. We presented it to McDonald’s Azerbaijan.',
      myRole: 'I am a co-founder of the concept.',
    },
  },
];

export const research = {
  kicker: 'Working paper · October 2026',
  title:
    'When Diversification Fails: Decomposing Portfolio Risk-Forecast Errors into Asset-Volatility and Correlation Surprises, 1997–2026',
  authors: [
    { name: 'Ilyas Taghiyev', note: 'lead author' },
    { name: 'Nijat Shikhaliyev' },
    { name: 'Mikayil Ahmadbayli' },
  ],
  abstract:
    'When a portfolio risk forecast misses, is it because assets became more volatile than expected, or because their correlations changed? We forecast the 20-day risk of 11 portfolios (stocks, bonds, gold, sectors, international equity, oil, the dollar) every five trading days from 1997 to 2026 with three standard models, plus 500 random stock portfolios, and split every forecast error with an exact Shapley decomposition.',
  keyResult: {
    value: '77–95%',
    label: 'of the squared forecast error comes from asset-volatility surprises',
    context: 'Test period 2008–2026',
  },
  // TODO: [PLACEHOLDER] set to the PDF URL when the paper is public.
  pdf: null as string | null,
  field: {
    title: 'Field research (biology)',
    items: [
      {
        when: 'Grade 9',
        text: 'Study of the possible effects of oil pollution on the habitat of the Caspian seal: water sensors and data analysis, under the supervision of biology teacher Aynur Alizada.',
      },
      {
        when: 'Summer 2024',
        text: 'Bird-migration study on Pirallahi Island; photo reports published by the Azerbaijan National Academy of Sciences.',
      },
      {
        when: '3 months',
        text: 'Herbarium of 180 species of local plants from three months of fieldwork across Azerbaijan.',
      },
    ],
  },
};

export const honors = [
  { title: 'Commendation, John Locke Institute Essay Competition', note: 'Science & Technology · 2026' },
  { title: 'Recognition by the Ministry of Culture of Azerbaijan', note: 'For ReHand Loom' },
  {
    title: 'Student of the Year in Mathematics',
    note: 'Every year since grade 8; awarded to one student per year',
  },
  { title: 'First Place, National Biology Olympiad', note: 'Grade 8' },
  { title: 'Bird-migration study published', note: 'Photo reports by the Azerbaijan National Academy of Sciences' },
  {
    title: 'Selected for Water Week 2027 (Azerbaijan)',
    note: 'Representing the school with a project on the effects of global warming on animals',
  },
];

/** No dates and no logos, by design. */
export const media: { outlet: string; text: string; href?: string; kind: 'press' | 'letter' }[] = [
  { outlet: 'Medeniyyet TV', text: 'MathRoutes featured on national television', kind: 'press' },
  {
    outlet: 'AZERTAC',
    text: 'Kumiho Hunters at the South Korean Embassy',
    href: 'https://azertag.az/en/xeber/azerbaijani_school_students_present_kumiho_hunters_cybersecurity_project_at_south_korean_embassy-4471836',
    kind: 'press',
  },
  {
    outlet: 'Uzbekistan News Gazette',
    text: 'Kumiho Hunters',
    href: 'https://uzbekistannewsgazette.com/azerbaijani-students-showcase-kumiho-hunters-cybersecurity-project-at-south-korean-embassy/',
    kind: 'press',
  },
  {
    outlet: 'AZERTAC',
    text: 'ReHand Loom smart glove',
    href: 'https://azertag.az/en/xeber/azerbaijani_school_students_develop_smart_glove_to_support_traditional_carpet_weavers-4468590',
    kind: 'press',
  },
  {
    outlet: 'Azerbaijan Medical University',
    text: 'SoleShift Kids',
    href: 'https://amu.edu.az/news/6266/atu-dan-elmi-destek-mekteblilerden-innovativ-layihe-soleshift-kids',
    kind: 'press',
  },
  { outlet: 'Sabah FC', text: 'Letter of recommendation (Athena Band)', kind: 'letter' },
  { outlet: 'McDonald’s Azerbaijan', text: 'Letter of recommendation (Sessiz Sifaris concept)', kind: 'letter' },
];

export const about = {
  paragraphs: [
    'I’m Ilyas, a student from Baku. I speak Azerbaijani, Russian, English and Turkish. Most of what I build is for children and young people: math cards for children with ADHD, cybersecurity lessons for primary schools, clubs where younger students write their first Python programs.',
    'Along the way I learned that a good average can hide the children who need help most. That is why I want to study statistics and data science: to measure what actually works, and for whom.',
    'Outside projects, I check music streaming charts every morning, because to me a table of numbers is a story waiting to be read.',
  ],
  facts: [
    { key: 'School', value: 'Academician Zarifa Aliyeva Lyceum, Baku', note: 'Graduating June 2027' },
    { key: 'Languages', value: 'Azerbaijani (native), Russian, English (IELTS 8.5), Turkish (B2)' },
    { key: 'Tools', value: 'Python, JavaScript, React, HTML, CSS' },
    { key: 'Interests', value: 'Statistics, data science, education, inclusion' },
  ],
  // TODO: [PLACEHOLDER] optional portrait. Put the file in src/assets/ and set the path here.
  photo: null as { src: string; alt: string } | null,
};

export const statusLabel: Record<ProjectStatus, string> = {
  active: 'Ongoing',
  completed: 'Completed',
  upcoming: 'Upcoming',
  concept: 'Concept',
  prototype: 'Prototype',
};
