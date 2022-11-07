---
id: zef-db-graph
title: ZefDB Graph
---

  
### Create a new DB  
```python  
g1 = Graph()    # initialized emtpy graph. Not synced.  
g2 = Graph(sync=True)    # sync with ZefHub  
```  
  
### Semantics  
- The actual graph objects are just references to the actual graph data. Executing `g2=g3` does not perform a "deep copy", but copies the reference to the actual database buffer.  
  
### Garbage Collection  
- The actual database buffer performs reference counting (on the C++ level) of the number of graph objects referencing it. Once this counter reaches zero, the database is garbage collected.  
  
  
### Listing all Loaded Graphs   
```python  
zef.pyzef.internals.list_graph_manager_uids()  
```  
  
  
