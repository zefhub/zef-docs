---
id: currying-and-partial-application
title: Currying and Partial Application
---

![](6b85bdd70f4092cc877ccff2cf1b39ae4f632904ab45b7d2825f5388520bd2ab.png)  
source: [Quinten de Graaf, Unsplash](https://unsplash.com/photos/L4gN0aeaPY4)  
  
  
  
### Currying  +  Data Pipelining  =  ❤️  
- pipelining requires functions that take exactly one argument  
- in languages / libraries with currying available, we can easily create these by call `(...)` with a single arg up to the point where one more argument would trigger computation  
- some people hate this tacit notation and find it less readable. Especially when they are not used to it in their programming language  
  
### How Currying does not go well with Optional Arguments  
- Optional arguments come last  
- How to know whether the optional argument will be given in the next call if args are given one at a time?  
```python  
def g(x, y):  
	return x+10*y  
  
# In languages that support currying out of the box, we could do  
g(2)(3)    # 32. But not in Python!  
g(2)       # returns a function equivalent to lambda y: 2+10*y  
  
  
def f(x,y,z=42):  
	return 100*x+10*y+z  
  
f(1)(2)      # return the final result or a function that takes z?  
```  
No good solution.  
  
Currying and data last languages go together well. See [[Data First Language]]  
e.g. `map(function, data)`. We want to pass the data in at the very last step, this should trigger computation.  
  
### How to solve this Dilemma in Python  
The language does not provide currying out of the box, but we can do something similar. Let us also extend the syntax that allows for more precise distinction between the dataflow argument and the others.  
  
**Requirements**  
- backwards compatibility of functions with traditional call syntax: both with and without keyword args  
- composability with piping  
- optional arguments should also be optional when curried  
  
```python  
functools.reduce(lambda x, y: x+y, [1, 2, 3, 4, 5])       # initial val is optional  
functools.reduce(lambda x, y: x+y, [1, 2, 3, 4, 5], 100)  
```  
Let's look at this in a data-first syntax  
```python  
@func  
def zef_reduce(data, f, initial_val=0):  
	return   
```  
  
For any function that will be chained, the `data` argument will never be optional. It is the main value that is transformed during this step. The other arguments can be seen as parametrically determining the properties of the transformation.  
In a sense, this is more aligned with the typical ordering of arguments in functions: the more important arguments appear earlier. Optional ones come last.  
  
How would we use this function in a pipeline?  
```python  
data = [1,2,3,4,5]  
f = lambda x, y: x+y  
initial_val = 0  
  
data | zef_reduce[f]                # use default arg  
data | zef_reduce[f][initial_val]   # optional arg specified  
  
# we can also still use it with regular non-piping syntax  
zef_reduce(data, f)  
zef_reduce(data, f, initial_val)  
```  
  
### So what are the rules?  
Zef functions and ZefOps can be called with square brackets, e.g. `reduce[f]` is a valid expression. Using square brackets never triggers the evaluation of the function. It is simply a terse syntax for partial application (or *absorption* of values, as we refer to this in a broader sense in Zef). If there are multiple arguments that are to be absorbed, the square brackets can be called multiple times.  
  
It is only when the data flow argument comes in, or if the function is called in the traditional Python style with `(arg1, arg2,...)`, that computation is triggered. This gives the suer very explicit control over which parts remain lazy and when evaluation is to be executed.  
  
This syntax plays nicely with optional arguments. Python's syntax that all argument absorption binds stronger than the piping of the dataflow argument. Hence, whenever computation is triggered, Zef has full access to all absorbed arguments and can determine whether optional arguments were specified or not.  
  
```python  
def my_func(arg1, arg2, arg3):  
	pass  
  
  
arg1 | my_func[arg2][arg3]  
```  
  
  
### Creating new Functions  
```python  
def my_add(x, y):  
	return x+y  
  
  
add_ten = my_add[10]  
  
32 | add_ten   # is still lazy, but fully determines the value.  
32 | add_ten | collect  # the dataflow input and collect are present: evaluation is triggered  
  
add_ten(32)    # evaluation is triggered imemdiately when `(...)` is used.  
```  
  
  
### Further Reading  
- Data-First vs Data-Last Languages. Where Python Stands?  
  
  
