---
id: user-value-types
title: UserValueTypes
---

  
Suppose you want to create a special type to represent some value. Let's consider a type `Email` as an example. Three different parts may be specified when creating a new UserValueType:  
1. the type name: a string which is also used in the `repr` etc. Note that a UserValueType is not defined by its name, but has an additional internal uid.  
2. a representation type. Once constructed successfully, how is the data represented? For `Email`, it would be natural to use a string.  
3. constraints: what should be checked and which invariants guaranteed for each instance of this type? A Zef logic type is passed here (arbitrary predicates can be succinctly expressed this way)  
  
  
### Preventing Mismatches  
Maybe your "Person" type has an email field. We could use a String for its type. Every email address can always be represented by a string and this would work.  
But maybe we want to prevent problems as our system grows and require the user to be more specific. They must use our type `Email` to assign a value to a field, rather than a generic string.   
  
  
### Checking Constraints  
Arbitrary constraints (by wrapping a predicate function or composition) to be checked at the time when constructing an instance of a UserValueType can be specified at the time of instance construction.  
  
  
### Distributed Types  
UserValueTypes once created can be distributed over the network. What does this? Suppose you create a new type. You can treat the type like a Zef value, which means you can push it into a stream, assign it to an attribute entity, use it as an element in a list, etc.  
Once a user on another computer has hold of a UserValueType, they can create instances of that type.  
  
  
### Value Semantics  
The instances obey value semantics.  
  
  
### Nominal Typing  
Note that UserValueTypes are Nominally typed: suppose two users on the Zef network would both create a type they call `Email`. These two types would not be considered to be the same type, even if all internals are the same. You can think of the type itself having an identity (managed for instance by an uid). This is what is called nominal typing.  
  
  
### Why not use Python Classes?  
The analogy to using Python classes and achieving similar functionality by putting checks into the constructor may be obvious to you.  
So why recreate all this functionality? There are various reasons:  
- UserValueTypes are data. This means that when new types are added, no changes to the source code are made. No Docker images need to be redeployed.  
- Instances of UserValueTypes are automatically Zef values. No manual serialization is required when sending them over the wire. They can be stored as first class citizens on graphs. These values will automatically have bindings to various languages which Zef supports.  
- UserValueTypes atomically fit into the Zef Type System. You can ask `is_a(my_instance, my_type)`.  
  
  
### Example 1  
```python  
# define a new UVT  
Email = UserValueType('Email', String, Is[contains['@']] )  
# structure:    (type name, representation type, constraints)  
  
# construct an instance of this type  
yolandis_mail = Email('yolandi@zefhub.io')      # succeeds  
ninjas_mail   = Email('ninja_at_zefhub.io')     # fails: no "@"  
```  
  
  
### Type Specialization  
One can use UserValueTypes in function signatures to be more restrictive  
 ```python  
def send_email(address: Email):  
	...  
   
send_mail(yolandis_mail)          # valid  
send_mail('yolandi@zefhub.io')    # error: does not accept raw Strings  
```  
  
but all functions that operate on raw strings can still be applied to wrapped types  
```python  
to_upper_case(yolandis_mail)    # returns a String  
```  
  
  
  
### Example 2  
```python  
# suppose we require that every person instance has a 'surname' field  
MyConstraint = {'surname': String}   # Dict as type:   
  
Person = UserValueType('Person', Dict, MyConstraint)  
```  
  
`Person` itself is data and can be sent over the wire. But we can also use it as a constructor  
```python  
p1 = Person({'first_name': 'Bob', 'surname': 'Smith'})   # valid  
p2 = Person({'first_name': 'Bob'}) # invalid: raises an exception  
```  
and use it like a set to check membership  
```python  
is_a(p1, Person)    # True  
```  
  
  
### Dictionaries vs Objects / Structs  
Note that together with the type wrapper, a dictionary acts very much like a struct / class in many programming languages. There are some significant differences though:  
  
- inherent value semantics: default comparison between two UserValueTypes is not tied to the address in memory, but performed based on internal key-value pairs (which themselves are also values in Zef)  
- constraint checking is more declarative than imperative checks in the class constructor: the type system can tap into this and detect problems at validation time  
- no serialization / unpacking step required when sending over the network or writing to a ZefDB graph.   
- Zef contains a powerful library of ZefOps to operate on dictionaries. These can all be used to operate on UserValueTypes that wrap Dicts.  
- bare dictionaries cannot be used by   
  
  
### Shorthand Notation  
Wrapping dictionaries in UserValueTypes is common. There is also a shorthand notation to construct instances and access fields  
```python  
p1 = Person(  
	first_name='Quentin',  
	surname='Tarantino',  
)  
  
p1.first_name        # access fields with dot notation  
p1 | F.first_name    # consider allowing this?  
```  
  
  
  
### UserValueTypes vs ZefRefs  
Both represent "things in the world" - when do we use which one?  
Domains that we model are generally graphs, where many things are interconnected.   
ZefRefs are first class handles that point at atoms on graphs. They behave somewhat like "objects" as well, but they keep you in the full context of a graph. Passing them around is very lightweight, but traversals and field lookups require the graph to be loaded in the process. This gives the user of the ZefRef a lot of power to see the entire surrounding domain and context, which is a powerful double-edged sword.  
  
If you don't want to give the "user" / caller access to all this information (be it for security, hiding the details of your domain model, etc.), you would traditionally extract the information into a JSON response / dictionary / object. Defining a UserValueType may be a useful tool here, since it   
1. interfaces well with entities already represented on graphs  
2. plays nicely with the type system  
3. can easily be sent over the wire without manual serialization / deserialization   
4. allows you to formulate powerful constraints declaratively  
  
  
In addition, it may be helpful to compare some of the properties of these types.  
For instances of these types:  
|                         | UVT | Dictionary | Python Object | ZefRef |  
| ----------------------- | --- | ---------- | ------------- | ------ |  
| identity                | ❌  | ❌         | ✅            |   ✅       |  
| type information        | ✅  | ❌         | ✅            |   ✅      |  
| automatic serialization | ✅  | ✅         | ❌            |   ✅      |  
  
  
### Related Material  
- [Advanced typing for UserValueTypes](user-value-type-advanced-typing)