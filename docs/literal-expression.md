---
id: literal-expression
title: Literal Expression
---

  
### What are they?  
Literal values are the simplest kinds of values:  
Their literal expression should evaluate to the value itself. This may sound abstract and complciated, but is actually really easy:  
```python  
42  
```  
this is a literal value in native Python. There is not even an assignment to a variable here.  
When the Python parser sees this, it knows that this is a valid expression. In the interpreter, this will evaluate to the Python value object associate with the number "42".  
  
  
  
### Expressions or Statements?  
They are all expressions.  
  
  
### __repr__  
One other property of literal values, is that their repr returns a string, which is a valid string representation for the value itself.  
This makes it really easy to work with: you get out what you put in. There is no magic or any other state in the background that interferes with literal values. You can copy it from VSCode, send the string to a colleague over Slack. If they paste it into their Python REPL, they will have access to the identical values.  
  
  
### Value Semantics  
All literal values have value semantics. The value is not identified by the underlying object's identity, but it's value (no pun intended - there is just no easier way to say this).  
  
  
### Show me more Literal Values  
```python  
True  
1/137  
'Hello, Zef!'  
[1,2,3]  
{'a', 42}  
{'name': 'Zef'}  
```  
These are all literal values native to Python. Many of the builtin types in Python which make it so easy to get going quickly, are literal expressions.  
  
  
### Why are literal values so great?  
Because of their simplicity. You get exactly what is written down in literal form. Nothing more, nothing less.  
They're just plain data, like opening a text or json file: you get exactly what you see.  
  
Using more literal values in your programming language eliminates an entire group of potential bugs, since there are fewer surprises.  
Since their print output is the same as their input, you get the most fundamental type of serialization for free. They also make debugging of programs much simpler, since they reveal everything they are.  
  
  
### Can I create my Own Literal Values?  
Yes. here's an example:  
```python  
[class MyVal():](<class MyVal:  
    def __init__(self, x):  
        self.x = x  
      
    def __repr__(self):  
        return f'MyVal({self.x})'  
  
print(MyVal(42))                   # MyVal(42)  
print(MyVal(['hello', True, 1]))   # MyVal(['hello', True, 1])  
```  
As long as you initialize `MyVal` with another Literal value, you will get a literal value.  
  
  
### Which Literal Values does Zef Provide?  
Almost all Zef values are literal values.  
Exceptions are:  
- DB  
- DBState  
- FlatGraph  
- Arrays. Sets, Dicts (when too long)  
  
Some of the compound types may contain a large number of items in your program. Suppose you had a list of 10M elements: if you ever called repr to the consiole, it would take a very long time on most consoles (they're a bit slow) to print this. To avoid this problem for you, these types truncate the output if it is too big. This does however no longer make them literal values, since you can't reconstruct the entire value from the repr output 😥.  
  
