---
id: zef-objects
title: Zef Objects
---

  
### TL; DR  
- in essence: dictionaries wrapped with a type  
- immutable values  
- key-value stores  
  
  
### What are Zef Objects?  
You can think of them as a thin wrapper with a type around a dictionary.  
- no temporal dimension: just describe "state"  
- can be used to express intent (i.e. which values you want which fields to have)  
- can be used to express what is: i.e. which fields have which value  
- inherent hierarchical tree structure  
  
  
  
### Allow Strong Typing  
useful for  
- function dispatch / control flow  
- structured data and integration with a rich domain model  
  
  
### Shared Type System  
with that of your domain model on a graph. New types don't need to be declared upfront, they are immediately valid literal expressions.  
```python  
m1 = ET.Movie(  
	title = 'Pulp Fiction',  
	year_of_release = 1994,  
)  
```  
  
  
### Analogy to Dictionaries  
dictionaries also do not need to "ask for permission": they can be constructed on the fly.  
```python  
m1_dict = dict(  
	title = 'Pulp Fiction',  
	year_of_release = 1994,  
)  
```  
  
  
### Literal Expressions  
Zef Objects are literal expressions:   
- the `repr` output is a valid expression leading to the exact value  
- there is no additional hidden state  
  
  
### Convenient Way to get fresh data on Graphs  
There are multiple ways to represent data that is to be merged into a graph. Using Zef Values may be one of the most readable and convenient ones when working with data "manually".  
```python  
# adds this object in   
ET.Movie(  
	title = 'Pulp Fiction',  
	year_of_release = 1994,  
) | transact[g] | run  
```  
  
  
### Structurally Typed  
Two Zef objects will compare equal if they are represent the same value. This will remain true, even if they are created by different users on different computers. Zef objects therefore obey value semantics (like dictionaries or other) and no implicit identity.  
  
  
### Plays nicely with Zef's Entity Resolution System  
```python  
# use a regular field as an ID  
ET.Person(  
	imdb_id='nm0000233',       
	first_name='Quentin',   
	last_name='Tarantino',  
)  
  
  
# use an internal name as an identifier when dealing with collections  
ET.Person['tarantino'](  
	first_name='Quentin',   
	last_name='Tarantino',  
)  
  
  
# use a ref to establish idenity with data in any Zef graph  
ET.Person[tarantino_ref](       
	first_name='Quentin',   
	last_name='Tarantino',  
)  
```  
  
  
  
### Use any Operators and Functions that work  for Dictionaries  
Note: TODO - not fully implemented  
Apart from the type and an optional name, Zef objects are just containers and can be thought of as a wrapped dictionary.  
Any function that works on a dictionary automatically works for a Zef object.  
```python  
# `insert` is just one of the builtin operators for dictionaries  
m2 = (ET.Movie(title = 'Pulp Fiction')   
		| insert['year_of_release'][1994]     
		)  
```  
The original movie object is not mutated, but a new one is created.  
  
  
### Nestable  
```python  
# Zef objects can be used as field values within object.  
ET.Movie(  
   title = 'Pulp Fiction',  
   director = ET.Person(first_name='Quentin', last_name='Tarantino'),  
)  
```  
  
  
### Syntactic Sugar: Dot Notation  
Note: upcoming feature  
```python  
m1.title                 # convenient notation to access fields  
m1.director.last_name    # can be chained  
```  
  
  
### Extended Semantics  
sets vs lists  
  
  
### Value Semantics & Immutability  
  
  
  
### Optional Language Translation Layer  
  
  
  
### Why not use Classes?  
In contrast to native classes, these types have value semantics and require no serialization / deserialization  
  
  
  
### Embedded vs Detached Data  
Zef provides multiple ways to refer to domain entities  
- **ZefRef**: entity X seen from graph g at time t  
- **EZefRef**: entity X seen from graph g (independent of time)  
  
These two reference types are used to refer to an entity in the context of some graph where it is embedded. It may be connected to a web of information here.  
  
- **Ref**: entity X (seen independent of any frame). No internal structure / fields.  
- **Zef Object**: The entity detached from the context of any database (graph / GraphSlice), but it can contain internal structure as key-value fields.   
  
Use Zef objects to  
- as function arguments if   
	1. the evaluating process does not have the required graph loaded in memory  
	2. you only want to give the function access to a self-contained object, not all the information attached in a DB  
- effectively work with data that will be merged into a graph  
  
  
  
### Related  
- transforming between different data types: data wrangling