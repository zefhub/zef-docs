const math = require("remark-math");
const katex = require("rehype-katex");

module.exports = {
  title: "Zef Docs",
  tagline: "Nie jou ma se databasis nie. Not your mother's database.",
  url: "https://zef.zefhub.io",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.svg",
  organizationName: "synchronoustechnologies",
  projectName: "Zef",
  themeConfig: {
    // sidebarCollapsible: false,
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    algolia: {
      appId: "1R69LQWN42",
      apiKey: "829b7dfc22942f61c2583857deb39b1f",
      indexName: "zef-zefhub",
      contextualSearch: false,
      searchParameters: {},
      sitemaps: ["https://zef.zefhub.io/sitemap.xml"],
      pathsToMatch: ["https://zef.zefhub.io/**", "http://zef.zefhub.io/**"],
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: "",
      logo: {
        alt: "ZefDB logo",
        src: "img/zef_logo_black.svg",
        srcDark: "img/zef_logo_white.svg",
      },
      items: [
        // {
        // 	to: "/",
        // 	activeBasePath: "docs",
        // 	label: "Docs",
        // 	position: "left",
        // },
        {
          href: "https://blog.zefhub.io/",
          label: "Blog",
          position: "right",
        },
        {
          href: "https://zefhub.io",
          label: "ZefHub",
          position: "right",
        },
        {
          href: "https://zef.chat",
          position: "right",
          className: "header-zef-chat-link",
          "aria-label": "Zef chat server",
        },
        {
          href: "https://github.com/zefhub/zef",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
        // {
        //   href: "https://github.com/synchronoustechnologies/zefDB",
        //   label: "GitHub",
        //   position: "right",
        // },
      ],
    },
    prism: {
      theme: require("prism-react-renderer/themes/okaidia"),
    },
    footer: {
      //   style: 'dark',
      //   links: [
      //     {
      //       title: 'Docs',
      //       items: [
      //         {
      //           label: 'Style Guide',
      //           to: 'docs/',
      //         },
      //         {
      //           label: 'Second Doc',
      //           to: 'docs/doc2/',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'Community',
      //       items: [
      //         {
      //           label: 'Stack Overflow',
      //           href: 'https://stackoverflow.com/questions/tagged/docusaurus',
      //         },
      //         {
      //           label: 'Discord',
      //           href: 'https://discordapp.com/invite/docusaurus',
      //         },
      //         {
      //           label: 'Twitter',
      //           href: 'https://twitter.com/docusaurus',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'More',
      //       items: [
      //         {
      //           label: 'Blog',
      //           to: 'blog',
      //         },
      //         {
      //           label: 'GitHub',
      //           href: 'https://github.com/facebook/docusaurus',
      //         },
      //       ],
      //     },
      //   ],
      copyright: `Copyright © ${new Date().getFullYear()} Synchronous Technologies Pte. Ltd.`,
    },
    zoom: {},
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/synchronoustechnologies/zefsite",
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     "https://github.com/facebook/docusaurus/edit/master/website/blog/",
        // },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-D6S5BF82XH",
          anonymizeIP: true,
        },
      },
    ],
  ],
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css",
      integrity:
        "sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc",
      crossorigin: "anonymous",
    },
  ],
  plugins: [require.resolve("docusaurus-plugin-image-zoom")],
};
