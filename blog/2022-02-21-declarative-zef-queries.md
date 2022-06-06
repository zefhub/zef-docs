---
slug: declarative-zef-queries
title: Declarative Queries in Zef
author: Ulf Bissbort
tags: [graphs, queries, sql]
---


# Imperative vs Declarative Queries
One major motivating factor that is often associated with relational databases is the ability to interact and query the data declaratively. Instead of telling the DB exactly how to traverse and gather the data, just give a bunch of clauses that have to be true and let the DB figure out how to resolve the query most effectively. 


```python
q1 = Query([
    Z['p1'] | is_a[ET.Person],
    Z['p1'] >> RT.FirstName | value | equals['Roger'],
])
```

```
SELECT * from Persons WHERE FirstName="Roger"
```
- everything in SQL is a table: entities are defined as rows of attributes. In Zef an Entity can "just be". It may have have attributes expressed as relations to values or atomic entities.
- variables from predicate logic are the equivalent of columns / column names in SQL.

```python
q2 = Query([
    Z['x1'] | is_a[VT.Int],
    Z['x1'] | less_than[5],
    Z['x1'] | greater_than[0],
])
```

- `Z['x1']` is a variable in the sense of predicate logic. In other fields they are sometimes also referred to as "unbound constants". 
- We have to wrap it with `Z`, since using `x1` by itself on the spot would not be valid Python syntax
- We could declare all variables used beforehand if the `Z` bothers us: `x1 = Z['x1']`
- each line is a predicate function: given a potential solution, it can be evaluated to true or false
- these predicate functions are often called "clauses" in mathematical logic - don't be frightened by the name
- each line can contain one or more variables: predicates can thus also express constraints between variables.
- the solution to a given query / list of constraints MUST fulfill each individual predicate. I.e. it can just be seen as one big predicate function obtained by combining all of them via an `And`.
- This combined predicate function is a function of all variables occurring in the query.
- We can also see each individual predicate function as a function off all variables in the query if we want a more formal justification for combining them with an `And` (the logical operators can only combine predicates with the same function signature)


Let's take the previous query up a notch:
```python
q3 = Query([
    Z['p1'] | is_a[ET.Person],
    Z['p2'] | is_a[ET.Person],
    Z['p1'] >> RT.FirstName | value | length | equals[ 
        Z['p2'] >> RT.FirstName | value | length 
    ],
])
```
Just to put it in normal words: "please return me all pairs of persons whose first names are of the same length." A result of this query would be a (possbily very long) list of dicts, each containing two people
`[{'p1': z_jack, 'p2': z_john}, ...` where `z_john` and `z_jack` are both ZefRefs and point to persons with those names respectively.

But this is not what we want to get at. The crucial part we want to demonstrate here is that to express queries of this type succinctly, we need the ability to use **ZefOps** inside predicate functions. It is crucial that these are not lazy values that can be evaluated to a fixed value beforehand, but they involve variables themselves. These only become equivalent to lazy values within the context of a potential solution.

So what is the problem? Before we were using `greater_than[0]`, i.e. a value inside the combinator, whereas now we are using a clause. Also: clauses can be understood as Zef lambda functions (as we discuss elsewhere). And Zef lambda functions are values themselves within Zef: value semantics is one of the foundational principles that we cannot give up.
So now we are using `greater_than` with two different values, but in quite different ways. This is a problem: what is the nature of the thing we pass into equals? Should the second case only return true if the argument piped in is the very Zef Lambda function inside? This seems to be the case at first glance, if we want strict and general value semantics.
But there is a way out and one also encounters it in different contexts. It is actually an approach that dates all the way back to Alonso Church, who came up with lambda calculus, which you may have heard of.
The way out of our dilemma is just to put on our Church glasses: in lambda calculus everything is a function. Even an integer like 42 can be seen as a function: it is simply the function that returns 42 whatever argument you give it. What are the arguments here and why are they not listed? Because it would be too tedious. As we saw, a query can be seen as one big lambda function itself that is just the combination of all listed clauses combined with `And`. The variables are implicit and are all the variables that occur in the query.
This allows us to keep our short syntax in terms of values above, e.g. use `greater_than[0]` with it having exactly the simpler meaning we associated with it before. The occasional user of Zef does not even need to be aware of all this abstract stuff and lambda calculus.

So what does this mean concretely? How can we construct a semantically consistent system out of this? There is a very narrow path out of this mess. We can  simply be guided by the logical constraint and the goal of a succinct, not overly technical syntax. We do not want to require everyone to have to syntactically wrap their values in a lambda function. 

Let's go through the requirements:
1. A value `42` is distinct from the Zef lamba function `func[42]` that always returns 42.
1. values inserted into logic operators must be interpreted as Zef Lambdas
1. We don't want to write the `func[...]` wrapper everywhere
1. All of this is not specific to `equals`, but applies to all logic operators (unary, binary, all arities)

Hence, anything injected into a `[...]` of a logic operator will be understood to be wrapped by a `func[...]` at the point of evaluation. This may sound horribly complicated at first, but keep your pitch fork down for a moment. What we're after is that the resulting syntax is easy to use and consistent. 
The expression `42 | equals[42]` will continue to evaluate to true, since the two associated Zef lambdas (which are values themselves) are considered to be equal. 

Side note: note that lambdas in Python do NOT follow value semantics for functions in this sense:

```python
my_answer_to_everything   = (lambda : 42) 
your_answer_to_everything = (lambda : 42) 
should_we_start_a_flame_war: bool =  my_answer_to_everything != your_answer_to_everything  

# OMG Python, you're worse than social media!
print(should_we_start_a_flame_war)          # True
```

But now we notice that this also allows us to throw in other expressions and operators that will be interpreted accordingly: both cases that we started off with, e.g. using `greater_than[0]` and but also `greater_than[ Z['x1']>> RT.Age | value ]` would work.
At the point of evaluations, the latter internal argument is translated into `func[ Z['x1']>> RT.Age | value ]` which by itself is a valid Zef lambda function that could be used in a different context as well.

The one thing we are not allowed to do is wrap the expression in an additional `func[]` layer and expect the same behavior. E.g. `equals[ func[Z['x1']>> RT.Age | value] ]` would check whether the incoming value is equal to that **lambda function**, i.e. at the point of evaluation `func[ func[Z['x1']>> RT.Age | value] ]` is the Zef lambda function that always returns the internal lambda function (a value itself), not matter what arguments are passed in.

So what does this mean, you may ask? The take away message for Zef lambda syntax is that multiple layers of `func[...]` do not automatically collapse to a single wrapping `func[...]` layer. They are different things.

What about using Python lambdas in piped expressions? since `42 | (lambda x: x+1)` cannot be intercepted by Zef in any way without doing unspeakably horrible things, you will have to wrap raw python functions and lambdas in one layer of `func[...]`:

```python3
42 | func[lambda x: x+1] | collect
```

works and is the way you have to do it. The same goes for normal python functions. But as soon as you have a Zef function, wrapping it in a `func[...]` will cause an additional layer of wrapping, since that Zef function is itself already a Zef value. This is the gotcha to watch out for!
















# SQL & Zef




# Declarativeness is in the Eye of the Beholder




# Knowing ones own type
How does an entity / object know what it is?

### Classes / Structs
This depends on the programming language. In dynamic languages like Python, this is stored as explicit meta-information as a pointer on each object pointing at the parent type object.
In compiled languages like C++, this information may not even be stored explicitly at runtime: only the struct's/object's contained attributes are stored at the objects location in memory. The information about which type it is compiled away in the simple case (this may be different for typed unions, e.g. std::variant and other more advanced structures).


### JSON / Python Dicts
This is either implicit from the context in which the dictionary is stored. Often the associated entity's type may also be explicitly stored as a value under a "type" key.

### Relational Databases / Spreadsheets
Which table it is contained in: the table name can often be seen as the equivalent to the object's type. Each row in the table can be seen as an object/entity expressed in terms of its attributes / fields (columns).

### Document Database
These are often organized in terms of **collections**. Just like we know that the real world entity described by a row in a table knows what it is from the table's name, a document in a collection is specified by the name of the collection. In some cases users may find it more convenient to directly dump json into the database.

### Zef Graphs
Each Relation / Entity / Atomic Entity (RAE) has its type stored explicitly in its blob on the graph. In contrast to objects, RAEs have no internal structure whatsoever. Rather than choosing to model the world in terms of a hierarchical taxonomy, all information is represented associatively in terms of relations.



# History of Zef: Evolving from Property Graphs 

 "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." — Antoine de Saint-Exupéry 

The Zef data model may seem somewhat strange at first when coming from the world of objects, tables or property graphs. In this post we want to give a brief overview of how we arrived at this data structure. Maybe we can even convince you that it is a simpler data structure than many of the better known alternatives.

1) model our domain in terms of C++ structs / Python objects
2) move to using plain old dictionaries, all the serialization and de-serialization code was getting too much
3) having to choose a hierarchy does not play well with modelling a complex domain where requirements often change. We often thought we got the domain modeling wrong, but that was missing the true underlying reason: the real world domain model was that of a graph and different parts of our system require querying the data from different directions. Choosing any tree-based hierarchical data structure has a structural mismatch with the true domain model. We moved on to use NetworkX. What a relief, working directly in terms of graphs is awesome! Why is this not the norm?
4) NetworkX is a bit slow. Even for Python standards. Also, we really want to work on top of graphs in our high performance simulations written in C++.
5) After exploring multiple options (iGraph, Boost Graph, various DBs), we didn't find any that had user friendliness in terms of the API we were looking for and the performance we required. How hard could it be to build a more performant version, but very much stripped down version of NetworkX in C++ and expose bindings to Python. This was actually easer than we thought and a basic version of "Arachne" was up and running after two to three weeks. The core data structure was a directed property graph: both the nodes and edges could contain attributes. For the application that we were running (MCTS-like simulations), Arachne achieved about a 10000x speedup over NetworkX, which somewhat surpassed our expectations. Cache locality and data oriented design for the win!
6) This design took us pretty far, but there were three problems appearing. A) working in the field of manufacturing, our domain models between customers differed and were often quite complicated. Also, they were often evolving over time as new requirements and features came up. We noticed the following pattern reappear every few weeks: an initially unimportant field of some entity started off its life as an internal attribute on a node or an edge. But at some later point, it became more important and modelling it as an internal attribute no longer seemed like the right choice. It should be a separate entity on the graph. All of this implied a graph schema change (yes, Arachne graphs had schemas) and a migration of the production data together with all the different code snippets that tied into that attribute.
We also noticed that the opposite direction never occurred: something we had started modeling as a separate entity on the graph never became an internal attribute and caused us hours of repetitive, boring work.

With this pattern emerging, what would the end game of this iterative domain model revision war be? A domain model where every attribute will have become its own distinct entity on the graph? That sounds silly and too radical. But what would happen if we actually tried this? What is the defining difference between an objects attribute and a separate entity connected by a relation in any case? Doesn't this distinction introduce two different languages for querying individual fields of entities on a graph: one for traversing the graph and one for accessing internal attributes. Would it not be simpler if we had a single language only and everything would just be a graph traversal. There is no inner structure to RAE, there is no externally imposed hierarchy on our domain model.

There was one complication though: Since Arachne was a directed property graph, we stored attributes for some relations on the graph as well. It was by far not as common as attributes of an entity, but they were extremely useful in some cases (suppose you were to model an online store with certain items added to an order. One of the simplest ways to store the number/amount of a given item is as an attribute of the "ordered" relation itself). What would become of these edge attributes when we flatten everything out on the graph? According to our recipe of representing fields as relations to separate "values nodes" on the graph, we would have relations coming out of relations?! This would no longer be a graph.
However, after a fair amount of back and forth, this is exactly what we decided to do. Zef Graphs are thus not simple graphs, but "meta-graphs" (we found this naming in this paper by Ben Goertzel). Note that these are different from hypergraphs, which can have edges which can connect more than two nodes.

