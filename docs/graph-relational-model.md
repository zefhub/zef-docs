---
id: graph-relational-model
title: Graph-Relational Model
---

  
  
  
### Tabular Data  
Actor Table  
 | first name | last name | favorite food |  
 | ---------- | --------- | ------------- |  
 | John       | Travolta  | 🍕            |  
 | Samuel     | Jackson   | 🍔            |  
 | Uma        | Thurman   | 🥦            |  
  
- **Entity type**: implicit in the table name  
- **Identity of entities**: either implicitly managed (error-prone) or explicit in some "key" column (beware of non-uniqueness of keys between tables)  
- **Rows**: each row typically corresponds to an entity (or atom in general). Identity of each entity (row) may be made explicit by a key (local ID) column.  
- **Columns**: The column name maps onto the relation **type**.   
- **Cell / Value in Table**: this corresponds to the target element / actual value in the semantic triple.  
  
  
  
  
### Plain Python Data  
```python  
[  
{'first_name': 'John',  'last_name': 'Travolta','favorite_food':'🍕'},  
{'first_name': 'Samuel','last_name':'Jackson',  'favorite_food':'🍔'},  
{'first_name': 'Uma',   'last_name': 'Thurman', 'favorite_food':'🥦'},  
]  
```  
  
  
  
### Semantic Triples (Facts)  
```python  
[  
(entity_1, RT.FirstName, 'John'),  
(entity_1, RT.LastName, 'Travolta'),  
(entity_1, RT.FavoriteFood, '🍕'),  
  
(entity_2, RT.FirstName, 'Samuel'),  
(entity_2, RT.LastName, 'Jackson'),  
(entity_2, RT.FavoriteFood, '🍔'),  
  
(entity_3, RT.FirstName, 'Uma'),  
(entity_3, RT.LastName, 'Thurman'),  
(entity_3, RT.FavoriteFood, '🥦'),  
]  
```  
  
  
  
### Zef Graph  
!400  
This is shown in very granular form here. For practical purposes, we usually have a more compressed view when visually displaying graphs.  
  
  
### Comparison to Relational Model  
- Thinking in terms of entities and relations allows you to focus more on the domain, not the representation of the data. It allows you to think at a higher level: types and sets instead of join tables and query patterns.  
  
  
### Related  
- ZefDoc - Representing Temporally Qualified Information in ZefDB  
