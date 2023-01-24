---
id: zef-ops-two-levels-of-laziness
title: ZefOps Two Levels of Laziness
---

  
  
This is a short explanation of two different ways in which ZefOps can be lazy. The two levels can even coexist.  
Knowing this distinction is not required for basic usage of Zef, but is aimed at advanced users.  
  
  
## Chained ZefOp Laziness  
  
Consider the expression  
```python  
my_val = 42 | iterate[add[1]] | take[4]  
```  
  
No computation occurs, since the chain is never triggered to evaluate. The expression simply evaluates to a lazy value. This lazy value is assigned to the variable called `my_val`.  
  
A lazy value in Zef also obeys value semantics. We can evaluate it at some later time, but we can also save the lazy value on a graph or send it over the network.  
  
This puts the caller in control and allows us to do things like working with infinite lists and other goodies.  
  
Suppose we were to evaluate this expression: what happens when we call the following?  
```python  
explicit_val = my_val | collect  
```  
  
  
## Usual Laziness  
  
The expression `42 | iterate[add[1]]` is actually the infinite sequence `[42, 43, 44, ...]`. If the evaluation engine would try to evaluate each part of the chain to an explicit list, we would never get past this stage.   
  
It therefore makes sense that when dealing with sequences / iterables, we resort to the typical Python approach in this case. Instead of returning tuples or lists, some operators can return lazy expressions such as iterables themselves when triggered. This is a different kind of laziness than that inherent to a ZefOp chain. Both are useful in different contexts.  
  
  
## An Example  
  
If we're not dealing with iterables anywhere, this distinction does not come up.  
  
#### A) The first level of laziness  
Here's an example where there is only one level of laziness:  
```python  
answer = 10 | multiply[4] | add[2]  
```  
No computation is performed yet. To trigger computation, you can do one of the following:  
  
```python  
answer | collect  
collect(answer)  
answer()       # a lazy value is equivalent to a function that takes no arguments  
```  
  
Only once any of these expressions are formed, is the runtime instructed to do the actual computation.  
  
The runtime has the full expression to be evaluated as data: the initial value and a list of subsequent operators.   
The runtime starts with the initial value and feeds it through one function at a time. If type checking is to be performed, this can be done on this outer level, not polluting the inside of the function.  
  
In contrast to the typical approach of nesting function calls, this approach is "flatter". Suppose you had 10000 operators in the chain: with normal (possibly recursive) calls, a new stack frame would be added for each call and you may run into stack overflows (or recursion depth limits in Python). In the pipeline approach, the number of stack frames / memory overhead does not grow linearly with the number of operators.   
  
This triggering of compute once collect is called is the first level of laziness.  
  
  
#### B) The second level of laziness  
Let's look at another example and generate a large concrete list (sure, this could also be a lazy iterable, but that would just add complexity to the example)  
```python  
v = list(range(10000000))    
```  
and let's assume f_expensive is a function that takes an int and is expensive to compute  
```python  
answer = v | map[f_expensive] | first  
```  
  
This expression is also lazy in the same way that our first example was lazy: until we call "collect", nothing happens.  
Once we call collect collect, the runtime is handed this full expression as data (again: an initial value and a chain/list of operators). If all operators are pure functions (and well defined on the domain, blablabla ...), "answer" has some concrete value which is correct. The runtime task is to transform the symbolic expression into the concrete value. We could add some more wishes like a) do it as fast as possible, require as little memory as possible, etc.  
  
There are many ways to perform the calculation and come to the correct result.  
The easiest way for the runtime would be to do exactly what it did in (A): feed the full values through one step at time.  
The runtime could apply `map[f_expensive]` to the entire list of 10000000 elements, leading to another list of 10000000 elements. In the next step it would feed this long list to "first", which returns the first element from this list. This would be correct.  
But now it performed the expensive computation on the entire list, even though it only needed the first element. This is pretty wasteful: both in terms of CPU time and the memory resources used to store the intermediate list.  
We can make the runtime smarter about such issues in many ways, but pretty much always at the cost of increasing the complexity of the runtime.  
One way which is not too hard here is to piggy-back off Python's iterator protocol. Instead of returning a concrete list (aka array) of values, the map operator could just return a different concrete type. Something that represents the same list of values in spirit, but a type that has a computational paradigm baked in: a generator. The runtime could also handle this work itself (and reimplement something that leads to the same computational effort as the generator), but here we are lazy ourselves and piggy back off this tool that Python provides.  
The generator laziness is embedded in the iterator protocol: the downstream consumer of the value can always call "next" on the iterator and only then does "f_expensive" jump in and actually get called. This add another layer of indirection, but you have to pick your poison.  
In any case: now if we evaluate this expression and each operator that operates on Lists plays along with this protocol, the total amount of work is massively reduced. "first" only calls "next" once, leading to "f_expensive" being called only once. The runtime does not need to store the intermediate list of 10000000 elements, it only needs to store the current element and the generator object that is responsible for computing the next element.  
  
Note that this iterator laziness is independent of the LazyValue's high level laziness.  
  
  
  
## References and Related Topics  
- ZefDoc - ZefGenerators  
