---
id: what-zef-db-enables
title: What ZefDB Enables
---

  
  
  
# What ZefDB Enables  
Or: "Some of the problems that are created by "typical" databases and resulting architectures"  
  
mostly a summarization of Rich Hickey's talk [Deconstructing the Database](https://youtu.be/Cym4TZwTCNU)  
  
  
### Zef's Data Model is Declarative  
building systems with most DBs that are "some instance / process running somewhere", we need to constantly direct the dataflow  
- get data from the DB via some query  
- convert it to a native local data structure (deserializati)  
- Operate on the data / transformation and computation  
- do some side effect on the world (e.g. write to a database, send a message, etc.)  
  
Sandwich layer: the first and final step are always impure. They interact with the world.  
Reading from a database is usually also a side effect. It has to be if the database is based on mutation of global state at the systems level. Sending and receiving messages (queries / responses) outside of the local process' boundary are also impure. They may fail.  
  
But: Reading from a database does not have to be an impure operation. Not if   
- the DB has value semantics  
- represents immutable data  
- does not require a network round trip in the query-response pattern  
- is reproducible  
  
The goal is to make the distribution of and coordination of live data an orthogonal concept to operating on the information in our business logic. You can think of a graph slice (the state of the DB at a given point in time) as a value you can operate on locally. It is simply an immutable value.   
- no need for coordination (the data can't change if you operate within a graph slice once it is accessible)  
- no need for coordination in your business logic  
- no need for serialization or deserialization  
  
All of this makes operating on data in ZefDB more declarative. You can just assume the facts to be there and are not required to say how the dataflow, locking, ensuring consistency is to be done.  
  
  
  
  
### Composite Decisions  
- if the DB mutates, we are afraid of round trips  
- build up ever more complex queries to execute within one consistent state of the DB, but expressing complex logic within SQL does not scale well  
- we may want to match more advanced algos (e.g. data nalytics, aggregation, ML, graph algorithms) for which DBs don't have support  
  
  
  
### Common Basis  
"What is the Data Basis?"  
  
  
  
  
### Data is "Over There"  
  
  
### Better at Data than OO  
how does this compare to Distributed Objects?  
  
  
  
### Information & Time  
- we want to store information, not mutate state  
- Information is based on facts. Facts are about things that happened they don't change  
- A decent information model must deal with time  
- adding time stamp fields manually about when facts are recorded signals the lack of an appropriate tool for the problem at hand  
- Most DBs are built on an update-in-place model, not an information model  
  
  
  
### Reactive Systems  
- polling breaks the pattern  
- most DBs are based on query-response. This is at odds with event-driven reactive system design  
- we also typically have consistency requirements in reactive systems. This is harder since time and different reference frames need to be accounted for in a distributed system  
  
  
### Separate the Integration of Novelty from the Read System  
- enterprisey term: CQRS  
- two very different things, no reason not to separate them in a DB. Those are also separated in other useful data structures, e.g. Ints (immutable), immutable strings, immutable tuples, immutable data structures  
  
  
### Communication with a Traditional Database  
- Strings: you send queries over  
- responses are also strings  
- foreign language  
  
  
  
### Relational Algebra  
- applies to within each state of the DB  
- "update" is not part of the relational algebra. More: "a miracle occurs" and now you have a new model.  
- Relational algebra does **not** apply between the models (DB state)  
- Process and change is not part of the SQL language. Leaves a lot of potential on the table  
  
  
  
  
  
  
  
Rich Hickey says: leveraging of the database comes from the query engine and indexing. Having sorted views of things  
- why are we calling key-value stores nowadays? We didn't call file systems databases?  
  
  
  
### What Datomic Does  
- move to information model  
- separate process from reads / perception  
- immutable basis in storage  
  
  
  
### Transactions  
- first class citizens of both a Graph and a Graph Slice  
- additional information can be linked up: e.g.   
	- timestamp: when did this occur (automatically added)  
	- who caused the transaction  
	- which process was this sent from	  
	- has it been audited  
- Accretion of facts over time. Like the stem of a tree that grows by adding rings to the outside. The inside remains unchanged.  
  
  
### Write Scalability  
"If you want arbitrary write scalability, you will have to give up transactions and queries." - Rich Hickey https://youtu.be/Cym4TZwTCNU?t=3436