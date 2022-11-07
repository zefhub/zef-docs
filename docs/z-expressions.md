---
id: z-expressions
title: Z-Expressions
---

### What are they?  
"Z-Expressions" allow you to express ValueTypes (sets of values) concisely in terms of logical conditions.  
They are distinct on the type level (of Zef type `ZExpression`).  
  
  
### Examples  
```python  
# the set of all things greater zero  
Positives = (Z > 0)  
  
42 in Positives    # => True  
-42 in Positives   # => False  
0 in Positives     # => False  
```  
  
  
### Composition  
Since Z-Expressions are ValueTypes, they can be combined with other ValueTypes using ValueType combinators  
```python  
SmallPositiveInts = Int & (Z>0) & (Z<10)  
  
4 in SmallPositiveInts      # => True  
4.1 in SmallPositiveInts    # => False, not an Int  
42 in SmallPositiveInts     # => False, too big  
```  
  
  
### Composition with ZefOps  
You can also use any ZefOp (including user-defined Zef functions) within Z-Expressions:  
```python  
SpecialList = (Z | sum == 42)  # Lists that add up to 42  
  
[10, 32] in SpecialList     # True  
[1,2,3]  in SpecialList     # False  
```  
  
  
### Use with Fields  
```python  
# the Field ZefOp is just a regular function  
Z | F.Name == 'Bob'    # the set of all things named `Bob`  
  
# use of high level language  
Z.age > 42    # the "field" notation may hook into resolver fcts  
```  
  
This notation is particularly useful when writing queries.  
```python  
# all persons called `Bob Smith` born before 1942  
MyQuery = (  
 ET.Person &              # denotes a set of entities by type  
 (Z.first_name=='Bob') &  
 (Z.last_name=='Smith') &  
 (Z.year_of_birth < 1942)  
)  
```  
  
  
  
  
### Types  
```python  
zef_type(Z)                    # ZExpression  
zef_type(Z | first)            # ZExpression  
zef_type(Z | first == 42)      # ValueType  
zef_type(Z | first > 42)       # ValueType  
```  
Z-Expressions bind stronger than other ValueTypes. Composite expressions are also Z-Expressions **UNTIL** a binary logic operator (`==`, `!=`, `<`, `>`, `<=`, '`>=`') is encountered: at this point the entire expression converts to a ValueType.  
You can think of the resulting ValueType being a wrapper around a predicate function.