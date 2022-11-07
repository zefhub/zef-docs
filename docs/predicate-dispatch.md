---
id: predicate-dispatch
title: Predicate Dispatch
---

  
An extension of dynamic dispatch that allows matching on arbitrary predicate functions (extending from a tree-like structural type hierarchy).  
  
Predicate dispatch can be seen as a subset of predicate dispatch.  
  
In Zef predicate dispatch drops out for free from the `match` operator:  
```python  
transmogrify = match[  
	(Int,    tm_int),  
	(Float,  tm_float),  
	(String, tm_string),  
]  
```  
  
  
### Exhaustiveness Checking  
Since the predicates (dispatch conditions) are specified as transparent data (not code), the Zef type checker can plug in and see whether any cases are unhandled when given the type of input argument.  
  
How can this be done? By compiling the problem to a SMT / SAT problem and using a solver like Z3. IThe SAT problem can be formulated as: find a value which is of the input type, but does not lie within the set union of all types in the match expression. If such a value exists, this is a counter-example that can be shown to the user and is informative. If it can be proven that no such value exists, the exhaustiveness check passes.  
  
A third option is that this cannot be proven (too expensive or Gödel's theorem), in either case this can be handled with a timeout and answering "unknown".  
