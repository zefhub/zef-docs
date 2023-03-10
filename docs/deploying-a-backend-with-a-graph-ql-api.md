---
id: deploying-a-backend-with-a-graph-ql-api
title: Deploying a Backend with a GraphQL API
---

  
In our previous tutorials,  
* [ZefDoc - Getting Started 1 - Manage your data with ZefDB](manage-your-data-with-zef-db)  
* [ZefDoc - Getting Started 2 - Building Data Pipelines with ZefOps](building-data-pipelines-with-zef-ops)  
  
We learnt how to manage data with ZefDB and perform some actions with ZefOp. Now that we have data stored in our database, we want to make it available to external applications via an API. In this tutorial, we will walkthrough how to set up a GraphQL server with minimal effort.  
  
## Loading Data (Again)  
Continuing from our previous tutorial on managing data with ZefDB, we have successfully transacted the Actor and Movies entities into our database. If you have access to the database from the previous tutorial, you can skip this section.  
  
However, if you don't have access to the previous database instance, you can load the data again by running the following code:  
```python  
from zef import DB, ET, RT  
from zef.ops import run  
  
db = DB()  
  
jen_law = ET.Actor(  
	first_name="Jennifer",  
	last_name="Lawrence"  
)["jen_law"]  
  
data = [  
	ET.Actor(  
		first_name="Dwayne",  
		last_name="Johnson",  
		acted_in=ET.Movie(title="Jumanji")  
	),  
	ET.Actor(  
		first_name="Chris",  
		last_name="Evans",  
		acted_in=ET.Movie(title="Captain America")  
	),  
	(jen_law, RT.acted_in, ET.Movie(title="Hunger Games"))  
	(jen_law, RT.acted_in, ET.Movie(title="Causeway")),  
]  
  
data | db | run  
```  
  
## Importing Zef  
Lets import the modules that will be used in this tutorial.  
```python  
from zef.ops import *  
from zef.core import *  
from zef.graphql import *  
from rich.pretty import pprint  
```  
  
## Declaring GraphQL Schema  
The following code snippet represents a GraphQL schema, which is a blueprint that defines the types of data that a GraphQL server can access:  
```graphql  
type Query {  
  actor(id: ID!): Actor  
  actors(firstName: String, lastName: String): [Actor]  
  movie(id: ID!): Movie  
  movies(title: String) : [Movie]  
  actedIn(id: ID!): [Movie]  
}  
  
type Mutation {  
  addActor(firstName: String!, lastName: String!): Actor  
  addMovie(title: String!, actors: [ID]!): Movie  
}  
  
type Actor {  
  id: ID  
  firstName: String  
  lastName: String  
}  
  
type Movie {  
  id: ID  
  title: String  
  actors: [Actor]  
}  
```  
The schema defines two [Object Types](https://graphql.org/learn/schema/#object-types-and-fields), `Actor` and `Movie`, with their respective fields such as `id`, `firstName`, `lastName`, and `title`. It also includes two special types, `Query` and `Mutation`, which serve as the entry point to the schema, with queries used for reading data and mutations for writing data.  
  
The schema includes the following queries:  
  
-   `actor` - takes a compulsory argument of `ID` and returns a single `Actor`  
-   `actors` - takes optional arguments of `firstName` and `lastName` and returns a list of `Actor`  
-   `movie` - takes a compulsory argument of `ID` and returns a single `Movie`  
-   `movies` - takes an optional argument of `title` and returns a list of `Movie`  
-   `actedIn` - takes a compulsory argument of an actor `ID` and returns a list of `Movie` that the actor has acted in  
  
Additionally, the schema includes two mutations:  
  
-   `addActor` - takes compulsory arguments of `firstName` and `lastName` and creates an `Actor` instance in the database.  
-   `addMovie` - takes compulsory arguments of `title` and a list of actor `id` and creates a `Movie` instance with actors that acted in the movie in the database.  
  
## Generating Data Representation in Python  
Next, we need a Python data structure to represent the GraphQL schema defined above. For the sake of simplicity in this tutorial, we will first define the schema as a string in a Python variable:  
```python   
schema = """  
type Query {  
  actor(id: ID!): Actor  
  actors(firstName: String, lastName: String): [Actor]  
  movie(id: ID!): Movie  
  movies(title: String) : [Movie]  
  actedIn(id: ID!): [Movie]  
}  
  
type Mutation {  
  addActor(firstName: String!, lastName: String!): Actor  
  addMovie(title: String!, actors: [ID]!): Movie  
}  
  
type Actor {  
  id: ID  
  firstName: String  
  lastName: String  
}  
  
type Movie {  
  id: ID  
  title: String  
  actors: [Actor]  
}  
"""  
```  
Alternatively, you could define the GraphQL schema in a separate file and read it into Python.  
  
We can then use the helper function `generate_schema_dict` to generate a dictionary structure for the schema:  
```python  
schema_dict = generate_schema_dict(schema)  
```  
We can pretty print the resulting schema dictionary in the Python REPL using:  
```python  
pprint(schema_dict, indent_guides=False)  
```  
will give the following output:  
```python  
{  
    "GraphQLTypes": {  
        "Query": {  
            "actor": {  
                "type": "Actor",  
                "resolver": None,  
                "args": {"id": {"type": "ID!"}},  
            },  
            "actors": {  
                "type": "[Actor]",  
                "resolver": None,  
                "args": {  
                    "firstName": {"type": "String"},  
                    "lastName": {"type": "String"},  
                },  
            },  
            "movie": {  
                "type": "Movie",  
                "resolver": None,  
                "args": {"id": {"type": "ID!"}},  
            },  
            "movies": {  
                "type": "[Movie]",  
                "resolver": None,  
                "args": {"title": {"type": "String"}},  
            },  
            "actedIn": {  
                "type": "[Movie]",  
                "resolver": None,  
                "args": {"id": {"type": "ID!"}},  
            },  
        },  
        "Mutation": {  
            "addActor": {  
                "type": "Actor",  
                "resolver": None,  
                "args": {  
                    "firstName": {"type": "String!"},  
                    "lastName": {"type": "String!"},  
                },  
            },  
            "addMovie": {  
                "type": "Movie",  
                "resolver": None,  
                "args": {"title": {"type": "String!"}, "actors": {"type": "[ID]!"}},  
            },  
        },  
        "Actor": {  
            "id": {"type": "ID", "resolver": None},  
            "firstName": {"type": "String", "resolver": None},  
            "lastName": {"type": "String", "resolver": None},  
        },  
        "Movie": {  
            "id": {"type": "ID", "resolver": None},  
            "title": {"type": "String", "resolver": None},  
            "actors": {"type": "[Actor]", "resolver": None},  
        },  
    }  
}  
```  
  
## Filling in Resolvers  
In order to use the schema dictionary to start the GraphQL server, we need to define the resolver functions for each of the fields in the schema that we want to use, which are currently defined as `None`.    
  
Resolvers are functions in a GraphQL server that are responsible for resolving the value of a field in a query. They are the actual implementation of the GraphQL operations defined in the schema. In ZefDB, resolvers would typically interact with the database to perform the queries or mutations specified in the GraphQL schema.  
  
### Resolvers for Object Type  
To access a specific field for an `Actor` or `Movie` entity in ZefDB, you can use a resolver function to retrieve the field value using a "handle" to the entity.  In general, you can use the following pattern to retrieve a field value from an entity:  
```python  
handle | <resolver> | collect  
```  
  
For example, to retrieve an `Actor`'s first name, you can use the `F.first_name` , like this:  
  
```python  
handle | F.first_name | collect  
```  
  
Similarly, to get the list of actors that acted in a movie, you can use the `Ins[RT.acted_in]` resolver, like this:  
  
```python  
handle | Ins[RT.acted_in] | collect  
```  
  
Here, `<resolver>` is a resolver function that takes a handle to an entity as input and returns the desired field value.  
  
The snippets of the dictionary below is after we fill in all the resolvers for object type:   
```python  
{  
	...  
		"Actor": {  
            "id": {"type": "ID", "resolver": uid},  
            "firstName": {"type": "String", "resolver": F.first_name},  
            "lastName": {"type": "String", "resolver": F.last_name},  
        },  
	    "Movie": {  
            "id": {"type": "ID", "resolver": uid},  
            "title": {"type": "String", "resolver": F.title},  
            "actors": {"type": "[Actor]", "resolver": Ins[RT.acted_in]},  
        },  
    ...  
}  
```  
:::info  
  
`uid` is a ZefOp that takes in a handle to an entity and returns it's uid.   
  
:::  
  
  
### Resolvers for Queries  
To write a custom resolver in Zef's GraphQL, it has to follow a certain format  
```python  
@func(db)  
def name_of_resolver(query_args: dict, db: DB):  
	...  
```  
Let's breakdown the syntax that is happening here:  
1. `@func` is a decorator that converts a regular python function to a [Zef Function](functions-and-methods)  
2. `@func(db)` is a variant of the `@func` decorator that injects a ZefDB instance into the Zef function. This means that the resolver has access to the database and can perform queries and mutations.  
3.  `query_args` is a dictionary of the arguments passed to the GraphQL query. The keys are the names of the arguments, and the values are their corresponding values. For example, if the query includes `actors(firstName: "Tom")`, then `query_args` would be `{"firstName": "Tom"}`.  
4. `db` is the ZefDB instance that was injected into the resolver using the `@func(db)` decorator. The resolver can use this instance to perform queries and mutations on the database.  
  
Lets define the custom resolvers for all five declared GraphQL query type:  
```python  
@func(db)  
def get_actor(query_args, db):  
    id = query_args.get("id")  
    res = db[id] | now  
  
    return res  
  
@func(db)  
def get_actors(query_args, db):  
  
    first_name = query_args.get("firstName", None)  
    last_name = query_args.get("lastName", None)  
  
    query_matching = match[  
        (Tuple[String, Nil], lambda x : (Z | F.first_name == x[0])),  
        (Tuple[Nil, String], lambda x : (Z | F.last_name == x[1])),  
        (  
            Tuple[String, String], lambda x : (  
                (Z | F.first_name == x[0])   
                & (Z | F.last_name == x[1])  
            )  
        ),  
        (Tuple[Nil, Nil], lambda _ : Any)  
    ]  
  
    query = (  
        ET.Actor   
        & ((first_name, last_name) | query_matching | collect)  
    )  
  
    res = (  
        db   
        | now   
        | all[query]  
    )  
  
    return res  
  
@func(db)  
def get_movie(query_args, db):  
    id = query_args.get("id")  
    res = db[id] | now  
  
    return res  
  
@func(db)  
def get_movies(query_args, db):  
    title = query_args.get("title", None)  
  
    query_matching = match[  
        (String, lambda x : (Z | F.title == x)),  
        (Nil, lambda _ : Any)  
    ]  
  
    query = (  
        ET.Movie  
        & (title | query_matching | collect)  
    )  
  
    res = (  
        db   
        | now   
        | all[query]  
    )  
  
    return res  
  
@func(db)  
def get_movies_acted_in(query_args, db):  
    id = query_args.get("id")  
      
    res = (  
        db[id]   
        | now   
        | Outs[RT.acted_in][ET.Movie]  
    )  
  
    return res  
```  
All of the code in the resolvers is just standard Zef code, which we introduced earlier in our getting started series. It's important to note that we don't use the `collect` ZefOp in any of the resolvers. The `collect` operator is invoked at runtime when a user makes a query or mutation.  
  
### Resolvers for Mutations  
The mutation resolvers are defined in the same way as the query resolvers, with the only difference being that the mutation resolvers will commit a transaction against the database.  
  
```python  
@func(db)  
def add_actor(query_args, db):  
    first_name = query_args.get("firstName")  
    last_name = query_args.get("lastName")  
  
    person = ET.Actor(  
        first_name=first_name,  
        last_name=last_name  
    ) | db | run  
  
    return person  
  
@func(db)  
def add_movie(query_args, db):  
    title = query_args.get("title")  
    actor_ids = query_args.get("actors")  
  
    new_movie = ET.Movie["m"](title=title)  
  
    refs = (  
        actor_ids   
        | map[lambda x:(db[x] | now | collect)]     # Get Actor Reference  
        | map[lambda x: (x, RT.acted_in, new_movie)]   # Create Triples  
        | db   
        | run  
    )  
      
    return refs[0][2]  
```  
  
We can see how the resolver chains in GraphQL fit nicely with ZefOp's functional coding paradigm. The resolver chains can be expressed in the following form::  
```python  
(  
    db   
    | <time_semantic_operator>  # Can be "now", "time_travel[-1]", Time(XXXX)  
    | resolver_1[arguments_1]   # First-level resolver with arguments passed by the user  
    | resolver_2[arguments_2]   # Second-level resolver with arguments passed by the user  
    | ...   
    | collect  
)  
```  
  
The final Python dictionary of the GraphQL schema will look like the following:  
```python  
schema_dict = {  
    "_Types": {  
        "Query": {  
            "actor": {  
                "type": "Actor",  
                "resolver": get_actor,  
                "args": {"id": {"type": "ID!"}},  
            },  
            "actors": {  
                "type": "[Actor]",  
                "resolver": get_actors,  
                "args": {  
                    "firstName": {"type": "String"},  
                    "lastName": {"type": "String"},  
                },  
            },  
            "movie": {  
                "type": "Movie",  
                "resolver": get_movie,  
                "args": {"id": {"type": "ID!"}},  
            },  
            "movies": {  
                "type": "[Movie]",  
                "resolver": get_movies,  
                "args": {"title": {"type": "String"}},  
            },  
            "actedIn": {  
                "type": "[Movie]",  
                "resolver": get_movies_acted_in,  
                "args": {"id": {"type": "ID!"}},  
            },  
        },  
        "Mutation": {  
            "addActor": {  
                "type": "Actor",  
                "resolver": add_actor,  
                "args": {  
                    "firstName": {"type": "String!"},  
                    "lastName": {"type": "String!"},  
                },  
            },  
            "addMovie": {  
                "type": "Movie",  
                "resolver": add_movie,  
                "args": {"title": {"type": "String!"}, "actors": {"type": "[ID]!"}},  
            },  
        },  
        "Actor": {  
            "id": {"type": "ID", "resolver": uid},  
            "firstName": {"type": "String", "resolver": F.first_name},  
            "lastName": {"type": "String", "resolver": F.last_name},  
        },  
        "Movie": {  
            "id": {"type": "ID", "resolver": uid},  
            "title": {"type": "String", "resolver": F.title},  
            "actors": {"type": "[Actor]", "resolver": Ins[RT.acted_in]},  
        },  
    }  
}  
```  
  
## Exploring our API  
Now that we have fully defined our schema as a Python data structure, all we need to do is spin up the GraphQL server. Zef has its own way of handling side effects, called [ZefFX](introduction-to-zef-fx), which includes a GraphQL server as one of the side effect that comes with the core library.   
  
Run the following to start a GraphQL Server with ZefFX:  
```python  
my_playground = FX.GraphQL.StartPlayground(  
    schema_dict =  schema_dict,  
    db =  db,  
    port =  5002,  
 ) | run | get['server_uuid']  
```  
Each of the keyword arguments for `GraphQL.StartPlayground` should be self-explanatory. The return value is the handler to the side effect, which in this case is a dictionary with the `uuid` of the GraphQL server. This can be used to interact with the server in the future.  
  
To stop the GraphQL server, run:  
```python  
stop_handler = FX.GraphQL.StopPlayground(  
    **start_handler  
) | run  
```  
  
  
## Hosting our API  
  
  
  
  
## Recap  
In this tutorial, we learned how to set up a GraphQL API with Zef. We explored how to write custom resolvers using ZefOps, and also briefly introduced the effect system for Zef called ZefFX.  
  
With these tools, we can easily build an end-to-end database and backend system using Zef. One key advantage of using Zef is that it allows us to write both the database and backend in pure Python code. This makes it easier to maintain and update the codebase, and reduces the potential for errors that can arise from having separate codebases for different components of the system.