---
id: user-value-type-advanced-typing
title: UserValueType Advanced Typing
---

  
### Non-Local Constraints  
Most constraints for DB schemas and objects act on the level of individual fields. For instance  
```python  
MyType = Dict[{  
	first_name = String,  
	year_of_birth = Int & (Z>1900)  
}]  
```  
defines the set of all dictionaries which  
1. contain the field `first_name` and the associated value is of type `String`  
2. contain the field `year_of_birth` and the associated value is of type `Int` and greater than 1900  
  
Not all constraints are decoupled though. Let's look at a more advanced constraint, where we only want to enforce that any minor has a guardian:  
```python  
MyType = (Dict[{  
    first_name = String,  
    age = Int & (Z>=0),      
}] &   
Implies[  
    Z.age < 18,  
    Z.guardian | zef_type == ET.Person,  
]  
)  
  
# Allow Implies syntax for Sets / Types?  
# What is this equivalent to? Subset?  
Children = ET.Person & (Z.age<18)  
PeopleWithGuardians = ET.Person & (Z.guardian | zef_type == ET.Person,)  
  
Children < PeopleWithGuardians   # to be seen as statement  
  
# another form:  
Implies[  
	V.x | contained_in[Children],  
	V.x | contained_in[PeopleWithGuardians],  
]  
```  
We can also use the Z-Expression notation for this - in this case within the Implies combinator. `Implies[Z...]` denotes the set of all values for which the first condition (if it is true) implies the second sentence.  
  
---- The above is on the level of types, below for sentences ----  
Note: `Implies[A, B]` is logically equivalent to `(not A) or B`.   
Example: The statement   
`If it rains, I will be wet`   
is  equivalent to  
`(It does not rain) or (I will be wet)`.  
  
  
  
