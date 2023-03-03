---
id: building-data-pipelines-with-zef-ops
title: Building Data Pipelines with ZefOps
---

  
  
In our [first tutorial](manage-your-data-with-zef-db), you would have seen the term "ZefOp" being brought up a several term. In fact, it's one of the core feature that makes programming with Zef so powerful, easy, and most importantly, fun!   
  
By the end of this tutorial, you should be familiar with the overall concept of a ZefOps, and should be able to harness the full power of it and slot it in into your python project easily.  
  
#### What is it?  
A ZefOp is a function that can be executed lazily and used in a composable way, just like a regular function. Lazy evaluation means that the function's execution is delayed until it's explicitly triggered. This enables the compiler to optimize the code when many lazy functions are chained together, leading to better performance compared to regular Python functions.  
  
For example, `first` is a ZefOp that is included in the core Zef library. It returns the first item of an iterator that matches a specified type. We can use ZefOp with regular function call syntax, like so:  
  
```python  
first([1,2,3,4])                      # 1  
```  
  
The functions above were evaluated eagerly. However, when used with the pipe operator, we can convert it to an expression that is evaluated lazily until we call `collect` at the end of the pipeline:  
```python  
[1,2,3,4] | first | collect           # 1  
```  
  
#### The Pipe Operator  
The pipe operator is a feature in programming languages that allows you to chain functions and operations together. In Zef and in most cases, the pipe is represented by a vertical bar `|`. It is commonly used in functional programming languages like Unix shell, R, Elixir, Elm, F#, and others.  
  
The pipe operator takes the output of one function and passes it as the input to the next operation in the chain. Consider the following example:  
```python  
[1,2,3,4] | first | int_to_alpha | collect  # b  
```  
  
1. `[1,2,3,4]` is passed as in input to `first`  
2. the output of `first` is passed as input to `int_to_alpha`  
3. `collect` is used at the end of a ZefOp chain to trigger the evaluation  
  
##### Motivation   
Piping is a common technique in many programming languages, and it's used for a few key reasons:  
1. It avoids excessive nesting, making code more readable by allowing data to flow from **left to right**:  
```python  
result = x | func_a | func_b | func_c | func_d | collect  
```  
  as compared to the normal way, which reads from **right to left**:  
```python  
result = func_d(func_c(func_b(func_a(x))))  
```  
  
2.  It makes it easy to debug and inspect intermediate values. We can easily comment on any part of a multiline data pipeline:  
```python  
result = (  
	x  
	| func_a  
	| func_b  
	| func_c  
#	 | func_d  
	| collect  
)  
```  
    
Common alternative to nesting function are   
1.  Intermediate variable names / states  
```python  
a_output = func_a(input_data)  
b_output = func_b(a_output)  
c_output = func_c(b_output)  
d_output = func_d(c_output)  
```  
  
2. Mutating variables  
```python  
x = func_a(x)  
x = func_b(x)  
x = func_c(x)  
final_result = func_d(x)  
```  
     
  
  Excessive naming is time-consuming and adds little to readability, while mutating variables can make debugging difficult. We believe functional pipelining promotes high-quality, readable, and consistent code.  
  
:::info  
  
In Zef, the pipe operator is implemented using operator overloading, and specifically, the `__or__` and `__ror__` method is overloaded to support the pipe operator. These are the Python method that corresponds to the `|` operator, and it's typically used for bitwise OR operations, but it can be overloaded to perform other operations. Check this [article](https://www.programiz.com/python-programming/operator-overloading) out on Operator Overloading in python.  
  
:::  
  
  
  
#### Argument Currying  
Argument currying is a powerful technique in functional programming where a function that takes multiple arguments is transformed into a series of functions, each of which takes a single argument. Zef is a data first language, and the syntax for currying is visualized by the following diagram.  
  
!500  
  
  
For example, the `add` operator takes in 1 argument:  
```python  
1 | add[2] | collect      # => 3  
```  
  
which is equivalent to a python function like the following:  
```python  
def add(x, y)  
	return x + y  
```  
  
Read more about argument currying [here](currying-and-partial-application), where we will have a deeper look in some of our design choices made to enable currying in python.  
  
#### Triggering Evaluations  
All Zef pipeline expressions are **lazy by default**. `collect` is a ZefOp used at the end of a Zef pipeline that makes it **eager** and returns a value. Without `collect`, the expression is just data. If you have been working with tools such as Apache Spark for data processing, you should be familiar with this concept, else you can refer to one of our topic - Lazy vs Eager Evaluation.  
  
#### Most Commonly Used ZefOps  
  
Now, we have explained the core concepts of ZefOp, let's look at some commonly used operators that ships along with the core library.   
  
```python  
# filter  
[1,2,3,4,5] | filter[lambda x: x%2 == 0]   # => [2, 4]  
  
# map  
[3, 4, 5] | map[lambda x: x+1]             # => [4, 5, 6]  
  
# reverse  
[2,3,4] | reverse                          # => [4,3,2]  
  
# nth  
[1,2,3,4,5] | nth[-2]                      # => 4  
  
# match  
 -9 | match[(  
	{24, 42}, lambda x: f'a very special temperature'),   
	(Is[less_than[-10]], lambda x: f'it is a freezing {x} degrees'),  
	(Is[less_than[10]], lambda x: f'somewhat cold: {x} degrees'),  
	(Is[greater_than_or_equal[20]], lambda x: f'warm: {x}'),    
	(Any, lambda x: f'something else {x}'  
)] # => 'somewhat cold: -9 degrees'  
  
```  
  
You may have seen similar named operators in other programming languages. In fact, Zef took inspirations from the good things from many different language. Also, We use these operators all over within Zef codebase!  
  
#### ZefOps Discovery  
Another powerful feature of ZefOp is the ability to easily discover available operators for a given use case. In addition to the `yo` operator mentioned earlier, you can use the `all` operator to search for operators that you might need but are not yet aware of. For example, to get a list of all the operators that work on a `List`, you can use the following code:  
```python  
ops | all[OperatesOn(List)] | collect  
```  
  
  
  
and you will get the whole list of operators that operates on a `List`.   
  
To learn more about discovering ZefOp, sheck out the [Finding ZefOps](finding-zef-ops) page in the Zef documentation.  
  
#### Writing Your Own ZefOps  
What if the function you wanted does not exist within the core ZefOps? Fear not, you can define your own function, convert it into a ZefOp just with a `@func` decorator, and use it like a normal ZefOp in your pipeline.   
  
```python  
@func  
def my_fancy_op(x):  
	return (x + 10) * 3  
  
10 | my_fancy_op | collect     # => 60  
```  
  
In the future, Zef plans to provide a platform for sharing custom ZefOps with others via ZefHub, creating a rich ecosystem where code sharing and live collaboration is made easy.   
  
#### ZefOps in Action  
_Advent of Code_ is an [Advent calendar](https://en.wikipedia.org/wiki/Advent_calendar) of small programming puzzles for a variety of skill sets and skill levels that can be solved in [any](https://github.com/search?q=advent+of+code) programming language you like. Let's see how we can use ZefOps in python to solve one of the Puzzle.  
  
We'll look at [AOC 2022 Day 1](https://adventofcode.com/2022/day/1).  
  
Given an input:  
```python  
data = """\  
1000  
2000  
3000  
  
4000  
  
5000  
6000  
  
7000  
8000  
9000  
  
10000\  
"""  
```  
There are groups of numbers, e.g., `1000 2000 3000` and `4000` are each a group, respectively. The solution is to find the group whose sum of all numbers is highest and return the sum. The answer to this set of input is `24000`.  
  
Solution:  
```python  
(  
	data  
	| split['\n']  
	| split['']  
	| map[map[Int] | sum]  
	| max  
	| collect  
)  
```  
  
Thats it! Writing data transformation pipelines with ZefOps is succinct and intuitive.  
  
#### Recap  
Congratulations on completing this tutorial! Throughout the guide, we have covered the following topics:  
  
-   An introduction to ZefOp and its syntax  
-   Commonly used ZefOps  
-   Advanced features of ZefOp, including operator discovery  
-   A real-life example of ZefOp usage  
  
With this knowledge, you are well-equipped to utilize ZefOp in various data transformation tasks. In the next [tutorial](deploying-a-backend-with-a-graph-ql-api), we will explore how to use ZefOp to build a backend with GraphQL and Zef.