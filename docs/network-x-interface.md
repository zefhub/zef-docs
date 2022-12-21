---
id: network-x-interface
title: NetworkX Interface
---

  
  
NetworkX is the most established graph library for Python and provides a large collection of graph algorithms. A ZefDB state can be "wrapped" to have the interface of a NetworkX graph, allowing you to use many of the NetworkX algorithms directly on your data.  
  
The proxy object `zef.experimental.networkx.ProxyGraph` presents a  
NetworkX-style interface, which is compatible with many of the NetworkX algorithms.  
  
Note that this proxy object is **lazy**. It does not make a copy of the Zef  
graph, and accesses the graph data only when requested through the NetworkX proxy.  
  
## Creating a proxy object  
  
Starting with some dummy data:  
  
```python  
zg = Graph()  
[  
    (ET.Person["alex"], RT.Name, "Alex"),  
    (ET.Person["bob"], RT.Name, "Bob"),  
    (ET.Person["charlie"], RT.Name, "Charlie"),  
    (ET.Person["doug"], RT.Name, "Doug"),  
      
    (Z["alex"], RT.FriendsWith["rel"], Z["bob"]),  
    (Z["alex"], RT.FriendsWith, Z["charlie"]),  
    (Z["bob"], RT.RivalsWith, Z["charlie"]),  
    (Z["bob"], RT.RivalsWith, Z["doug"]),  
      
    (Z["rel"], [(RT.Since, now()),  
                (RT.MetAt, "Gym"),]),  
] | transact[zg] | run  
```  
  
we can construct a proxy NetworkX graph of the friends network:  
  
```python  
import networkx as nx  
from zef.experimental.networkx import ProxyGraph  
  
dg = ProxyGraph(now(zg), ET.Person, RT.FriendsWith)  
ug = ProxyGraph(now(zg), ET.Person, RT.FriendsWith, undirected=True)  
```  
  
wher `dg` is a directed graph (`nx.DiGraph`) and `udg` is undirected  
(`nx.Graph`), consisting of the subgraph made up of only `ET.Person` entities  
and `RT.FriendsWith` relations.  
  
It is possible to have different views simultaneously. For example:  
  
```python  
dg_all = ProxyGraph(now(zg), ET.Person)  
ug_all = ProxyGraph(now(zg), ET.Person, undirected=True)  
```  
  
will consider all relations between `ET.Person` entities to be edges, that is  
`RT.FriendsWith` and `RT.RivalsWith` are considered equal.  
  
Note that proxy views are of a GraphSlice, and so are immutable and will not  
advance with the Zef graph head.  
  
### Node/edge properties  
  
Nodes are simple wrappers around a ZefRef object and any AETs on the entities are interpreted as fields:  
  
```python  
>>> for node in dg.nodes:  
...     print(f"{node} has name {dg.nodes[node]['Name']}")  
  
<ZefRef #97 ET.Person slice=2> has name Doug  
<ZefRef #127 ET.Person slice=2> has name Charlie  
<ZefRef #135 ET.Person slice=2> has name Bob  
<ZefRef #143 ET.Person slice=2> has name Alex  
```  
  
Edges can similarly possess fields:  
  
```python  
>>> # We can also do lookups with ZefRefs  
... z_alex = zg | now | all[ET.Person] | select_by_field[RT.Name]["Alex"] | collect  
... z_bob = zg | now | all[ET.Person] | select_by_field[RT.Name]["Bob"] | collect  
...   
... info = dg[z_alex][z_bob]  
... print(f"Edge information: {info}")  
  
Edge information: {'MetAt': 'Gym', 'Since': <Time 2022-07-08 07:55:57 (+0800)>, 'type': RT.FriendsWith}  
```  
  
### Simple characterisations  
  
Many simple NetworkX analysis functions will work directly on these graphs:  
  
```python  
>>> nx.node_connectivity(ug_all)  
  
1  
```  
  
```python  
>>> list(nx.connected_components(ug))  
  
[{<ZefRef #97 ET.Person slice=2>},  
 {<ZefRef #127 ET.Person slice=2>,  
  <ZefRef #135 ET.Person slice=2>,  
  <ZefRef #143 ET.Person slice=2>}]  
```  
  
```python  
>>> nx.greedy_color(ug_all)  
  
{<ZefRef #135 ET.Person slice=2>: 0,  
 <ZefRef #127 ET.Person slice=2>: 1,  
 <ZefRef #143 ET.Person slice=2>: 2,  
 <ZefRef #97 ET.Person slice=2>: 1}  
```  
  
```python  
>>> nx.shortest_path(dg_all)  
  
{<ZefRef #97 ET.Person slice=2>: {<ZefRef #97 ET.Person slice=2>: [<ZefRef #97 ET.Person slice=2>]},  
 <ZefRef #127 ET.Person slice=2>: {<ZefRef #127 ET.Person slice=2>: [<ZefRef #127 ET.Person slice=2>]},  
 <ZefRef #135 ET.Person slice=2>: {<ZefRef #135 ET.Person slice=2>: [<ZefRef #135 ET.Person slice=2>],  
  <ZefRef #97 ET.Person slice=2>: [<ZefRef #135 ET.Person slice=2>,  
   <ZefRef #97 ET.Person slice=2>],  
  <ZefRef #127 ET.Person slice=2>: [<ZefRef #135 ET.Person slice=2>,  
   <ZefRef #127 ET.Person slice=2>]},  
 <ZefRef #143 ET.Person slice=2>: {<ZefRef #143 ET.Person slice=2>: [<ZefRef #143 ET.Person slice=2>],  
  <ZefRef #127 ET.Person slice=2>: [<ZefRef #143 ET.Person slice=2>,  
   <ZefRef #127 ET.Person slice=2>],  
  <ZefRef #135 ET.Person slice=2>: [<ZefRef #143 ET.Person slice=2>,  
   <ZefRef #135 ET.Person slice=2>],  
  <ZefRef #97 ET.Person slice=2>: [<ZefRef #143 ET.Person slice=2>,  
   <ZefRef #135 ET.Person slice=2>,  
   <ZefRef #97 ET.Person slice=2>]}}  
```  
  
Many other NetworkX features work as above.  
  
### Complex algorithms  
  
Many of the NetworkX algorithms need to build up their own temporary graph to  
compute the output. This fails as a `ProxyGraph` is immutable. To work around  
this, a copy of the proxy object as a pure NetworkX object can be made using  
`to_native()`:  
  
```python  
nx.minimum_spanning_tree(ug.to_native())  
nx.maximum_branching(dg.to_native())  
nx.average_clustering(dg.to_native())  
```  
  
The nodes in a graph returned by `to_native()` are still thin wrappers around a  
`ZefRef` and can be used to get back to data on the original graph directly.