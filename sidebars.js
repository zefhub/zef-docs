module.exports = {
  "mainSidebar": [
    "documentation-overview",
    {
      "type": "category",
      "label": "ZefDB",
      "link": {"type": 'doc', "id": 'overview-zefdb'},
      // "link": {
      //   "type": 'generated-index',
      //   "title": 'ZefDB Overview',
      //   "description": 'ZefDB - A an append-only, graph-relational, event-sourced database',
      //   "slug": '/zefdb/overview',
      //   "keywords": ['overview'],
      //   "image": '/img/docusaurus.png',
      // },
      "items": [
        {
          "type": "category",
          "label": "How-Tos",
          "link": {"type": 'doc', "id": 'howtos-zefdb'},
          "items": [
            "semantic-diffing",
            "predicate-dispatch",
          ]
        },
        // "howtos-zefdb",
        "tutorials-zefdb",
        "explanations-zefdb",
        "reference-zefdb",
      ]
    },
    
    {
      type: "category",
      label: "ZefOps",
      // link: {
      //   type: 'generated-index',
      //   title: 'Docusaurus Guides2',
      //   description: 'Learn about the most important Docusaurus concepts!',
      //   slug: '/category/docusaurus-guides',
      //   keywords: ['guides'],
      //   image: '/img/docusaurus.png',
      // },
      items: [
        "representing-time",
        {
          type: 'link',
          label: 'ZefHub',               // The link label
          href: 'https://zefhub.io',     // The external URL
        },
        {
          type: 'html',
          value: 'Core concepts',
          className: 'sidebar-title',
        },
      ]
    },

    // {
    //   type: 'category',
    //   label: 'ABCDE',
    //   collapsible: true,
    //   collapsed: false,
    //   items: [
    //     'creating-pages',
    //     {
    //       type: 'category',
    //       label: 'Docs',
    //       items: ['introduction', 'sidebar', 'markdown-features', 'versioning'],
    //     },
    //   ],
    // },

    // {
    //   type: 'category',
    //   label: 'ABCDE',
    //   // collapsible: false,    # enabling this does not cause an error, but the category does not show up
    //   collapsed: false,
    //   link: {
    //     type: 'generated-index',
    //     title: 'Docusaurus Guides',
    //     description: 'Learn about the most important Docusaurus concepts!',
    //     slug: '/category/docusaurus-guides',
    //     keywords: ['guides'],
    //     image: '/img/docusaurus.png',
    //   },
    //   items: [
    //     'representing-time',
    //   ],
    // },

    {
      "type": "category",
      "label": "GraphQL",
      "link": {
        "type": 'generated-index',
        "title": 'GraphQL Overview',
        // "description": 'Zef GraphQL - easily create and maintain a GraphQL APIs and connect systems',
        "slug": '/graphql/overview',
        // "keywords": ['overview'],
        // "image": '/img/docusaurus.png',
      },
      "items": [
        "representing-time",
        "entity-vs-value",
        "facts-logic"
      ]
    },

    {
      "type": "category",
      "label": "Data Streaming",
      "items": [
        "representing-time"
      ]
    },

    {
      "type": "category",
      "label": "Type System",
      "link": {"type": 'doc', "id": 'finding-zef-ops'},
      "items": [
        "representing-time"
      ]
    },


    
    {
      "type": "category",
      "label": "Managed Effects",
      "items": [
        "representing-time"
      ]
    },
    
    {
      "type": "category",
      "label": "Zef Studio",
      "link": {"type": 'doc', "id": 'overview-zefstudio'},
      "items": [
        // "representing-time"
      ]
    },
    
    {
      "type": "category",
      "label": "Integration",
      "items": [
        "representing-time"
      ]
    },

    {
      "type": "category",
      "label": "Domain Modeling",
      "items": [
        "representing-time"
      ]
    },

    {
      "type": "category",
      "label": "Algorithms",
      "items": [
        "representing-time"
      ]
    },

    
    {
      "type": "category",
      "label": "Use Cases",
      "items": [
        "representing-time"
      ]
    },
    
    {
      "type": "category",
      "label": "Installing Zef",
      "items": [
        "representing-time"
      ]
    },
    
    {
      "type": "category",
      "label": "Contributing",
      "items": [
        "representing-time"
      ]
    },

    {
      "type": "category",
      "label": "Roadmap",
      "items": [
        {
          "type": "category",
          "label": "Distributed Systems",
          "items": [
            "representing-time"
          ]
        }
      ]
    }


  ]
}