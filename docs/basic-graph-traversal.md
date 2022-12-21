---
id: basic-graph-traversal
title: Basic Graph Traversal
---

  
## Starting Traversals  
  
To start a graph traversal, one needs an entry point  
  
1. listing all nodes of a specific type (similar to a full table scan)  
2. from a tag (both nodes and relations can be tagged)  
3. we already have a concrete reference (ZefRef or EZefRef) to a node or relation on the graph and can traverse from there  
  
## 1. Listing All Instances of a Type  
  
```python  
gs = g | now                                            # get the latest graph slice  
  
gs | all                                                # lists all instances that exist in this graph slice  
gs | all[ET]                                            # list all entities that exist in this graph slice (RT/AET also valid)  
gs | all[ET.Person]                                     # returns a LazyValue[List[ZefRef]]  
gs | all[AET.Float]                                     # all atomic entities of type Float  
gs | all[RT.FirstName]                                  # relations have types too. A ZefRef can also refer to a relation  
gs | all[(ET.Person, RT.FirstName, AET.String)]         # more specific: source/target type can also be included  
```  
  
All the examples return lists of instances in lazy form which exist in the graph slice `gs`.  
  
Analogous operations can be done on the eternal graph: This will answer the question "show all instances that ever existed at any time".  
  
```python  
g | all  
g | all[ET]  
g | all[ET.Person]  
...  
```  
  
## 2. Entering via a Tag  
  
```python  
z_dog = gs['my favorite dog']                           # any string can be used as a tag within the context of a graph slice  
```  
  
# Traversing  
  
```python  
first_names = all_persons | Out[RT.FirstName] | value       # this is still lazy  
```  
  
  
```python  
(gs  
  | all[ET.Person]  
  | filter[lambda z: z | Out[RT.FirstName] == 'Yolandi']  
  | single                                              # there can only one (otherwise single will fail)  
  | collect                                             # trigger evaluation  
)  
```  
  
````python  
```python  
```python  
```python  
```python  
```python  
```python  
```python  
  
  
## structure  
---  
  
Normal traversal  
```python  
z1 | outs  
z1 | ins  
z1 | Outs[RT.FriendOf]  
z1 | out_rels[RT.FriendOf]  
z_rel = z1 | out_rel[RT.FriendOf]  
z_rel | target  
z_rel | source  
...  
````  
  
Time travel  
  
```python  
z1 | to_frame[g | now]  
  
z1 | time_travel[-2]        # moves the reference frame: go back two slices  
z1 | time_travel[+5]  
z_tx | time_travel[-2]      # if z_tx is a ZefRef, it also only moves the reference frame, even if z_tx points to a TX  
  
z1 | time_travel[Time('2021 December 4 15:31:00 (+0100)')]  
  
  
# z1 | exists[my_graph_slice]  
z_zr | contained_in[my_graph_slice]  
z_ezr | contained_in[g]  
```  
  
Given a RAE, look at all events in its past:  
  
```python  
z_ae | instantiated                     # when was the AET instantiated  
z_ae | value_assigned                   # a List[ZefRef[TX]]  when values were assigned  
z_ae | terminated  
```  
  
Given a TX, explore what happened there  
  
```python  
my_tx | instantiated                        # show all instantiated RAEs  
my_tx | terminated  
my_tx | value_assigned  
my_tx | merged  
my_tx | affected  
  
```  
  
given a ZefRef / EZefRef pointing to a TX, get the graph slice / state following this TX  
  
```python  
z_tx_zr | to_graph_slice           # ZefRef  -> GraphSlice,     discards reference frame, returns a GraphSlice  
z_tx_ezr | to_graph_slice          # EZefRef -> GraphSlice      returns a GraphSlice  
```  
  
Conversely, given a graph slice, get the TX that precedes it.  
  
```python  
my_graph_slice | to_tx     # => ZefRef[TX]  
```  
  
The reference frame is also that of the GraphSlice.  
  
## Temporal Traversals  
  
Relative traversals: there are  
  
```python  
  
z_zr | time_travel[-2]                  # move the reference frame back 2 time slices, keep pointing at the same object  
z_zr | time_travel[-3*units.hours]      # go back 2 time slices  
  
my_graph_slice | time_travel[+3]        # it can also be used on graph slices directly  
```  
  
Absolute traversals: the 'now' operator is the bridge between modeled time and execution time. It takes one to the point in time of execution, i.e. it cannot be used inside any pure function.  
  
```python  
now()                                   # -> Time.              returns current time (of type Time)  
g | now                                 # Graph -> GraphSlice  
gs | now                                # GraphSlice -> GraphSlice  
z_zr_my_entity | now                    # ZefRef -> ZefRef:     fast forward to very latest reference frame at time of execution  
z_ezr_my_entity | now                   # EZefRef -> ZefRef:    fast forward to very latest reference frame at time of execution  
```  
  
