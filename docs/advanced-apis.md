---
id: advanced-apis
title: Advanced APIs
---

  
  
## Manual  
  
  
The automatic creation of the GQL schema representation has many flaws:  
  
- The automatic naming does not do well with capitalization or pluralization.  
  Reverse relations are fixed to `rev_...`.  
- GQL fields are matched directly with relations. Relations out of relations are  
  not handled.  
- All fields are exported.  
- The top level queries are all-or-nothing for instances.  
  
There are other features we might want:  
  
- Custom resolution of fields (e.g. a GQL field might represent several zef  
  traversals, or all relations regardless of the in/out direction)  
- Derived quantities from expressions (e.g. the number of relations)  
- Filtering, pagination, grouping.  
- Mutations  
  
A more in-depth discussion of the GraphQL schema layout is given in x. Here, we  
will demonstrate a few of the ideas above in one example. This is given as one  
giant `GraphDelta`, but we will intersperse it with comments.  
  
```py  
actions = ([  
    ET.GQL_Schema["s"],  
    (Z["s"], RT.GQL_Type, ET.GQL_Type["person"]),  
    (Z["person"], RT.Name, "GQL_Person"),  
    (Z["s"], RT.GQL_Type, ET.GQL_Type["pet"]),  
    (Z["pet"], RT.Name, "GQL_Pet"),  
    #...  
```  
  
We must attach to the main `ET.GQL_Schema` entity a set of `RT.GQL_Type`s.  
Although these might be aligned directly with an `EntityType` of the zef graph, they do  
not need to.  
  
```py  
    #...  
    (Z["s"], RT.GQL_Interface, ET.GQL_Interface["practically_human"]),  
    (Z["practically_human"], RT.Name, "GQL_PracticallyHuman"),  
  
    (Z["person"], RT.GQL_Implements, Z["practically_human"]),  
    (Z["pet"], RT.GQL_Implements, Z["practically_human"]),  
    #...  
```  
  
If we want to support GQL interfaces (e.g. for polymorphism) these are defined  
through `ET.GQL_Interface` nodes.  
  
```py  
    #...  
    (Z["s"], RT.GQL_Scalar, ET.GQL_Scalar["scalar_dob"]),  
    (Z["scalar_dob"], RT.Name, "GQL_Dob"),  
  
    (Z["s"], RT.GQL_Scalar, ET.GQL_Scalar["scalar_species"]),  
    (Z["scalar_species"], RT.Name, "GQL_Species"),  
    #...  
```  
  
Special types such as `QuantityFloat`s, `ZefEnumValue`s or `Time`s cannot be  
mapped directly to primitive GQL types, and so should be represented as complex  
GQL scalars. Often, a single "generic" implementation will *not* be sufficient  
for these.  
  
:::info   
  
Currently, the GQL API does not support the "serialization" function of  
`ariadne`. This means that we don't define the scalar representation with the  
scalar, but rather with the resolution of the graph traversal that ends up at  
the scalar.  
  
:::  
  
```py  
    #...  
    (Z["person"], RT.GQL_Field["person_first_name"], AET.String),  
    (Z["person_first_name"], [  
        (RT.Name, "GQL_FirstName"),  
        (RT.GQL_Resolve_with, delegate_of((ET.Person, RT.FirstName, AET.String)))  
    ]),  
  
    (Z["person"], RT.GQL_Field["person_last_name"], AET.String),  
    (Z["person_last_name"], [  
        (RT.Name, "GQL_LastName"),  
        (RT.GQL_Resolve_with, delegate_of((ET.Person, RT.LastName, AET.String))),  
    ]),  
    #...  
```  
  
To control the graph traversal/resolution of the GQL fields, we create  
`GQL_Field` relations and attach to them one one of:  
  
- `RT.GQL_Resolve_with`: this should point at a delegate of a relation on the  
  graph which would be traversed. This should be the default choice.  
- `RT.GQL_Resolve_with_func`: call the on-graph function pointed at by this relation to  
  produce a value.  
- `RT.GQL_Resolve_with_body`: similar to `RT.GQL_Resolve_with_func` except this  
  relation points at an `AET.String` which contains the body of the function.  
    
So far, we have demonstrated the simplest case of `RT.GQL_Resolve_with`, which  
allows direct traversals on the graph.  
  
:::caution  
  
It is not allowed to create an entity or interface without any fields.  
  
:::  
  
  
```py  
    #...  
    (Z["person"], RT.GQL_Field["person_friend"], ET.GQL_List["person_friend_list"]),  
    (Z["person_friend_list"], RT.argument, Z["person"]),  
    (Z["person_friend"], [  
        (RT.Name, "GQL_Friends"),  
        (RT.GQL_Resolve_with, delegate_of((ET.Person, RT.FriendsWith, ET.Person))),  
    ]),  
  
    (Z["person"], RT.GQL_Field["person_pet"], ET.GQL_List["person_pet_list"]),  
    (Z["person_pet_list"], RT.argument, Z["pet"]),  
    (Z["person_pet"], [  
        (RT.Name, "GQL_Pets"),  
        (RT.GQL_Resolve_with, delegate_of((ET.Person, RT.HasPet, ET.Pet))),  
    ]),  
    #...  
```  
  
To indicate the field is a list, use the `ET.GQL_List` type and attach to it a  
`RT.argument` indicating what type of list it is (note this is a GQL type, not a  
zef type). When a list is present, the behaviour of `RT.GQL_Resolve_with` is  
modified appropriately.  
  
```py  
    #...  
    (Z["person"], RT.GQL_Field["person_dob"], AET.String),  
    (Z["person_dob"], [  
        (RT.Name, "GQL_Dob"),  
        (RT.GQL_Resolve_with_body, "return z | Outs[RT.DOB] | single_or[None] | maybe_value | func[str] | collect"),  
    ]),  
  
    (Z["person"], RT.GQL_Field["person_name"], AET.String),  
    (Z["person_name"], [  
        (RT.Name, "GQL_Name"),  
        (RT.GQL_Resolve_with_body, "return (z | Outs[RT.LastName] | single_or[None] | value_or[''] | collect) + ', ' + (z | Outs[RT.FirstName] | single_or[None] | value_or[''] | collect)"),  
    ]),  
  
    (Z["person"], RT.GQL_Field["person_species"], AET.String),  
    (Z["person_species"], [  
        (RT.Name, "GQL_Species"),  
        (RT.GQL_Resolve_with_body, "return 'Human'"),  
    ]),  
    #...  
```  
  
The two fields above demonstrate the use of `RT.GQL_Resolve_with_body`:  
  
- `dob`: this converts what would be the normal return value of a  
`RT.GQL_Resolve_with` relation (a `Time`) to a string. This is not done very  
well, it should also strip off the time component of the string as well. Note  
that the `RT.GQL_Field` points at what type is *returned* from the body  
function, i.e. a string.  
  
- `name`: this is a generated quantity that doesn't exist on the graph, but is  
  created for the GQL query out of the `RT.FirstName` and `RT.LastName`  
  relations.  
    
```py  
    #...  
    (Z["pet"], RT.GQL_Field["pet_name"], AET.String),  
    (Z["pet_name"], [  
        (RT.Name, "GQL_Name"),  
        (RT.GQL_Resolve_with, delegate_of((ET.Pet, RT.Name, AET.String))),  
    ]),  
  
    (Z["pet"], RT.GQL_Field["pet_species"], AET.String),  
    (Z["pet_species"], [  
        (RT.Name, "GQL_Species"),  
        (RT.GQL_Resolve_with_body, "v = (z | Outs[RT.Species] | single_or[None] | maybe_value | collect); return v.enum_value if v else None"),  
    ]),  
  
    (Z["pet"], RT.GQL_Field["pet_owner"], ET.GQL_List["pet_owner_list"]),  
    (Z["pet_owner_list"], RT.argument, Z["person"]),  
    (Z["pet_owner"], [  
        (RT.Name, "GQL_Owners"),  
        (RT.GQL_Resolve_with["pet_owner_resolve"], delegate_of((ET.Person, RT.HasPet, ET.Pet))),  
    ]),  
    (Z["pet_owner_resolve"], RT.IsOut, False),  
    #...  
```  
  
Similar features have been used for the pet. Note that the species is an enum,  
which must be converted into a simple string for GQL scalars.  
  
For the `owners` resolving, an additional property is attached (`RT.IsOut` ->  
`False`) to indicate the relation is traversed in the opposite direction.  
  
```py  
    #...  
    (Z["practically_human"], RT.GQL_Field["ph_name"], AET.String),  
    (Z["ph_name"], RT.Name, "GQL_Name"),  
  
    (Z["practically_human"], RT.GQL_Field["ph_species"], AET.String),  
    (Z["ph_species"], RT.Name, "GQL_Species"),  
    #...  
```  
  
The interface requires all of the things that implement that interface to also  
contain the same fields.  
  
```py  
    #...  
    (Z["s"], RT.GQL_Type, ET.GQL_Type["query"]),  
    (Z["query"], RT.Name, "GQL_Query"),  
  
    (Z["query"], RT.GQL_Field["query_person"], ET.GQL_List["query_person_list"]),  
    (Z["query_person_list"], RT.argument, Z["person"]),  
    (Z["query_person"], [  
        (RT.Name, "GQL_People"),  
        (RT.GQL_QueryParams["query_person_max"], 1),  
        (RT.GQL_Resolve_with_body, "return g | now | all[ET.Person] | take[max] | collect"),  
    ]),  
    (Z["query_person_max"], RT.Name, "GQL_Max"),  
    #...  
```  
  
All GQL schemas require a `query` type as the entrypoint. As this does not  
correspond to any entity on the graph, you cannot provide `RT.GQL_Resolve_with`  
relations, and you must define either `RT.GQL_Resolve_with_func` or  
`RT.GQL_Resolve_with_body` relations.  
  
To pass parameters to the query (or to any field) you can add  
`RT.GQL_QueryParams` to a field. For example, the above allows for a GQL query  
like the following:  
  
```json  
query {  
    people(max: 5) {  
        ...  
    }  
}  
```  
  
If no `max` is given, then a value of `1` is taken instead (following the target  
of the `RT.GQL_QueryParams` relation).  
  
```py  
    #...  
    (Z["query"], RT.GQL_Field["query_animal"], ET.GQL_List["query_animal_list"]),  
    (Z["query_animal_list"], RT.argument, Z["practically_human"]),  
    (Z["query_animal"], [  
        (RT.Name, "GQL_Animals"),  
        (RT.GQL_Resolve_with_body, "return (g | now | all[ET.Person] | collect) + (g | now | all[ET.Pet] | collect)"),  
    ]),  
])  
```  
  
You can run this manual example through the following code:  
  
```py  
r = actions | transact[g] | run  
  
graphql_r = Effect({  
    'type': FX.GraphQL.StartServer,  
    'schema_root': r["s"],  
    'playground_path': "/",  
}) | run  
```  
  
Try entering the following query:  
  
```json  
query {  
  people(max:2) {  
    firstName  
    dob  
    friends {  
      name  
    }  
    pets {  
      name  
      owners {  
        name  
      }  
    }  
  }  
    
  animals {  
    name  
    species  
  }  
}  
```  
  
### Using `RT.GQL_Resolve_with_func`  
  
It is recommended to use Zef functions instead of `RT.Resolve_with_body`. The  
only difference is that the functions must be created on the graph first, to be  
able to refer to them in the GraphDelta. For example, the "animals" query could  
be rewritten like this:  
  
```py  
  
@func(g)  
def get_animals(z, g, ctx):  
    people = g | now | all[ET.Person] | collect  
    pets = g | now | all[ET.Pet] | collect  
    return people + pets  
  
acts = [  
    #...  
    (Z["query_animal"], RT.Name, "GQL_Animals"),  
    (Z["query_animal"], RT.GQL_Resolve_with_func, get_animals),  
]  
```  
  
## Sample graph used in the examples {#sample}  
  
The sample graph used in the examples above can be created with the code below:  
  
```py  
g = Graph()  
[  
    (ET.Person["joe"], RT.FirstName, "Joe"),  
    (Z["joe"], RT.LastName, "Bloggs"),  
    (Z["joe"], RT.DOB, Time("1991-01-01")),  
  
    (ET.Person["jane"], RT.FirstName, "Jane"),  
    (Z["jane"], RT.LastName, "Doe"),  
    (Z["jane"], RT.DOB, Time("1992-02-02")),  
  
    (ET.Person["alex"], RT.FirstName, "Alex"),  
  
    (Z["joe"], RT.FriendsWith, Z["jane"]),  
    (Z["joe"], RT.FriendsWith, Z["alex"]),  
  
    (Z["joe"], RT.HasPet, Z["rufus"]),  
    (Z["jane"], RT.HasPet, Z["rufus"]),  
  
    ET.Pet["rufus"],  
    (Z["rufus"], RT.Name, "Rufus"),  
    (Z["rufus"], RT.Species, EN.Animal.Dog),  
] | transact[g] | run  
```