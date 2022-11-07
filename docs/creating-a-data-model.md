---
id: creating-a-data-model
title: Creating a Data Model
---

### Syntax  
aka. "defining a schema".  
This could be for graphs or APIs. In Zef, schemas are specified as plain data (once again). This allows you to operate on and process the schema data programmatically, which gives you superpowers.  
```python  
# any listed field is required  
data_model = [  
    ET.Person(  
        name = String,  
        email = Email,  
        todos = [ET.TodoItem],    # [...]: ordered list  
        acted_in = {ET.Movie},    # {...}: set  
        favorite_words = {String} & (Z | length < 10),  # specify cardinality constraints  
    ),  
      
    ET.Movie(  
        title = String & (Z | length < 30),  
        year_of_release = Int & (Z > 1900),  
    ),      
]  
```  
This is also a Zef Object, i.e. a literal expression. The values just happen to be typed. We can use this data structure to declare a schema.  
  
!ZefDoc - Creating a Data Model 2022-10-13 15.53.56.excalidraw  
TODO...  
  
### Schema  
**What can be?**  
A set of constraints / logic sentences which are true for the DB state (graph slice) in which the schema applies. A transaction will not successfully close if any of the constraints specified by the schema are violated.  
- local constraints: apply locally to a type  
- non-local and complex constraints: not all constraints are local or simple. In Zef you can use any constraint which you can express as a predicate function as part of a graph's schema by wrapping it in a type.  
  
  
### Blueprint  
**What is?**  
A graph's blueprint can be seen as a projection of types. As soon as any instance of a type exists on a graph, its blueprint counterpart is guaranteed to exist as well.  
Looking at a blueprint shows the set of all entities and relations that exist in the data as a summary on the type level.  
  
  
### Schema vs Blueprint  
A **graph schema** is a set of logical sentences and constraints that say something about "what is allowed to be" in a DB state.  
  
A **graph blueprint** is typically a statement about "what is", i.e. it is a superset of the [projection](<https://en.wikipedia.org/wiki/Projection_(mathematics)>) onto the type space of all data present in the DB.  
  
  
### Optional Fields  
```python  
ET.Person(  
		name = String,  
		middle_name = Optional[String],    # traditional Python  
		nickname = String | Nil            # composition  
)  
```  
Specifying an optional field is only useful if exclusive conditions are added to a schema: i.e. if it is explicitly stated that no fields other than a specified set may be added to an entity.  
  
Side note: this is only recommended as an advanced use case in schema design and should not be a default if you unsure about your domain model.  
  
  
### Field Cardinality  
In many languages and data models, the terms "one-to-one", "one-to-many", "many-to-one", "many-to-many" appear in the context of a type's field.  
Although we believe that these are meaningful concepts (when associated with the relation), we do not believe that this makes sense in the definition of an entity.  
Suppose we define the "director" field of an "ET.Movie": in this context it is relevant and meaningful to describe whether a ET.Movie can have exactly one or multiple directors. But the ET.Movie is not the place to specify whether a ET.Director could direct multiple movies (that cardinality should be defined at junction of the "directed" relation with the director).  
The relevant attribute to specify within the context of a type is therefore only the cardinality of the field.  
  
Examples:  
```python  
# there is only one director  
ET.Movie(  
	director = ET.Person  
)  
  
# there could be any number of directors and order is not important  
ET.Movie(  
	director = {ET.Person}  
)  
  
# there could be any number of directors and order is important  
ET.Movie(  
	director = [ET.Person]  
)  
```  
