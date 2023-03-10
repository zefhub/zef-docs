---
id: writing-data-to-zef-db
title: Writing Data to ZefDB
---

  
## ⚛  Atomic Changes ⚛  
Any changes to ZefDB occur atomically. This makes it safe to deal with concurrent and parallel code across threads and compute nodes: you never have to worry about observing an intermediate or incomplete state.  
  
  
## 📝 Describing Your Changes 📝  
To allow these state changes to occur atomically, you do not mutate your domain objects in place, one change at a time.  
Rather, Zef allows you to move away from this imperative style to a more declarative style: you describe all changes you would like to have performed as a data structure (a list of changes, aka change list).  
  
This also makes it safe to change your DB state from different threads or compute nodes: all changes are sent to the transacting thread via a queue: the changes are taken from this queue one at a time and applied sequentially.  
- well defined sequence of events (linearizability)  
- you can cause changes from different threads: decoupling of the source of change from where the state change is executed  
- invariants (local and non-local) on all resulting states can be enforced (schema)  
  
The structure of a change list: simply a Python list  
```python  
my_changes = [  
	change1,  
	change2,  
	change3,	  
]  
```  
each item in the change list is one of  
- an object  
- a triple  
- an extended command  
  
  
## 🌳 Object Notation 🌳  
The object notation focuses on ease of use. It may seem very natural if you are familiar to working with dictionaries, objects or structs: It provides a terse way to express your domain objects directly in a readable, tree-structured form.  
  
Creating a new entity  
```python  
ET.Movie()    # bare object: no internal fields  
```  
  
  
### One-to-One Relations  
```python  
ET.Movie(  
	title='Pulp Fiction',  
	year_of_release=1994,  
)  
```  
one one relation of a given type going out from entity  
  
  
### One-to-Many Relations  
```python  
ET.Movie(  
	genre={  
		'drama',  
		'thriller',  
		'gangster',  
	}  
)  
```  
multiple edges/relations of the same type going out from the same entity: represented as a set  
  
  
### Zef-Lists  
When order is important: the same semantics as a list/array, but "flattened out" on the graph.  
```python  
changes = [  
	  
]  
```  
  
  
  
## ☘️ Semantic Triples Notation (Datalog)☘️  
```python  
[  
 (eiffel_tower, RT.located_in, cities.paris),  
]  
```  
A triple is equivalent to a relation / arrow: `(source, relation_type, target)`  
  
  
## 📆 Updating Existing Atoms 📆  
```python  
fargo = ET.Movie('㏈-4398652364785625864735') # ref to existing entity  
  
fargo(  
	year_of_release=1996,    # set this field  
)  
```  
The minimum amount of changes to achieve the target state will be performed:  
- if the field does not exist, a new AE is create and the value is assigned  
- if the field exists and is an AE, then the new value is assigned  
- if the field exists as a relation to a value node, the previous relation is terminated and a new relation is created  
  
```python  
(fargo, RT.directed_by, joel_cohen)   # triple notation  
```  
Using the triple notation is always "additive": a new relation is always created, it does not overwrite or interfere with existing fields.  
One can also think of it as "adding a fact to the database"  
  
  
### Differential Updates to One-to-Many Relations  
```python  
fargo(  
	actor=Add(    # special wrapper to indicate intent  
			steve_buscemi,  
			peter_stormare,  
	)  
)  
  
bob(  
	on_bucket_list=Remove(  
			cities.cape_town,  
			cities.hotazel,  
	)  
)  
```  
don't overwrite the existing set: just add or remove the relations  
  
  
### ⚙️  Updates with Function Calls ⚙️  
```python  
alice(  
	bank_balance = Update(add[10*currency.usd])  
)  
```  
this is the syntax if we have a reference to the source and want to operate on an attached field.  
  
If we have reference to the AE we want to atomically update directly, we can use the ZefOp  
```python  
bank_balance_ae | update[subtract[5*currency.usd]]  
```  
Since it is a lazy value, it can be passed as an expression without doing anything at the definition site. It will be interpreted at by the transactor.  
  
  
  
## ✍️ Assigning Values to Existing AEs ✍️  
if you have a reference to an existing AE and you want to assign a new value:  
```python  
[  
 Assign(42, my_ae)  
 my_ae | assign[42],  
 my_ae << 42,       # shorthand notation  
]  
```  
  
  
  
## ⚰️ Terminating Atoms ⚰️  
```python  
[  
 -my_atom,  
 Terminate(my_atom)  
]  
```  
  
