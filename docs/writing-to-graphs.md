---
id: writing-to-graphs
title: Writing to Graphs
---

This is a list with minimal examples of the different approaches to write to ZefDB.  
  
### Single Entities / Atoms  
```python  
db = DB()  
  
alfred = ET.Person | transact[db] | run   # returns a reference (ZefRef) to the entity in the DB  
bertrand = ET.Person | db | run   # shorthand  
```  
  
###  Multiple Unrelated Atoms  
```python  
my_refs = [ET.Person, ET.City, AET.Bool, AET.String] | db | run  
```  
  
### Relations (aka Facts)  
```python  
(alfred, RT.teacher_of, bertrand) | db | run     # using existing entities  
_,_,ludwig = (bertrand, RT.teacher_of, ET.Person) | db, run   # instantiate a new entity and a relation to it  
  
[  
	(ludwig, RT.surname, 'Wittgenstein'),    # if values other than `ET. ...` are used, these are interpreted as AE and assignement  
	(ludwig, RT.born_in, ET.City[V.vienna]),           # relation to new  
	(V.vienna, RT.name, Val('Vienna')),       # wrapping a value in `Val` says: "don't create an attribute entity, link directly to the value node"  
  
	ET.Country               # we can also create separate entities in this list  
]  
```  
  
  
### Object Notation  
```python  
alan = ET.Person(  
					first_name='Alan',  
					surname='Turing',     # creates an RT.surname to an AET[String] and assigns "turing"  
					born_in=ET.City(      # we can nest entities (unlike JSON/dicts, with explicit types!)  
						name='London',  
						in_country=ET.Country(name='England'),  
					),					  
				) | db | run  
# in the object notation, only the ZefRef to the root (the actual "object") is returned  
  
  
# using existing refs to entities: express intent which fields to set  
[  
 alan(  
	 phd_supervisor=ET.Person(first_name='Alonso'),  
	   
	 )  
]  
  
# this can also be combined with other syntax in a list of graph changes.  
[  
 (V.jonny, RT.born_in, ET.City(name='Budapest')),  
   
 ET.Person[V.jonny](  
	 first_name='János',  
	 surname='von Neumann',  
 ),  
  
(V.jonny, RT.tried_to_hire, alan),  
  
  
alan.year_of_birth << 1912,    # if the field exists as an AE: assign. Otherwise instantiate and assign. Field must be unique.  
alan.student_of << ludwig,     # !!!!! WRONG !!!!!! This notation is only for assigning values, not linking with other entities!  
  
alan.phd_supervisor.surname << 'Church',    # we can chain outgoing relations though  
]  
```  
  
  
  
### Dealing with Fields on Relations  
```python  
alonso = db | now | all[ET.Person & (Z.surname=='Church')] | single  
  
[  
	ET.Person[V.alonso](  
		surname='Church'  
	),  
	  
	alan({  
		RT.phd_thesis(supervisor=V.alonso, year_of_completion=1938): ET.Document()  
	})  
]   
```  
  
  
### Tools for Dealing with Fields  
```python  
[  
    alan.bank_balance | update[add[100*usd]],  
    jonny.bank_balance | update[subtract[100*usd]],  
]  
```  
  
  
### Putting Constraints on Attribute Entities  
Since new values can be assigned at later times, you may want to put upfront restrictions on a given AE  
```python  
# create new AE. even if one is present. Assign a value in same TX.  
(living_room, RT.temperature, AE[Temperature] << 25*celsius)   
```  
  
  
  
### Multiary Relations  
using sets with `{...}` indicates that multiple elements are associated under that relation type and order is not important.  
```python  
jonny(  
	friends = {alan, ET.Person(first_name='Claude')}  
)  
# The set can be understood as multiple enttities being   
# linked via the same relation type.   
  
# In this context, when used on an existing entity, it means: we want this set as the resulting state.  
# If previous things were connected and they are no longer in the new list: too bad, they will be killed off.  
```  
  
Workings in diffs  
```python  
# add or remove items from the set  
[  
ET.Person[ET.freeman](first_name='Freeman', surname='Dyson')  
  
jonny.friends | add[V.freeman, alonso]   # add to set. Do not clear previous members. Won't be added if present.  
  
jonny.friends | remove[alan]      # remove: you have to use references to existing entities.  
# open question: if not in list, should removal requests error or accept silently?  
  
  
  
]  
```  
  
  
  
### Ordered Lists on Graphs  
```python  
# don't add these at first. Only ideas for later, but only when an actual use case arises.  
# insert_after  
# insert_before  
# update_at  
# remove_at  
# sort  
# reverse  
```  
  
  
  
  
### Dictionary Notation  
```python  
 {ET.Person : {  
		 RT.FirstName: "Fred",  
		 RT.YearOfBirth: 1970,  
		 RT.Parent: z1  
	 },  
 } | g | run  
```  
This notation is no longer required since the object notation became possible. It will probably be sunset.  
  
  
  
  
### Accessing Atoms by Event Type  
```python  
db | now | all[Instantiated]    # does this return ZefRef to atoms?  
db | now | all[Terminated[RT]]  # With subtype  
```  
  
