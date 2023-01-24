---
id: getting-started
title: Getting Started
---

  
Welcome to Zef! This Quick Start is designed to give you a taste of the major ideas and concepts of Zef. If you haven't already, please go through the [ZefDoc - Glossary](glossary) to get an overview of some common terms used in Zef.  
  
Start at the top and work your way down!  
  
### Creating a new database (DB)  
  
```python  
# imports all the Zef tools you need  
from zef import *  
from zef.ops import *  
  
# creates a new empty database  
db = DB()  
```  
  
We plan on introducing user specific configs in the near future which will clean `import *`.  
  
For now, the imports unlock user friendly syntax and powerful Zef operators (ZefOps) which will be highlighted below.  
  
### Adding data to the graph  
  
The Zef graph data model is completely flat. There's no properties or data nested inside nodes.  
  
The fundamental parts of any graph are instances of  
- Entities  
- Relations  
- Attribute Entities (AEs), nodes to which values can be assigned over time  
  
In Zef, "|" pipe is overloaded so users can chain together values, Zef operators (ZefOps), and functions in sequential, lazy, and executable pipelines where data flow is left to right.  
  
```python  
# declare the data we want to write to the DB: a single entity with fields  
  
yolandi = ET.Person(  
	first_name='Yolandi',  
	country+of_birth='South Africa',  
)				   
  
db = DB()                     # create a new database  
p1 = run(transact(changes, db))    # write the changes  
  
# p1 is a reference to the entity in the DB now  
```  
  
Above, `ET.Person` defines the entity type "Person", This is not  are not a predefined type, you can write new   
use some different names like `RT.MyFavoriteRelation`.  
  
### Exploring the graph  
  
`yo` is a ZefOp that can be used in different contexts for useful information outputted in ASCII. You can think of `yo` as the Python `help` designed for Zef. When used on a graph it outputs a summary, on an instance an overview, and on a ZefOp a docstring.  
  
All Zef pipeline expressions are lazy by default. `collect` is a ZefOp used at the end of a Zef pipeline that makes it eager and returns a value. Without `collect`, the expression is just data.  
  
```python  
g | yo | collect            # outputs a detailed summary of the graph  
  
g | now | yo | collect      # outputs a summary of the latest time slice of the graph  
```  
  
`now` is a ZefOp that takes users to the latest time slice.  
  
```python  
p1 | yo | collect           # outputs an overview of a prior time slice of the specified node  
  
p1 | now | yo | collect     # outputs an overview of the latest time slice of the specified node  
```  
  
You will notice that `p1 | now` shows `RT.FirstName` as you're viewing the latest time slice which includes all actions that have occurred up to this point.  
  
### Traversing the graph  
  
Graph traversals can also be done using ZefOps.  
  
```python  
name_rel = p1 | now | out_rel[RT.FirstName]     # steps onto the edge  
name_rel | yo | collect                         # outputs overview of the edge  
  
name_aet = p1 | now | Out[RT.FirstName]         # steps onto the target  
name_aet | yo | collect                         # outputs overview of the target  
```  
  
The below ZefOps are used for traversals when there is exactly one connected RAE.  
  
`out_rel` traverses to an outgoing edge. `in_rel` traverses to an incoming edge.  
  
`Out` traverses to the target of an edge. `In` traverses to the source of an edge.  
  
These four ZefOps also exist in plural form: `out_rels`, `in_rels`, `Outs`, and `Ins`. These plural forms return a list of zero or more connected RAEs.  
  
### Retrieving values  
  
`value` is a ZefOp that retrieves the value on an AET node with respect to its time slice.  
  
```python  
current_name: str = name_aet | value | collect  
print(current_name)  
```  
  
### Triggering computation  
  
`run` is a ZefOp that triggers computation of a Zef pipeline (which is lazy by default) and runs the pipeline output through a function.  
If the pipeline output is an Effect, there is an implicit execute curried in that executes the Effect.  
Unlike `collect`, run does not return the output of the pipeline but runs it.  
  
```python  
current_name: str = name_aet | value | collect  
print(current_name)  
  
name_aet | value | run[print]  
```  
  
### Persisting graphs  
  
Persisting graphs requires a free ZefHub account. See the [ZefDoc - Installing Zef](installing-zef) on getting your ZefHub account.  
  
```python  
# This persists, syncs, and distributes all future changes via ZefHub in real-time  
g | sync[True] | run  
```  
  
Once a Zef graph is synced, all subsequent changes will be automatically persisted, synchronized, and distributed via ZefHub in real-time.  
  
### Sharing graphs  
  
We can also share graphs that are synced with ZefHub easily with others.  
  
```python  
# ---------------- Python Session A (You) -----------------  
g | uid | to_clipboard | run                        # every graph has an auto-generated uid  
# or  
g | tag['share-stories'] | run                      # a user-specified tag can be assigned to a graph  
  
"your-friends-email" | grant[KW.view][g] | run      # grants view access to our friend  
```  
  
`to_clipboard` is a Zefop that returns an Effect that copies data to our local clipboard.  
  
Our friend can access our graph with the shared uid or tag (you can mimic this by opening a separate Python shell).  
  
```python  
# ---------------- Python Session B (Friend) -----------------  
graph_uid = '...'                          # copied from Slack/WhatsApp/email  
g = Graph(graph_uid)                       # retrieve the graph using uid  
# or  
graph_tag = '<your-user-name>/share-stories'  
g = Graph(graph_tag)                       # retrieve the graph using a tag  
  
g | now | all[ET] | collect                # let's see all entities in the latest time slice  
```  
  
Our friend wants to add data to our graph as well.  
  
```python  
p2 = ET.Person | g | run                   # Oh no, this returns: Error('user has no append privileges')!  
```  
  
We previously only granted view access. We can grant append access to our friend, along with read-access for everyone.  
  
```python  
"your-friends-email" | grant[KW.append][g] | run        # grants append access to our friend  
"group:everyone" | grant[KW.view][g] | run              # grants view access to all ZefHub users  
"group:everyone" | grant[KW.discover][g] | run          # grants ability for all ZefHub users to search and discover  
```  
  
### Collaborating and live updates  
  
Let's subscribe to any changes that happen.  
  
```python  
# ---------------- Python Session A (You) -----------------  
g | on[Instantiated[ET]] | subscribe[print]     # we want to be informed any time an ET is added  
```  
  
Our friend can make multiple changes to the graph in one transaction.  
  
```python  
# ---------------- Python Session B (Friend) -----------------  
p1 = (g  
    | now  
    | all[ET.Person]  
    | single                                    # there is only one ET.Person on the graph so far  
    | collect  
)  
  
  
actions = [  
    (ET.Person['p2'], RT.Name, "Ninja"),        # 'p2' is an internal id / name  
    (p1, RT.FriendOf, Z['p2']),                 # Z is used to refer to entities by internal name  
]  
actions | transact[g] | run                     # convert the actions to a transact Effect and execute  
```  
  
Since we hooked up a subscription, a message will now show up in Session A.  
  
### Making changes and exploring past values  
  
A new value can be assigned.  
  
```python  
p1_name = p1 | Out[RT.FirstName] | collect  
p1_name | assign_value["Anri"] | g | run               # Atomic entities can have values reassigned  
```  
  
The complete versioned history can be viewed.  
  
```python  
p1_name | now | yo | collect                          # explore all history until latest time slice  
```  
  
### Time traveling  
  
Zef uses an immutable data structure, which means full versioning comes out-of-the-box.  
  
We can access any previous time slice with ease.  
  
```python  
# ---------------- Python Session B (Friend) -----------------  
p1_past_absolute = p1 | time_travel[Time('2021 December 4 15:31:00 (+0100)')] | collect   # go to an absolute time slice  
p1_past_relative = p1 | time_travel[-2] | collect                                         # go to a relative time slice  
```  
