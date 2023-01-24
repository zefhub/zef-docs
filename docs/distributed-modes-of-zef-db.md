---
id: distributed-modes-of-zef-db
title: Distributed Modes of ZefDB
---

  
  
### Can I run ZefDB in Distributed Mode?  
Yes, having mechanisms built into the core of ZefDB to deal with network outages and delays is definitely one of the core requirements which we're designing the data model around. Two cases where this practically appears are:  
- running a distributed database / backend service: all nodes are part of your system  
- building distributed applications where ZefDB is used both by the user and your backend  
  
There are always two fundamental approaches you can take:  
1. use a single DB which is replicated across these nodes: either fully or partially (in future)  
2. use "different" DB instances on the various nodes and stream the (possibly partial) updates across these DBs  
  
Ultimately the question of whether one wants to work off the same DB, shard a DB or create new DB instances and merge the information across these should always come down to the same question: what is it I want to achieve?  
If a node may become disconnected and should continue to be able to write locally, this seems like a good reason to create a new instance of a local DB and just merge the information across.  
  
On the level of what is a single vs a distributed DB: this becomes a naming question.  
We call them "different DBs", but one could also think of it as one large DB where meta-info to who knew what when etc. is attached to each fact. There is no difference and its question of interpretation and definitions.  
  
Just as a matter of defining what we mean with certain names in Zef:  
- a DB ever has only one transactor. This is the process that gets the full authority to decide on what is written (i.e. what the state is).  
- Every DB has an identity represented by its UID  
  
One could think of partial synchronization of a DB, but this is a bit further out and is not trivial for different reason.  
- thinking of using this in the browser or on "the edge" with WASM: the WASM machine's memory model is 32bit only (there are ways to extend this)  
- having proper security and not syncing information surprisingly is of high importance in the fundamental design  
  
Dealing with any conflicts here is very much like in Git: the user gets to decide on the merge policy  
- last writer wins  
- more information will be easy to access in Zef: which local state were the different parties aware of when they made their change (Lamport logic or other vector clocks are a simple data structure that is often used here)? This is a pretty common strategy used in more advanced distributed systems.  
