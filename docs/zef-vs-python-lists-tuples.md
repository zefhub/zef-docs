---
id: zef-vs-python-lists-tuples
title: Zef vs Python Lists & Tuples
---

  
We use these terms with a somewhat different meaning than their connotation in Python.  
  
### Python  
These Python types say a lot about the **representation** of the data.  
- List: a mutable data structure. It's type says something about the data representation: contiguously stored pointers to Python object, it cannot be lazy  
- Tuple: an immutable data structure, very similar to a Python list otherwise  
  
  
### Zef Lists and Tuples: Logical Types  
`zef.List` and `zef.Tuple` say something about the **logical form of the data**. A given value could be both a List and a Tuple of a certain kind.  
  
e.g.  
```python  
T1 = List[Int]            # the set of all 1d sequences where each element is an Int  
[1, 5] | is_a[T1]         # => True  
[1, 5, 42] | is_a[T1]     # => True  
  
T2 = Tuple[Int, Int, Int]  
[1, 5] | is_a[T2]         # => False: does not have three elements  
[1, 5, 42] | is_a[T2]     # => True  
```  
  
  
### Laziness  
Specifying that a value is a Zef List or Tuple says nothing about whether it is lazy or "fully evaluated", i.e. the computational policy. This means that also a lazy sequence  
```python  
# infinite (lazy) seuquence of Fibonacci numbers  
fib = (0, 1) | iterate[lambda p: (p[1], sum(p))] | map[second]  
```  
is considered a `List[Int]`.  
Side note for the experts: asking this question for infinite sequences may be undecidable.  
  
Streams are also considered to be Lists over time. e.g. a `Stream[Int]` is a subtype of `List[Int]`.  
  
  
### List Subtyping  
A single type can be specified as a subtype for a list:  
```python  
List[T1]  
```  
can be understood as a the set of all lists where each element is of type `T1`. It says nothing about the length of the list.  
The bare form `List` is equivalent to `List[Any]`, i.e.  is the union of all subtyped lists.  
  
  
### Tuple Subtyping  
A list of subtypes can be specified for a Tuple  
```python  
T3 = Tuple[String, Float]      
['hi', 3.2] | is_a[T3]        #  ✅  
['hi', 3.2, 1] | is_a[T3]     #  ❌ length does not match  
```  
The element at each position needs to match the specified type.  
  
  
### Relation to Python's Typing Module  
```python  
import typing  
  
  
```  
  
  
  
  
### Further Material  
- Zef Tuples can be understood as [product types](https://en.wikipedia.org/wiki/Product_type)  
