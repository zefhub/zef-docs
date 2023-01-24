---
id: coordinating-computation
title: Coordinating Computation
---

  
The general computational model underlying Zef is quite lazy. Much lazier than what you're used to from normal Python. It may seem a bit awkward and complicated at first, but it allows you to write very expressive and declarative code which is decoupled from the computation. Only at the very end if some output or action is requested, is any real work done. In general, only the minimal amount of work is done and this is determined by the Zef runtime, allowing you to focus on the logic when writing code to solve your problem.  
  
  
Let's explore the different ways to trigger computation.  
There are three general categories of   
  
  
## Collect  
- pure computation: only a value is wanted  
- no other interactions with the outside world (aka side effects: e.g. sending an email, reading from disk, writing to a DB)  
```python  
x = [2,3,4,5] | map[power[2]] | sum     # x is a LazyValue  
  
# trigger compute: what is this concretely?  
x | collect  
  
# alternatives  
collect(x)  
x()  
```  
Note: in traditional Python a lazy value can be expressed by  a pure, reproducible function which takes no arguments. As seen in the last line, LazyValues in Zef also drop out naturally as such: function that take no args.  
  
  
  
## Executing Effects  
Writing as much of your code as pure functions is one of the few things which most experienced developers can agree on as being a good thing. This applies especially to the parts containing the core logic of your application.  
This is a noble goal, but in many cases the question is "what does this concretely mean?". "How can I do this principle to this very code I'm writing here?" ZefFX is a tool which can help you structure your application in this way by providing a friendly and convenient way to deal with side effects: a managed effect system.  
  
```python  
my_wish = FX.HTTP.StartServer(port=8000)    # pure data  
  
my_wish | run  
```  
You're handing your wish over to the runtime. Think of it as expressing the entire dirty task of interacting with the nasty outside world as data (sending it a message) and asking it "could you please do that for me?".  
The runtime will respond with a message or an error. In case of an error, this should be descriptive.  
  
  
  
  
### Executing Effect Streams  
  
Suppose you have a Stream of wishes (effects). Each time a new wish flows through the stream, you want it to be executed by the runtime.  
In this case you can simply "connect the hose to the runtime directly"  
```python  
my_stream_of_wishes | subscribe  
```  
In contrast to `run` which takes a single or a fixed list of wishes and executes the entire list, subscribe acts asynchronously: each time a wish appears it gets executed directly, one after the other.  
  
How to specify more advanced execution policies like  
- handling back pressure  
- handling wishes concurrently  
will be discussed in more detail later.  
  
Note: `subscribe` in it's raw form can be understood to have `execute` (the impure procedure that takes a wish and executes it) curried in as its default. You can also run you own impure procedures  
```python  
my_stream | subscribe[print]  
```  
will hook up the stream, activate the pipeline and call the (impure) function `print` on each value as it appears in `my_stream`.  
  
  
  
### Executing Wishes Sequentially  
  
  
