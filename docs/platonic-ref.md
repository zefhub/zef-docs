---
id: platonic-ref
title: PlatonicRef
---

  
### Semantics:  
A reference type referring to an entity (more generally: [Atom](atoms)) without an reference frame or database context. This can be seen as the most general kind of reference with the minimal amount of information stored to refer to the entity. It only contains the information about the primary type (e.g. an `ET.Person`) together with the Platonic uid.  
  
  
### Function  
A PlatonicRef is a fundamental data type:  
- a concrete type to use as a part of your language in modeling your domain  
- minimal semantics among all the reference types (only type and most abstract uid)  
- function: a mechanism to agree that you're talking about the "same thing" in the most general sense. You do not need to agree about any facts relating to this atom.  
  
  
### Background on Naming  
> Platonism about mathematics (or _mathematical platonism_) is the metaphysical view that there are abstract mathematical objects whose existence is independent of us and our language, thought, and practices.  
  
source: [Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/entries/platonism-mathematics/)  
Zef does not make any assertions about the metaphysical existence of mathematical objects in this respect. The name is chosen to signal the reference to a commonly agreed on entity which exists outside the realm of the computational reference frame's context.  
  
  
