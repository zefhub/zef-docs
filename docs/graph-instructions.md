---
id: graph-instructions
title: Graph Instructions
---

  
### Definition  
A set of minimal instructions to perform state transitions on graphs. Any change can be expressed as a set of graph instructions.  
  
There are 4 different types of graph instructions:  
1. Instantiations  
2. Terminations  
3. Value assignments  
4. Tagging  
  
  
  
### Example of Graph Instructions  
```python  
instantiate[ET.Person]  
terminate[z1]             # z1 is a ZefRef/EZefRef/Ref/FlatRef  
assign[z2][42]  
tag[z3]['my favorite atom']  
```  
  
  
### Related  
- a list of graph instructions is called a [graph command](graph-instructions): an aggregate set of changes to be performed that are mutually consistent.