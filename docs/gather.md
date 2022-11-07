---
id: gather
title: Gather
---

  
### Overview  
The `gather` operator allows you to efficiently "select" or gather subgraphs of certain atoms, starting from an initial set.  
  
The gather ZefOp executes a sequence of steps: in each step new atoms are added to the set according to your specified rules. T  
!ZefDoc - Gather 2022-11-05 08.51.55.excalidraw  
The gray region shows the selected nodes at each step.  
  
  
### Rules  
Suppose you're starting from one or a given set of ZefRef and you are interested in the "surrounding region" in the graph. The `gather` operator allows you to iteratively explore the region and "gather" neighboring nodes, resulting in a subgraph of the region.  
  
You can specify the traversal policy by specifying a declarative set of `rules`  
```python  
rules = {  
    'from_source': [  
        (Any, RT.Director, ET.Person),  
        (ET.Person,  RT.FirstName, AET.String),  
    ],  
    'from_target': [  
        (Any, RT.Writer, ET.Person,),  
    ]  
}  
```  
It is important not to confuse the traversal direction (steps taken by the algorithm) with the direction of the relations on the graph.  
The triples **always** denote `(source, relation, target)`.  
In the rules two sets of rules are specified  
- `from_source`: a rule when an already contained atom is at the **source**, this traverses the relation outwards to the target.  
- `from_target`: the "opposite", if an already contained atom is at the target, this traverses in the direction opposite to the relation direction.  
  
  
  
### Starting from a Set of Atoms  
Starting from an initial subgraph given as a list or set of ZefRef, calling `gather` will iteratively add new atoms to the subset.  
```python  
my_subgraph = [z1, z2, z3] | gather[rules]  
```  
- Note: the algorithm halts once no new atoms are found (i.e. which were not already present in the previous iteration).  
  
  
  
### Early Stopping   
The algorithm exits early in adding new atoms to the frontier.  
Specifying the parameter `max_steps` defines a hard cutoff for the maximum number of iterations.  
```python  
my_set = g | now | all[ET.Movie]  
max_steps = 2  
  
my_set | gather[rules][max_steps]  
```  
- **Why is this useful?**: Calling `gather` without that may lead to a larger subgraph than you are interested in (e.g. for displaying). Setting this optional parameter allows additional control over the resulting subgraph.  
  
  
  
### Starting from a single ZefRef  
You can also call gather on a single atom (a ZefRef pointing to it). This is equivalent to calling it on the list / set containing only this one element.  
```python  
z1 | gather[rules]  
```  
  
