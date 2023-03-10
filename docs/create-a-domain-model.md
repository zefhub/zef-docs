---
id: create-a-domain-model
title: Create a Domain Model
---

  
  
## Use a Database Schema to Communicate Your Domain Model  
  
A ZefDB schema is different from schemas in other databases. There are two distinct parts which we distinguish:  
- constraints: a set of logical constraints on any valid DB state. These can be simple local constraints (as in relational DBs), non-local constraints or anything you can express in a predicate function  
- blueprint: describe the shape of your data. If data exists in a certain shape, this shape is guaranteed to show up in the blueprint.  
  
  
```python  
[  
    ET.Movie[  
        'title':           String,  
        'year_of_release': Year,  
        'actors':          List[ET.Person],  
        'directors':       List[ET.Person],  
        'writers':         List[ET.Person],  
        'genres':          Set[ET.Genre],    # or tagged?  
        'age_rating':      ET.AgeRating,  
    ],  
    ET.Person[  
        'first_name': String,  
        'last_name': String,  
        'year_of_birth': Year,  
        'country_of_birth': ET.Country,  
        ...               # there may be more fields  
    ],  
    ET.Country[  
        'name': String,  
        'population': Int,  
    ],  
    ET.Genre[  
        'name': String,  
    ],  
]  
```  
Note that this is a valid Python expression: a list of types.  
A blueprint describes the structural shape of your knowledge graph on a type level.  
  
  
## Optional Fields  
### General Optional Fields  
```python  
ET.Movie[  
    'title': String,  
    ...  
]  
```  
using ellipses indicates that all other possible fields are optional. `title` is required, but if any additional field is added, it will still be part of the type.  
  
  
### Individual Optional Fields  
One can add specific optional fields though.  
```python  
ET.Movie[  
    'first_name': String     : Optional,  
    'last_name': String,  
    'year_of_birth': Int     : Optional,  
]  
```  
This means: if these fields are present, they **MUST** be of the specified type.  
  
  
Alternative syntax:  
```python  
ET.Movie[  
    Optional['first_name']: String,  
    'last_name': String,  
    Optional['year_of_birth']: Int,  
]  
```  
  
```python  
ET.Movie[  
    'first_name?': String,  
    'last_name': String,  
    'year_of_birth?': Int,  
]  
```  
