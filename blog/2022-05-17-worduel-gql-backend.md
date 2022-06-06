---
slug: worduel-gql-backend
title: Worduel GraphQL Backend in mins!
author: Zeyad Abuamer
author_url: https://www.linkedin.com/in/zeyadkhaled/
author_title: Zef Grandmaster
tags: [zef, zefops, python, wordle, graphql, backend, api, zefgql]
---

This is last blog of the wordle blog series. Be sure to check [part 1](/blog/wordle-using-zefops) and [part 2](/blog/wordle-solver-one-line) before reading this blog!

In this blog, we are going to adapt the code we wrote in [part 1](/blog/wordle-using-zefops) to create the GraphQL backend to our game [Worduel](https://worduel.zef.app/) 🗡

We will see how easy it is to dynamically generate a GraphQL backend using ZefGQL, run it using ZefFX, and deploy it using ZefHub.

_In this blog, we won't implement all of the endpoints that are actually needed for Worduel to run, the full code, including the schema and all endpoints, is found in this [Github repo](https://github.com/zefhub/worduel/tree/main/backend)._

![Worduel](worduel-logo.png "Worduel")

## Let's start building 🏗

So to get started we have to create an empty Zef graph

    g = Graph()

After that we will use a tool of ZefGQL which takes a string (that contains a GraphQL schema) and a graph to parse and create all the required RAEs `relations, atomic entities, and entities` on the graph.

### Parsing GraphQL Schema

_The link to schema used for this project can be found [here](https://github.com/zefhub/worduel/blob/main/backend/schema.py)._

```python
schema_gql: str = "...."                # A string contains compatible GraphQL schema
generate_graph_from_file(schema_gql, g) # Graph g will now contain a copy of the GraphQL schema
schema = gql_schema(g)                  # gql_schema returns the ZefRef to ET.GQL_Schema on graph g
types = gql_types_dict(schema)          # Dict of the GQL types connected to the GQL schema
```

### Adding Data Model

After that we will add our data model/schema to the graph. We use delegates to create the schema. Delegates don't add any data but can be seen as the blueprint of the data that exists or will exist on the graph.

_Psst: Adding RAEs to our graph automatically create delegates, but in this case we want to create a schema before adding any actual data_

```python
[
    delegate_of((ET.User, RT.Name, AET.String)),
    delegate_of((ET.Duel, RT.Participant, ET.User)),
    delegate_of((ET.Duel, RT.Game, ET.Game)),
    delegate_of((ET.Game, RT.Creator, ET.User)),
    delegate_of((ET.Game, RT.Player, ET.User)),
    delegate_of((ET.Game, RT.Completed, AET.Bool)),
    delegate_of((ET.Game, RT.Solution, AET.String)),
    delegate_of((ET.Game, RT.Guess, AET.String)),
] | transact[g] | run                           # Transact the list of delegates on the graph
```

If we look at the list of delegates closely we can understand the data model for our game.

### Resolvers

ZefGQL allows developers to resolve data by connecting a type/field on the schema to a resolver. You don't have to instantiate any objects or write heaps of code just to define your resolvers.

ZefGQL lifts all of this weight from your shoulders! It dynamically figures out how to resolve the connections between your GraphQL schema and your Data schema to answer questions.

ZefGQL Resolvers come in 4 different kinds with priority of resolving in this order:

#### Default Resolvers

It is a list of strings that contain the type names for which resolving should be the default policy i.e mapping the keys of a dict to the fields of a type.
We define the default resolvers for types we know don't need any special traversal apart from accessing a key in a dict or a property of an object using _getattr_

Example

```python
default_list = ["CreateGameReturnType", "SubmitGuessReturnType", "Score"] | to_json | collect
(schema, RT.DefaultResolversList, default_list) | g | run
```

#### Delegate Resolvers

A way of connecting from a field of a ET.GQL_Type to the data delegate. Basically, telling the runtime how to walk on a specific relation by looking at the data schema.

Example

```python
duel_dict = {
    "games":   {"triple": (ET.Duel, RT.Game, ET.Game)},
    "players": {"triple": (ET.Duel, RT.Participant, ET.User)},
}
connect_delegate_resolvers(g, types['GQL_Duel'], duel_dict)
```

You can view this as telling ZefGQL that for the subfield `games` for `Duel` type, the triple given is how you should traverse the ZefRef you will get in runtime.

#### Function Resolvers

We use function resolvers, when resolving isn't as simple as walking on the data schema. In our example, for our mutation make_guess we want to run through special logic.
Other usages of function resolvers include when the field you are traversing isn't concrete but abstract. An example is a field that returns the aggregate times by running a calculation.

Example

```python
@func(g)
def user_duels(z: VT.ZefRef, g: VT.Graph, **defaults):
    filter_days = 7
    return z << L[RT.Participant] | filter[lambda d: now() - time(d >> L[RT.Game] | last | instantiated) < (now() - Time(f"{filter_days} days"))] | collect

user_dict = {
    "duels": user_duels,
}
connect_zef_function_resolvers(g, types['GQL_User'], user_dict)
```

We are attaching the user's subfield `duels` to a function that traverse all of the user's duels but filters on the time of the last move on that duel to be less than 7 days old.
We could have used a delegate resolver but we wouldn't be able to add the special filtering logic.

#### Fallback Resolvers

Fallback resolvers are used as a final resort when resolving a field. It also usually contains logic that can apply to multiple fields that can be resolved the same way. In the example below, we find a code snippet for resolving any id field.

Example

```python
fallback_resolvers = (
    """def fallback_resolvers(ot, ft, bt, rt, fn):
    from zef import RT
    from zef.ops import now, value, collect
    if fn == "id" and now(ft) >> RT.Name | value | collect == "GQL_ID":
       return ('''
                if type(z) == dict: return z["id"]
                else: return str(z | to_ezefref | uid | collect)''')
    else:
        return "return None"
""")
(schema, RT.FallbackResolvers, fallback_resolvers) | g | run
```

The returns of the function should be of type str as this logic will be pasted inside the generated resolvers.

_The function signature might be a bit ugly and shows a lot of the implementation details. This part will definitly be improved as more cases come into light._

## Running the Backend 🏃🏻‍♂️

The final API code, will contain a mix of the above resolvers for all the types and fields in the schema.
After defining all of the resolvers, we can now test it locally using the ZefFX system.

```python
Effect({
    "type": FX.GraphQL.StartServer,
    "schema_root": gql_schema(g),
    "port": 5010,
    "open_browser": True,
}) | run
```

This will execute the effect which will start a web server that knows how to handle the incoming GQL requests. It will also open the browser with a GQL playground so that we can test our API.

It is literally as simple as that!

## Deploying to prod 🏭

To deploy your GraphQL backend, you have to sync your graph and tag it.
This way you can run your API from a different process/server/environment because it is synced to ZefHub:

```python
g | sync[True] | run               # Sync your graph to ZefHub
g | tag["worduelapi/prod"] | run   # Tag your graph
```

Now you are able to pull the graph from ZefHub by using the tag.

```python
g = Graph("worduelapi/prod")
```

Putting it all together, the necessary code to run your GraphQL backend looks like this:

```python
from zef import *
from zef.ops import *
from zef.gql import *
from time import sleep
import os

worduel_tag = os.getenv('TAG', "worduel/main3")
if __name__ == "__main__":
    g = Graph(worduel_tag)
    make_primary(g, True)  # To be able to perform mutations locally without needing to send merge requests
    Effect({
        "type": FX.GraphQL.StartServer,
        "schema_root": gql_schema(g),
        "port": 5010,
        "bind_address": "0.0.0.0",
    }) | run

    while True: sleep(1)
```

_As a side-note: In the future, ZefHub will allow you it remotely deploy your backend from your local environment by running the effect on ZefHub. i.e: my_graphql_effect | run[on_zefhub]_

## Wrap up 🔚

Just like that, a dynamically-generated running GraphQL backend in no time!

This is the end of the Wordle/Worduel blog series. The code for this blog can be found [here](https://github.com/zefhub/worduel/tree/main/backend).
