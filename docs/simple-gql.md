---
id: simple-gql
title: SimpleGQL
---

  
  
## What is SimpleGQL?  
  
The `zef.gql.server_simplegql` provides a way to host a GraphQL server using  
only a GraphQL schema file. No setup of the Zef graph is required.  
  
The purpose of SimpleGQL is to provide frontend developers a backend that "just  
works" but can later be extended/interacted with the full suite of Zef capability.  
  
This page assumes you understand GraphQL schema files.  
  
## Prepare a SimpleGQL-compatible GraphQL schema file  
  
A SimpleGQL-compatible schema file contains only `type` and `enum` definitions,  
and can look like:  
  
```graphql sample.graphql  
# Zef.SchemaVersion: v1  
  
type Employee {  
    firstName: String!  
    lastName: String!  
    dob: DateTime  
      
    reportsTo: Employee  
    responsibleFor: [Employee] @relation(rt: ReportsTo) @incoming  
    department: Department  
    status: EmploymentStatus  
}  
  
enum EmploymentStatus {  
    EMPLOYED  
    RETIRED  
    HIRING  
}  
  
type Department {  
    name: String!  
      
    employees: [Employee] @relation(rt: Department) @incoming  
}  
```  
  
To host this as a GraphQL server, we save this file to `sample.graphql` and then  
run:  
```  
python3 -m zef.gql.simplegql --schema-file=sample.graphql --data-tag=data --create --port 5001 --bind 0.0.0.0  
```  
  
Note that this command uses (or creates if it doesn't already exist) a graph  
with the tag `data`. You may then point your browser at the [GraphQL  
Playground](https://graphqlbin.com) and enter `http://localhost:5001/gql` to  
explore the GraphQL API. Try creating a department and employee and then  
querying them.  
  
For help on the command line arguments, run:  
  
```  
python3 -m zef.gql.simplegql --help  
```  
  
## SimpleGQL directives  
  
The SimpleGQL schema follows standard GraphQL schema rules for `type` and  
`enum`. In addition it supports the following directives on fields:  
  
- `@relation(source, rt, target)`: indicates the underlying Zef graph relation  
  that should be traversed from this type of entity to obtain the field.  
- `@relation(rt)` as above, but where the source and target are guessed.  
- `@incoming` the underlying Zef graph relation is incoming to this entity.   
- `@unique` the field should be kept unique. Attempts to create entities with  
  the same field will result in an error.  
- `@search`: indicates this field is searchable and sortable in queries.  
  
A special directive on a type of `@upfetch` can also be used. This should be  
used sparingly, and only when an atomic "check or create" operation is needed.  
For example, a user account which is uniquely identified by its email could  
have:  
  
```graphql  
type User  
  @upfetch(field: "email") {  
  email: String! @unique @search  
  givenName: String  
  ...  
}  
```  
  
Only one field can be marked as the upfetch field of a type, and it creates a  
special mutation for the GraphQL API. As an upfetch field is similar to a UID,  
it must be unique and required. Note that each entity **also** has a UID, which  
can be used instead.  
  
## Authentication  
  
The types also support the `@auth` directive. This is best described with an  
example:  
  
```graphql  
# Zef.SchemaVersion: v1  
# Zef.Authentication: {"JWKURL": "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com", "Audience": "firebase-audience-here", "Header": "X-Auth-Token"}  
  
type User @auth(  
  query: "z | Out[RT.FirebaseID] | value | equals[info.context | get_in[('auth', 'USER_ID')][None] | collect]",  
  add: "info.context | get_in[('auth', 'admin')][False]"  
) {  
  firebaseID: String! @unique  
  email: String @unique  
  givenName: String  
  familyName: String  
  phone: String  
  birthday: DateTime  
}  
  
```  
  
The `query`, `add`, `update`, `updatePost` and `delete` arguments are each user-defined  
functions which act as predicates that should return whether this operation is  
permitted. Each function has access to the variables:  
- `z`: the current entity of the GraphQL type.  
- `type_node`: the entity corresponding to the GraphQL type schema node.  
- `info`: the ariadne `info` struct  
  
Each function is run at a different time and has some default fallback behaviour:  
  
- `query`: runs whenever an entity is traversed. If empty will return `True`.  
- `add`: runs whenever a new entity is created, using the graph state **as if**  
  that entity has already been created. If not present, will fallback to `query`.  
- `update`: runs whenever an entity would be modified, using the graph state  
  **before** the modification. Falls back to `query`.  
- `updatePost`: runs whenever an entity would be modified, using the graph state  
  **as if** the modification has already happened. Falls back to `update`.  
- `delete`: runs whenever an entity would be deleted, using the graph state  
  before the deletion. Falls back to `update`.  
    
    
### Auth variables  
  
The auth configuration must be present in a line with a comment beginning:  
```  
# Zef.Authentication:   
```  
and the remainder of the line will be parsed as a JSON object. The configuration  
must be on one line only, without line breaks.  
  
The auth configuration can be either for an asymmetric or symmetric key sharing.  
In either case, JWTs are used to validate user sessions. The allowed keys in the  
configuration JSON object are:  
  
- Algo: either 'RS256' for asymmetric key sharing with a JWT or 'HS256' for  
  symmetric key sharing.  
- JWKURL: only allowed when `Algo` is 'RS256'. The URL where the JWK key can be obtained.  
- VerificationKey: only allowed when `Algo` is 'HS256'. The preshared key for  
  symmetric authentication as a string. Any `\n` present in the string will be  
  replaced with line breaks.  
- VerificationKeyEnv: only allowed when `Algo` is 'HS256'. The name of an  
  environment variable where the preshared key is located.  
- Audience: to validate the audience field of the JWT  
- Header: what HTTP header is used to find the JWT in client connections.  
- Namespace: if not given, the entire JWT object is made available as  
  `info.context['auth']`, otherwise only the key in the JWT given by `Namespace`  
  is made available at `info.context['auth']`.  
- Public: if True (the default) then HTTP requests without a JWT are allowed  
  through with `info.context['auth']` set to `None`.  
  
If auth has been verified, the query progresses and the entire JWT is made  
available at `info.context['auth']`. If only a part of the JWT should be made  
available, the configuration key `Namespace` should be used.