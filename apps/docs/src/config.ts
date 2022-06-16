export const SITE = {
  title: "setup.ts",
  description: "Project scaffolding in TypeScript",
  defaultLanguage: "en_US",
};

export const OPEN_GRAPH = {
  image: {
    src: "https://github.com/jakob-kruse/setup.ts/blob/main/apps/docs/public/logo.png?raw=true",
    alt:
      "setup.ts logo"
  },
  twitter: "JakobKruseDev",
};

export const KNOWN_LANGUAGES = {
  English: "en",
};

export const GITHUB_EDIT_URL = `https://github.com/jakob-kruse/setup.ts/blob/main/apps/docs/`;

export const SIDEBAR: {
  title?: string;
  children?: {
      title: string;
      path: string;
  }[];
}[] = [
  {
    title: undefined,
    children: [
      {
        title: "Quick Start",
        path: "/quick-start",
      }
    ]
  },
  {
    title: "Plugins",
    children: [
      {
        title: "Introduction",
        path: "/plugins/introduction",
      },
      {
        title: "Advanced Plugins",
        path: "/plugins/advanced",
      }
    ]
  }
]