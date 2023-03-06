---
id: types-of-zef-db-events
title: Types of ZefDB Events
---

  
ZefDB's simple data model makes it possible and relatively simple to systematically deal with changes to the DB over time.  
DB state and changes are complementary:  
- At any given time, the state of DB is a typed meta-graph (with value semantics - it will never changes)  
- Changes can be thought of as a set of "DB Events"  
  
and these two representations of the same information are complementary:  
- given any two states (pre and post), a unique minimal set of events relating these two states can be derived  
- Given any initial state and set of DB Events, the resulting state can be computed.  
  
Events are particularly useful when thinking and building systems dealing with the actual changes. State is useful when dealing with things at a fixed point in time, e.g. resolving a query or traversing a specific instance of your DB.  
  
   
  
  
### Types of DB Events  
There are 3 basic types of DB Events:  
- Instantiated  
- Terminated  
- Assigned  
  
`Instantiated` itself denotes a type and can be understood as the set of all instances of events where an atom was instantiated. A concrete instance of an event that is emitted wraps the actual atom, e.g.  
```python  
Instantiated(ET.Person('㏈-84365784637564675'))  
```  
Specifically, the wrapped atom is in the reference frame of the DB where the instantiation occurred with the time slice / state following the transaction in which the change occurred.  
  
  
### Event Subtyping  
All of the following denote types, i.e. sets of values. Using square brackets, one can specify subtypes, i.e. subsets of events  
```python  
Instantiated     # the set of all instantiation events  
```  
  
all events where an entity of type `ET.SalesOrder` was instantiated  
```python  
Instantiated[ET.SalesOrder]   
```  
  
all events where an entity of type `ET.Foo` or `ET.Bar` was terminated  
```python  
Terminated[ET.Foo | ET.Bar]  
```  
  
  
### Assignment Events  
Assignment event instances come with three values baked in:  
1. the reference to the attribute entity to which the value was assigned  
2. the previous value (pre)  
3. the new values (post)  
  
Inform me about any event if a value larger than 10 was assigned to an attribute entity of type Int  
```python  
Assigned[AE[Int], Any, Z>10]  
```  
  
A concrete event would be of the form  
```python  
Assigned(  
	atom=AE('㏈-4b36c74365764385af'),  
	pre=5,  
	post=10  
)  
```  
  
  
### Exploring Past Events  
Any database transaction represents a reified atomic change of the DB state. It is expressed as a set of DB events.  
  
```python  
my_tx | events               # return all events  
my_tx | events[Terminated]   # all terminated events  
my_tx | events[RT]           # all events where a relation was instantiated  
```  
  
  
### Creating a Real-Time Stream of Events  
The `on` operator is the counterpart to `events`: they take exactly the same subtypes as parameters, but whereas the latter allows you to explore the past, `on` gives you a stream which will contain the latest events as they occur.  
It is always used on a DB:  
```python  
my_stream = my_db | on[Any]           # listen to all events  
my_stream = my_db | on[Instantiated]  # inform me about instantiations  
```  
  
  
