---
id: overview-types
title: Overview of Zef's Type System
---

  
Zef's type system is based on set theory.  
  
  
  
## 🍡 Types as Sets 🍡  
  
## 🫧  Expressing Sub-Types ⁉ 🫧  
Certain types in Zef allow you to conveniently express sub-types, giving you an expressive and succinct language for pattern matching, validation, etc.  
See the basic [How-To Specify Subtypes](specifying-sub-types) for an overview.  
  
  
  
## ✅ Using Types for Data Validation ✅  
Validating data at the boundaries of your system is an essential part when building robust software.  
The Zef type system allows you to hoist this logic out of the function body into the type level of your program.  
This has two advantages:  
1. more declarative: separate the assumptions on your from the "what" your function is doing  
2. Expressing constraints and validation logic for your data is more declarative and composable when expressed as types  
3. the Zef logical type checker can hook into the type declarations and prove certain facts along your data pipelines to be true at compile time independent of the concrete values flowing through at run time.  
  
To get started with using the Zef type system for data validation, check out this tutorial  
  
  
  
## 🧩 Pattern Matching 🧩  
  
  
  
## 📚 Using Types to Express DB Schemas 📚  
  
  
## 🦘 Robust Communication Across Boundaries 🦘  
  
  
  
  
## 🐍 A Type System for Python 🐍  
  
Python is dynamically typed and optional type hints have been added. Type checkers like MyPy exist and can type check parts of code ahead of time, but they do not tie into the Python runtime and help you if something goes wrong.  
Learn more about how the Zef type system is different and integrates into your running program at various points.  
  
  
## ⚡️Speeding up Code at Compile Time ⚡️  
  
  
## 🥇 Types as First Class Values 🥇  
  
  
## 🔍 Types as Queries 🔍  
  
Declarative queries are about constraints: you specify the conditions for the results you are looking for and the database returns instances which fulfill the constraints.  
Set-Theoretic Types are about constraints as well: a type can be seen as a set of constraints applied to the set of all possible values, leading to the type/set of interest.  
  
Learn more about how Zef combines these two concepts and allows you to express complex queries directly via the type system directly from within Python! More succinct and more composable than SQL.  
  
  
## 🚦 Predicate Dispatch for Python 🚦  
  
  
  
## 🙌 Exhaustiveness Checking 🙌  
  
  
## 🎙️ A Conversation with Your Compiler 🎙️  
  
  
  
  
