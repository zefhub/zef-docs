---
id: introduction-to-logic-types
title: Introduction to Logic Types
---

  
  
![](159f741a856a1b9a95d017f7e0015528fd2a8c2e40c53ee6469ee9b2835cc18e.png)  
source: https://unsplash.com/photos/E2vK9eAqpdg  
  
  
### TLDR  
Logic Types in Zef are should not be seen as an alternative or replacement of Python's type system, but rather as an extension and a tool to solve concrete problems. Built on set theory, it is the foundation for declarative query DSL, which is Python itself! It also connects and unifies the concepts of database schema with the language's type system and hooks into the type annotation system.  
  
  
  
  
  
## Zef Logic Types  
Most programming languages have a type system (it may not be static) and it is one of the core foundational parts of a language. To introduce new custom types in Python one typically uses classes:  
```python  
class Dog:  
	def __init__(self, name, color):  
		self.name = name  
		self.color = color  
  
rufus = Dog(name='Rufus', color='brown')  
```  
  
The class has two functions:  
- define the representation of the real world entity as data: what do these bytes mean?  
- define membership: the class `Dog` can be seen as the set of all dogs. We can test membership with `isinstance(rufus, Dog)`  
  
In Zef we distinguish between these two aspects. **Zef Logic Types** focus on the latter part in defining membership of a set. Given any value `x`, and any logic type `MyType`, one can ask the question of membership as   
```python  
is_a(x, MyType)     # returns True / False  
x | is_a[MyType]    # equivalent piping notation  
```  
i.e. `is_a` takes us from the land of types to predicate functions.  
  
Note that logic types are usually written in PascalCase, analogous to the casing convention for class names in Python.  
  
  
## How to Construct / Define Logic Types  
1. Explicit definition via a predicate function  
2. By composition from other types  
  
Let's start with the explicit definition approach. Suppose we want to define the set of all things longer than one. What do we mean with *length*? We could say that anything on which Python's `len` function can be called. We can encode this concept in a predicate function expressed as a normal Python function  
```python  
def has_length_one(x):  
	try:  
		return len(x) == 1  
	except:  
		False  
```  
  
This function implicitly defines a set: The set of all Python objects with length 1. Given any object, we can easily determine whether it is a member of that set. But we don't have a convenient language to talk about this set as a first class citizen in traditional Python.   
  
This is what the associated Zef Logic Type is: an explicit representation of this set as a plain value (i.e. as data).  
```python  
AllThingsOfLengthOne = Is[has_length_one]  
```  
  
We previously saw that `is_a` is a function that takes us from the land of types to the land of predicate functions. `Is` is the inverse: it is a simple wrapper that can absorb a callable and takes us from the land of predicate functions to the land of types / sets.  
  
We could now also define a new type by composition  
```python  
ListsOfLengthOne = Intersection[List, AllThingsOfLengthOne]  
```  
since we're saying that an element in the combined set must be a `List` (note that this is a Zef.List) **and** it must be of length one. As usual, there is a correspondence between the combinators acting on predicates and type combinators:  
- `And` ↔️ `Intersection`  
- `Or`   ↔️ `Union`  
- `Not` ↔️ `Complement`  
  
Using these combinators is very common for types and writing them out gets a bit tedious sometimes. You can also use a shorthand notation  
```python  
A & B    # equivalent to Intersection[A][B]  
A | B    # equivalent to Union[A][B]  
~A       # equivalent to Complement[A]  
```  
This is in full agreement with the syntax introduced by Python 3.10 for native Python types.  
  
If you have ever dabbled with logic, you may have heard that `and` / `Intersection` is equivalent to multiplication, `or` / `Union` is the counterpart of addition. For this reason Python magic method precedence rules use the same convention as the convention in arithmetic:  
```python  
2 + 4*10  == 2 + (4*10)    # `*` binds stronger than `+`  
A | B & C == A | (B & C)   # `&` binds stronger than `|`  
```  
Since the latter is not as common to most readers, it is recommended to add parentheses for clarity if the precedence rules are not visually clear.  
  
  
## Why?  
You may say "OK, fine. But what does this help me with concrete problems? This is just a trivial wrapper around predicates and there is nothing here I couldn't do with predicate functions?" That  
- Types often compose better than predicate functions (less noisy)  
- Expressing logic in types is more declarative than with predicate functions  
- Expressing constraints and requirements as types allows us to hoist this part out of the function bodies to the level of the type system  
- The separation of the concerns between constraints and **what** the functions does is a separation of concerns  
- The Zef Logic Type checker can hook into this information, since it is purely data and not intermingled with the core logic in functions. This opens a conceptually alternative route from MyPy for type checking Python code  
- The Zef Type system works across language and process boundaries (we used its ancestor across Python / C++ / Julia back in the days)  
  
  
Let's look at some more concrete examples.  
  
Write more Total Functions (ZefBlog)  
  
  
  
  
## Domain Types  
RAEs: Relations, Attribute Entities, Entities  
  
- **ET.Foo**: denotes the set of all instances of entities with this fundamental type. The only way our program can refer to a real world entity (or a concept we choose to model this way) is via a reference. Also see: [[Entities and Concepts don't live in the CPU]]. Here comes the crux. This set / type `ET.Foo` actually operates at a higher semantic level. It automatically discards references. This means any `z` of concrete type  `ZefRef` / `EZefRef` / `Ref`  referencing an entity of this type returns true for `z | is_a[ET.Foo]`  
  
- **Tuples**: Suppose we have types `T1, T2, T3`. The composite type `Tuple[T1,T2,T3]` denotes the set of all lists (it could be an array or generator) of length 3 (tuple types refer to fixed length), where the first element is of type `T1`, the second of type `T2`, etc.   
  Since this form of composition is very common (e.g. multi-ary function signatures), there is also a shorthand notation `(T1,T2,T3)`.  
  
- `RP` (RelationPattern): this refers to a set of RAEs fulfilling a specific property. `RP[Z, RT.Foo, ET.Bar]` denotes the set of all RAEs that when substituted in at the position of `Z`, have exactly one relation of type `RT.Foo` going out to an entity of type `ET.Bar`. Note that `Z` may appear at most at one position and that the other two positions are filled in by types (sets) themselves, that prescribes what the instance needs to match on. We can of course also use aggregate types, e.g . `RP[Z, RT.Foo, ET.Bar | ET.Bar]`. There are different utility types available to enable composing queries.  
- HasValue  
- SameAs  
  
  
- **Lists**: A list can also act as a container type and is different from the Tuple type in that it does not necessarily constrain the length of its elements. `List[T1]` refers to the set of all lists of variable length, where each element is of type `T1`. This can include logic types, e.g. `List[Int & Even]` where `Even = Is[lambda x: x%2==0]`.    
  
  
  
see also: Dictionary Queries in Zef  
  
  
  
  
  
## Zef Types are not Mutually Exclusive  
Both Lists and Tuples are not fundamental types (both an array and a generator) qualify as a list. Take the concrete array `v = [42, 'hello']`. There are many sets / types that this is part of. For instance, `v | is_a[T]` will be true for both `T = Tuple[Int, String]`, but also `T = List[Int | String]`, `List[String | Int | Graph] | Float`, etc.  
It is therefore not meaningful to ask for a value's (singular) logic type. There are infinitely many. You could however ask for a value's representation type, i.e. in which specific form is this value represented in bits. This question operates on a lower abstraction level though. When modeling our domain, we usually do not want to worry about the nitty gritty low level details of how something is represented in memory. We want to operate at the level of our domain and different parts of our code should ideally decide on the abstraction layer they operate on and try sticking to that (of course there may be legitimate exceptions, this is more a default rule of thumb).  
  
  
## Representation Types  
These can be seen as primitive types. Any data in our system must be represented in some form. Whether it is a String, an Array or a lazy Generator. Roughly speaking, Zef's representation types boil down to what is usually understood as a **type** in many programming languages.  
It is worth noting though that representation types themselves can serve as logic types. They denote the set of all values represented in the way they denote. e.g. `Int32`. The same conceptual value may be represented by different types though, e.g. 42 could be represented by a `Int8`, `Int16`, etc.  
As a consequence, equality of value does not imply equality of representation type. This may seem surprising at first, but is not idiosyncratic to Zef. e.g. in Python `42 == 42.0` returns True, but `type(42) == type(42.0)` is False.  
  
  
