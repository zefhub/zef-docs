---
id: glossary
title: Glossary
---

  
  
### AET  
Attribute Entity Type  
  
---  
  
### Atom  
The elementary building blocks that can appear in a DBState. One of  
- Entity instance  
- Attribute Entity instance  
- Relation instance  
- TX instance  
- DB/Graph Root Node (this terminology applies to FlatGraph and DBs)  
Also: Blueprints of the first three above.  
As a type:  
`Atom = ET | AET | RT | TX | RootNode`  
  
---  
  
### Attribute Entity (AE)  
A special type of Atom which has an identity (like an entity), but values can be assigned to it over time (a reified and persisted stream of values). From the graph perspective of ZefDB, an AE can is one kind of node on the graph. It differs from a Stream in two ways:  
- the data (values assigned at different times) is persisted  
- different DBs can have their independent representation of the same logical AE and are free to assign different values from their reference frames.  
  
---  
  
### Blueprint  
  
---  
  
### DB  
an instance of a ZefDB. This is the accumulating data structure over time, i.e. the eternal graph of knowledge that only ever grows.  
Formerly known as "Graph".  
  
---  
  
### DBState  
The state of a ZefDB at a particular time (determined by the transactor and their clock). A state is determined by   
- structural component (which atoms exist and how they are connected)  
- assignment of values to AEs  
  
  
---  
  
### DB Changes  
A set of changes expressed in the form of a List that are to be applied as a write to a DB. The changes themselves are pure data with value semantics.  
  
---  
  
### Entity  
  
---  
  
### Error  
In addition to the use of exceptions, Zef introduces "Error" as a ValueType to deal with errors in your programs control flow. In contrast to exception, Errors are pure data (with value semantics) that can be sent over the network and hook into the type system. They are particularly useful in distributed systems and asynchronous code.  
  
---  
  
### ET  
Entity Type  
  
---  
  
### Graph  
Formerly known as "FlatGraph".  
An immutable data structure. In contrast to a DB, this has no concept of time and is a pure value. It is immutable: once fixed, it cannot ever change (on a logical level. Below the hood if the runtime can prove that nobody can see the incoming graph, this may mutate it for performance reasons.)  
There is a strong similarity between Graphs and DBStates: both can be seen to represent a graph as a value. The semantics of Zef are chosen that, where possible, the same operations (ZefOps) can be used on both these structures with the analogous effects.  
Reference types to atoms: GraphRef (formerly FlatRef)  
  
---  
  
### Instructions  
alternative: "changes"?  
The set/list of changes that go into `transact` or into a FlatGraph.  
These can be classified into different (semantic) levels of instructions: L1 and L2 instructions. L1 are of the most explicit form where all verifications etc. have been performed.  
  
---  
  
### ReactiveZ  
A module in the Zef library that allows you to easily build end-to-end reactive real-time systems based on a data streaming (pub-sub) paradigm. It can be used in the small (in your local process like ReactiveX) or in the large in a distributed system, like Apache Kafka. The same syntax of ZefOps can be used for both, i.e. it decouples the syntax of ReactiveZ code from the implementation and runtime context.   
  
---  
  
### Reference  
The union of the concrete references:  
`Rerefence = ZefRef | EZefRef | Ref | GraphRef`  
  
---  
  
### Reference Frame  
Each computational thread (aka actor) has its own view of valid facts of the world. Zef is built on the paradigm of non-blocking (no locks!) computational units (actors) communicating via   
1. message passing  
2. shared immutable state  
The reference frame of a DB is a combination of the DB's identity and the state (e.g. time slice index of the state's preceding transaction)  
  
---  
  
### Relation  
  
  
---  
  
### State Delta  
A set of concrete changes between any two DBStates or Graphs. This is always expressible as a Set of one of the change wrapper types `Instantiated(z1), Terminated(z2), Assigned(z3, from=13, to=42)`.  
  
---  
  
### Transaction  
  
---  
  
### Transactor  
The thread / "actor" in charge of writing to a DB. At any given time there may be at most one transactor. In strong consistency mode, this requirement is true on the level of the entire Zef network. Any instructions to write to the DB are added to a the transactor's queue and processed sequentially.  
  
---  
  
### Wish  
A ValueType that represents the intent to perform a side effect. This is the data structure used to communicate intent to Zef's effect system (ZefFX). In other communities wishes are also known as  
- actions: React/JS/...  
- commands: Elm  
- effect: Scala / Zio/ ...  
We chose this term based on the naming Bret Victor uses in his system, since it is less overloaded in the developer world and reflects the nature of the data structure well: it is not guaranteed to be executed. Rather it is the representation of an **intent** the user wishes to perform in form of a typed data structure.  
  
---  
  
### ZefFX  
A part of Zef that allows you to deal with side effects and managing resources in a controlled and systematic way. Using ZefFX, you get massively improved visibility of what over your running system. It also provides a set of foundational tools that make  resource safety along with tools for visibility, concurrency, and parallelism.  
  
---  
  
### ZefOp  
An operator in Zef. They are the fundamental, highly composable building blocks that allow you to write succinct, expressive and performant code. ZefOps are pure data (they are a uid with a thin wrapper that can be sent across the network) which are decoupled from the implementation of the operator.  
