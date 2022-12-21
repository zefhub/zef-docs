---
id: quick-api-creation
title: Quick API Creation
---

  
## Prepare a DB  
  
Creates a DB and instantiates something  
```python  
from zef import *  
from zef.gql import *  
from zef.ops import *  
  
db = DB()  
changes = [  
        (ET.Person["p1"], RT.Owns, ET.Dog["d1"]),  
        (Z["p1"], RT.Name, "Jeff"),  
        (Z["d1"], RT.Name, "Charlie"),  
]   
  
# These changes are plian data. Let's write them to the DB  
changes | transact[db] | run  
```  
  
  
## Autogenerate a GraphQL Schema  
We can easily autogenerate a GQL schema from the graph's data structure:  
```python  
actions = auto_generate_gql(db) # this generates a set of actions for a transaction  
my_schema = actions | transact[db] | run | get['schema_root'] | collect  
```  
Now we have a GQL schema defined on the graph g.  
  
  
## Explore with the GQL Playground  
  
```python  
Effect({  
        "type": FX.GraphQL.StartPlayground,  
        "schema_root": my_schema,  
        "port": 5005,  
}) | run   
```  
Running the effect starts a Playground server in the background on the user's machine and starts a browser.  
![](a2f7118deec2072b62c39f635d59d63d1cf40e095e668aee1e3e427b6acb8889.png)  
  
  
## Launch Server  
```python  
Effect({  
        "type": FX.GraphQL.StartServer,  
        "schema_root": my_schema,  
        "path": '/my-api',  
        "port": 6000,  
}) | run   
```  
Now a server is running in the background and can be queried at `localhost:6000/my-api`  
  
  
  
