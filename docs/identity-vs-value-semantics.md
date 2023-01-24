---
id: identity-vs-value-semantics
title: Identity vs Value Semantics
---

  
Here we shortly discuss how these two different semantics concepts are related and how to practically switch between them.  
  
  
## Identity  ➡️  Value  
You may have heard that relational DBs and SQL have no concept of inherent identity. Communicating with your database is different from working directly on "local objects" in the "typical object oriented approach". Equality can only be tested by comparing values.  
  
Expressing entities with an identity in terms of value is very easy: you always encode the identity as a value in form of an `id` or **key** field. There are many advantages in using randomly generated IDs over sequential ids.  
  
This is not bound to interacting with your DB, you can use the same principle in your local program. This pattern appears in many places, e.g.  
- REST APIs encode identity in URLs  
- GraphQL entities typically also have an **ID** fields which is kept stable across system boundaries  
- interaction with a DB  
- dealing with streams  
- ...  
  
  
  
## Values  ➡️  Identity  
Sometimes you want to go the other way around. Especially when dealing with change over time.  
  
Suppose you're editing a document, one character at a time. After each keystroke, the document may be seen as a value (e.g. a string). In our everyday language, we mean something different by "the document": we assign an identity to the document over time. We mentally assign an identity to it and you can also think of it as a process as it changes one character at a time.   
  
  
How can we explicitly assign an identity to a sequence of values evolving over time in Zef? This is exactly what an Attribute Entity (AE) is for to represent and potentially persist such data in a ZefDB. An AE   
- has an identity (and an internal uid)  
- complies with the semantics of the different [zef reference types](reference-types)  
- can be merged across DBs and Zef automagically handles all the underlying identity management, identification, merge semantics etc.  
  
  
  
### The Ship Of Theseus  
  
> This, milord, is my family's axe. We have owned it for almost nine hundred years, see. Of course, sometimes it needed a new blade. And sometimes it has required a new handle, new designs on the metalwork, a little refreshing of the ornamentation ... but is this not the nine hundred-year-old axe of my family? And because it has changed gently over time, it is still a pretty good axe, y'know. Pretty good. - Terry Pratchett  
  
[The Ship of Theseus](https://plato.stanford.edu/entries/identity-time/), also known as the Theseus' Paradox, is a thought experiment that raises questions about the nature of identity and continuity. It posits that if all the parts of a ship are replaced over time, is it still the same ship? The paradox is often used to illustrate the difficulties in defining the identity of an object, and whether it is determined by its physical makeup or by some other criteria. Some philosophers argue that the ship would still be the same, as long as it maintains the same function and purpose, while others argue that it would be a different ship, as it is no longer composed of the same physical parts. It raises similar questions in other fields such as personal identity, and the continuity of living organisms.  
  
These ideas of juxtaposing state and process go back to [Heraclitus](https://plato.stanford.edu/entries/spacetime-bebecome)   
> Everything flows and nothing abides; everything gives way and nothing stays fixed. You cannot step twice into the same river, for other waters and yet others, go flowing on.  
  
and constitute some of of the foundational concepts to [process philosophy](https://plato.stanford.edu/entries/process-philosophy/), which emphasizes the "flow" and [process over time over state](https://youtu.be/Xx-Tb26gwwc).  
  
Ward Cunningham also discusses a similar idea on this idea of sequences of values in the context of decision making, which he calls [episodes](http://c2.com/ppr/episodes.html):  
>We are particularly interested in the sequence of mental states that lead to important decisions. We call the sequence an _episode_. An episode builds toward a climax where the decision is made. Before the decision, we find facts, share opinions, build concentration and generally prepare for an event that cannot be _known_ in advance. After the climax, the decision is known, but the episode continues. In the tail of an episode we act on our decision, promulgate it, follow it through to its consequences. We also leave a trace of the episode behind in its products. It is from this trace that we must often pick up the pieces of thought in some future episode.  
  
  
### How is this useful to me?  
It is easy to get lost in one of the many interesting rabbit holes which these topics provide.   
  
Zef aims to make these concepts explicit and embed them into the core semantics of the DSL, helping you to build more expressive and powerful systems and solve real world problems.  
  
Having a rough overview of these ideas and recognizing them in your everyday problems can help you design better and more resilient systems - especially if you're working in complex domains where not only the data, but also the system itself evolves over time.   
Recognizing the lack of precision in our everyday language (and programming languages) for these concepts of identity, change, value and process is a first step to improving the status quo.  
  
Here are a few pointers to related topics:  
- [GraphD](https://github.com/googlearchive/graphd/blob/master/doc/a-brief-tour-of-graphd.md) had a strong focus on distinguishing between values and identities, as well as providing a tool to embed this into a knowledge graph. Unfortunately, it seems that Google has stopped development of this open project.  
- Eric Evans' "Domain Driven Design" touches on similar concepts, often distinguishing between "domain objects" and "value objects".  
- In "data streaming" (e.g. ZeroMQ, Kafka, RabbitMQ, ...) the identity is often implicit in the identity of the stream. Similar ideas apply to libraries and languages where where "streams" are core data structures:   
	- Elm: signals (in earlier versions of Elm)  
	- ReactiveX: Observables  
	- Dart: Streams  
  
  
  
### Summary  
In summary we can see that the concepts of values and entities with identity nest in both directions. You can embed values in "streams / sequences over time" which we mentally assign an identity to.   
Conversely, we can express such a sequence as a pure value again, e.g. by "serializing it as pure data". The precise way is irrelevant, it could be a binary format as well. But the concept of assigning UIDs in this direction is universal.  
The act of generating a UID always requires a source of entropy and cannot be performed by a pure function. This act can be seen as a bidirectional exchange across a system boundary: entropy flows in across the boundary by the very act of uid generation (randomness from the environment) when your internal system "A" learns about some object with an identity. The latter being only meaningful if it is a concept in the world external to "A".