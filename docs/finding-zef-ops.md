---
id: finding-zef-ops
title: Finding ZefOps
---

  
  
## Getting Details on a specific ZefOp  
```python  
yo(trim_left)  
```  
`yo` can be used across the board on various data structure, ZefOps, ValueTypes, graphs, etc. It prints a short summary.  
  
  
  
## Searching for Specific ZefOps  
  
Zef allows you to treat your codebase like a database. You can write queries in a declarative style when you're looking for things.  
  
Let's look at an example. Suppose we're looking for all operators that are part of the core Zef library that operate on Strings.  
```python  
ops | all[OperatesOn(List)] | collect  
  
# also works when there is no type for this  
ops | all[UsedFor['control flow']] | collect   
```  
`ops` is a namespace that comes with Zef and contains all commonly used operators. In these queries we always start with a general set on the left (`ops` here) and now we can search for ones that fulfill some specified attributes.  
  
  
## The `all` Query Operator  
`all` is an operator itself that acts similar to `filter`. It differs from `filter` in that it interprets the dataflow argument to the left liberally as some kind of implicit set. For instance, a namespace, a FlatGraph, a ZefDB Graph may all be interpreted as a starting set in the context of a query.  
  
  
## Queries using LogicTypes / Sets  
In queries we want to specify what we want in a declarative and composable way. In Zef Logic Types (which are ValueTypes) are used for this. They denote sets of things. We can specify each constraint on what we want using a ValueType.  
  
  
## Defining Custom LogicTypes  
`OperatesOn` is a function that returns a value of type `ValueType`.  
The details of which set of things it defines for some given input arguments are encapsulated inside the function body. Anything you can express via a predicate function `my_predicate`, you can directly wrap as a Logic Type using `Is[my_predicate]`.  
  
`OperatesOn` is a predefined function that is aware of the structure used in ZefOp's docstrings. `OperatesOn(List)`  denotes the set of all ZefOps which are tagged to act on the type `List`.  
  
Further examples of queries:  
```python  
ops | all[OperatesOn(List) & UsedFor("control flow")] | collect  
ops | all[OperatesOn(Stream) & UsedFor("string manipulation")] | collect  
ops | all[UsedFor("string manipulation") & ~OperatesOn(String)] | collect  
ops | all[RelatedOps(filter)] | collect  
```  
  
