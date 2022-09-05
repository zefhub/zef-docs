---
id: graph-slice
title: Graph Slice
---

  
# Graph Slice  
  
A **Graph Slice** is a time slice of a cross an eternal ZefDB graph at one fixed point in time. It can be seen as the **state of the data base** at a given point in time, which makes assertions about   
1. the existence about a set of Atoms (Entities, Relations, AttributeEntities)   
2. facts that are asserted to to be true (relations between atoms, aka semantic triples)  
  
A Graph Slice contains both the identity of the graph (database) from which this information is seen, as well as the time.  
  
  
## Difference to ZefDB Graph  
The term ZefDB graph refers to the **Eternal Graph**, which transcends time. Specifically, it grows over time by accreting new facts.  
A **Graph Slice** is a higher level abstraction and can be seen as one slice of the eternal graph at one point in time.  
  
  
## Discrete Transitions  
Since changes to a ZefDB graph occur through transactions only and these occur discretely, a given GraphSlice can be seen as the state of DB over an  interval of non-zero temporal width. At any point in time between the previous and next transaction, the DB can be seen to be in same state of the respective GraphSlice.  
Whether one wants to see the transactions as primary and Graph Slices as subordinate/emergent or vice versa, is up to you. There is no clear right or wrong and which view to choose boils down to its usefulness in a given context.  
  
## Time  
A Graph Slice is always associated with a time (it's starting time of validity) or an interval. The concept of "a time" is not well-defined in a distributed system, as Leslie Lamport pointed out in his [Turing award winning work relating distributed systems to Einstein's theory of relativity](https://dl.acm.org/doi/10.1145/359545.359563).   
The semantics of time always being given with respect to the reference frame of the transacting process. This concept is built into the Zef language at the core. When referring to the time or interval associated with a Graph Slice, this is **always** to be understood in the frame of the transactor of the graph, which was writing the changes.  
