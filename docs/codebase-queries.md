---
id: codebase-queries
title: Codebase Queries
---

![](6d532654df99090ab3f3300625720cd9382e7ed4e60fba5ab5d19e8f034f2e65.png)  
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
