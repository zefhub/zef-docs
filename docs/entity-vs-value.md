---
id: entity-vs-value
title: Entity vs Value
---

  
In Zef (and generally in domain modeling) we can categorize any object appearing as data as one of two types: entities or values.  
  
  
#### Side Note  
With "entity" we refer to any instance of type entity, attribute entity and relations on this page. This is for brevity only.  
  
  
  
### Values  
- Values have no identity and are purely determined by the value they represent. e.g. our concept of 42 refers to exactly the same (abstract) thing / concept as that which an alien civilization would have once they formalized the natural natural numbers.  
- Values and their equality follow the rules of value semantics.  
- Values compose: composite container types of values are themselves values again. e.g. the list `[1, 2, "hello"]` can itself be considered a value. Other container types are dictionaries and sets.  
- If the "constructor" for a value object is called, it should always lead to the same object. Two values constructed on different computers would compare equal if they were constructed with the same parameters.  
- The constructor for a value object is a pure function. No entropy generation for a uid is required.  
- In domain driven design, these are called as **value objects**.  
  
  
  
## Entities  
- Entities often refer to "things" in the real world.  
- When referring to entities within the systems we build, we can only ever talk about them using references. Concretely within Zef, we can use one of the three different [reference types](reference-types) with the choice depending on the semantic meaning within the given context.  
- Entities have an identity: We would consider two entities to be different, even if all attributes and properties are considered equal.  
- In domain driven design, these are called as **domain objects**.  
- Entities with identity semantics can be represented by value objects when using an id, as underlined by Pat Helland in [Identity by Any Other Name](https://cacm.acm.org/magazines/2019/4/235620-identity-by-any-other-name/fulltext)  
- Relational databases don't have identity semantics (see e.g. [Relational has no Object Identity](https://wiki.c2.com/?RelationalHasNoObjectIdentity) by Costin Cozianu). Identity is assigned and managed using keys in tables and it is the responsibility of the user to operate on this low abstraction level (we should write a blog post on [dealing with entities via keys and ID is the domain modeling counterpart of manual memory management and pointer arithmetic in C.])  
  
  
  
  
## Further References and Material  
- blog post [Value Object](https://martinfowler.com/bliki/ValueObject.html) by Martin Fowler  
- [Value Object](http://wiki.c2.com/?ValueObject) by Costin Cozianu  
   
  
  
