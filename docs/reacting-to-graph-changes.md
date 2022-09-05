---
id: reacting-to-graph-changes
title: Reacting to Graph Changes
---

  
In this section you will learn how to set up subscriptions on graphs. It is assumed that you are familiar with  
- ZefDB graphs  
- Declarative queries in Zef  
  
  
## Basic Example  
Suppose we want to be informed each time a new movie is added to a graph `g`. We can simply write  
```python  
my_stream = g | on[Instantiated[ET.Movie]]  
```  
  
A few points to note:  
- basic subscription are always done on the eternal graph `g`, since a GraphSlice is immutable and never changes  
- subscriptions returns streams of events: a collection over time.  
- `Instantiated` is a ValueType in Zef and can be seen as the set of all concrete instantiation events.  
- `Instantiated[ET.Movie]` is also a (parametrized) ValueType and denotes the subset of instantiation events where an entity of type `ET.Movie` was instantiated on `g`  
  
  
## Event Types  
There are four elementary types of events that can occur on ZefDB graphs:  
1. `Instantiated`: any Atom can be instantiated  
2. `Terminated`: termination events of an Atom  
3. `Assigned`: an event where a value is assigned to an AttributeEntity  
4. `Tagged`: an Atom is tagged within the context of the graph  
  
  
  
## Concrete Event Instances  
An actual event always refers to a concrete Atom for which it occurred. An example of such a concrete event is `instantiated[z1]` where `z1` is a ZefRef to an entity of type `ET.Movie`. The reference frame of `z1` is the resulting state **after** the transaction where the event occurred on the graph where the subscription is set up.  
  
Analogously, there are events of the form   
- `terminated[z1]`  
- `assigned[z2][41][42]` denotes the event where the previous value of the AttributeEntity `z2` was `41` and the new value `42` was assigned  
- `tagged['my favorite node'][nil][z3]`: the first arg is the tag (a string), the second arg is a ZefRef to the Atom the tag was previously pointing to (`nil` if there was none) and the third arg is a ZefRef to the Atom it is pointing to  
  
  
## Zef ValueTypes for Events  
Note that the instances are written in lower case, since they are not the `ValueType`. The statement  
```python  
instantiated[z1] | is_a[Instantiated]    # => True  
```  
would evaluate to `True`, i.e. they are of that type.  
  
We could also ask more specific questions:  
```python  
# suppose z1 is a ZefRef to an instance of type ET.Movie  
  
instantiated[z1] | is_a[Instantiated[ET.Movie]]     # => True  
instantiated[z1] | is_a[Instantiated[ET.Person]]    # => False  
```  
  
  
  
## Composite Types 🖇  
We can also use the combinators to construct composite ValueTypes and subscribe to these.  
```python  
Person = ET.Actor | ET.Director | ET.Person  # composite type  
new_person_stream = g | on[Instantiated[Person]]  
```  
  
  
  
## Triples & Pattern Matching  
See [[Triples & Pattern Matching (ZefDoc)]] for a discussion on the triple of types.  
  
```python  
my_pattern = (ET.Actor, RT.ActedIn, ET.Movie)  
g | on[Terminated[my_pattern]]  
```  
This creates a stream that emits an event each time a new relation which fits this pattern is terminated.  
  
We can also loosen some requirements, for example we may not care about the specific node attached as the target of the relation  
```python  
g | on[Instantiated[ET.Actor, RT.ActedIn, Any]]  
```  
where `Any` can be understood as the set that contains **all** possible values.  
  
We may also be interested when a specific actor acts in a new movie  
```python  
# suppose z_ninja points to a specific ET.Person  
  
g | on[Instantiated[{z_ninja}, RT.ActedIn, ET.Movie]]  
```  
Note that the instance is wrapped using a Python set `{z_ninja}`, since the triples denoting sets / patterns to match on are always composed of sets themselves. Instances are not automatically promoted to sets containing one element by Zef, but Python sets are interpreted as such where a ValueType is expected.  
  
  
  
## Subscribing to Specific Value Changes  
  
Suppose you're interested when a rating for a certain movie reaches a very specific value.  
```python  
# suppose z_rating is a EZefRef pointing to an AET[Int]  
g | on[Assigned[{z_rating}][Any][{4}]  
```  
1. First argument: this says that we're listening for assignments to exactly one AttributeEntity.  
2. Second argument: the set of values that the assigned value must have had **before** this assignment event.  
3. Third argument: the set of values the newly assigned value must be in.  
  
##### Using more advanced ValueTypes  
Suppose you're interested   
  
  
