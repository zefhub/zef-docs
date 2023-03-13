---
id: deploying-a-backend-with-a-graph-ql-api
title: Deploying a Backend with a GraphQL API
---

  
In our previous tutorials,  
* [ZefDoc - Getting Started 1 - Manage your data with ZefDB](manage-your-data-with-zef-db)  
* [ZefDoc - Getting Started 2 - Building Data Pipelines with ZefOps](building-data-pipelines-with-zef-ops)  
  
We learnt how to manage data with ZefDB and perform some actions with ZefOp. Now that we have data stored in our database, we want to make it available to external applications via an API. In this tutorial, we will walkthrough how to set up a GraphQL server with minimal effort.  
  
## Importing Zef  
Lets import the modules that will be used in this tutorial.  
```python  
from zef.ops import *  
from zef.core import *  
from zef.graphql import *  
from rich.pretty import pprint  
```  
  
## Declaring GraphQL Schema  
We want to create a simple GraphQL API, with two endpoints(query type),  
* `yo()` - that returns a simple "Hello World!"   
* `actors()` - that returns a list of actors  
  
The following code snippet represents a GraphQL schema, as per the [official specs](https://graphql.org/learn/schema/), which is a blueprint that defines the types of data that a GraphQL server can access:  
```graphql  
type Query {  
  yo(): String  
  actors(): [Actor]  
}  
  
type Actor {  
  id: ID  
  firstName: String  
  lastName: String  
}  
```  
  
## Generating Data Representation in Python  
Let's declare a plain string variable in Python for the GraphQL Schema.  
```python  
schema = """  
type Query {  
  yo(): String  
  actors(): [Actor]  
}  
  
type Actor {  
  id: ID  
  firstName: String  
  lastName: String  
}  
"""  
```  
  
Then, we will pass this as an input to a helped function  `generate_schema_dict` to generate the representation of the schema in the form a Python dictionary:  
  
```python  
schema_dict = parse_schema(schema)  
pprint(schema_dict, indent_guides=False)  
```  
  
which will give the following output:  
```python  
{  
    'GraphQLTypes': {  
        'Query': {  
	        'yo': {'type': 'String', 'resolver': None},   
	        'actors': {'type': '[Actor]', 'resolver': None}  
	    },  
        'Actor': {  
            'id': {'type': 'ID', 'resolver': None},  
            'firstName': {'type': 'String', 'resolver': None},  
            'lastName': {'type': 'String', 'resolver': None}  
        }  
    }  
}  
```  
  
## Filling in Resolvers  
Resolvers in GraphQL are functions that determine how to fetch and return data for each field requested in a GraphQL query. The GraphQL's [Object Types](https://graphql.org/learn/schema/#object-types-and-fields) fits nicely with Zef's Data model, hence, it is trivial to resolve the fields of the `Actor` by using the F operator:  
```python  
{  
	...  
 	"Actor": {  
            "id": {"type": "ID", "resolver": uid},  
            "firstName": {"type": "String", "resolver": F.first_name},  
            "lastName": {"type": "String", "resolver": F.last_name},  
    }  
}  
```  
  
For the `actors`  Query type, let's try to write the a custom resolver that retrieves the all the actors in our database:   
```python  
@func  
def get_actors(query_args, db):  
	res = (  
		db  
		| now  
		| all[ET.Actor]  
	)  
  
	return res  
```  
  
It's important to note that we don't use the `collect` ZefOp in the resolver. The `collect` operator is invoked at runtime when a user makes a query or mutation.  
   
The final Python dictionary of the GraphQL schema will look like the following:  
```python  
{  
    'GraphQLTypes': {  
        'Query': {  
	        'yo': {'type': 'String', 'resolver': lambda _ : "Hello World"},   
	        'actors': {'type': '[Actor]', 'resolver': get_actors}  
	    },  
        'Actor': {  
            'id': {'type': 'ID', 'resolver': uid},  
            'firstName': {'type': 'String', 'resolver': F.first_name},  
            'lastName': {'type': 'String', 'resolver': F.last_name}  
        }  
    }  
}  
```  
  
## Exploring our API  
Now that we have fully defined our schema as a Python data structure, all we need to do is spin up the GraphQL server. Zef has its own way of handling side effects, called [ZefFX](introduction-to-zef-fx), which includes a GraphQL server as one of the side effect that comes with the core library.   
  
Run the following to start a GraphQL Playground with ZefFX:  
```python  
my_playground = FX.GraphQL.StartPlayground(  
    schema_dict =  schema_dict,  
    db =  db,  
    port =  5002,  
 ) | run   
 ```  
  
To stop the GraphQL playground, run:  
```python  
FX.GraphQL.StopPlayground(  
    **my_playground  
) | run  
```  
  
## Hosting our API  
```python  
my_server = FX.GraphQL.StartServer(  
    schema_dict =  schema_dict,  
    db =  db,  
    port =  5002,  
 ) | run   
```  
For this command, the GraphQL playground will be disabled as we don't want to expose that page in a production setting.  
  
## Recap  
In this tutorial, we learned how to set up a simple GraphQL API with Zef. We explored how to write custom resolvers using ZefOps, and also briefly introduced the effect system for Zef called ZefFX.   
Check this [tutorial](graph-ql-api-for-movies-and-actors) out, where we dive deeper into how to write complex queries and mutations with the same dataset.  
  
One key advantage of using Zef is that it allows us to write both the database and backend in pure Python code. This makes it easier to maintain and update the codebase, and reduces the potential for errors that can arise from having separate codebases for different components of the system.  
  
