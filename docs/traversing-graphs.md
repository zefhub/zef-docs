---
id: traversing-graphs
title: Traversing Graphs
---

  
This page is focussed on traversing GraphSlices, i.e. traversing the knowledge graph across "space" at a specific time. ZefDB also provides a similar API to traverse the eternal graph across space and time: traversing eternal graphs  
  
  
### Finding all Attached Atoms  
```python  
z_person | Outs        # show all atoms attached to   
z_person | Ins  
z_person | ins_and_outs  
```  
  
  
### Filtering on Specific Relation Types  
```python  
z_person | Outs[RT.FriendOf]  
z_person | Ins[RT.FriendOf]  
z_person | ins_and_outs[RT.FriendOf]  
```  
  
Why are `In, Out, ...` capitalized in contrast to all other ZefOps? There would be a name collision with Python's `"in"` keyword.  
  
  
### Accessing "Fields"  
Note that the equivalent of fields are relations of a specific type that occur exactly once  
```python  
z_person | Out[RT.FirstName] # there must be exactly one such relation  
```  
The operators `In, Out, Ins, Outs, ...` always return ZefRef(s)  
  
  
  
### Getting Hold of the Relations  
In some cases we may not be interested in the atoms connected as source / target of a specified relation, but rather want a ZefRef to the relation itself.  
```python  
z_person | out_rel[RT.FriendOf]    # in case of a one-to-one relation  
z_person | out_rels[RT.FriendOf]   # varaible number  
  
z_person | in_rel[RT.FriendOf]  
z_person | in_rels[RT.FriendOf]  
```  
  
  
  
### Shorthand Notation  
```python  
z_person | F.FirstName     # returns a value  
z_person | Fs.FriendOf     # returns a List[ZefRef] if an entity is attached  
```  
`F` is a shortcut symbol (for "field"): using the dot notation, the expression `F.Something` is a ZefOp and has similar behavior to `Out[RT.FriendOf]`.  
  
It is slightly more opinionated though:   
1. If an attribute entity is attached as the target of the traversed relation, the value assigned in that Graph Slice is automatically returned (as opposed to a ZefRef to the attribute entity)  
2. If an entity or relation is attached as a target, a ZefRef to this is returned.  
  
This is convenient when writing high level code, where you may often be interested in the actual value.  
`Fs` is the one-to-many counterpart to `F` (as `Outs` is to `Out`).  
  
  
  
### Filtering on Target Type  
```python  
z_person | Outs[RT.FriendOf][ET.Dog]  
```  
A type can be curried in as a second argument. This can be seen as a form of pattern matching which filters out all nodes connected by both the specified relation set and target type set.  
  
  
