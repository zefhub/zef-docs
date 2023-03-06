---
id: specifying-sub-types
title: Specifying Sub-Types
---

  
This doc will give you a quick overview of what some of the most important typical types are and what their sub-types mean  
  
  
  
## Dict  
`Dict` denotes the set of all dictionaries.  
Two ways of specifying sub-types are possible:  
  
##### Key-Value type specification  
```python  
D1 = Dict[String, Int]   # all keys are strings and vals are ints  
  
{'x': 42, 'y': 1} in D1        # True  
{'x': 42, 'y': 'one'} in D1    # False  
```  
  
###### Listing Key-Value Pairs  
```python  
D2 = Dict['x': Int, 'name': String]  
{'x': 42, 'name': 'Bob'} in D2     # True  
{'x': 42, 'name': 'Bob', 'one_more': 1} in D2     # False  
```  
- The above notation "seals" the allowed key-value pairs. The required fields are listed.  
- the key is specified by value (the same in the type definition as in the value)  
- the value is specified by type  
  
##### Openness to Extension  
```python  
D2 = Dict[  
			'x': Int,   
			'name': String,  
			...                 # allow more key-val fields  
		]  
  
{'x': 42, 'name': 'Bob', 'one_more': 1} in D2     # False  
```  
if you want to only list the required fields and not care if additional ones are present  
  
  
## Lists  
Lists in Zef are a higher level syntactic construct than in Python: they do not refer to the concrete low level representation of a value, but rather indicate "a sequence of items".  
```python  
[2, 'hello', True] | is_a[List]      # True  
(5, 6, 7) | is_a[List]               # True  
```  
  
Subtyping a list `List[T1]` can be done specifying any type `T1`: the resulting set denotes the set of all lists where every element in the list is of type (contained in the set) `T1`:  
```python  
[3, 4, 5] in List[Int]    # True  
[3, 'hi'] in List[Int]    # False  
```  
Specifying a subtype for a list does not say anything about the length of the lists.  
  
  
  
## Tuples  
Tuples (aka product types) are similar to Lists, but each specified subtype is applied to the element at the respective position:  
```python  
T3 = Tuple[Int, Float, String]  
[2, 4.5, 'hi'] in T3     # True  
[2, 4, 'hi'] in T3       # False: second element mismatch  
[2, 4.5] in T3           # False: length mismatch  
```  
  
  
##### Openness to Extension  
Similar to Dicts subtyping: ellipsis can be used  
```python  
T4 = Tuple[Int, String, ...]  # allow additional elements  
[4, 'hi'] in T4               # True  
[4, 'hi', 1.1, 1.2] in T4     # True  
[4] in T4           # False: string required as second element  
```  
  
