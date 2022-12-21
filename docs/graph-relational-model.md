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
(ET.Person[:'p1'], RT.FirstName, 'John'),  
(ET.Person[:'p1'], RT.LastName, 'Travolta'),  
(ET.Person[:'p1'], RT.FavoriteFood, '🍕'),  
  
(ET.Person[:'p2'], RT.FirstName, 'Samuel'),  
(ET.Person[:'p2'], RT.LastName, 'Jackson'),  
(ET.Person[:'p2'], RT.FavoriteFood, '🍔'),  
  
(ET.Person[:'p3'], RT.FirstName, 'Uma'),  
(ET.Person[:'p3'], RT.LastName, 'Thurman'),  
(ET.Person[:'p3'], RT.FavoriteFood, '🥦'),  
]  
```  
  
  
  
### Zef Graph  
![[Drawing 2022-10-05 09.26.39.excalidraw| 400]]  
This is shown in very granular form here. For practical purposes, we usually have a more compressed view when visually displaying graphs.  
  
  
  
### Which Problems does the Graph-Relational Model Address?  
Or why it is worth departing from the trodden paths?  
|                                                | SQL-Based Relational DBs     | Labeled Property Graphs     | Graph-Relational |  
| ---------------------------------------------- | ---------------------------- | --------------------------- | ---------------- |  
| Schema                                         | ✅                           | Typically no strong support | ✅               |  
| Data model decoupled from representation       | ❌                           | sometimes                   | ✅               |  
| Supports fields("properties") on relations     | ❌                           | ✅  (typically)             | ✅               |  
| no painful schema migrations                   | ❌                           | ✅                          | ✅               |  
| Strong transactional model (ACID)              | ✅                           | ❌ (commonly)               | ✅               |  
| good for thinking in tables                    | ✅                           | ❌                          | ✅               |  
| good for thinking in graphs                    | ❌ (not obvious to non-pros) | ✅                          | ✅               |  
| good for thinking in objects                   | ❌ (ORMs have problems)      | ❌                          | ✅               |  
| maps onto differential computation / streaming | 3 / 5                        | 1 / 5                       | 5 / 5            |  
| conceptual soundness: based on formal logic    | 3 / 5                        | 3 / 5                       | 5 / 5            |  
| first class support for facts over time        | ❌                           | ❌                          | ✅               |  
  
  
  
	  
  
### Comparison to Relational Model  
- Thinking in terms of entities and relations allows you to focus more on the domain, not the representation of the data. It allows you to think at a higher level: types and sets instead of join tables and query patterns.  
  
  
### Related  
- [[ZefDoc - Representing Temporally Qualified Information in ZefDB]]  
