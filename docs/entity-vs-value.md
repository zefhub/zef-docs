---
id: entity-vs-value
title: Entity vs Value
---

  
  
  
### How do I Decide if Something is a Value or an Entity?  
The question you should think about first when choosing how to represent **something** is: what happens when I write down a literal expression for this thing and were to "instantiate" it twice?  
- should it refer to the identical "thing"?  
- does it denote two different things of the same type?  
  
If (1) is the answer, you're dealing with a **value**.  
If (2) is the answer, you're dealing with something that has an identity, e.g. an entity.  
  
### I thought you said Zef has "value semantics" everywhere?  
Yes, this is *mostly* true. It is also true for the "atoms", i.e. the concrete Python objects you are dealing with.  
To resolve this paradox, we have to get slightly philosophical: Suppose you're dealing some entity that has value semantics, e.g. a "User" which you are storing in a database and dealing with in your code. The obvious, but fundamentally critical point you always need to remember is the following: your Python object representing this customer **IS NOT** that person. The actual person lives in the real world. All you have in your Python process or your database is something you choose to be a representation of that person. It is simply a "handle" or pointer to refer to whichever actual real-world entity or abstract concept you choose to represent.  
  
- The actual entity / person has an identity and does not follow value semantics  
- The handle / entity object in your system has value semantics. If you make a copy of it, it points to the real thing.  
  
This is analogous to pointers in languages like C++ having value semantics. Even if they point to an object which does not have value semantics.  
  
  
---  
### Related  
- [ZefDoc - Identity vs Value Semantics](identity-vs-value-semantics)  
