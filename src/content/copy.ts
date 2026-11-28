/**
 * Site copy: the words people read on noahwright.dev, kept in one place so they
 * are easy to find and rewrite.
 *
 * Every entry says who wrote it:
 *   - `author: "ai"`   — drafted by an AI assistant. Fair game for a rewrite.
 *   - `author: "noah"` — written (or rewritten and approved) by Noah. Leave it alone.
 *
 * When Noah rewrites an entry, change its `text` and flip `author` to "noah".
 * If he reads an AI entry and is happy with it as is, flipping `author` is enough.
 * New copy goes here too, marked "ai" until he's had a go at it.
 *
 * Structured content that has its own data file isn't repeated here:
 *   - `src/lib/resume.ts`      (resume entries, milestones, summary)
 *   - `src/lib/projects.ts`    (project cards)
 *   - `src/lib/portraits.ts`   (portrait styles and the portraits note)
 *   - `src/lib/siteHistory.ts` (site versions)
 * Those aren't marked yet.
 *
 * Plain data only: no React, no imports, so tools and tests can read it.
 */

export type Author = "ai" | "noah";

export interface CopyEntry {
  readonly author: Author;
  readonly text: string;
}

export const COPY = {
  site: {
    /** Not shown anywhere yet. */
    tagline: {
      author: "ai",
      text: "Engineering leader building tools that help teams move faster",
    },
    description: {
      author: "ai",
      text: "I'm an engineering manager leading an Engineering Enablement team: we build the tools, guardrails, and AI-powered workflows that help engineers ship faster and safer. Before that, ten years in the U.S. Air Force. After hours, I build games and toys that are mostly an excuse to try new things.",
    },
    metaDescription: {
      author: "ai",
      text: "Engineering leader, software engineer, USAF veteran, father. Building great products and great teams.",
    },
    ogImageAlt: {
      author: "ai",
      text: "Noah Wright: engineering leader, builder of useful software, Air Force veteran",
    },
    ogImageTagline: { author: "ai", text: "Engineering leader · Builder · Veteran" },
  },

  home: {
    greeting: { author: "ai", text: "👋 I'm Noah" },
    /** Rotating hero taglines. A rewrite is in progress: see TODOs/hero-taglines.todo.md. */
    heroTitles: [
      { author: "ai", text: "👔 Software engineering manager" },
      { author: "ai", text: "🏗️ Builder of useful software" },
      { author: "ai", text: "😎 Building cool little side projects" },
      { author: "ai", text: "🤓 Nerding out over AI" },
      { author: "ai", text: "🧙 Wielding AI minions like a computer wizard" },
      { author: "ai", text: "💺 Chair Force veteran 🫡" },
      { author: "ai", text: "🇺🇸 Air Force veteran 🫡" },
      { author: "ai", text: "🧑‍🔬 Computer scientist experimenting with AI" },
      { author: "ai", text: "🤡 Lifelong self-deprecating jokester" },
      { author: "ai", text: "🎮 Been gaming since before I could read" },
      { author: "ai", text: "🧑‍💻 Always curious, lifelong learner" },
      { author: "ai", text: "🛠️ Tinkerer, over-engineerer, problem-solver" },
      { author: "ai", text: "🚧 Learning in public -- pardon the mess!" },
      { author: "ai", text: "🤖 Keeping robots busy on my side projects" },
    ],
    projectsButton: { author: "ai", text: "My Projects" },
    resumeButton: { author: "ai", text: "Resume" },
    photoLinkLabel: { author: "ai", text: "See Noah's other portrait styles" },
    /** `{n}` is the number of other portraits. */
    photoHint: { author: "ai", text: "psst… {n} more of me" },
    exploreHeading: { author: "ai", text: "Explore" },
    exploreCards: {
      projects: {
        title: { author: "ai", text: "Projects" },
        description: { author: "ai", text: "See what I've built." },
      },
      about: {
        title: { author: "ai", text: "About Me" },
        description: { author: "ai", text: "The story behind the resume." },
      },
      resume: {
        title: { author: "ai", text: "Resume" },
        description: { author: "ai", text: "Experience, skills, and the PDF." },
      },
      contact: {
        title: { author: "ai", text: "Get in Touch" },
        description: { author: "ai", text: "Say hello or start a conversation." },
      },
    },
  },

  about: {
    metaDescription: {
      author: "ai",
      text: "Learn more about Noah Wright, his engineering leadership background, and the values that shape his work.",
    },
    heading: { author: "ai", text: "About" },
    whoIAmHeading: { author: "ai", text: "Who I Am" },
    whoIAm: [
      {
        author: "ai",
        text: "I got into programming through playful curiosity—amazed by how math could make video games, I wanted to learn code to build my own. That spark led me to discover something deeper: code can be a tool for both fun and for eliminating soul-crushing work from people’s jobs. That’s still what drives me today: getting useful tools into people’s hands so they can be happier and more productive.",
      },
      {
        author: "ai",
        text: "My ten years in the United States Air Force taught me how to function in highly regulated environments. It was bureaucracy and red tape with a side of morning PT and the occasional shooting range trip. That structure was both constraining and freeing—you had to jump through hoops, but once you learned the system, everything became predictable. The military’s emphasis on training, consistent enforcement, and bias toward action shaped how I think about organizations: a high-functioning team continually prunes what’s no longer useful, just like managing technical debt.",
      },
    ],
    whatIBuildHeading: { author: "ai", text: "What I Build" },
    whatIBuild: [
      {
        author: "ai",
        text: "I love “engineering for engineers.” My current role is managing an Engineering Enablement team, and we build tools to help engineers be more productive. Empowerment is my north star: I want people to feel capable and fast, with guardrails in place to keep them safe from costly mistakes. Lately, we’ve been focused on leveraging generative AI and modern coding tools to help teams keep pace with the accelerating rate of change. The world is moving faster than ever, and I want to help software teams keep up.",
      },
    ],
    outsideWorkHeading: { author: "ai", text: "Outside Work" },
    outsideWork: [
      {
        author: "ai",
        text: "Family is everything to me. My wife and I care for our disabled adult child, which has taught me both patience and the deep importance of finding ways to make life easier for people who struggle with everyday tasks. That’s part of why I’m passionate about empowering tools—I see the real-world impact they have. When I’m not building software, I’m still a gamer and fun-loving goofball. I make silly side projects, toys, and games, mostly on my fake Doors 97 operating system. That playful spirit has never left me, and I don’t think it ever should.",
      },
    ],
    contactButton: { author: "ai", text: "Get in Touch" },
    resumeButton: { author: "ai", text: "View Resume" },
  },

  contact: {
    metaDescription: {
      author: "ai",
      text: "Get in touch with Noah Wright. Interested in opportunities, collaborations, or just want to connect? Reach out via email or LinkedIn.",
    },
    heading: { author: "ai", text: "Get in Touch" },
    intro: {
      author: "ai",
      text: "I’m always interested in new opportunities, collaborations, and interesting conversations. Whether you have a project in mind, want to discuss engineering leadership, or just want to connect, feel free to reach out.",
    },
    emailButton: { author: "ai", text: "Email Me" },
    linkedInButton: { author: "ai", text: "Connect on LinkedIn" },
    gitHubButton: { author: "ai", text: "See my GitHub" },
  },

  projects: {
    metaDescription: {
      author: "ai",
      text: "Explore software, game, and design system projects by Noah Wright, including live demos and source code.",
    },
    heading: { author: "ai", text: "Projects" },
    intro: {
      author: "ai",
      text: "A mix of tools, games, and platform experiments that reflect how I like to build: practical foundations, interesting technical constraints, and a little room for play.",
    },
  },

  history: {
    metaDescription: {
      author: "ai",
      text: "A brief timeline of Noah Wright's developer website iterations and how the current site evolved.",
    },
    heading: { author: "ai", text: "Site History" },
    intro: {
      author: "ai",
      text: "Every version of this site that made it into the world. The old blog is still online, if you want to see how things have changed.",
    },
  },

  portraits: {
    metaDescription: {
      author: "ai",
      text: "The real photo and ten AI-generated style reimaginings behind the home page hero's rotating portrait.",
    },
    heading: { author: "ai", text: "The Many Faces of Noah" },
    promptsQuestion: { author: "ai", text: "Curious about the prompts?" },
    promptsLink: { author: "ai", text: "Full notes on GitHub" },
  },

  resume: {
    metaDescription: {
      author: "ai",
      text: "Noah Wright's resume, presented as a branching timeline of a dual career in the U.S. Air Force and civilian software engineering.",
    },
    heading: { author: "ai", text: "Resume" },
    downloadButton: { author: "ai", text: "Download PDF" },
    downloadAgainButton: { author: "ai", text: "Download the one-page PDF" },
    contactLink: { author: "ai", text: "Get in touch" },
  },

  notFound: {
    bsod: [
      {
        author: "ai",
        text: "A fatal exception 404 has occurred at noahwright.dev. The page you requested could not be found. It may have moved, been deleted, or never existed at all.",
      },
      { author: "ai", text: "* Check the address for typos. It happens to the best of us." },
      { author: "ai", text: "* Press CTRL+ALT+DEL to reboot. (Please don’t, it won’t help.)" },
    ],
    bsodPrompt: { author: "ai", text: "Press any key to continue" },
    heading: { author: "ai", text: "Page not found" },
    intro: { author: "ai", text: "Nothing lives at this address. Try one of these instead:" },
  },

  easterEggs: {
    consoleGreeting: { author: "ai", text: "👋 Hi, fellow nerd!" },
    /** `{url}` is the site's GitHub repo. */
    consoleSource: { author: "ai", text: "Poking around? The source for this site is on GitHub: {url}" },
    consoleKonami: { author: "ai", text: "Psst: try the Konami code." },
    konamiToast: { author: "ai", text: "🕹️ 30 extra lives granted" },
  },
} as const satisfies CopyTree;

/** Any nesting of entries, arrays of entries and groups. */
type CopyTree = { readonly [key: string]: CopyEntry | readonly CopyEntry[] | CopyTree };

/** Fill `{name}` placeholders: `fill(COPY.home.photoHint, { n: 10 })`. */
export function fill(entry: CopyEntry, values: Record<string, string | number>): string {
  return entry.text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}
