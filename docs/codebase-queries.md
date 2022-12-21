---
id: codebase-queries
title: Codebase Queries
---

  
  
![](d510b920414cefd4fb0f065ac19967f72c8ddfec7747d53ab7357a7fece9f672.png)  
by Stable Diffusion  
  
### Accessing Data Associated with ZefOps Relationally  
```python  
# return the list of all operators that act on dictionaries  
ops | all[OperatesOn(Dict)] | collect  
  
# list of related operators  
ops | all[RelatedOps(chunk)] | collect   
```  
  
- **OperatesOn**: given the data type, list operators that can operate on it  
- **RelatedOps**: show a list of loosely related operators  
- **UsedFor**: look which operators can be used in a loosely defined category  
  
  
  
### Programmatically accessing Source Code  
```python  
docstring(take_while)         # returns a string  
source_code(skip_until)  
```  
  
  
  
### What is the Source of Truth for this Information?  
It is currently defined in the operator docstrings.  
