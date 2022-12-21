---
id: merging
title: Merging
---

  
This section assumes familiarity with the [[Zef Lineage]] system and the [[Zef Data Model]]  
  
  
### Using the `merge` Operator  
This operator allows you to take multiple FlatGraphs or GraphSlices and construct one new FlatGraph from this.  
  
  
### Merging Values  
Not a problem. No identity matching required and no ambiguity. If the same value were to be listed multiple times as it is contained in multiple source graphs, only a single value node is created in the new graph.  
  
  
### Merging ZefRefs, EZefRefs and Refs  
These three types of references always refer to atoms that have already been assigned an identity within the Zef network. Merging them into a FlatGraph poses no problem and is a functionally pure operation. No UID needs to be generated and no additional entropy is required.  
  
During the merge, the atoms are represented in their natural form on the FlatGraph, which only keeps track of the origin uid, i.e. is equivalent in the information content to a `Ref`.  
You can look at FlatGraphs as being used as an intermediate data structure that references any atoms **without** accounting for a reference frame from a specific ZefDB graph.  
  
  
  
### Merging from FlatRefs  
FlatRefs can refer to two kinds of atoms represented on a FlatGraph: with and without IDs.  
  
1. those with an assigned ID. These are atoms whose identity is known within the Zef Network. Assigning an ID is an impure operation, since calls into a random number generator. This is typically done within the transaction on a ZefDB graph.   
2. New atoms can also be created locally in FlatGraph. Their identity is only specified by their index within the element list of the FlatGraph and no UID is assigned. This makes the operation pure and allows data pipelines that operate on FlatGraphs to be reproducible and have value semantics. The identity is stable within that graph and can also be addressed via additional tagging.  
  
When FlatGraphs are merged into ZefDB graphs, FlatRefs without IDs can be seen as instantiation [[ZefDoc - Graph Instruction |graph instructions]].  
  
  
