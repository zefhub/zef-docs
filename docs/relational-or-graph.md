---
id: relational-or-graph
title: Relational or Graph
---

  
![](b47c94cee4e76cd0d9a005f3d4f15cd63dad13040577c81b71cac6f2328add6b.png)  
  
Is ZefDB a relational or a graph DB? This is a question we often hear.  
  
The answer to this question is more complicated, since different people and communities use terms somewhat differently.  
  
### Is ZefDB based on the Relational Model  
Yes.  
The relational model was introduced and defined by Codd  
Although it does not save the data in row-based or column-based tabluar form (the data layout is kept as an open degree of freedom that can be optimized over based on query patterns), the precise storage form is an implementation detail. One of Codd's main points in defining the relational model  
1. data and connections between domain entities should be represented relationally, i.e. not be implicitly encoded in a data structure (such as an object store)  
2. The data should be queriable and efficiently accessible from query patterns that are not known at the time when the schema is defined or the data is inserted. ZefDB has advantages in this respect over tabular databases here: for queries with multiple joins the graph-structure is significantly more performant than actually performing joins. Why? These are simply graph traversals. In this respect one could argue that ZefDB comes closer to the ideals formulated in relational model than most tabular and SQL-based DBs.  
3. Data should ideally be represented in denormalized form, ideally third normal form or higher. In Zef this naturally corresponds to the representation in terms of very granular entities, attribute entities and  relations.  
  
  
### Does ZefDB use a Schema?  
It allows you to add schemas.  
By default it starts off in dynamic schema mode, where a blueprint of all data is built up automatically as you add the data.  
You can lock in and enforce these constraints at any time.  
  
  
### A Different Kind of Schema  
Schemas in ZefDB graphs are more powerful than in most contemporary relational DBs. In the latter, you simply describe a set of tables and describe the name and data type for each column. With ZefDB you can encode much kore complex and non-local constraints and invariants into the schema.   
Anything you can express as a predicate function can be added to the schema.   
  
  
### How is the data represented?  
In an unconventional form. As an eternal meta-graph describing changes over time in a way that emergent states (GraphSlices) can be queried very efficiently.  
  
  
### Is ZefDB built upon some existing DB as an underlying Storage Layer?  
No. It is built on the memory model of the C machine.   
  
