---
id: graph-formats
title: Graph Formats
---

  
  
Many file formats exist for representing graphs, including GraphML, GEXF, GML,  
LEDA, Pajek, SparseGraph6, etc ... If you want to import these into a  
Zef graph, this is the place to learn how.  
  
Instead of reinventing the wheel, we make use of NetworkX to first parse the  
file into memory.  
  
In this example, we'll use a example GraphML file of TODO: sample.graphml  
  
## Load into NetworkX  
  
```py  
import networkx as nx  
  
ng = nx.read_graphml("sample.graphml")  
```  
  
## Import into a Zef graph  
  
You can import the NetworkX graph as entities/relations on any Zef graph. Here  
we start with a blank one:  
  
```py  
from zef import *  
from zef.ops import *  
from zef.experimental.importers.general import inject_networkx_into_zef  
  
zg = Graph()  
inject_networkx_into_zef(ng, zg)  
```  
  
The return value of the `inject_networkx_into_zef` function is a tuple of two  
dictionaries, which map the ids in the NetworkX graph to the `ZefRef`s.  
  
```py  
zg = Graph()  
n_map,e_map = inject_networkx_into_zef(ng, zg)  
  
n_map["n0"] | Out[RT.Color] | value | run[print]  
```  
  
```  
green  
```  
  
## Import options  
  
### Translation options  
  
The import requires creating entities and relations and these must have types  
in the Zef graph (`ET.x` and `RT.y`). However, in the imported data these are  
type-less nodes and edges. You can control how the importer guesses the  
translation of these using the keyword options:  
  
- `ET_translation`  
- `RT_translation`  
- `fieldname_translation`  
- `aet_translation`  
  
The default translation tries to guess the ET or RT from the ID. But there are  
plenty of times where this is not right. For example, this TODO: sample data  
has only numeric IDs, which will convert to `ET.Node`  
in the default translation. You might want to instead import this as:  
  
```py  
inject_networkx_into_zef(ng, zg,  
                         ET_translation=always["Person"],  
                         RT_translation=always["Knows"],  
                         ignore_excess_ET_RT_types=True)  
```  
  
This makes all entities `ET.Person` and all relations between entities  
`RT.Knows`. The relation types for fields remain the same, determined from the  
key, e.g. `RT.Name` and `RT.Age`.  
  
### Store ID option  
  
The keyword argument `store_id` is set to `RT.ID` by default, meaning that node  
ids from the NetworkX graph are added to the created Zef entities by a `RT.ID`  
relation. If you want to disable this you can set `store_id=None`.  
  
## Exporting back to the same format  
  
This How-To is about imports only. Zef graphs in general can be meta-graphs and  
so might not be directly representable in any of the formats. However, one  
option we have is to use the [[ZefDoc - NetworkX Interface]] to view and then export your Zef  
graph to a file. For example:  
  
```py  
  
from zef.experimental.networkx import ProxyGraph  
import networkx as nx  
  
ng = ProxyGraph(now(zg), include_type_as_field=False)  
ng_native = ng.to_native(include_fields=True)  
nx.write_graphml(ng_native, "output.graphml")  
```  
  
Note that this will not reproduce the imported file exactly, unless some  
significant customization is applied to the ProxyGraph functions.  
