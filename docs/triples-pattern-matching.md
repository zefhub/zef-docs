---
id: triples-pattern-matching
title: Triples & Pattern Matching
---

  
  
A triple of concrete instances `(z1, z2, z3)` where all z's are of type `ZefRef` can be understood as the pure data version of a fact. Facts correspond to concrete relations within a GraphSlice.  
  
To subscribe to certain types of facts appearing or being retracted (terminated) from our knowledge base, we can define corresponding sets / ValueTypes.  
  
#### Basic Example  
```python  
my_pattern = (ET.Person, RT.ActedIn, ET.Movie)  
```  
as a triple can be understood as a shorthand for  
```python  
my_pattern = Tuple[ET.Person, RT.ActedIn, ET.Movie]  
```  
which denotes the set of all triples of instances `z1, z2, z3` where **all** of the following are true:  
```python  
z1 | is_a[ET.Person]  
z2 | is_a[RT.ActedIn]  
z3 | is_a[ET.Movie]  
```  
  
Notice the structure of `my_pattern`: each of its three elements is a ValueType / set, as well as the resulting expression itself being a ValueType / set.