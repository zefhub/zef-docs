---
id: data-first
title: Data-First?
---

  
# Data-First vs Data-Last Languages. Where Python Stands  
  
## Is 'idiomatic' Python data-first or data-last?  
To me it seems unclear / undecided (if you feel snarky, you could call Python 'confused') on this front. Let's look at some examples to demonstrate my point. Python has the three primordial operators built into the core language:  
```python  
import functools as ft  
  
map(lambda x: x+1, [1,2,3,4])             # data-last  
filter(lambda x: x%2, [1,2,3,4])          # data-last  
ft.reduce(lambda x, y: x+y, [1,2,3,4], 0) # "data-second"??? wtf?  
```  
While we're at it, let's also remark that `map` and `filter` return lazy values, but `ft.reduce` evaluates eagerly.   
  
Let's look at some functions from the core language's itertools:  
```python  
import itertools as it  
  
it.dropwhile(lambda x: x<5, [1,4,6,4,1])  # data-last  
it.islice('ABCDEFG', 2, None)             # data-first  
it.product('ABCD', repeat=2)              # data-first  
it.takewhile(lambda x: x<5, [1,4,6,4,1])  # data-last  
```  
hmmmm  
`x=45`  
What about functions / methods associated with classes? Let's look at Python's `str` splitting.  
```python  
'Umuntu ngumuntu ngabantu'.split(' ')  
```  
If we implement such methods for our own classes, how would we do that?  
```python  
class String():  
	def split(self, sep=None, maxsplit=-1):  
		...  
```  
In this case `self` would refer to the data (the object). Methods are also just functions in Python that are slapped onto the class. Hence, in Python's idiomatic object-oriented approach, methods are data-first: the first argument passed into the method is always the object on which the method is called and the dot notation is just syntactic sugar.  
  
So how do we remember where the data argument comes in the various builtin Python functions and what is the recommended approach in the language?  
![](6a59f90c760f549222285962bf4df5181ff983da72fe0ec9bd5024df14b80dbc.png)  
  
  
Personally, I find this lack of consistency of Python and Itertools a bit tedious: I often need to look up the order of arguments for some of the itertools functions I don't use on a daily basis.  
  
  
## The Principles for Zef  
Use a data-first approach throughout. This eliminates guess work. It also fits in well with Python's (possibly implicit) philosophy for functions with multiple arguments, some of which with default values: "less important arguments" (with defaults provided) come last in the function signature. Important arguments come first. The main data which is operated on can usually be considered an important argument.  
  
We refer to the very first argument of a ZefOp / Zef Function as the **data flow argument**. When piping functions, this is the data that flows through the pipeline, being transformed from one value to the next along the pipeline.  
  
If the dataflow argument is not provided, there is no way that the function has all parameters to start execution. We can therefore use this as a foundational principle in our system of lazy computation to create a rule when actual evaluation is triggered: once the data flow argument is provided.  
  
## Application to Currying  
This allows us to provide a convenient way to deal with the two usually somewhat problematic concerns:  
- currying of functions  
- dealing with function argument's default values   
- future topic discussed elsewhere: currying with keyword arguments  
  
## Role of  Square Brackets `[...]`  
As a general rule of thumb in Zef, the square brackets are used to "absorb" values. Absorption simply means that the resulting value is of similar external type, but it contains an additional nested value / attribute. You can think of it like nesting in JSON or adding an element to a list.   
This applies to Zef functions, ZefOps and Zef ValueTypes. These can all be thought of to contain a list of internally absorbed values.  
How can you access them? Using the "absorbed" ZefOp: e.g.  `my_operator | absorbed`  
  
Currying in of positional arguments is done using `[...]` operators.   
```python  
my_reduce = reduce[multiply][1.0]  
  
my_value = [1,2,3,4] | my_reduce     # this uniquely defines the value. But is not evaluated yet.  
  
# how to evaluate?  
my_value()  # a lazy value is equivalent to a pure function that takes no args  
my_value | collect   # collect triggers evaluation of values.  
```  
This adds one layer of indirection when compared to "normal" Python code.  Even for pure functions, we can specify all arguments without causing the calculation to run. We're decoupling the declaration of the value from computation. As you start using this pattern, you will hopefully start to see the power that it brings in different contexts. It is especially useful in the domain of distributed computation and distributed systems.  
  
## Backwards Compatibility  
One important aspect of Zef is to keep backwards compatibility with existing Python code. Even when dealing with Zef functions and ZefOps: you can **always**  still use them like regular Python functions . When used with good old parentheses and all required function arguments, evaluation is triggered eagerly.  
  
Applied to the example from above  
```python  
reduce([1,2,3,4], multiply, 0.0)  # with positional args  
```  
  
  
  
## Comparison to other Languages  
- Elixir: chooses a data-first approach. See [this post](https://elixirschool.com/en/lessons/basics/pipe_operator) and [this video](https://www.youtube.com/watch?v=9blsJnV0HpI) for a short discussion.  
- C++: the standard algorithms (even before ranges) also takes a [data-first approach](https://en.cppreference.com/w/cpp/algorithm/transform). So did [Eric Niebler in constructing RangesV3](https://ericniebler.github.io/range-v3).  
- F-Sharp: functions are curried by default and they go with a consistent data-last approach  
- Rescript is data-first and has a [built in pipe operator](https://rescript-lang.org/docs/manual/v8.0.0/pipe) `->` which automatically works with partial function application of the second argument onwards. This is syntactically closest to the Zef syntax.  
  
  
  
## Summary  
- `my_operator[...]` partially applies arguments  
- We have a strong syntactic distinction between   
	1. composing new functions via `[...]` and `|`  
	2. executing functions via `(...)`, `collect` and injecting the dataflow argument into the pipeline  
  
  
  
## References & Further Reading  
- Composing ZefOps and Data  
- An [excellent discussion](https://www.javierchavarri.com/data-first-and-data-last-a-comparison/) of data-first vs data-last Syntax and tradeoffs by Javier Chávarri.  
- Pipelining syntax proposal for C++: [Blogpost by Arthur O'Dwyer](https://quuxplusone.github.io/blog/2020/04/10/pipeline-operator-examples/), [official proposal](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2020/p2011r0.html) . Note that this proposal is also using a data-first syntax.  
