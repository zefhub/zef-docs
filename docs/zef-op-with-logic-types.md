---
id: zef-op-with-logic-types
title: ZefOp with Logic Types
---

  
  
  
  
```python  
from zef import *  
from zef.ops import *  
  
# trim any value that is an Int  
[4, 6, 'hello', 6.2, 7] | trim[Int] | collect  
  
# Python sets can also be used to define explicit   
# sets of values (which can be seen as a type)  
[4,6,'hello', 6.2, 7] | trim[{7, 4}] | collect  
  
# we switched everything over to types, since we   
# overloaded a whole lot of operators to take   
# both values and predicate functions. # e.g.   
split[' ']             # (NOT valid Zef anymore)  
# and  
split[is_uppercase]    # (NOT valid Zef anymore)  
  
# but now we run into edge cases. What if you have a list  
# of functions? Should the predicate function be matched  
# as a value or applied?  
  
# Using types combines both options succinctly and removes  
# the ambiguity.  
# Any predicate function can succinctly be wrapped up as a   
# logical type using "Is"  
split[Is[lambda x: x > 0]]  
  
```  
