---
id: zef-ref
title: ZefRef
---

  
A [Zef reference](reference-types) that semantically also contains a reference frame. It can be understood to mean "I am talking about [atom](atoms) X seen from the reference frame of graph Y at its time T".  
  
  
### Representation  
We can encode everything in two UIDs:  
1. the UID of the [object](https://plato.stanford.edu/entries/object/#ContObjeVsSubj) Zef Atom (entity / attribute entity / relation)  
2. the UID of the transaction which determines the reference frame  
  
  
  
### Optimizations  
Looking up UIDs on each traversal step to determine the actual location of that atom in the respective process' memory can be slow (on the traversal timescale). Therefore there is a buffer to optionally store the information of these two pointers. These are encoded as one pointer to the beginning of the graph buffer together with the two offsets for the object and TX.  
Note that the uids are stable identifiers across process boundaries, the graph pointer is only stable within one process if the graph remains loaded.  
  
  
### Type  
A ZefRef is a Zef ValueType.  
  
  
### Semantics  
A ZefRef has value semantics. It is not to be confused with the reference semantics of the Atom that it points to.  
  
In case you are familiar with imperative and object oriented programming, this is no different: although the object / struct instances have reference semantics (their very address is often used as their ID), pointers to such objects have value semantics. Bare pointers are often even [trivially copyable](https://en.cppreference.com/w/cpp/types/is_trivially_copyable).  
  
  
  
