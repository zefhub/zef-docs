---
id: zef-ops-two-levels-of-laziness
title: ZefOps Two Levels of Laziness
---

  
  
This is a short explanation of two different ways in which ZefOps can be lazy. The two levels can even coexist.  
Knowing this distinction is not required for basic usage of Zef, but is aimed at advanced users.  
  
  
## Chained ZefOp Laziness  
  
Consider the expression  
```python  
my_val = 42 | iterate[add[1]] | take[4]  
```  
  
No computation occurs, since the chain is never triggered to evaluate. The expression simply evaluates to a lazy value. This lazy value is assigned to the variable called `my_val`.  
  
A lazy value in Zef also obeys value semantics. We can evaluate it at some later time, but we can also save the lazy value on a graph or send it over the network.  
  
This puts the caller in control and allows us to do things like working with infinite lists and other goodies.  
  
Suppose we were to evaluate this expression: what happens when we call the following?  
```python  
explicit_val = my_val | collect  
```  
  
  
## Usual Laziness  
  
The expression `42 | iterate[add[1]]` is actually the infinite sequence `[42, 43, 44, ...]`. If the evaluation engine would try to evaluate each part of the chain to an explicit list, we would never get past this stage.   
  
It therefore makes sense that when dealing with sequences / iterables, we resort to the typical Python approach in this case. Instead of returning tuples or lists, some operators can return lazy expressions such as iterables themselves when triggered. This is a different kind of laziness than that inherent to a ZefOp chain. Both are useful in different contexts.  
  
  
## References and Related Topics  
- [[ZefDoc - ZefGenerators]]  
