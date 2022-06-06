---
id: general-explanations
title: General Understanding
sidebar_label: General
---

The reason for this single page: many small points that are inter-connected and giving each a separate page would clutter the hierarchical menu. If an individual topic of discussion becomes sufficiently long, it should be moved to a separate page.


## Ephermeral vs Eternal Data
abc

---

## Choose your Model of Time Wisely
You may not be aware that your model for time is a choice you have.


(Common) Approach A:


Approach B:



---

## Information Systems are about Facts
By definition https://www.merriam-webster.com/dictionary/information

---

## Facts accrete
Facts don't change.
I have often heard that one should just "Ask your accountant" on how to deal with valuable critical data. They have a lot of experience with dealing with trying to resolve inconsistencies and the value of not mutating data. Essentially, the accounting tradition has invented "event sourcing" way before it was cool.

---



## Time is not Absolute
This is not only true in physics at large scales, but the very same concepts carry over to distributed computational systems. Leslie Lamport received the Turing award for this insight. This is not some esoteric fact, but is also used by accomplished teams at the very foundation (e.g. at AWS) every day. 
Once you give up on the existence of absolute time across different services / CPU cores or general computational nodes, a whole lot of things become a lot easier.
Ask not "what is the value of this now?" or "what was the value of this field at this time?", but rather `"seen from the perspective of A at A's time t, what was the value of X?"`.
This may seem like an unusual way to think and program, especially when not having worked with distributed systems, but it inherently avoids a large class of problems by design.
Erlang and Elixir users can attest to this, since message passing is just a consequence or variant of this.

It is also a great help at a smaller scale in writing multithreaded programs: passing information between functions and processes by value, possibly via queues (or channels in Golang or other CSP implementations), is a much better way than sharing mutable state across threads. 

Sharing immutable state across processes is totally fine though and that is what zefDB enables you to do easily. Just make sure to use zef pure functions, that either remain within a fixed time slice of the graph or look at the past. e.g. the `now` zefop makes a function zef impure.

---

## Modelling the Real World in Terms of Objects / Structs Scales Poorly
...

---

## Using Value has Value


---

## Choose the Right Value Type

This sounds trivial at first sight, but that is not what we mean. Clearly you should not represent a Float as a String or an Int as a Float (looking at you, JS).

Rather the temporal aspect. Many things modeled as traditional 

---

## Simple vs Easy
This is just a summary of Rich Hickey's well known talk [Simple Made Easy](https://www.youtube.com/watch?v=oytL881p-nQ). It's solid advice for an ever increasing problem.

Easy is subjective to the author of the system. Easy is the thing that requires less effort. It depends on prior experience, the availability of existing tools. It may be very easy to use an existing, but very complex tool (yeah - just use this Java Corba library for that distributed systems problem and you'll be up and running in 10 minutes!). 


Simplicity is about the structure of the solution to solve a certain problem. It has nothing to do with the author. It has to do with the lack of unnecessary complection. It is an extremely hard / impossible task to prove that a solution to some non-trivial task is the easiest. Maybe you're lacking the perspective and language to efficiently represent your problem that someone 200 years from now will have.
As a measure for simplicty: think of the Kolmogorov complexity / entropy of the solution expressed in a set of useful DSLs (abstraction layers) for the problem. This measure is clearly not exact if we optimize for conceptual clarity and human understanding. It is useful though to see simplicity as the total amount of non-leaky abstractions and their inter-dependencies.

Sometimes simple solutions are easy, but more often than not they are hard.
Creating a big entangled hairball of a system to solve a problem may be the easiest way today. This seems to be socially accepted in developer circles: "You just wanted to build a basic web app in react and after initialization your project depends on >1000 JS libraries and contains dozens of known vulnerabilities." There's a bright future ahead of the cybersecurity sector.

---

## Zef Pure Functions

The concept of referentially transparent / pure functions is one of the core principles of functional programming. Working with pure functions has many advantages in terms of composition and the ability to reason about program correctness. There are many excellent resources on this topic, which we do not wish to even summarize here, but rather discuss an extension/specialization of this concept when working with zefDB graphs.

Fundamentally, a pure function always returns the same result when called with the same arguments. Function calls follow value-based semantics. This forbids the function to maintain any internal state that affects the output (e.g. a random number generator taking no arguments is not allowed, caching of previously computed values is allowed) as well as any IO operation (network API calls, reading from the keyboard, queries from a mutable database, ...).

So far there's nothing new. So what about functions that take an eternal graph as an argument. The full eternal graph follows value semantics, so one can clearly argue that if the graph doesn't change, a pure function will return the same result. Obviously.

So what about a function that takes a ZefRef to some entity living in the timeslice of a graph? Firstly, does this even follow value semantics if the argument is a reference? Yes, if the underlying data structure is immutable, it does. One could also see the function as taking two arguments: the ZefRef can be replaced by the (rae uid, tx uid) and the full eternal graph is also passed in as the full state. Again, it is fully clear that if one were to call such a pure function with the same ZefRef and the same eternal graph, it will give the same result. But we can actually make a stronger claim in this specific case. zefDB graphs change in very specific ways: data / facts are only appended, nothing is ever overwritten. If you have a list that you only append to (the eternal graph) and you have a pure function that can access all elements in that list that lie before a certain pointer to some element in that list (the point is passed in as an argument to that function as well), then you can rigorously state that for this class of functions the result will not change, *EVEN* if you append new data to the list. Note that this is a stronger requirement on the function than just purity: it is not allowed to peek ahead. The pointer to the list element is simply the tx that contains the reference frame and the 'peeking ahead' is looking into the future. This is the concept that we call 'zef purity'. Functions that if you call them tomorrow will return the same result as today and the zef language makes it easy to pass in the reference frame: it is automatically contained in any ZefRef(s). 
You cannot know the facts that will accrete tomorrow today, but you can know the facts that accreted today tomorrow when using zefDB. 

This simply reflects the inherent asymmetry of experienced time. The property of not being able to peek into the future appears in relativistic physics as two points in space-time with space-like separation. zef pure functions compose: functions using exclusively other zef pure functions are again zef pure. But if any function downstream is not zef pure (peeks into the future) it breaks the zef purity of all other functions relying on it. In summary, zef pure functions follow transitive composition laws, isomorphic to the composition emerging for retarded [Green's functions / propagators in relativistic field theories](https://en.wikipedia.org/wiki/Propagator#Retarded_propagator).

All of this is nothing new to distributed systems. Leslie Lamport was awarded the Turing award for his work on demonstrating the [fundamental equivalence of distributed systems and the theory of relativity](http://lamport.azurewebsites.net/pubs/time-clocks.pdf). This is also useful for the real world: the critical systems of your cloud provider of choice are built upon these abstractions.

 The same fundamental issues even arise in the coordination of multi-threaded programs, especially when running concurrently on multiple processors. The [CSP](https://en.wikipedia.org/wiki/Communicating_sequential_processes) paradigm can also be seen as a set of architectural choices to consistently deal with issues arising from these fundamental principles.

 Stephen Wolfram has started using the term "reference frame programming" for this (call me out if I am misattributing this) and has some [insightful discussion on this](https://www.infoq.com/podcasts/wolfram-language-mathematica/) (see the "21:45 How do reference frames help with the problem of distributed computing?" section).

zefDB simply aims to make this easy and accessible as a library. It does so by providing useful primitives that make it easy to write zef pure functions by baking the reference frame into the core data structures: It is not meaningful to ask "what was the state of *x* at 14:32 today". In a distributed system, one avoids many problems by a slight reformulation: "Seen from the perspective / reference frame Y at its time t, what was the value of *x*." Here *Y* could be  service / CPU core / compute node / database / mars rover / ... Giving up on the absoluteness of time is not that hard, just think of what you would do when debugging by going through database logs. Then treat everything as a database log. Differences in the perception of time may come from clock skew, physical distance, network lag, dropping of messages, outage of services or any combination thereof. Each individual unit of computation carries along its own clock and at some sufficiently low level, computations are performed sequentially. Unless you go down to the level where causality itself is an emergent phenomenon, but let's be pragmatic for now.





---


## Why we Prefer Reference Frames over Time Slices



---


## By Default or when in Doubt, PubSub is the Better Choice than Polling
This is here as an opinionated statement of principle.
Hopefully, this is evident when designing any moderately complex system.

Slight reformulation: a push-based system (observer pattern) scales better with growing system complexity than a pull-based (callback / query based) system. This may not be obvious if one starts off with a very simple scenario where callbacks seem to do the job just as well.

Of course there may be exceptions: Sometimes one cannot rely on the service emitting an event if it goes down, e.g. the power is cut. In this case it may be a good idea to work with a heartbeat and poll this. Whether this design truly falls under 'polling' may be up for debate.


---


## Process Philosophy is Underappreciated in Software engineering

---

## How does Z Compose
Should be one of the very first questions when designing Z.


---

## Composition is Easier than Decomposition


---

## The Tyranny of Hierarchies
Kenneth Stanley's thoughts on "The tyranny of objectives" was one 


## Prefer Immutable Data Structures by Default
Speaking from my own personal experience, I can say that the advantages of programming in this unconventional way can only be appreciated after having worked with mutating objects and structs for many years before and experiencing all the pain this causes. The fact that a large part of this pain is self-inflicted by the choice of paradigm and data model, was not clear to me at the time. Most code that I saw did it this way and I never even asked the question whether there was an alternative to modeling some part of the world and their change over time in terms of bits changing for the respective objects. This is especially true when having to think about multiple threads, possibly running on multiple cores or distributed systems.

"Eventually, with mutable objects you create an intractable mess. And encapsulation does not get rid of that. Encapsulation only means: 'well, I'm in charge of this mess.'" - RH

With the benefit of hindsight, I can only recommend to others to become aware of this being a choice and explore different ways of doing it.
I don't think we have reached the end of the road in how this is best done. One sector strongly driven by managing the complexity of massive code bases and with high performance demands is the game industry. Here one also sees a trend of moving away from OO towards alternative architectures and paradigms, such as ECS systems and a [more functional approach](https://www.gamasutra.com/view/news/169296/Indepth_Functional_programming_in_C.php).


--

--
## Absence of Graphs
This question never occurred to me. But now that we have been using graphs to model our domain and build everything as a thin functional layer on top of this sea of facts, it is hard to unsee. If graphs are so useful for modelling complex domains, especially if the entire scope of the project is not clear at the start, why are they not one of the core data structures in most (all?) programming languages? There are arrays, there are hashmaps, there are tuples. Why is there no "std::graph" in the C++ stl? 
Sure, you can model any graph as a hashmap or a list of semantic triples (e.g. Datomic). But you need to build your own little toolset of utility functions or interface to work with the graph naturally. This is not quite as severe, but similar to that fact that you can represent any hashmap as a string (e.g. in serialized form).

I do not have an answer to this question. Probably this is because I adopted an unusual programming style over the last year or two. Much inspired by Clojure. I think there is an enormous amount to be gained by taking Rich Hickey's advice literally: "It's just data". Structuring your application in a way that all of the business logic in terms of composable functions that transform data into data is the best way I have seen far to keep the artificial complexity of a non-trivial, evolving system at bay. 


This is one of core principles of Clojure and preached by Rich Hickey. In my opinion, it is hard to overstate the importance of this idea in everyday programming. One only appreciates the importance once one has experienced the alternative for a sufficiently complex system, which is not self-evident.

I think this is one of the reasons that microservices and lambda functions have become so popular. It exposes programmers who work with mutating objects and large amounts of system state every day to see that it's just data. The typical REST / GraphQL / GRPC /... interfaces for you to convert your hairball into plain data from time to time. And you can reason about the subsystems.

No question that microservices can be a good choice for a problem. But if your main problem you're solving by creating your 42nd microservice is mutating state (you may not be aware that this is the reason your undiscovered inner functional alter ego is nudging you there), you can have the same benefits at the scale of your program. Just stop mutating data and minimize the impedance mismatch of your program structure (transformation pipelines) with the problem you're solving.

---

## It's Just Data


## Why don't we just use Clojure and Datomic
Happenstance. Also the ecosystem for machine learning, simulations, numerics is more developed in Python / C++ / Julia / ...
One of the reason we built zefDB is that we were envious of the results the Clojure community obtained with their tooling. Although the tools for using a functional style may not be as great in Python or C++ as they are in other languages, there is nobody forcing you to mutate your data. There is no problem in using a more value semantics based approach in most of your code. With the introduction of ranges in C++, this clearly also seems to be the direction it is moving into.

---

## Getting out of the Weeds
Rich Hickey also rightly points out that programming in most non-functional languages is like dealing with little imperative machines that mutate zeros and ones. My subjetive impression agrees with this observation: pick a random snippet of C++ from somewhere and it's likely that there is a fair bit of state mutation going on in most of the codebase. Be it by using OO patterns or imperative patterns. Although this is considered the "idiomatic" C++ style by many, this is by no means required: you can perfectly well write referentially transparent functions. With libraries like immer or pyrsistent one can also use immutable data structure and prevent unnecessary copying once if size and performance are a concern.

When adopting this style in C++, there are two diametrically opposite layers where mutation is required: 
- at the very top layer where side effects are to be executed: even functional programs, if they are to be useful, need to communicate with the outside world. Be that by drawing pixels on a screen, sending a message down a network connection etc. 
- at the bottom of the stack: all programs lead to the physical mutation of transistors in RAM etc. This is the main part for which zefDB tries to provide a useful, general purpose layer of data structures and interface function, that one can work in a higher level style henceforth and focus on solving the actual problem at hand effectively. It tries to get you out of the weeds of dealing with the "little machines that do stuff to the actual memory" and provide a set of meaningful, reusable abstractions to the layers above.

---

## Single Source of Truth

---

## Data as an API

---

## Separate Data from Compute
"When you combine two pieces of data, you get data. When you combine two machines, you get trouble."
Rich Hickey

"OO conflates process constructs and information constructs."

---

## State Observation should be Permissionless
i.e. require no coordination.

---
## Bring the User close to the Data
make it easy to explore, visualize, compare, dig in at any point during development. Make the feedback cycle as tight, fast and easy as possible to elevate productivity. Seeing and interacting are key to learning and understanding a problem.

---

## zefDB & Lisp

After getting used to working with zefops, their concatenation and piping for a while, we couldn't help but notice a inherently higher composability as compared to more traditional imperative and object oriented code. Digging into language design and their compositional properties, one immediately stumbles upon expression-based vs statement based programs and Lisps. The former are generally more  composable. As long as one is working with pure functions and expressions, substitution can be used for refactoring and composition. One does not need to think about program state. Less complection, even if the style seems somewhat less familiar to our hunter gatherer brain that continuously feels the impulse to do stuff to the world.

We wouldn't go as far as to claim that zef (as a DSL) is a Lisp, but they definitely share some properties. This is easiest to show with some examples.
```[1,2,3,4] | last``` vs ```(last 1 2 3 4)```

```[1,2,3,4,5,6] | filter[is_odd]``` vs ```(filter is_odd [1 2 3 4 5 6])```

- zef uses a concatenative programming approach that places the visual focus more on the flow and transformation of data along a pipeline. Other function arguments / parameters are curried in via `[]`. If this were expressed in form of regular functions, the "main data" (sometimes this is somewhat subjective) corresponding to the first function argument is treated somewhat differently, in that it can be piped.
- zef used prefix notation (for all but the first argument), whereas Lisp uses infix notation.
- both are nestable and substitutable.
- when working in terms of zefops: zefops are just data on a graph. Also somewhat Lispy, but based on graphs rather than lists are core data structures. If "Lisp" stand for "List Processor", maybe one could refer to zef as a "Graph Processor", i.e. a "GraPr"?

--

## Type Systems are Great for Some Problems - but not for All

---

## Why GraphQL if You Don't talk in Graphs, but Trees

---

## Is Appending Data a Mutation?

---

## Einstein vs Popper

---

## Zef Preference
Data > Functions > Metaprogramming



---


## Zoology of State Changes
Value changes and structural changes.

---

## Do Graphs have the Highest Degree of Closure
"Closure" in the group theoretic, not programming.
Many data structures are nestable. One can have a list of lists. A hashmap containing hashmaps. Clearly, one can also have a graph with its nodes being other graphs.

But I think there is something special about graphs, although I am not sure about this yet. This is very much wip and constructive input is welcome.

There are many ways to combine graphs. Simple addition of graphs, i.e. laying them out next to each other and simply combining the new graph to contain the union of elements of the individual graphs (the graph Laplacians transform as the direct sums). Kronecker graphs (the Laplacians transform as the direct product). It is under this transformation of composition and flattening where graphs behave differently from e.g. hashmaps and form a closed group.

The reason I arrived at this question is that once I started using graphs for modeling complex domains / systems, I never had the hard requirement for a different data structure anymore. Sure, one may still choose to represent things in other data structure, be it for efficiency, simplicity or structureal guarantees and conveying meaning. But I never needed another data structure because a graph wasn't powerful enough. This is where I noticed a difference to any other data structure I have used previously, where often one had to switch to a different data structure, due to an impedance mismatch with the inherent structure of the core data one is trying to represent.

Having a dynamically versioned graph, i.e. a zef graph, just adds one layer of icing on top. It inherently contains an epochal time model / event sourcing and the structure of distributed Lamport logical clocks when using multiple graphs.

---

## It is Important not to Conflate Names and Entities

---

## Hierarchical Domain Modeling is in the Eye of the Beholder



---



## Invariants are your Friend
Values are not always enough for managing identity. If you have an entry about Ninja's dog "Rufus" in your database, how do you distinguish it from all other dogs called "Rufus" in your system. Often through additional constraints, i.e. context. It would be very useful to have a direct way no name this very dog unambiguously when programs communicate amongst each other. Also somethings that can be communicated clearly across the wire. It is nothing new, that this is the problems that uuids or uids solve. They are the names that machines give to things in the system. In contrast to human names, they never conflict (when done correctly), allowing to easily and uniquely communicate identity.
You should use them. You will never regret having overused them, but the reverse is not true.
zefDB automatically assigns uids to all RAEs, transactions and graphs. These reamin stable (invariants), also across graph revisions.
You may get away with using indexes on the graph within any given revision, but make sure to communicate in uids if in doubt. The additional memory requirements (16 vs 4 bytes) and hash lookup are usually well worth it.


---


## Truth is a Singleton!

Why is a single instance of the actual graph data of a zefDB graph sufficient on each compute node?
Since it is non-mutating and append-only (95% true), it is not only safe to share a single graph instance across threads, but even across processes. The addresses between processes may be different (using the virtual address space of the process), but using file backing and mmap it is possible to have the actual data in memory only once!
Since there is a single write head (also when considered across multiple compute nodes), there is never any conflict. Any new data appended to the primary instance of the graph is automatically pushed out to all secondary instances (read-only access to the graph) and views / reads are permissionless. 


---


## Is it a Value or a Stream?
As in other aspects of the real world www.proforhobo.com, it takes some practice and develop an intuition about distinguishing these two types. Mistaking the one for the other can lead to awkward situations (in university departments or your codebase), hence it is a useful skill.

Can we provide a syntax that simple, that it is just as simple to work with streams as with values? Instead of dealing with a String, we work with a Stream[String]?
Very often what we want is actually the latter, but we are so used to the former.

---


## Why does ZefRef | tx return a ZefRef?
This may seem unintuitive at first, and was a choice we were not entirely certain about. But after a fair amount of brooding we made the choice and the argument is the following.

if you're writing functions that relate to stuff in the world, they may take ZefRef(s) and return ZefRef(s). You want them to be pure in the sense that if you ever call them again with the same arguments, they return exactly the same result. Just a slight extension of the purity concept to reference frames dragged along in the arguments. Many of these functions will / should be written in the high level API, where you can use ZefRefs to RAEs, other existent transactions and Graphs. Hence, you need to ensure that the reference frame is passed along for these types, also if other zef pure functions are called recursively.  You may very well sometimes talk about the previous transaction that changed the value of an AE from the reference frame of some tx.

In essence, the reason boils down to giving precedence to the common use case of implementing reference frame programming and ensuring reproducibility. Functions taking ZefRefs should be causally pure by default: they can and may look at the past from the given reference frame, but looking into the future is an unsafe operation and should not be done unless explicitly stated in the function description. A similar spirit as naming functions with a "!" in Julia to indicate that they are not pure.


---



## Reference Frame Programming

---

## Subject vs Object
"A subject is an observer and an object is a thing observed."


---

## High Level vs Low Level API
Encode the reference frame from which you are answering the question into the very reference type and pass it along. If you're viewing a graph live whose primary instance is appending facts as you are watching, you can very easily run functions answering questions from the perspective of the primary instance.

Counterexample: ...

We refer to working with ZefRefs as the high-level api of the graph. You can access the high level primitives: entities, atomic entities, relations, transactions and other graphs using a ZefRef.
The reference frame from which you're answering questions is automatically passed along.
This is equivalent to manually serializing messages that contain the uid of the blob the ZefRef is pointing to, as well as putting the reference frame into the message as well for reproducibility.

When working with UZefRefs, you have more options: You can reference ANY kind of blob on a zefdb graph and it is essentially just a wrapped pointer to the blob. You can also use traversal operators like ">", ">>", "<", "<<" and other zefops like "target", "outs", but you will see the full low level graph representing the immutable data structure in all of its gory detail.

In writing most of your business logic, you probably want to use the high level API most of the time. But zefDB allows you to easily switch between the two at any point.
We try to adhere to the data-oriented design philosophy at multiple levels here: openly lay out your data for everyone authorized to see (no pseudo-hiding or ontologically impedance mismatched encapsulation). Provide suitable APIs through interface functions to make it easy for the user to do the "right thing" by default. You can opt out of the high level API anywhere if you need to.


---


## Equality of Things
What does it mean for two things to be equal? Are you the same person you were a year ago? Our everyday language is not very precise here.

"This, milord, is my family's axe. We have owned it for almost nine hundred years, see. Of course, sometimes it needed a new blade. And sometimes it has required a new handle, new designs on the metalwork, a little refreshing of the ornamentation ... but is this not the nine hundred-year-old axe of my family? And because it has changed gently over time, it is still a pretty good axe, y'know. Pretty good."
-- Terry Pratchett, The Fifth Elephant


Use ZefRefs for strict identity referring to the identical thing in space-time. Use UZefRefs for things that we choose to assign the same idenityt to for different times, as long as there is a continuous transformational path in the sense of the [Ship of Theseus](https://en.wikipedia.org/wiki/Ship_of_Theseus).

Notice that most programming languages do not provide a good inherent framework for distinguishing or reason about these two types of identity. But we do believe that there is value in treating this topic in a more explicit fashion. 



---


## Transactions Should be First Class Citizens
Also of the high level graph. Users should be able to create relations to and from transactions.


---


## A Common Pattern for Functions
When passing structs, the function answering some question often need more context.
E.g. a function which takes a sales order as an argument and should return all line items for that order.
Multiple approaches are possible here:

If you choose to model the sales order by some struct, maybe containing a uid, but not the entire context around it as an input argument, this function has to access the information it needs from somewhere. Often it reaches out to a database, and does some io. Hence, it is no longer a pure function. If a large part of your business logic consists of such structure, you are giving up on the advantages of working with pure functions: no reproducibility and fewer ways to reason about correctness. Mocking required for tests.

Let us try to make such a function pure: necessarily, all data it needs to answer that question (if there is to be any variability in the output) needs to be contained in the input arguments. I.e. the input data structure, either surrounding the sales order data structure or some other data structure passed in as an argument, have to contain the information. This may be very large, possibly the state of the entire database.

But most databases are mutating state and don't follow value semantics. One notable exception Datomic, and we strongly recommend Rich Hickey's talk "The Database as a Value" https://www.youtube.com/watch?v=EKdV1IgAaFc . We asked ourselves: "why does such a database that interfaces naturally with the C-based language ecosystem not exist?". zefDB is an attempt to solve this problem and provide value semantics for a distributed information management system.

What does this allow you tyo do? Pass in the entire state of the database at any point in time (including time travel) as a very lightweght data structure. 


---


## Asking zefDB for a Banana
"The problem with object-oriented languages is they’ve got all this implicit environment that they carry around with them. You wanted a banana but what you got was a gorilla holding the banana and the entire jungle." - Joe Armstrong.

The zefDB stance: you get a banana, but can access the immutable jungle if you need.



---


## zefDB Graphs and Persistent Data Structures
A bit of history:
zefDB actually grew out of a persistent data structure. We were performing MCTS simulations and required flexibility in the state representation and had a simulation that generated more than a million states per second as one traversed down the tree of choices. Most states were related to their parent state by a very small change only. Storing all states explicitly was very inefficient and costly in terms of RAM. We started off using the C++ "Immer" library for persistent data structures based on rrb trees, but some essential features of the API were not built out yet. Also, we were incurring a fairly high cache miss rate with our typical traversal pattern, probably because the rrb tree's data layout was not ideal for our traversal pattern. At this point we switched to our own persistent data structure sequentially written into a memory arena with optimized memory layout: the core states we were simulating essentially boiled down to a list of what are now atomic entities. The structure was more flexible than the current zefDB structure in that any given state could branch off any other state, i.e. allowed for arbitrary trees as hierarchies. It had many similarities to rrb trees, but had a different model of identity management and was more opinionated in what it represented.
We noticed a pretty significant performance increase (> 10x if I recall correctly), probably due to the customized memory layout. This is when we realized how useful this granular model is. Also, everything was in one memory arena. Using handles instead of raw pointers would even make it transferrable across processes and compute nodes. We could just send the binary data across the wire (if the systems share the same endianness etc.) and memcpy the bytes into the right place once they arrive. Serializing and deserializing becomes a non-issue: the contiguous, serialized data IS the data on the actual machine. And it is fast. This aspect is very similar to Google's FlatBuffers, often used in games where performance is required on this front.

So: does a zefDB graph itself qualify as a persistent data structure? This depends on the definition you want to use. Tradeoffs in terms of memory compactness CQRS support and query lookup speed are to be made with the ability of representing arbitrary hierarchies of state dependencies. The zefDB data model could certainly be extended to support the latter (and provide the same flexibility as rbb tress and similar persistent data structures to represent values). For the use case of a database to represent a sequence of facts that happened in the past, choices were made to prioritize the former and not support arbitrary branching WITHIN a single zefDB graph. This does not mean that you cannot represent such branched scenarios efficiently by building an interface layer that uses zefDB graph(s) and my gut feel at this point is actually that this may be the best way to go.

But for the scenario of representing a linear sequence of states, i.e. each state has at most one child state, a zefDB graph can very well be seen as a persistent data structure.

---

## Distributed Persistent Data Structures
Most persistent data structure libraries run within one process and lay out their data on the heap. There is fundamentally no reason why this concept is not extensible to distributed systems.
If you think about it, git is such a system. Commits are partial updates that are built to be sent over a network and any path down the commit graph defines a sequence of states.
Unison's model for distributing functions across the network is also such a system. A function just "is". It can (with very high probability) just be referred to via its SHA512 hash (its name within the network) and any node requiring a certain function, but not having cached it locally, can reach out to other nodes and ask for it.

zefDB graphs can also be seen as a distributable, persistent data structure. Graph updates are simply a list of transactions and each transaction contains a set of low level changes expressed within a minimal language capable of expressing arbitrary graph changes.


---

## zefDB & JSON
Any valid JSON structure can be uniquely expressed as a zefDB subgraph: JSON keys become relation types, nested JSON objects map to entities (although their type is not clear from the JSON expression unless a schema or sub-language is agreed upon), scalar leaf nodes map to atomic entities and lists can be expressed as zef lists. The same mapping applies to structs and objects in many languages where additional type information may be available. All of these map onto trees within zefDB.
Also, the zefDB scalar type system is somewhat larger than JSON's, e.g. QuantityFloat with units or Time has no direct equivalent.

---

## zefDB & GraphQL
This may not be obvious at first, but these two are extremely similar in their spatial structure.
...

---


## zefDB & SQL
The counterpart to typical graph traversal operations map to outer joins in SQL.
[The case against SQL](https://scattered-thoughts.net/writing/against-sql/).
ZefDB aims to be more composable in its expressions.
Modelling everything as rows of tables as the fundamental abstraction has drawbacks in terms of extensibility in certain domains: one often continues adding more columns which are often sparsely populated. Normalizing the data leads to a large number of joins being required in many real world use cases. Sometimes performance takes a hit, especially if the traversal paths vary and covering all scenarios with secondary indexes is not feasible.

zefDBs stance: lazily mirror all the data that may be accessed into the client's memory and perform the actual computation locally. Use your programming language of choice natively together with zefops as a powerful query system (similar to Microsoft's LINQ - but cross-language!). The execution and local caching of graphs should happen in a layer orthogonal to the business logic.
Avoid making various parts of your program async, because you have to wait for database queries to come back. The synchronous world is much friendlier if you can have it. Many typical queries can be executed in microseconds.


---


## Why is Querying a Remote Database Still a Thing?
We don't know. Mirroring the data and querying locally at essentially the speed of native data structures is much more convenient. We honestly don't know why nobody else is using this pattern. Clojure and Datomic seem to have it. Why has nobody built something similar for C-based languages?
We're genuinely interested, please let us know if we've missed some great library or if you have some insight.

Querying "The Database" vs just asking zefDB for some data is similar to "Running something on some fixed server with some ip" vs just abstractly asking some query dispatched to an AWS lambda function. It lifts the level of abstraction. You don't have to deal with the implementation and coordination, just say what you want. The coordination and execution policy should be orthogonal.


---


## Observables & Atomic Entities
If you're unfamiliar with  to observables as one of the fundamental data types / structures, have a look at this [excellent introduction](https://youtu.be/gawmdhCNy-A).

AEs and observables are very much the same thing. Except for two significant differences:
- an AE also saves all of its history: all value changes (equivalent to events of an observable) of the past can easily be accessed at any point in the future. This makes it unnecessary to cobble together your own intermediate data structures when trying to detect state changes or reconstruct aspects of the past.
- Each AE is still part of a graph at any point in time. One can spatially (i.e.  not temporally) traverse the graph starting from an atomic entity within any time slice. This is extremely handy when calculating aggregates on the fly (especially as subscriptions), since one does not need to manually merge (or RX.CombineLatest) all the observables that may be required within a given function. This allows separation of a the triggering event (leading to the firing of a subscription) from the quantity that is being calculated.


---


## Coupling Structure of the Data Representation to Ontological Structure of the Domain
This is a bad idea.
If you want to extend your domain model, you now need to change the structures to various parts of your code. Dictionaries and graphs are better at this: they are open to extension if you play your cards right: adding a new key value pair to a dictionary should always be allowed if you choose your keys without clashes.
Modeling your domain via objects within an OO language seems like a great idea until you tried it for a sufficiently complex and evolving system. You don't need to provide a new little specialized API (class methods) for any new object type you introduce. That doesn't scale.

This is the reason Rich Hickey says that lists are poor data structures to use for your domain model.
This is also the reason why too many positional arguments to a function are a bad idea.


This is what you do if you use tables for complex domains. As your project grows, things that start of as columns sometimes move to a new table as you normalize your data grudgingly, incurring a performance hit .Example: A "customer" was a string of an order initially, as it seemed to be a minor field. But then you suddenly need to treat it as a separate entity with various relations to other entities. Not only do you have to migrate your schema, but various scattered pieces of your code base may be relying on your old schema.


---


## "Normal" vs Reactive Programs


---

## Process Philosophy and Functional Programming

In imperative and object oriented programming the primary focus is on state. The state of a set of variables or objects at any given point in time. Time comes in as an afterthought, something that happens between state changes and we need to cross our fingers and potentially add duct tape if something screws up between state changes. Within this view, it is also easy to conflate two different types of time in a reactive program one is dealing with: the time one models in the program and that physical time(s) at which the computation is performed. Lack of conceptual clarity on this front can be a source of complexity in getting a program a reactive program correct.


["Sometimes old ways are the best ways"](https://youtu.be/7PYIH4dnL3I?t=84)



|   Focus on state / a given time slice    | Focus on the process / behavior under time |
| ----------- | ----------- |
| Parmenides, Aristoteles      | Heraclitus, Whitehead       |
| Newtonian mechanics | Lagrangian mechanics|
| Creationist view (focus on current observed complexity)   | Darwinian view (focus on processes and principles from which complexity can emerge)        |
| Ampere / Faraday | Maxwell |
| Newtonian view of time | Einstein's view of time |
| Schrödinger (non-relativistic quantum mechanics) | Dirac (relativistic quantum field theory)  |
| imperative and OO programming | functional and functional reactive programming |
| thinking about data in terms of values only | thinking about data in terms of streams |
| Hedonism | Buddhism, ... |
| object oriented game development | ECS-based game development  |


---


## State

"State is the complection of values and time" - Rich Hickey.

We actually want to extend this view somewhat and argue that there are two types of state changes.
- value changes with fixed structure: think of a simple app , the state of which can always be described by a json object of the same form. Only the values of some floats and strings may change. There is probably little disagreement here that these are "state changes" by assigning different values to existing entities over time. The identity of the entities in the json object is often encoded by it's structure: e.g. the position in a list or the value associated with a key.

We would like to argue that it makes sense to separately consider a different type of state change: a structural change. It's probably clear what this means in the context of adding a new integer to an existing list of integers. The position of the integer often encodes its identity and a new identity is added. 
Can this also be seen as a pure change of value? That's debatable and people have different opinions on hwo far one can stretch the concept of a value. One could argue that the entire list is just a value (a composition of individual integer values) and this is certainly a valid view. 

It comes down to connotation and practicality of conceptual definitions. The waters at the borders of these words as they are commonly used today are murky.


---



## Out of the Tar Pit
Is a [well known paper ](http://curtclifton.net/papers/MoseleyMarks06a.pdf) by Mosley and Marks on managing complexity of software systems, the key points of which many experienced programmers seem to agree with. It also resonated with me - mostly.

My main gripe with it since quite a while has been that the solution they seem to propose using relational databases and functional programming, seems inconsistent, as most (all?) relational databases of significance mutate their state. They are in fact just an entire system built around keeping the mutation of one giant state under control, also during parallel read and write access. If a large part of your business logic code touches state stored in the DB, but should be referentially transparent functions for the largest part, how do these two facts go together? For any realistic system built on these presumptions any interaction with the database would be modeled as IO, hence be impure. I recently stumbled upon [a good summary](https://kmdouglass.github.io/posts/summary-out-of-the-tar-pit/) and discussion of this point that has bugged me since a while.

I think Datomic and Clojure have a better story here. Having a database that obeys value semantics is the only way forward, out of this mess, as far as I can see.


## Identity and State

Intensional vs extensional identity, as discussed in [Out of the Tar Pit - page 13](http://curtclifton.net/papers/MoseleyMarks06a.pdf): your domain problem may require the one or the other. This is the same discussion as value vs identity. If you have a function `f(x) = x^2` over the domain of integers, one is working in the simple value oriented world. The function does not need to know anything about the outer world. It's input is always a value and so is its output.

Now lets consider a slightly different type of "function". I would bet that if you picked a random code snippet from an arbitrary code base of systems we rely upon in our everyday lives, a large part of code would fall into this category.



