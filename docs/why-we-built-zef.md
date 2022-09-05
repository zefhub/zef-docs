---
id: why-we-built-zef
title: Why we built Zef
---

  
## The Everyday Grind of Data Management  
- data schemas changing. Migrations are tedious.  
- we spent a lot of time debugging: "how did the system get into this state?"  
  
  
  
### Our Product Required End-to-End Reactivity  
- web based app, we were working in simulations and scheduling for complex manufacturing  
- **requiring users to press refresh was a no-go** Things on the factory shop floor changing all the time. Different users and interfaces: from factory workers, resource planners, schedulers, quality departments, management.  
- Polling sucks. It breaks reactivity. Bad with expensive queries. At which frequency.  
  
  
### Almost all existing DBs did not have a model for time that we were looking for  
- most DBs we looked at were built on the core abstraction of being a big mutable state at the center of a distributed system.  
- Knowing what the state of the system was at some previous point in the past was not built into their information model. It was not part of the semantics of their query language. If needed, we would have had to design this into the schema and information model manually. This makes SQL queries even more verbose.  
  
  
### We had Extreme Performance Requirements  
Running simulations of future scenarios for manufacturers with a variety of algorithms requires accessing the latest actual state. This state was fairly complex and represented in form of a knowledge graph.  
For some customers, the algorithms we developed were just about good enough for the required simulation horizon if we distributed the compute to 1000 CPU cores (we used AWS lambda, each running for ~5 - 20seconds with a recursive fan-out to distribute the network load).  
For this duration the simulations required on the order of 1 billion reads / second, i.e. around 1M / (core * seconds).  
You may now think "well, just use a caching layer. This load should clearly not go to the DB." Or query the data once and deserialize it into local data structures.  
This is exactly what we did initially. Read on...  
  
  
### Too much Time went into Data Plumbing  
Reading the state from the DB and unpacking it into data structures native to our language was our initial approach. You would probably consider this the conventional approach.  
But this has a number of drawback:  
- you now have coupling between your DB's data model (and possibly schema) with the core data structures and the code that operates on it. Essentially you're doing the same work twice: defining your domain model for the DB as well as for your simulation data structures. This led to a whole lot of busy work. Working closely with our customers and growing the products over time meant that we had frequent data model changes. Some were [non-breaking extensions, others were breaking changes](https://youtu.be/oyLBGkS5ICk?t=1342). After spending way too much time updating the various abstraction layers in our system that depended on the data model, it was clear that this approach would not scale. This is probably the very reason why most enterprise software development is so sluggish.  
  
### What is a DB Anyway?  
So what's the way out? The first step was coming to the realization that this distinction between database and "backend server", both representing the same domain model is not of fundamental nature. We should only have to declare the data model once and the nitty gritty representation details in all other layers should be automatically derived from that (sounds like the promise of an ORM, but those lead to a whole new set of problems for systems like ours).  
  
The very concept of a database being some "service that runs in some place" is the problem. It is not fundamental to what a [database is at the core](https://wiki.c2.com/?DatabaseIsRepresenterOfFacts).   
Something being a database says nothing about the execution policy. Whether the queries are performed on the main server that does the writes, some replica or even on your local machine if the required information is available.  
  
  
### The Roots in High Performance Simulations  
ZefDB was born when we noticed that we could use the customized data structure we designed for our performant Monte Carlo Tree Search simulations as a database with some modifications.  
These data structures were designed as immutable graph data structures building on the ideas of [Phil Bagwell](http://lampwww.epfl.ch/papers/idealhashtrees.pdf) and [Rich Hickey](https://github.com/clojure/clojure/blob/c6756a8bab137128c8119add29a25b0a88509900/src/jvm/clojure/lang/PersistentVector.java), but extending them to temporal graphs.   
These reduced the memory footprint and gave a 5-10x performance boost over our previous approach using the wonderful [immer](https://github.com/arximboldi/immer) library for immutable data structures (I am not sure, but most of the gains seemed to come from reducing cache misses afaik).  
  
The original immutable temporal graph allowed simulating a large number of hypothetical futures, each with a complete event log of what happened and mechanisms efficiently calculate the derived state at any point along these trajectories. All information was stored contiguously in one large buffer / allocator. We noticed that restricting the hypothetical futures to a single trajectory reduced this data structure to a graph database with full time-travel capabilities - very similar in fundamental abstractions to Datomic, but built on the C machine's bare memory model, rather than an existing key-value store.   
  
  
### Syncing across Computational Nodes  
Since the full immutable state was stored in a contiguous block of virtual memory space and all references were implemented via [handles, not pointers](https://floooh.github.io/2018/06/17/handles-vs-pointers.html), we could copy the full state by combining `memcpy`  with websockets.  
  
  
### Queries, Data Types, Advanced Syncing, Transactions, ...  
These are all features we added in building out our V0 version of ZefDB to a database. We did not intend to focus on Zef as a product at that point, but rather built out all the features we needed to simplify and solve our everyday problems as effectively as possible.  
