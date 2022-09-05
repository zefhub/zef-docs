---
id: using-zef-fx
title: Using ZefFX
---

  
  
## A Declarative Approach  
Instead of performing side-effectful operations eagerly, the Zef's managed effects system (ZefFX) allow you to declare what you would do.  
It allows separating the intent from the execution.  
  
This may take a bit of getting used to, but is an extremely useful tool to make your code more testable and decoupled: it allows you to write a much larger part of your business logic code as pure functions, which returns data structures describing what effectful operations on the outside world should be performed. These data strictures describing the **intent** are called "wishes" in Zef.   
  
  
## Wishes  
They are pure data. In fact they are just simple Python dictionaries that know which type of wish they are and contain all data that is required for the execution of the effect by the effect system.  
  
  
  
## Basic Example  
  
Let's look at a **wish** to express the intent of copying text to the clipboard  
```python  
my_wish = {  
 'type': FX.Clipboard.CopyTo,  
 'value': 'hello world'  
}  
```  
where `FX.Clipboard.CopyTo` is a literal value.  
  
  
## Execution  
To actually execute the effect, we can use the function called `execute`. It takes a wish and attempts to execute it in a controlled environment using the effect handler associated with that specific type of effect.  
```python  
run(my_wish)  
```  
Since this is an impure operation, this is wrapped in `run` (see ...)  
  
  
## Shorthand Notation  
Instead of writing out the dictionary as above, one can also use the shorthand notation  
```python  
my_wish = FX.Clipboard.CopyTo(value='hello world')  
```  
The effect type itself can be seen to act as the constructor. The expression evaluates to the same dictionary as above.  
  
This notation has the following advantages:  
1. it is shorter  
2. Fail early: if specified by the effect module, a verification check is performed at the point of construction. If parameters are invalid or missing, an informative error is returned at this point. This prevents the error occurring further downstream when execution is attempted.  
  
  
## Analogy with an HTTP-Based Service  
The core idea of Zef's managed effect system is to encapsulate the icky interaction with the outside world. All communication with this system is done via messages.  
This pattern is very similar to one that you may be familiar with from typical we services. Suppose you had to interact with an "email sending service" that exposes an HTTP API. It exposes different functionality under different end points. All communication with it is done via encoding your data as json and sending request-response queries to its HTTP API.  
The differences of Zef's effect system is that   
  
|                           | HTTP Service                  | ZefFX                               |  
| ------------------------- | ----------------------------- | ----------------------------------- |  
| **data**                  | serialized JSON               | plain Python data structures        |  
| **communication**         | typically over the network 🌿 | local in process / over the network |  
| **communication pattern** | request-response              | request-response / stream-based     |  
| serialization overhead    | conversion to JSON / parsing  | None                                |   
