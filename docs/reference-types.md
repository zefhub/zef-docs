---
id: reference-types
title: Reference Types
---

  
### References  
There are three different types of references that can point at an Atom:  
1. **[ZefRef](zef-ref)**: object pointed to and a reference to a GraphSlice as a reference frame. This reference frame means: seen from **graph g**1 at **time t1**.  
2. **[EZefRef](ezef-ref)**: object pointed to and a reference to an Eternal Graph as a reference frame. This reference frame means: seen from **graph g2**, but not at a specific time, but the reference frame itself being an entity transcending time.  
3. [PlatonicRef](platonic-ref): purely an object pointed at. No reference frame is specified. This is the least specific and a useful data structure when communicating between graphs / services. It is also useful when working at a high level of abstraction and one wants to point at entities without getting into the details of which graph the specific data is represented on.  
4. Upcoming: RealTimeRef  
5. FlatRef  
  
Either of these may point to the **same** entity (or more generally: atom)  
  
  
### Note on Naming  
We distinguish between  
- Ref: the concrete data structure pointing at an atom in a reference frame independent way  
- Reference: the collective term referring for the union of all {ZefRef, EZefRef, Ref}  
  
