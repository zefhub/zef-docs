---
id: atoms
title: Atoms
---

  
An atom is the smallest unit of information that is represented as a node or an edge on a ZefDB graph. Atoms are the building blocks you can use to construct a domain model.  
  
There are five different kinds of atoms on a ZefDB graph:  
1. Entities  
2. Attribute Entities  
3. Relations  
4. Transactions  
5. ValueNodes  
  
  
## References to Atoms  
Any of the three [reference types in Zef](reference-types) can point at an atom. Let's shortly discuss the semantic meaning of each.  
- **ZefRef**: A ZefRef always points to an atom. It can't point at any other blob / node on the graph. Since ZefRefs have the reference frame and baked in, they can always be understood to point at the respective atom "living in the Graph Slice".  
- **EZefRef**: Any instance of an atom can always be pointed to by an EZefRef. The reference frame is given in terms of the eternal graph, i.e. the semantics are that the object is seen by a given frame, but the reference frame transcends time. Also: not every EZefRef necessarily points to an atom. There are other types of low level nodes and edges on the Eternal Graph that are not Atoms, but EZefRefs can refer to them.  
- **Ref**: This is the most general / least specific reference to an Atom. No reference frame is specified.  
  
  
  
## Domain Object vs Values  
Every instance of an atom of subtype 1-4 has an identity. You can think of it as a "thing" you can point to which is identified not only by its type, but is distinct and possesses a UID under the hood. Calling a constructor twice for such a "domain object" would not result in two objects that compare equal.  
  
In contrast, an instance of a value node, is identified purely by its value. You could have a value node representing the integer `42`. If someone else were to create the same value node on a different computer and they ever were to send it over for comparison with your value, they would compare equal. A value node has no identity and is fully defined by its value. This is called **value semantics**.  
  
  
## References  
- [The Value of Values](https://youtu.be/-6BsiVyC1kM) by Rich Hickey  
- [The Most Valuable Values](https://youtu.be/_oBx_NbLghY) by Juan Pedro Bolivar Puente   
