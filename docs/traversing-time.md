---
id: traversing-time
title: Traversing Time
---

  
  
## Moving Between GraphSlices  
You can traverse through time across different DB states by using the `time_travel` ZefOp. In all cases below, a GraphSlice is returned.  
  
##### Moving by a fixed number of GraphSlices / TXs:  
```python  
my_graph_slice | time_travel[+4]  # returns GraphSlice | Error  
my_graph_slice | time_travel[-2]  # move backwards in time by 2 slices  
```  
  
  
##### Moving by a fixed duration (relative to current GraphSlice)  
```python  
my_graph_slice | time_travel[-2 * unit.hours]  # travel back in time  
```  
Related: units in Zef.  
  
  
##### Moving to an absolute time  
```python  
t1 = now() - 0.5 * unit.hours  
  
my_graph_slice | time_travel[t1]  
my_graph       | time_travel[t1]  # this also works for eternal graphs  
```  
  
  
  
  
  
### Time Travel for ZefRefs  
The identical syntax can also be used on a ZefRef instead of a GraphSlice. In that case, another ZefRef is returned: the identity of the atom remains constant, but it is viewed from the same eternal graph at a different time.  
  
  
##### Moving by a fixed number of GraphSlices / TXs:  
```python  
my_zefref | time_travel[+4]  # returns ZefRef | Error  
my_zefref | time_travel[-2]  # move backwards in time by 2 slices  
```  
  
  
##### Moving by a fixed duration (relative to current GraphSlice)  
```python  
my_zefref | time_travel[-2 * unit.hours]  # travel back in time  
```  
  
  
##### Moving to an absolute time  
```python  
t1 = now() - 0.5 * unit.hours  
  
my_zefref  | time_travel[t1]  
my_ezefref | time_travel[t1]  # this also works for eternal ZefRefs  
```  
  
  
  
  
### Error Cases  
For all of the above cases, if the implied time lies outside of the bounds of the graph (prior to the first GraphSlice or later than the last GraphSlice present), an Error is returned.