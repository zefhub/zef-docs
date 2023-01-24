---
id: semantic-diffing
title: Semantic Diffing
---

  
Git and seeing a history of all changes as a stable foundation of software development is great. But not all data is best represented as linear character sequences in a bunch of files. This is where choosing a suitable representation and data structure for a given problem comes in.  
If you express a complex state within a GraphSlice and these evolve over time, Zef's diffing drops out for free. Rather than operating like git on the linear sequence of bytes, the diffing in Zef inherently operates on the semantic level of your domain representation.  
  
  
### Git  
- Diffs on text  
- Best for plain text, but works on binary data as well  
- gets confused if file content and file names change  
  
  
### Zef  
- Diff performed on very granular levels of atoms on graph  
- if the domain is represented in its "natural" form on a graph / dictionary / list  in a relational manner, the diffing is intrinsically semantic  
  
  
  
### Show me the Code!   
(**Note**: not fully implemented yet)  
```python  
diff(graph_slice_2, graph_slice_1)  # between two graph slices  
diff(flat_graph_2, flat_graph_1)    # between two FlatGraphs  
diff(flat_graph_2, graph_slice_1)   # between a FlatGraph and a GS  
```  
  
Essentially this diffing can be done between any graphs that represent state. Since the identity of atoms in Zef are tracked across different graphs based on the Zef Lineage Model, diffs can even be computed between states of different ZefDB graphs.  
  
  
### Data Structure  
What is the concrete data structure representing a diff?  
```python  
my_diff = [  
	instantiated[z1],  
	terminated[z2],  
	assigned[z3]['old value']['new value'],  
	tagged[z3]['best node ever!']  
]  
```  
  
This is just a list of changes, which we refer to as a **GraphDelta**. They are a description of changes. `z1, ...` are references that differ in concrete type:  
- diffing two GraphSlices on the same Graph: ZefRef in the latter state.  
- diffing two FlatGraphs: Ref  
- diffing two GraphSlices on the different Graphs: Ref  
  
  
  
#### Relation to Graph Commands  
You may have noticed that a GraphDelta looks very similar to a [graph command](graph-instructions) (a list of changes one wishes to execute). GraphDeltas are pure descriptions of what is different, i.e. they describe something about the world / the states. Graph commands express wishes and are imperative in nature.  
  
  
#### Relation to Graph Subscriptions  
The events emitted upon transactions closing when graph subscriptions are set up are also simply GraphDeltas. GraphDeltas between consecutive GraphSlices with the state transition encoded by one transaction.  
  
  
  
  
### References and Further Material  
- [SemanticDiff](https://martinfowler.com/bliki/SemanticDiff.html) by Martin Fowler