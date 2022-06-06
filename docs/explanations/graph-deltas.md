---
id: graph-deltas
title: Graph Deltas
---

## Why?
"Great benefits will be reaped by those who resist their imperative impulses and invest in the power of deferred execution." - Nero

An additional layer of indirection allows for more controlled execution of side effects (appending to graphs).

- larger parts of your business logic to be written as pure functions
- graph deltas compose
- more declarative, higher level of abstraction
- GraphDelta being pure data (an expression) can be transformed with the tools that ZefDB provides, as well as those of your language
- makes zef more of a distributed systems DSL: the syntax of what changes are to be performed on a graph is decoupled from the execution environment (local transactions, remote transactions on graphs primary instance living on other compute nodes, transactions performed by zefhub)
- integration with the [ZefDB effects system](effects/effects.mdx): enable controlled execution via policies and user-defined middleware layer


### Instantiation
```python
GraphDelta((
    instantiate[ET.Dog],    # Not a valid expression: keep reading on
))
```
After using zefDB for a while, it turns out that instantiating RAEs in graph deltas is a pretty common operation and something we often do when writing code. `instantiate_` is a bit long to type out each time. Is there a shorter intuitive way to express this consistently? There are clearly many ways. The one we liked and settled on is that the very act of declaring a RAE type indicates the instantiation of an instance:
```python
GraphDelta((
    ET.Dog,
    ET.Cat,
))
```
OK, that's cute. Now how do we easily access the newly created RAEs if we transact this on a graph, you may ask.
That's where **internal names** come in:
```python
my_receipt = GraphDelta((
    ET.Dog['rufus'],
    ET.Cat['schrödinger'],
)) | g | run
```
Piping the GraphDelta through `g` turns it into an effect. An effect is also just a value and does nothing. It can be passed to the FX system using the run function though, which can execute it. If it succeeds, a receipt is returned.  This receipt is pure data in form of a dictionary: it relates the internal names we used in the graph delta (keys) to the ZefRef (dictionary values) of the RAE affected in the time slice of the transaction. e.g.
```python 
my_receipt = {
    'rufus': z_rufus,                       # z_rufus is a ZefRef to the RAE on graph g  
    'schrödinger': z_schroedinger,          # likewise
}
```
Internal temp ids are automatically created for any RAE that was not assigned an internal name in the graph delta.

:::note Hiding Variables
One sometimes encounters the case that one wants to express relationships in the GraphDelta by making use of variable names, bu one does not want these variables to clutter the receipt. In this case, simply use a variable name that starts with and underscore, e.g. "_x1". This convention is analogous to the case of Queries.
:::

We can also express data with that is of more complex form than what JSON or other tree-based formats allow for.
```python
my_receipt = GraphDelta((
    (ET.Person['jack'], RT.FirstName, 'Jack'),     # declaration and name assignment
    (ET.Cat['schrödinger'], RT.Name, 'Schrödinger'),
    (ET.Dog['rufus'], RT.Name, 'Rufus'),

    (Z['jack'], RT.Owns, Z['rufus']),              # additional relation between the entities
    (Z['jack'], RT.Owns, Z['schrödinger']),
    (Z['rufus'], RT.Likes, Z['schrödinger']),
)) | g | run                          # 'run' indicates that a side effect is executed
```

There's a lot going on here, so let's break it down.

- the order of the expressions is of no significance
- a RAE declaration may assign an internal name. Each internal name may be used at most once by a RAE declaration.
- If we want to refer to any RAE after the initial declaration, we can use the `Z['jack']` operator together with the internal name. Think of `Z` as a flexible placeholder or pronoun. We can generally use it for things we want to refer to in a given context.
- the described data structure is declared as a list of semantic triples and cannot be expressed as a tree (i.e. as JSON or a nested dict without using a custom DSL for cross referencing). This underlines the fundamental similarity between triple stores (relating to e.g. RDF, datalog) and directed graphs.
- Note that we could immediately assign a value `'Jack'` attached to the `RT.FirstName` relation: this is shorthand for instantiating an `AET.String` (the type can be inferred) and additionally performing a value assignment.

### Termination
For the other elementary graph actions, we do not use a shorthand notation as for instantiation, but write out the operator.
```python
GraphDelta((
    terminate[rufus],
))
```
Can one also give internal names to RAEs that one would want to terminate? No.
The very fact that we can name something that already exists on some graph (that we want to terminate), means that it already has an identity. There is never any need to give it an internal name, since we can just use a (U)ZefRef (or equivalently its uid) to reference / name it.


### Value Assignments
```python
rufus_weight = rufus >> RT.Weight
new_value = QuantityFloat(7.7, EN.Unit.kilograms)

GraphDelta((
    rufus_weight <= new_value,
))
```

### Merging RAEs from Foreign Graphs
If we think about it, one does actually also not need a merge command. If we have any ZefRef `z1` to a RAE of our choosing, we can simply write
```python
GraphDelta((
    z1,
))
```

:::tip Remote Transactions
In case the transaction will be performed on a graph that is not a primary instance in the local process, a remote transaction can be performed. 
:::

Can we also give internal names to merged RAEs? Analogous to naming when instantiating RAEs.
```python
# this is an invalid expression!
GraphDelta((
    merge_[rufus]['Rufus'],
    (Z['Rufus'], RT.Color, EN.Color.Brown),
))
```
This is actually redundant. Similar to terminations, `rufus` already has an identity and we can refer to him using a ZefRef. 
```python
GraphDelta((
    (rufus, RT.Color, EN.Color.Brown),
))
```
The entire `merge[rufus]` expression becomes redundant



This will make sure that the target graph will know about `rufus` and properly account for it within the lineage system.

What happens when the target graph already contains `rufus`? For now: a no-op. Option for the future: One may consider adding the information that `rufus` was also contained in the transaction created from this graph delta. We only plan to implement this when seeing sufficient real world use cases which this would solve.


## Handling failures
We believe in the philosophy of failing hard as early as possible if something is wrong. 
Therefore a number of checks are performed at the construction stage of a graph delta (although a graph delta is essentially just a thinly wrapped list of dictionaries). It is better that a user is alerted about any inconsistencies in a graph delta locally when the expression is constructed than when the transaction is attempted.
Examples of errors that can be detected would be the usage of internal names in multiple RAE declarations, or the usage of internal names in `Z['some_name']` where `'some_name'` has not been declared. 

In the future, the checking system may be extended to test whether a given graph delta, if it were applied to a graph `g` would lead to a transactional change that is compliant with some a given zef spec.

## Use your tools
Since graph deltas are built from native language constructs (tuples), we can employ our usual language tools for the construction and manipulation.
Suppose Jack gets 10 new puppies, but has not decided on proper names yet. We can construct the graph delta as
```python
GraphDelta((
    (ET.Person['jack'], RT.FirstName, 'Jack'),    
    *[(Z['jack'], RT.Owns, ET.Dog[f"puppie_{c}"]) for c in range(10)],
))
```



# Bigger Picture

We will soon have `GraphSlice` as a first class object in ZefDB. What does it represent? A given graph at one particular instance in time. How do we access graph slices?

```python
g | graph_slice[now]        # get me the very latest slice at the time of execution. Note: using `now` makes this an impure operation!
g | graph_slice[my_tx]      # `my_tx` is a (U)ZefRef to a transaction on g.
g | graph_slice['July 4 2020 18:00 (+0200)']     # also possible. But use with care since the string parsing etc. has performance costs
```

Now that we have introduced the concept of graph slices, we can define a delta / diffing operator
```python
gs_a = g | graph_slice[time_slice[100]]
gs_b = g | graph_slice[time_slice[42]]

my_graph_delta = gs_b - gs_a
```
The resulting `my_graph_delta` is just a graph delta expression that contains the minimal set of changes between the two graph slices from a set theoretic perspective. This is analogous to a git squash of all intermediate changes between the two slices.

We can also create a graph
```python
g_forked = g | fork[g(time_slice[42])]
my_graph_delta | g_forked | run
```
after the application of the transaction `my_graph_delta` will be in the same state as `gs_b`.

### But, wait a moment...
It's easy to see what the graph delta does in case of instantiations, merges, value assignments: it just contains these operations as expressions.
But how can this work if a RAE `z` was terminated between `gs_b` and `gs_a`? If our graph delta simply contains an `instantiate_[rae_type(z)]`, i.e. of the same type, the identity of the newly instantiated RAE will be different. This is where ZefDB's [lineage system](lineage/lineage-low-level-graph-layout.mdx) comes to the rescue. This is usually used to talk about the same thing in the real world from different graphs (reference frames), but for the very reason we just encountered, one can also have multiple RAEs on the same graph be of the same lineage, i.e. refer to the same real world thing. As long as there is at most one RAE of a given lineage alive at any point in time per graph.

So how do we undo the erroneous termination of Rufus? We don't have to revive the terminated RAE, we simply instantiate a new one with the same lineage. This is fully captured by the *command* `merge_[rufus]` in the graph delta.

When transacted on a graph that already contains a non-terminated RAE referring to Rufus, this command does not do anything, i.e. acts idempotently. Having multiple RAEs refer to the same real world thing is a recipe for disaster.

