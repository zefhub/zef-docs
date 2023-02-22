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
      label: "Data Pipelines & ZefOps",
      "link": {"type": 'doc', "id": 'overview-zefops'},
      items: [
        "representing-time",
        {
          type: 'link',
          label: 'ZefHub',               // The link label
          href: 'https://zefhub.io',     // The external URL
        },
      ]
    },

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