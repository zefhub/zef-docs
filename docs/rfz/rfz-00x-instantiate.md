---
title: RFZ - instantiate as a zefop
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Motivation

Downsides to `instantiate`

- `instantiate` is very long to type.
- The shorthand, `I = lambda *args: instantiate(*args, g)` is language specific currying.
- Instantiating an AET with a value is a two-step process.
- `instantiate` is currently not a zefop, so currently can't be lazily evaluated.

## Suggestions

- Rename `instantiate` to a shorter word, e.g. `create`, `make`, `zmake`.
- Make `instantiate` itself a zefop, with the curryable information the graph.
- Allow for automatic AET type determination.

### Examples

<Tabs
  groupId="names"
  defaultValue="zmake"
  values={[
    { label: 'create', value: 'create', },
    { label: 'make', value: 'make', },
    { label: 'zmake', value: 'zmake', },
    { label: 'instantiate', value: 'instantiate', },
  ]
}>
<TabItem value="create">

```python
g = Graph()

I = create[g]
z_entity = I(ET.Entity)
z_entity = ET.Entity | I

z_string_ae = create("some string", g)
z_float_ae = I(3.0)
z_rel = create(z_entity, RT.Name, z_ae, g)
```

</TabItem>
<TabItem value="make">

```python
g = Graph()

I = make[g]
z_entity = I(ET.Entity)
z_entity = ET.Entity | I

z_string_ae = make("some string", g)
z_float_ae = I(3.0)
z_rel = make(z_entity, RT.Name, z_ae, g)
```

</TabItem>
<TabItem value="zmake">

```python
g = Graph()

I = zmake[g]
z_entity = I(ET.Entity)
z_entity = ET.Entity | I

z_string_ae = zmake("some string", g)
z_float_ae = I(3.0)
z_rel = zmake(z_entity, RT.Name, z_ae, g)
```

</TabItem>
<TabItem value="instantiate">

```python
g = Graph()

I = instantiate[g]
z_entity = I(ET.Entity)
z_entity = ET.Entity | I

z_string_ae = instantiate("some string", g)
z_float_ae = I(3.0)
z_rel = instantiate(z_entity, RT.Name, z_ae, g)
```

</TabItem>
</Tabs>


## Extension of `attach`
An alternative proposal is to not introduce a new function / zefop to replace **instantiate**, but to extend the usage of the **attach** zefop.

### Current mental model for `attach`
If we are on a given RAE `z` and we just want to *attach* a field to it on the fly, but **not** move to the new field, but continue our functional piping with `z` itself. This is extremely hand and we moved to often using this as the primary method of instantiating RAEs on a graph.

### Zef Meta-Operators
One core part of the zef language are `<<`, `<`, `>`, `>>`, which allow you to traverse the graph locally. One arrow (`<`, `>`) takes you onto a given relation whereas two arrows  `<<`, `>>` take you further and over the edge.
The usage of zefops is often in conjunction with the pipe operator `|` that does not encode any spatial movement for the following functional step, i.e. reflects *standing still*. Hence we could think of the quintuple `<<`, `<`, `|`, `>`, `>>` to encode motion.

This ties into the current usage of `z | attach[RT.Age, 42]`, where we **stand still**, i.e. the same `z` is returned that went in. There is an unambiguous syntax though which decouples the action of attaching something from what is returned, i.e. the implcitly associated traversal step:
- `z >> attach[RT.FriendOf, ET.Person]` performs the very same modification of the graph, but returns the newly attached target. 
- Similarly `z > attach[RT.FriendOf, ET.Person]` performs the same modification and returns the newly created relation of type `RT.FriendOf`

In all cases above, the new field is always attached to `z` via an outgoing edge. The proposed syntax would also allow to conveniently attach other RAEs via incoming relations:
- `z << attach[RT.FriendOf, ET.Person]`  attaches a new `ET.Person` via an incoming relation and moves there
- `z < attach[RT.FriendOf, ET.Person]`

### Downsides

- Before we have lazy zefops, we may again need many parentheses (as in graph traversals) to fight the operator precedence. This is true, but all of the current syntax for `attach` remains unaffected and we have additional tools to compactly express on the fly graph modifications. You're not forced to use it in any form and provides an **additional, more advanced API** only.
- Is it not inconsistent that `z | attach[RT.FriendOf, ET.Person]` creates an outgoing edge and not an incmoing edge, although the syntax looks visually symmetric? This is true and is a downside. This may be a small price to pay though and it is intuitive that **fields** are attached via outgoing relations, i.e. have an implicitly higher precedence. Also this criticism applies only to the current syntax.

## What does this have to do with `instantiate`?
All previous points seem like a completely separate issue from `instantiate` being too verbose. OK, hold on. The proposed changes for `attach` would make it more powerful for graph modification and possibly increase its usage even more (to be tested). Could we not also use `attach` as a zefop to cover the use cases of `instantiate`?

Here it goes:
- `g | attach[ET.Person]` instantiates a new ET.Person and returns `g`. This allows chaining and creating many unconnected entities (if this were ever wanted)
- `g >> attach[ET.Person]` instantiates a new ET.Person and returns the new entity and pretty much replaces what we are currently using `instantiate` for.

### Downsides
This may be confusing at the very early stages of using zef. This confusion may clear up very quickly though and the concepts tie in coherently with the existing traversal syntax. We could leave `instantiate` in for a while and look at the emerging confusion / problems.


### Alternatives
 We could also have `g | attach[ET.Person]` return the new entity, and may seem more intuitive at first. But it seems to go against the underlying philosophy upon closer inspection.




## Things to keep in mind

- A new name should not clobber a commonly used function.

## Related concepts

- Instantiation of a transformed AET, taking a function and a set of arguments,
  and producing a new AET. Subscriptions to changes in the arguments are made
  which update the produced AET.
