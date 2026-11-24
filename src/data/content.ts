/**
 * All site content lives in this file. Components only render it.
 *
 * Source of truth: Ilyas's CV (private/Ilyas_Taghiyev_UC_Activities.pdf).
 * Rules for editing:
 * - Every fact, number, title and role must appear in the CV. Nothing else.
 * - Typography: curly quotes “ ” ’, en dash – for ranges, and a
 *   non-breaking space ( ) between a number and its unit.
 * - A missing detail section is hidden on the live site and shown as a
 *   dashed “Ilyas to write” box in `npm run dev`. See TODO.md.
 */

export type LinkKind = 'website' | 'press' | 'paper';

export interface ExternalLink {
  label: string;
  href: string;
  kind: LinkKind;
}

export interface Fact {
  /** The number or short value, set in mono (e.g. "450"). */
  value: string;
  /** What the value counts (e.g. "children"). */
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  /** One line under the title in the list. */
  summary: string;
  /** Who the project is for; shown as “For: …”. */
  audience?: string;
  /** School grades during which Ilyas worked on it, as in the CV. */
  grades: string;
  /** Time commitment, as in the CV. */
  time: string;
  role: string;
  /** Shown in the list (first three) and on the project page (all). */
  facts: Fact[];
  recognition?: string[];
  links: ExternalLink[];
  /** Photo slot id (see src/data/photos.ts). */
  photo?: string;
  /**
   * The project page tells one story: problem → built → measured → learned.
   * Text here only restates the CV. Missing parts are for Ilyas to write.
   */
  detail: {
    problem?: string;
    built?: string;
    builtTitle?: string;
    measured?: string;
    measuredTitle?: string;
    learned?: string;
  };
}

const nb = ' ';

export const site = {
  name: 'Ilyas Taghiyev',
  title: 'Ilyas Taghiyev — Finding the child the average hides',
  description:
    'Ilyas Taghiyev, a student at the Lyceum named after Academician Zarifa Aliyeva in Baku, builds learning projects for children and young people and uses statistics to find out what works for each of them.',
  meta: ['Baku, Azerbaijan', 'Class of 2027'],
  /** What Ilyas wants to study. */
  study: 'Statistics & Data Science',
  /** Official name. Use exactly this spelling everywhere. */
  school: 'Lyceum named after Academician Zarifa Aliyeva',
  /** One sentence about who Ilyas is (his own words from the About text). */
  intro: 'Most of what I build is for children and young people.',
  tagline: 'Finding the child the average hides.',
  lead: 'I build learning projects for children and young people, and I use statistics to find out what works for each of them.',
  email: 'ilyastagiyev1@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ilyas-taghiyev-166301412',
  year: 2026,
};

export interface Score {
  test: string;
  /** Main score, exactly as supplied by Ilyas. Never recalculated. */
  value: string;
  date: string;
  /** ISO year-month for <time datetime>. */
  datetime: string;
  parts: { label: string; value: string }[];
  note?: string;
}

/** Exam scores, supplied by Ilyas (2026-11-24). Never change, round or recalculate. */
export const scores: Score[] = [
  {
    test: 'SAT',
    value: '1550',
    date: 'March 2026',
    datetime: '2026-03',
    parts: [
      { label: 'Evidence-Based Reading & Writing', value: '750' },
      { label: 'Math', value: '800' },
    ],
  },
  {
    test: 'ACT',
    value: '34',
    date: 'June 2026',
    datetime: '2026-06',
    parts: [
      { label: 'English', value: '35' },
      { label: 'Reading', value: '32' },
      { label: 'Math', value: '36' },
      { label: 'Science', value: '36' },
    ],
    note: 'Composite: enhanced ACT average of English, Reading and Math. Science is reported separately.',
  },
  {
    test: 'IELTS Academic',
    value: '8.5',
    date: 'July 2026',
    datetime: '2026-07',
    parts: [
      { label: 'Listening', value: '9.0' },
      { label: 'Reading', value: '9.0' },
      { label: 'Writing', value: '7.5' },
      { label: 'Speaking', value: '7.5' },
    ],
  },
];

export const nav = [
  { href: '#academics', label: 'Academics' },
  { href: '#projects', label: 'Projects' },
  { href: '#research', label: 'Research' },
  { href: '#recognition', label: 'Recognition' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

const press = {
  kumihoAzertac: {
    label: 'AZERTAC',
    href: 'https://azertag.az/en/xeber/azerbaijani_school_students_present_kumiho_hunters_cybersecurity_project_at_south_korean_embassy-4471836',
    kind: 'press',
  },
  kumihoGazette: {
    label: 'Uzbekistan News Gazette',
    href: 'https://uzbekistannewsgazette.com/azerbaijani-students-showcase-kumiho-hunters-cybersecurity-project-at-south-korean-embassy/',
    kind: 'press',
  },
  rehandAzertac: {
    label: 'AZERTAC',
    href: 'https://azertag.az/en/xeber/azerbaijani_school_students_develop_smart_glove_to_support_traditional_carpet_weavers-4468590',
    kind: 'press',
  },
  soleshiftAmu: {
    label: 'Azerbaijan Medical University',
    href: 'https://amu.edu.az/news/6266/atu-dan-elmi-destek-mekteblilerden-innovativ-layihe-soleshift-kids',
    kind: 'press',
  },
} satisfies Record<string, ExternalLink>;

/**
 * Projects, in order: from the one that works most directly with children
 * and young people to the one that does least. Reorder to reorder the site.
 */
export const projects: Project[] = [
  {
    slug: 'mathroutes',
    title: 'MathRoutes',
    summary: 'A free, hands-on math program for children with ADHD.',
    audience: `Children aged 5–9 with${nb}ADHD`,
    grades: 'Grades 10–11',
    time: `6${nb}hr/wk · 32${nb}wk/yr`,
    role: 'Founder',
    facts: [
      { value: '2K+', label: 'children reached by our team' },
      { value: '20', label: 'teen mentors trained' },
      { value: `3×${nb}a${nb}week`, label: 'sessions' },
    ],
    recognition: ['Selected nationally to present MathRoutes on Medeniyyet TV'],
    links: [{ label: 'mathroutes.vercel.app', href: 'https://mathroutes.vercel.app', kind: 'website' }],
    photo: 'mathroutes',
    detail: {
      built:
        'A free math program for children with ADHD, ages 5–9. Children explore math through drawing, cutting and building. They create sequences with their own rules and challenge classmates to figure them out, practicing mathematical reasoning through play. I drew on Math-U-See and Beast Academy to create the hands-on tasks.',
      measuredTitle: 'What changed',
      measured:
        'I revised the task cards based on children’s responses. I trained 20 teen mentors to run sessions three times a week, and our team reached 2K+ children.',
    },
  },
  {
    slug: 'kumiho-hunters',
    title: 'Kumiho Hunters',
    summary: 'Online-safety lessons for primary-school children.',
    audience: 'Primary-school children',
    grades: 'Grades 10–11',
    time: `5${nb}hr/wk · 21${nb}wk/yr`,
    role: 'Chief Analytics Officer',
    facts: [
      { value: '450', label: 'children' },
      { value: '18', label: 'schools' },
      { value: '21', label: 'weeks' },
    ],
    recognition: ['Selected by the South Korean Embassy for its event'],
    // TODO: kumihohunters.site did not respond on 2026-11-24. Check it is live.
    links: [
      { label: 'kumihohunters.site', href: 'https://kumihohunters.site', kind: 'website' },
      press.kumihoAzertac,
      press.kumihoGazette,
    ],
    photo: 'kumiho-hunters',
    detail: {
      builtTitle: 'What we built',
      built:
        'A student-led cybersecurity education program. Over 21 weeks it teaches primary-school children to recognize online scams, protect their passwords and personal data, and ask an adult for help before clicking. It reached 450 children in 18 schools.',
      measured:
        'I analyzed the pre- and post-test scores. Using Hake’s normalized gain, I assessed progress relative to the improvement that was still possible, and identified the classes that needed a new approach.',
    },
  },
  {
    slug: 'soleshift-kids',
    title: 'SoleShift Kids',
    summary: 'Foot screening and follow-up care for rural schoolchildren.',
    audience: 'Rural schoolchildren',
    grades: 'Grades 9–11',
    time: `9${nb}hr/wk · 24${nb}wk/yr`,
    role: 'Co-founder · workshop lead',
    facts: [
      { value: '473', label: 'children screened' },
      { value: '276', label: 'specialist reviews arranged' },
      { value: '173', label: 'free insoles' },
      { value: '8', label: 'schools' },
      { value: '20', label: 'workshops I led' },
    ],
    recognition: ['Featured by Azerbaijan Medical University'],
    links: [{ label: 'sole-shift.com', href: 'https://sole-shift.com', kind: 'website' }, press.soleshiftAmu],
    photo: 'soleshift-kids',
    detail: {
      builtTitle: 'What we built',
      built:
        'A free program that brings foot screening and follow-up care to rural schoolchildren. Supervised by an orthopedic surgeon from Azerbaijan Medical University, the team uses a low-cost foot-pressure sensor and arranges specialist reviews and free insoles. I led 20 workshops to prepare children for the screening, connecting health education with access to care.',
      measuredTitle: 'Results',
      measured:
        'I helped screen 473 children in 8 schools. Our team arranged 276 specialist reviews and provided 173 free insoles.',
    },
  },
  {
    slug: 'stem-van-thuis',
    title: 'Stem van Thuis',
    summary: 'Picture cards that help toddlers communicate before they learn Dutch.',
    audience: 'Toddlers in Dutch daycares',
    grades: 'Grades 10–11',
    time: `6${nb}hr/wk · 18${nb}wk/yr`,
    role: 'Founder · card designer',
    facts: [
      { value: '200+', label: 'toddlers reached' },
      { value: '12', label: 'picture cards' },
      { value: `18${nb}weeks`, label: 'pilot' },
    ],
    links: [],
    photo: 'stem-van-thuis',
    detail: {
      problem: 'Toddlers in Dutch daycares need to show their basic needs before they have learned Dutch.',
      built:
        'A picture-card system for Dutch daycares. I designed 12 cards for food, sleep and pain. A toddler points to a card, and its QR code plays a parent’s recorded voice, so pictures come together with a familiar voice.',
      measuredTitle: 'What I tested',
      measured:
        'Over an 18-week pilot, I tested and refined the cards with teachers and families until the youngest children could use them. The cards reached 200+ toddlers in Dutch daycares.',
    },
  },
  {
    slug: 'click',
    title: 'CLICK: Children Rewrite the Instructions',
    summary: 'Computing, English and AI-literacy lessons for Roma children.',
    audience: 'Roma children in Romania',
    grades: 'Grade 11',
    time: `8${nb}hr/wk · 12${nb}wk/yr`,
    role: 'Teacher · curriculum co-developer',
    facts: [
      { value: '270+', label: 'children taught online' },
      { value: '75%', label: 'completed tasks without mentor hints' },
      { value: '14', label: 'tutorials revised' },
    ],
    recognition: ['Initiated at the invitation of the Romanian Embassy in Azerbaijan'],
    // TODO: click-alpha-give.vercel.app returned 404 on 2026-11-24, so the link is hidden.
    links: [],
    photo: 'click',
    detail: {
      builtTitle: 'What we built',
      built:
        'An online pilot, started at the invitation of the Romanian Embassy in Azerbaijan, that helps Roma children in Romania build digital independence through computing, English and AI-literacy tutorials. I taught 270+ children online.',
      measured:
        'As curriculum co-developer, I used the difficulties children ran into to revise 14 tutorials and make technical ideas easier to follow. By the end of the program, 75% completed tasks without mentor hints.',
    },
  },
  {
    slug: 'youth-collective',
    title: 'The Youth Collective',
    summary: 'Data-literacy and AI-ethics workshops for children.',
    audience: 'Children in Azerbaijan',
    grades: 'Grades 9–11',
    time: `3${nb}hr/wk · 30${nb}wk/yr`,
    role: 'Co-founder · Children’s Affairs Ambassador',
    facts: [{ value: '400+', label: 'children so far' }],
    links: [{ label: 'youth-collective.com', href: 'https://youth-collective.com', kind: 'website' }],
    photo: 'youth-collective',
    detail: {
      builtTitle: 'What I run',
      built:
        'A youth-led initiative in Azerbaijan where children explore ecology, sports and health through workshops and community projects. I lead its work for children: in data-literacy and AI-ethics workshops, children collect observations, test popular claims with examples from ecology, sports and health, and learn to use AI tools critically, not blindly.',
    },
  },
  {
    slug: 'azerbaijan-childrens-foundation',
    title: 'Azerbaijan Children’s Foundation',
    summary: 'Digital work for a national children’s charity.',
    audience: 'Children and their families',
    grades: 'Grade 11',
    time: `4${nb}hr/wk · 12${nb}wk/yr`,
    role: 'Digital team member',
    facts: [],
    links: [{ label: 'azuf.az', href: 'https://azuf.az', kind: 'website' }],
    photo: 'childrens-foundation',
    detail: {
      builtTitle: 'What I do',
      built:
        'The foundation is a national charity that supports children’s wellbeing through recreation for vulnerable families, digital-literacy and online-safety lessons for primary pupils, and chances for schoolchildren to develop creative talents. On its digital team I build registration forms, create announcements and prepare presentations for children’s events. I also guide participants and manage the technology on site, supporting families online and in person.',
    },
  },
  {
    slug: 'loomlock',
    title: 'LoomLock',
    summary: 'Website permissions that follow family roles in carpet businesses.',
    audience: 'Artisan families',
    grades: 'Grades 10–11',
    time: `7${nb}hr/wk · 8${nb}wk/yr`,
    role: 'Co-founder',
    facts: [
      { value: '100+', label: 'artisan families trained' },
      { value: '3', label: 'regions' },
    ],
    links: [{ label: 'loom-lock.com', href: 'https://www.loom-lock.com', kind: 'website' }],
    photo: 'loomlock',
    detail: {
      builtTitle: 'What we built',
      built:
        'LoomLock translates family roles into website permissions: teens manage online sales while adults control payments. I built these safeguards for family carpet businesses and led hands-on digital-security training for 100+ artisan families across 3 regions.',
    },
  },
  {
    slug: 'rehand-loom',
    title: 'ReHand Loom',
    summary: 'A sensor glove to study strain in carpet weavers.',
    audience: 'Carpet weavers',
    grades: 'Grades 10–11',
    time: `10${nb}hr/wk · 25${nb}wk/yr`,
    role: 'Co-founder · data lead',
    facts: [
      { value: '378', label: 'weavers trained' },
      { value: '6', label: 'prototypes' },
      { value: '5', label: 'regions' },
    ],
    recognition: ['Showcased at the National Carpet Museum', 'Recognized by the Ministry of Culture'],
    links: [press.rehandAzertac],
    photo: 'rehand-loom',
    detail: {
      builtTitle: 'What we built',
      built:
        'A sensor glove that reads finger and wrist movement and pressure, to study weavers’ strain. As data lead, I built the pipeline that processes the glove’s readings.',
      measuredTitle: 'Results',
      measured: 'We refined 6 prototypes with weavers’ feedback and trained 378 weavers across 5 regions.',
    },
  },
  {
    slug: 'sessiz-sifaris',
    title: 'Sessiz Sifaris',
    summary: 'QR ordering for guests with speech or language barriers.',
    audience: 'Restaurant guests with speech or language barriers',
    grades: 'Grades 10–11',
    time: `5${nb}hr/wk · 10${nb}wk/yr`,
    role: 'Co-founder',
    facts: [
      { value: '300+', label: 'orders placed' },
      { value: '2', label: 'pilot sites' },
      { value: '20', label: 'supervisors trained' },
    ],
    links: [{ label: 'sessizsifaris.com', href: 'https://sessizsifaris.com', kind: 'website' }],
    photo: 'sessiz-sifaris',
    detail: {
      builtTitle: 'What we built',
      built:
        'A QR ordering system that lets guests with speech or language barriers order without speaking at McDonald’s and KFC in Azerbaijan. I trained 20 supervisors to support its use.',
      measuredTitle: 'Results',
      measured: 'Guests placed 300+ orders at 2 pilot sites, and a third branch adopted the system on its own.',
    },
  },
  {
    slug: 'athena-band',
    title: 'Athena Band',
    summary: 'Software that turns a screen-free band’s readings into data athletes can review.',
    audience: 'Athletes',
    grades: 'Grades 10–11',
    time: `5${nb}hr/wk · 16${nb}wk/yr`,
    role: 'Software developer · user trainer',
    facts: [],
    recognition: ['Recommended by the president of Sabah FC'],
    links: [{ label: 'athenaband.com', href: 'https://athenaband.com', kind: 'website' }],
    photo: 'athena-band',
    detail: {
      built:
        'Software and a dashboard that turn a screen-free band’s movement and heart-rate readings into data athletes can review.',
      measuredTitle: 'How we tested it',
      measured:
        'I trained users and tested the core functions with Sabah FC personnel, connecting development with field testing.',
    },
  },
  {
    slug: 'wolbacaspian',
    title: 'WolbaCaspian',
    summary: 'Solar sensor stations to guide mosquito-habitat control.',
    grades: 'Grades 10–11',
    time: `4${nb}hr/wk · 12${nb}wk/yr`,
    role: 'Co-designer (team of five)',
    facts: [],
    links: [{ label: 'wolbacaspian.com', href: 'https://wolbacaspian.com', kind: 'website' }],
    photo: 'wolbacaspian',
    detail: {
      builtTitle: 'What we built',
      built:
        'Solar sensor stations that guide mosquito-habitat control in Azerbaijan’s Caspian lowlands, linking environmental monitoring to prevention. I co-designed the stations.',
      measuredTitle: 'How we measured',
      measured:
        'Our five-person team used Random Forest to calibrate the low-cost sensors against Ministry of Ecology and local weather-station data. I planned how to validate the model against a baseline.',
    },
  },
];

export const research = {
  kicker: 'Preprint · November 2026',
  title:
    'When Diversification Fails: Decomposing Portfolio Risk-Forecast Errors into Asset-Volatility and Correlation Surprises, 1997–2026',
  authors: ['Ilyas Taghiyev', 'Nijat Shikhaliyev', 'Mikayil Ahmadbayli', 'Murad Ismayilov'],
  summary:
    'When a portfolio risk forecast misses, is it because assets became more volatile than expected, or because their correlations changed? We tested 3 risk models on 11 portfolios from 1997 to 2026 and split the error of every 20-day risk forecast with an exact Shapley decomposition.',
  myPart:
    'As co-author, I prepared the 1997–2026 data and set up every test so that each forecast used only information available on its date.',
  keyResult: {
    low: 77,
    high: 95,
    value: '77–95%',
    label: 'of squared forecast error came from asset-risk surprises',
  },
  link: { label: 'Read the preprint on Zenodo', href: 'https://zenodo.org/records/24425599' },
};

/**
 * Academic honors (Academics section). Only academic awards that are in the CV:
 * essay competitions, olympiads, academic prizes. The CV has one.
 */
export const academicHonors = [
  {
    title: 'John Locke Institute Global Essay Prize: Commended',
    meta: 'Science & Technology essay · Grade 10 · International',
    note: 'An essay arguing that politeness toward AI matters because it rehearses habits we carry into human relationships.',
  },
];

/** Recognition of projects (Recognition section). */
export const honors = [
  { title: 'Recognized by the Ministry of Culture of Azerbaijan', note: 'ReHand Loom' },
  { title: 'Selected by the South Korean Embassy for its event', note: 'Kumiho Hunters' },
  { title: 'Selected nationally to present on Medeniyyet TV', note: 'MathRoutes' },
];

/** No dates and no logos, by design. */
export const media: { outlet: string; text: string; href?: string }[] = [
  { outlet: 'Medeniyyet TV', text: 'MathRoutes presented on national television' },
  { outlet: 'AZERTAC', text: 'Kumiho Hunters at the South Korean Embassy', href: press.kumihoAzertac.href },
  { outlet: 'Uzbekistan News Gazette', text: 'Kumiho Hunters', href: press.kumihoGazette.href },
  { outlet: 'AZERTAC', text: 'ReHand Loom smart glove', href: press.rehandAzertac.href },
  { outlet: 'Azerbaijan Medical University', text: 'SoleShift Kids', href: press.soleshiftAmu.href },
  { outlet: 'National Carpet Museum', text: 'ReHand Loom showcased' },
  { outlet: 'Sabah FC', text: 'The club president recommended the Athena Band team' },
];

/**
 * About: the facts about Ilyas live in the intro. About only says why
 * statistics, in his own words, so it does not repeat the intro.
 * CV facts only (2026-11-24): no languages, tools, interests or hobbies.
 */
export const about = {
  paragraphs: [
    'Working on these projects, I learned that a good average can hide the children who need help most. That is why I want to study statistics and data science: to measure what actually works, and for whom.',
  ],
};
