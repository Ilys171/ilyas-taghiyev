/**
 * All site content lives in this file. Components only render it.
 *
 * Source of truth: Ilyas's CV (private/Ilyas_Taghiyev_UC_Activities.pdf).
 * Rules for editing:
 * - Every fact, number, title and role must appear in the CV. Nothing else.
 * - Typography: curly quotes “ ” ’, en dash – for ranges, and a
 *   non-breaking space ( ) between a number and its unit.
 * - A missing detail section is simply not shown.
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

export type Category = 'learning' | 'health' | 'community';

/** Category names. Colours are tokens in global.css (--cat-*). */
export const categories: Record<Category, { label: string }> = {
  learning: { label: 'Learning' },
  health: { label: 'Health' },
  community: { label: 'Communities & accessibility' },
};

export interface Project {
  slug: string;
  title: string;
  category: Category;
  /** One strong sentence: what it is. */
  summary: string;
  /** Who the project is for; shown as “For” on the project page. */
  audience?: string;
  /** School grades during which Ilyas worked on it, as in the CV (no years). */
  grades: string;
  /** Time commitment, as in the CV. */
  time: string;
  role: string;
  /** 2–3 key facts, exactly as in the CV. Non-number facts where the CV has no numbers. */
  facts: Fact[];
  recognition?: string[];
  links: ExternalLink[];
  /** Project page story. Text only restates the CV. */
  detail: {
    built?: string;
    builtTitle?: string;
    measured?: string;
    measuredTitle?: string;
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
  /** Why (his own words, merged from the former About section). */
  studyWhy: 'to measure what actually works, and for whom.',
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
  { href: '#projects', label: 'Projects' },
  { href: '#research', label: 'Research' },
  { href: '#recognition', label: 'Recognition' },
  { href: '#academics', label: 'Academics' },
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
 * The 7 projects on the site, in Ilyas's order (2026-11-24, revised): the
 * strongest first, work with children first. Category colours: learning,
 * health, communities & accessibility.
 * Removed on purpose: Numbers Club, Science Club, Stem van Thuis, CLICK,
 * School Voice, LoomLock, WolbaCaspian, Azerbaijan Children’s Foundation.
 * Their old URLs redirect to /#projects (astro.config.mjs).
 * Nothing from recommendation letters appears here.
 */
export const projects: Project[] = [
  {
    slug: 'mathroutes',
    title: 'MathRoutes',
    category: 'learning',
    summary: 'A free, hands-on math program for children with ADHD, aged 5–9.',
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
    category: 'learning',
    summary: 'Online-safety lessons that teach primary-school children to spot scams and ask an adult before clicking.',
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
    links: [
      { label: 'kumihohunters.site', href: 'https://kumihohunters.site', kind: 'website' },
      press.kumihoAzertac,
      press.kumihoGazette,
    ],
    detail: {
      builtTitle: 'What we built',
      built:
        'A student-led cybersecurity education program. Over 21 weeks it teaches primary-school children to recognize online scams, protect their passwords and personal data, and ask an adult for help before clicking. It reached 450 children in 18 schools.',
      measuredTitle: 'What I measured',
      measured:
        'I analyzed the pre- and post-test scores. Using Hake’s normalized gain, I assessed progress relative to the improvement that was still possible, and identified the classes that needed a new approach.',
    },
  },
  {
    slug: 'soleshift-kids',
    title: 'SoleShift Kids',
    category: 'health',
    summary: 'Foot screening and follow-up care for rural schoolchildren, supervised by an orthopedic surgeon.',
    audience: 'Rural schoolchildren',
    grades: 'Grades 9–11',
    time: `9${nb}hr/wk · 24${nb}wk/yr`,
    role: 'Co-founder · workshop lead',
    facts: [
      { value: '473', label: 'children screened' },
      { value: '276', label: 'specialist reviews arranged' },
      { value: '173', label: 'free insoles' },
    ],
    recognition: ['Featured by Azerbaijan Medical University'],
    links: [{ label: 'sole-shift.com', href: 'https://sole-shift.com', kind: 'website' }, press.soleshiftAmu],
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
    slug: 'youth-collective',
    title: 'The Youth Collective',
    category: 'learning',
    summary: 'Data-literacy and AI-ethics workshops where children test everyday claims with evidence.',
    audience: 'Children in Azerbaijan',
    grades: 'Grades 9–11',
    time: `3${nb}hr/wk · 30${nb}wk/yr`,
    role: 'Co-founder · Children’s Affairs Ambassador',
    facts: [
      { value: '400+', label: 'children so far' },
      { value: 'Ecology, sports, health', label: 'where the claims come from' },
      { value: 'AI tools', label: 'used critically, not blindly' },
    ],
    links: [{ label: 'youth-collective.com', href: 'https://youth-collective.com', kind: 'website' }],
    detail: {
      builtTitle: 'What I run',
      built:
        'A youth-led initiative in Azerbaijan where children explore ecology, sports and health through workshops and community projects. I lead its work for children: in data-literacy and AI-ethics workshops, children collect observations, test popular claims with examples from ecology, sports and health, and learn to use AI tools critically, not blindly.',
    },
  },
  {
    slug: 'rehand-loom',
    title: 'ReHand Loom',
    category: 'community',
    summary: 'A sensor glove that reads finger and wrist movement and pressure to study carpet weavers’ strain.',
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
    category: 'community',
    summary: 'QR ordering that lets guests with speech or language barriers order without speaking.',
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
    category: 'community',
    summary: 'Software and a dashboard that turn a screen-free band’s readings into data athletes can review.',
    audience: 'Athletes',
    grades: 'Grades 10–11',
    time: `5${nb}hr/wk · 16${nb}wk/yr`,
    role: 'Software developer · user trainer',
    facts: [
      { value: 'Movement & heart rate', label: 'readings turned into data athletes can review' },
      { value: 'Sabah FC', label: 'core functions tested with club personnel' },
    ],
    links: [{ label: 'athenaband.com', href: 'https://athenaband.com', kind: 'website' }],
    detail: {
      built:
        'Software and a dashboard that turn a screen-free band’s movement and heart-rate readings into data athletes can review.',
      measuredTitle: 'How we tested it',
      measured:
        'I trained users and tested the core functions with Sabah FC personnel, connecting development with field testing.',
    },
  },
];

/**
 * “More work with children”: child-related CV projects without a website,
 * shown as a compact list (no links, no pages, no facts beyond one sentence).
 * Only projects that are in the CV. Numbers Club, Science Club and School
 * Voice are not in the CV, so they are not listed.
 */
export const moreWork: { title: string; grades: string; summary: string }[] = [
  {
    title: 'Stem van Thuis',
    grades: 'Grades 10–11',
    summary:
      'A picture-card system that helps toddlers in Dutch daycares express basic needs before they learn Dutch, with QR codes that play a parent’s recorded voice.',
  },
  {
    title: 'CLICK: Children Rewrite the Instructions',
    grades: 'Grade 11',
    summary:
      'An online pilot, started at the invitation of the Romanian Embassy in Azerbaijan, that helps Roma children in Romania build digital independence through computing, English and AI-literacy tutorials.',
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
    /** It is a range, not one number: it varies by portfolio and model. */
    rangeNote: 'The share varies by portfolio and model: it is a range across the 11 portfolios and 3 risk models, not a single number.',
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

/**
 * Recognition of projects (Recognition section). Honors and selections, then
 * public media coverage. No dates (not a timeline), no logos, and nothing
 * from recommendation letters. Each item names the project it belongs to.
 */
export const honors: { title: string; project: string }[] = [
  { title: 'Selected nationally to present MathRoutes on Medeniyyet TV', project: 'mathroutes' },
  { title: 'Selected by the South Korean Embassy for its event', project: 'kumiho-hunters' },
  { title: 'Showcased at the National Carpet Museum', project: 'rehand-loom' },
  { title: 'Recognized by the Ministry of Culture of Azerbaijan', project: 'rehand-loom' },
];

/** Public media coverage with a link. */
export const media: { outlet: string; text: string; href: string; project: string }[] = [
  { outlet: 'AZERTAC', text: 'Kumiho Hunters at the South Korean Embassy', href: press.kumihoAzertac.href, project: 'kumiho-hunters' },
  { outlet: 'Uzbekistan News Gazette', text: 'Kumiho Hunters at the South Korean Embassy', href: press.kumihoGazette.href, project: 'kumiho-hunters' },
  { outlet: 'AZERTAC', text: 'ReHand Loom smart glove', href: press.rehandAzertac.href, project: 'rehand-loom' },
  { outlet: 'Azerbaijan Medical University', text: 'SoleShift Kids', href: press.soleshiftAmu.href, project: 'soleshift-kids' },
];
