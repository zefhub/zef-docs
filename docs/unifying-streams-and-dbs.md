---
id: unifying-streams-and-dbs
title: Unifying Streams and DBs
---

  
  
![](49c38400f1171495ec1794a7de06a3523483b00233f74d1a5eed4303c6177059.png)  
  
  
### States  
GraphSlices act as states in Zef. You get all the power of the relational model you are used to from tabular (aka SQL) databases.  
1. the ability to query your data independent of the representation form  
2. add powerful schemas optionally at any point  
3. much higher performance on joins than in relational DBs (graph representation)  
  
  
  
### Streams  
One of the best ways to build truly reactive systems is by using event driven architectures. Using the PubSub pattern (aka observer pattern) avoids you taking the path to callback hell.   
Thinking of your system as a system of streams that transform data in predictable ways along data pipelines is an approach that works both in the small  as well as in the large.  
  
- **In the small**: e.g. ReactiveX in various languages or modern languages like Dart with Flutter have this built in at the core  
- **In the large**: e.g. Apache Kafka, AWS SQS, ...  
  
Often such streams propagate events through the system. Following this data streaming approach with declarative transformations is often a superior approach than operating on the streams imperatively, since the underlying system can help you avoid race conditions and many other sneaky bugs crawling in at the interfaces of your systems.  
  
However, although it has become common to even persist the data flowing through streams indefinitely (e.g. in Kafka), the same data is typically still stored in a database. The latter provide more flexibility in superior querying capabilities than Kafka does.  
  
  
  
### Aggregation over events = State  
One common architecture is that events propagate through streams (i.e. event streams). The state at any point in time can be defined as the aggregate of all changes applied in sequence to some initial state.  
  
![](f36c6e7df20cbcc2660f6aa8782ec136e5964c0d05fe356ea1d5c6fadf721979.png)  
Transactions a reified ([[ZefDoc - Graph Instruction |graph instruction]]) events.  
  
It is common to persist this aggregate state in one or multiple databases. Which databases and the data model is chosen based on requirements of how the data will be queried.  
  
  
### Events = Diffs of States  
This is simply the flip side of the coin. Given any two states with atoms (that have identity) and values, one can look at the difference of states and express this in terms of elementary changes on the graph.  
This procedure can also be fully automated and is given by the ZefOp called `diff`.   
  
  
  
### Intellectual Foundation  
Fundamentally, it is important to note that all of this is the same data! In the (possibly persisted) stream and any of the aggregating DBs.   
Apache Kafka calls the fundamental equivalence of the the events in streams the "[Stream-Table](https://www.confluent.io/blog/kafka-streams-tables-part-1-event-streaming/) Duality". The same fundamental concept can be found the writings of [Whitehead](https://plato.stanford.edu/entries/process-philosophy/) and [Deleuze](https://plato.stanford.edu/entries/deleuze/#PhilDiff).  
  
  
### Cut the Boilerplate  
Tables are great in many cases. But in Zef we take the view that not all data is always best viewed as a table. In particular, displaying data as a table is a **view** and should not necessarily be coupled to the concrete representation on disk.  
  
- How are DBs and streams typically connected in today's systems? Through imperative code in some service.  
- Where does this transformation occur? In some service running, listening to events and performing the writes.  
- How is consistency between the different representations of the same data achieved? By hoping that the developers writing this service did not makes any mistakes 🤞.  
- What happens when the data model changes? Updates need to be done on all fronts: the code, the database schemas. These changes often need to be coordinated across teams and services.  
  
  
### How can Zef Help?  
With Zef this duality of streaming and state represented in a relational manner is absorbed at the very core by the data model. There is no need to use and glue together these multiple systems.  
Since a ZefDB graphs schema ties directly into the Zef type system, consistency and type checking can even be guaranteed across system boundaries!  
  
  
### A Graph of Streams vs a Stream of Graphs  
  
  
  
  
### Further Material and References  
- [Alfred North Whitehead: The Philosophy of Organism](https://socialecologies.wordpress.com/2012/10/11/alfred-north-whitehead-the-philosophy-of-organization/)  
  
