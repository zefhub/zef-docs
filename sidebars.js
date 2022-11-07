module.exports = {
  "mainSidebar": [
    {
      "type": "category",
      "label": "Introduction",
      "items": [
        "introduction/overview",
        "introduction/installation",
        "introduction/quick-start"
      ]
    },
    {
      "type": "category",
      "label": "How-To",
      "items": [
        "introduction-to-zef-db",
        {
          "type": "category",
          "label": "Traverse Graphs",
          "items": [
            "how-to/traverse-basic"
          ]
        },
        {
          "type": "category",
          "label": "GraphQL",
          "items": [
            "how-to/graphql-basic",
            "how-to/graphql-manual",
            "how-to/graphql-simplegql"
          ]
        },
        {
          "type": "category",
          "label": "Import From File",
          "items": [
            "how-to/import-csv",
            "how-to/imgui-csv",
            "how-to/import-graph-formats"
          ]
        },
        "how-to/add-to-a-graph",
        "how-to/share-graphs",
        "how-to/use-zef-networkx",
        "how-to/manage-login",
        {
          "type": "category",
          "label": "ValueTypes",
          "items": [
            "image"
          ]
        },
        "traversing-graphs",
        "data-wrangling",
        {
          "type": "category",
          "label": "ZefDB",
          "items": [
            "introduction-to-zef-db",
            "zef-db-graph"
          ]
        },
        "reacting-to-graph-changes",
        {
          "type": "category",
          "label": "ZefFX",
          "items": [
            "clipboard",
            "reading-and-writing-files",
            "http",
            "websocket"
          ]
        },
        "traversing-time",
        {
          "type": "category",
          "label": "ZefOps",
          "items": [
            "gather"
          ]
        },
        "using-zef-fx"
      ]
    },
    {
      "type": "category",
      "label": "Explanations",
      "items": [
        "explanations/privileges",
        "explanations/blob-structure",
        "user-value-types",
        {
          "type": "category",
          "label": "Wish",
          "items": [
            "wish"
          ]
        },
        {
          "type": "category",
          "label": "ZefFX",
          "items": [
            "wish"
          ]
        },
        "introduction-to-logic-types",
        "zef-ops-two-levels-of-laziness",
        "zef-objects",
        {
          "type": "category",
          "label": "FlatGraph",
          "items": [
            "merging"
          ]
        },
        {
          "type": "category",
          "label": "Concepts",
          "items": [
            "zef-ref",
            "reference-types",
            "reference-frame-programming",
            "entity-vs-value",
            "semantic-diffing",
            "graph-slice",
            "ezef-ref",
            "atoms"
          ]
        },
        "data-first-vs-data-last-languages-where-python-stands",
        "creating-a-data-model",
        "graph-relational-model",
        "unifying-streams-and-dbs",
        "zef-vs-python-lists-tuples",
        "low-level-graph-data-layout",
        "introduction-to-zef-fx",
        {
          "type": "category",
          "label": "ValueTypes",
          "items": [
            "user-value-type-advanced-typing",
            "z-expressions"
          ]
        },
        {
          "type": "category",
          "label": "ZefDB",
          "items": [
            "zef-db-transactions",
            "relational-or-graph",
            "graph-synchronization"
          ]
        },
        "logical-atomism",
        "predicate-dispatch",
        {
          "type": "category",
          "label": "Logic Types",
          "items": [
            "triples-pattern-matching"
          ]
        },
        "ref-types-vs-uids",
        {
          "type": "category",
          "label": "Code Search",
          "items": [
            "finding-zef-ops"
          ]
        },
        "z-expression",
        {
          "type": "category",
          "label": "Graphs",
          "items": [
            "graph-instructions",
            "graph-instructions"
          ]
        },
        "design-goals",
        {
          "type": "category",
          "label": "Logic",
          "items": [
            "facts-logic"
          ]
        },
        "zef-value-types"
      ]
    },
    {
      "type": "category",
      "label": "Tutorials",
      "items": [
        "tutorials/basic/employee-database",
        "tutorials/budgeter/budgeter",
        {
          "type": "category",
          "label": "Advent of Code",
          "items": [
            "2021-day-5",
            "2021-day-1",
            "2021-day-3",
            "2021-day-6"
          ]
        },
        "importing-plain-python-data",
        "zef-op-katas"
      ]
    },
    {
      "type": "category",
      "label": "Reference",
      "items": [
        "reference/glossary",
        "reference/cheatsheet-comprehensive",
        "reference/zef-ops"
      ]
    },
    {
      "type": "category",
      "label": "Configuration",
      "items": [
        "configuration-auth",
        "configuration-config",
        "configuration-messages",
        "configuration-env",
        "configuration-client-state"
      ]
    },
    {
      "type": "doc",
      "label": "FAQ",
      "id": "faq"
    },
    "documentation-overview",
    {
      "type": "category",
      "label": "HowTo",
      "items": [
        "codebase-queries"
      ]
    }
  ],
  "developerSidebar": [
    {
      "type": "category",
      "label": "Internal",
      "link": {
        "type": "generated-index",
        "title": "Internal guides",
        "description": "Autogenerated index page for internal",
        "slug": "/internal"
      },
      "items": [
        "internal/updating-global-tokens",
        "internal/importing-submodules"
      ]
    }
  ]
}