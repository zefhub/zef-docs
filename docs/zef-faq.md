---
id: zef-faq
title: Zef FAQ
---

  
  
  
## Is Zef open source?  
  
Yes! It's licensed under Apache 2.0.  
  
## Is Zef a graph database?  
  
Zef is a toolkit of modules, one of which is ZefDB, an immutable, in-memory database.  
ZefDB models data into Entities (ET), Relations (RT), and Atomic Entities (AET).  
This lends itself most naturally to a graph structure of vertices (avoiding "nodes" as it has many meanings across computing) and edges.  
  
## When seen as a database, what is Zef's consistency model?  
  
Zef has strong consistency for any graph locally (within any thread of a write head) and eventual consistency between different processes and graphs by default.  
  
## Is Zef shardable?  
  
Yes, the fundamental data model with lineage and the ability to directly relate data across graphs allows for high scalability and sharding.  
We look at sharding as a graph partitioning problem - given a large graph, along which edges can I cut to divide it into manageable chunks to minimize the ratio of inter-graph / intra-graph connections?  
  
## You mentioned ZefDB has follow a strong transactional model and guarantees. I thought only SQL/relational databases have this and ZefDB is graph-based?  
  
The (ACID <=> relational DB) correspondence is correlational, not causal or restricted by the laws of physics or information theory.  
ZefDB has transactions and resulting guarantees.  
More will be coming on this front in the future.  
  
## How can it be that I don't have to send queries to a server hosting the database?  
  
You _can_ do this with ZefDB, but often it is more convenient to have nanosecond instead of millisecond response times when building more complex applications (c.f. N+1 problem).  
Consistency and linearizability (in the distributed systems sense) are guaranteed within the ZefDB concurrency model when there is only one transactor node (be it CPU thread or server).  
As soon as transactions are accepted, these updates are sent out and distributed to all clients that are subscribed to changes on that graph.  
Since a ZefDB graph's data layout is fully contiguous in memory, this simply amounts to performing "memcpy"s across websocket connections: the new data is automatically appended to the graphs in all clients' memory.  
  
## I thought sharing state across threads or a distributed system is bad / dangerous and one should prefer communicating via messages?  
  
State and messages of updates are two different sides of the same coin.  
As in git or any event-sourced system, the concept of state is emergent and implicit by aggregating all updates.  
ZefDB graphs reify this concept at the very lowest level of bits.  
Also: sharing state is totally safe if the state is immutable or append only (blockchains are an example of such a system being resilient).  
  
## Which query language does Zef natively use?  
  
There is no separate query language!  
You query Zef like your native data structures in Python (more languages coming soon).  
Zef also contains a library of lazy operators called ZefOps, which you can compose together with "|" for queries and pipelines.  
  
## What language is Zef written in?  
  
C++ at the core and Python for many of the newer features at alpha stage.  
  
## Which languages can I use Zef with natively?  
  
Python only at the moment.  
When developing the original version of Zef, one specific goal was to simplify the development of performant applications across languages.  
We ran simulations in C++ and Julia, but built a large part of the backend infrastructure and data-heavy user-facing applications using Python and ReactiveX.  
To keep things easier for the initial stage, we made the decision to focus on Python only.  
  
Moving forward, we are planning to add C++ and Julia support and possibly additional languages (based on interest) later on.  
  
## The core principles and composition of ZefOps seems very similar to Clojure. Can I think of Zef as a data-oriented drop-in library for Python?  
  
Yes, that is a perspective one can take.  
  
---  
  
# ZefHub  
  
## What's the relationship between Zef and ZefHub?  
  
Zef is an open source, data-oriented toolkit for graph data.  
ZefHub is a real-time storage, synchronization, and distribution service for Zef graphs.  
ZefHub is a venture-backed startup and the creator and maintainer of Zef.  
  
## What can Zef and ZefHub be used for?  
  
Zef and ZefHub were designed for Python developers who want an intuitive way to work with graph data without the hassle of dealing with real-time, distributed infrastructure.  
The key differentiators are 1) versioned graphs, 2) no separate query language, 3) streams, and 4) hassle-free infra.  
It's fantastic for graph projects (digital twin, 360 data, simulations, fraud detection, recommendations) and graph backends (GraphQL).  
You can also use it without the database, to construct data streams and pipelines.  
  
## Working with Zef feels more like working with Numpy / Pandas or other with in-memory native data structures. Is it really built to be used as a database?  
  
Yes.  
We believe that these two views are not mutually exclusive.  
You can have the comfort of working with data that feels entirely local, but you can choose to persist and distribute it at any time.  
  
## Zef's data model seems very similar to RDF - is there a relation?  
  
Yes Zef's data model within any time slice can indeed be seen as semantic triples and isomorphic to RDF, but we choose to take a stronger graph-centric approach of looking at the data as nodes and relations.  
In addition, Zef has a strong model of time and full versioning of all prior states built in, which is not a part of RDF.  
  
## Zef seems like git for data, is there a relation?  
  
Zef's temporal model is very similar to git's, but more granular.  
Git was designed to deal with text files and has to infer diffs by comparing pre and post states.  
Zef's identity model is highly granular which makes the task of constructing diffs, merging, and detecting conflicts much simpler.  
  
## What's your business model?  
  
We have tiered monthly plans together with additional metered pricing.  
We will always have a free tier available on ZefHub.  
You can see more details at zefhub.io.  
