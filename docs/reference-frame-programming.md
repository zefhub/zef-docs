---
id: reference-frame-programming
title: Reference Frame Programming
---

A conceptual framework for distributed systems where each actor / frame in the system does is not considered to be in control of a global truth.  
  
In reference frame programming the individual actors (threads of execution) are first class citizens of the information system, enabling a richer semantics of facts, computation and which actor's perspective these are seen from.  
  
## Status Quo  
In most of today's common approaches to building distributed systems, this knowledge is implicit. You may only become aware of it once you run into problems such as race conditions, deadlocks, problems with state synchronizations between threads or services.  
  
  
Zef makes this information explicit. It becomes part of the language and the data model itself.  
  
  
## Time  
In particular, each actor measures their own local time. Times between different actors cannot be directly. Causal relations and implications about "who knew what at which time" can nevertheless be made by using partial orderings and [logical clocks](https://en.wikipedia.org/wiki/Logical_clock).  
  
  
## Incorporation into Zef's Syntax  
The concept of reference frames is inherently contained in one of Zef's most common data structures: the ZefRef. A ZefRef is essentially a combination of two pointers / uids:   
1. the [object](https://plato.stanford.edu/entries/object/#ContObjeVsSubj) it is pointing at. e.g. a ZefRef to an instance of type `ET.Person`  
2. a reference frame: which graph slice is this seen from? This can be seen as as the [subject](https://plato.stanford.edu/entries/object/#ContObjeVsSubj) / observer.  
  
This means that taking advantage of the richer semantics: "who knows what about what?"   
  
  
  
## References / Additional Material  
- Stephen Wolfram also discusses similar ideas in this [podcast around](https://www.infoq.com/podcasts/wolfram-language-mathematica/) 21:45  
  
