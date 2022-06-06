---
title: Exploring a sample Zymergen graph
---

The idea of this tutorial is to show some of the structure of the graph used to
describe a Zymergen module and how a schedule is represented on the graph.

It aims to do this by natural exploration and minimizes required prior
knowledge. Images will also be neglected from this tutorial: even though they
would help understand this particular graph, we would like to show how only the
built-in tools of ZefDB should be sufficient to understand a graph structure.


## Viewing the config and protocols on a graph

### 1. Start ZefDB and view a graph

Start your python interpreter in your preferred program/terminal. Then run:

```python
from zefdb import *
from zefdb.zefops import *
```

These are the standard imports of any zef session. To find all graphs with
zymergen in their name:

```python
zearch("zymergen")
```
```python title="output"
['zymergen-scenario1', 'zymergen-scenario2', 'zymergen-scenario3']
```

We import one of these graphs and look at its basic information:
```python
g_orig = Graph("zymergen-scenario1")
g = clone(g_orig)
g | info
```

:::note
The syntax `g|info` could also be written as `info(g)`. This type of function is
known as a "zefop".
:::

Note we have cloned the graph. This is only for the purposes of this tutorial, so
we can mess it up without changing the original.

The output of the info command can be long, but for now, we are only interested
in the top sections. Specifically, the Entities list shows:
```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  Entities ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
[3 total, 3 alive]             ET.AnyOf
[6 total, 6 alive]             ET.Submodule
[5 total, 5 alive]             ET.Handoff
[11 total, 11 alive]           ET.InternalLocation
[17 total, 17 alive]           ET.Recipe
[5 total, 5 alive]             ET.Payload
[5 total, 5 alive]             ET.ToBeImplemented
[5 total, 5 alive]             ET.ZymergenProtocol
[13 total, 13 alive]           ET.ZymergenStep
[4 total, 4 alive]             ET.SubLocation
```

Each string beginning with an `ET` represents an entity type. These are
first-class citizens in zefdb. Let's get all of the `ET.Submodule`s in the
graph, and view more detail on the first one:

```python
sms = g | instances[now][ET.Submodule]
sms | first | info
```
``` {12-13}
<...snip...>
uid:                    2ce8111dedd1162dc18c2720694d7e96
blob index:             97
type:                   ET.Submodule
current owning graphs:  9c41f880369e0716476a8692c36858e0 , name tags: (zymergen-scenario1)
other graphs viewing:   /
instantiation:          1: 2021-02-19 08:51:46 (+0800)
termination:            /

    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Incoming & Outgoing Relations ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    
    1x:     (z:ET.Submodule) ---------------------------(RT.Name)-------------------------> (AET.String)
                (z) ----(eccc9616ae5f7405cb087b5f6222a670)---> (f3b14876453b6ae0d7ec349738e2d341 [latest val: atc-sm-1])
    
    1x:     (z:ET.Submodule) ---------------------------(RT.Type)-------------------------> (AET.String)
                (z) ----(f643dc826855759943e9142892dee29c)---> (e049afb7afc5741dc6aa5baad0a78a75 [latest val: atc])
<...snip...>
```

We can see that this entity is connected by two relations to two atomic entity
strings: these show its name and its type. The values in this case are
`"atc-sm-1"` and `"atc"`.

:::note
An atomic entity and an entity function similarly. The only difference is an
atomic entity can have a value, and an atomic entity's type is restricted to the
value type.
:::

### 2. Diving into particular entities

Let's get the detailed information for each submodule:

```python
details = []
for sm in sms:
    details.append({"z": sm,
                    "name": sm >> RT.Name | value.String,
                    "type": sm >> RT.Type | value.String})
details
```
```
[{'z': <ZefRef #97 ET.Submodule ts=1>, 'name': 'atc-sm-1', 'type': 'atc'},
 {'z': <ZefRef #328 ET.Submodule ts=1>, 'name': 'atc-sm-4', 'type': 'atc'},
 {'z': <ZefRef #392 ET.Submodule ts=1>, 'name': 'magnemotion-sm-1', 'type': 'magnemotion'},
 {'z': <ZefRef #577 ET.Submodule ts=1>, 'name': 'atc-sm-3', 'type': 'atc'},
 {'z': <ZefRef #628 ET.Submodule ts=1>, 'name': 'atc-sm-2', 'type': 'atc'},
 {'z': <ZefRef #679 ET.Submodule ts=1>, 'name': 'ambistore-sm-1', 'type': 'ambistore'}]
```
We used `>>` to traverse an edge to its target and `| value` to get the value of
the atomic entity we landed on. To interpret the output, we see that there are 6
submodules, 4 of type `"atc"` and each uniquely named. The item `'z'` is
the `ZefRef` that corresponds to that entity. `ZefRef`s are the standard type to
refer to all graph entities and relations, encoding what and when you 
have looked at an entity or relation.

:::note
`value.String` does not strictly require the `.String` part here but it allows
compilable languages (C++, Julia) to take advantage of inferring the type, hence
it is good practice to include when possible.
:::

Although we show the types of each submodule as strings, these are actually
the one entity (with a value of a string) on the graph themselves. The UID of
the entity indicates this:

(OOPES THIS DOESN"T WORK - FIXME!")

```python
(details['atc-sm-1']['z'] >> RT.Type) == (sms['atc-sm-2']['z'] >> RT.Type)
details['atc-sm-1']['z'] >> RT.Type | uid
details['atc-sm-2']['z'] >> RT.Type | uid
```

The magnemotion submodule has an extra relation, capacity, in addition to its
name and type:

```python
mm_out_edges = details['magnemotion-sm-1']['z'] | outs
rt_outs = [RT(out) for out in mm_out_edges]
details['magnemotion-sm-1']['z'] >> RT.Capacity | value
```
```
[<RelationType: Name>, <RelationType: Type>, <RelationType: Capacity>]
1
```

Whether a relation is always present can indicate intent of the graph
constructor. In this case, there is an implicit assumption that all submodules
have a capacity of one, and only if an explicit `RT.Capacity` is given, can that
capacity be larger. In this case, the capacity of the magnemotion is explicitly
set to 1 regardless, but in other scenarios it can be higher.


### 3. Exploring sideways

Previously, the properites of name, type and capacity could be considered to
"belong to" the submodule. In a traditional database, these may be wrapped up
together into one object. Let's now venture outwards to other objects in the
graph.

From the original info statement given for the first submodule there were many
relations *incoming* to the submodule:

```python
sms | first | info
```
```
<...snip...>
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Incoming & Outgoing Relations ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    
<...snip...>
    1x:     (z:ET.Submodule) <-------------------------(RT.Option)------------------------- (ET.AnyOf)
                (z) <---(6b3925aad27c0bb6d59aa853d33e017e)---- (1421590b028335f05876d8a38dbea361)
    
    1x:     (z:ET.Submodule) <-------------------------(RT.Within)------------------------- (ET.Handoff)
                (z) <---(3372a9e40c5b39fe31042a20eedf0a6e)---- (755e6906f0b6acce3becaa8d852eebff)
    
    2x:     (z:ET.Submodule) <-------------------------(RT.Within)------------------------- (ET.InternalLocation)
                (z) <---(1dc0b78de4bc95dd11763c902dcbe298)---- (6447b19658d62c42b604be497b806ac7)
                (z) <---(2fcb19290641f2586744318ba53787c9)---- (da47ccc385741be560b7b78d9ae4ddf7)
<...snip...>
```

The `RT.Within` relation looks like it describes locations, divided further into
two categories of `ET.Handoff` and `ET.InternalLocation`. (Tip: read the relation as
"A is Within this B", e.g. "ET.Handoff is RT.Within this ET.Submodule"). This is
referring to the transport graph which we will get to later.

For now, let's look down the mysterious `RT.Option` relation:

```python
# The (...) are required for operator precedence. This restriction will be
# lifted in the future
anyof = (sms | first) << RT.Option
anyof | info
```
```
<...snip...>
    4x:     (z:ET.AnyOf) --------------------------(RT.Option)------------------------> (ET.Submodule)
                (z) ----(6b3925aad27c0bb6d59aa853d33e017e)---> (ccad64a5584e15d3f37fbb50ae69c690)
                (z) ----(00907fe3c6992346ae3f5b7c6f9dbae9)---> (5bb043d80f45502e75f0926fce653335)
                (z) ----(21605d0392b27b11e6f0b63c7d2c5ddd)---> (d467ae9956f2c9c5aa1c168820922a28)
                (z) ----(8722323b15c217332d7723708f8b493a)---> (067759fdcb22ead159be7eeb5b6b86f3)
    
    5x:     (z:ET.AnyOf) <-------------------------(RT.Alias)-------------------------- (ET.ZymergenProtocol)
                (z) <---(f956b18e068b7c2caf21723d2649a7f4)---- (b22feec83767a96b44eae844ebe9127a)
                (z) <---(1cf1c8954149899efdd004257a30a59b)---- (32b2b8ea92fe9770a5546d3afd095100)
                (z) <---(67cf2c6f4738c36f6ed943cfdf4ddc8b)---- (7b4471945dac70bf10383ffcd4caff04)
                (z) <---(a7e0203738027347270be4c8f9f5b7a4)---- (a78aa445e722216af551c3c58f3c584b)
                (z) <---(e1e72934ba7ccd30dc4e298f79b4403f)---- (2657f1f70ac65b5109b77c5dd6d73cc3)
<...snip...>
```
Note: we use `<<` here instead of `>>` to traverse an *incoming* edge instead of
an *outgoing* edge. Now that we can see the connections that are made
to this `ET.AnyOf` node, we might be able to guess at its purpose - it connects
an alias in a protocol to "any of" a type of submodule. Let's check some of this
statement:
```python
for sm in anyof >> L[RT.Option]:
    print(sm >> RT.Type | value)
```
```
atc
atc
atc
atc
```
Here the notation `L[...]` is used to obtain a list of all possible nodes at the
ends of a `RT.Option` (the same command without `L[...]` would raise an
exception, as it is not clear which edge to traverse). We can see that all of
the options are atc submodules. 

### 4. Pincering the protocols

We can consider exploring further along this path, which would take us into the
protocols. But first let's see how many protocols there are in the graph:
```python
protocols = g | instances[now][ET.ZymergenProtocol]
len(protocols)
```
```
5
```
Notice that there were also 5 `ET.ZymergenProtocol`s connected to the `ET.AnyOf`
node above. This suggests that these are the same sets. In fact, we can check
this more directly:
```python
difference = protocols | without[anyof << L[RT.Alias]]
```
```
[]
```
The `without` zefop does a set difference, and shows that there are no extra
protocols. Let's explore the last protocol:

```python
protocols | last | info
```
```
<...snip...>
    1x:     (z:ET.ZymergenProtocol) -----------------------(RT.ZymergenUUID)---------------------> (AET.String)
                (z) ----(a03cb1a9337ed0fbac2c50d754f41dbb)---> (0fa54a5baa0a041c2b34aa9d6bb4dbcb [latest val: 55411086-152a-4007-b13b-647ba819f407])
    
    1x:     (z:ET.ZymergenProtocol) --------------------------(RT.Alias)-------------------------> (ET.AnyOf)
                (z) ----(e1e72934ba7ccd30dc4e298f79b4403f)---> (1421590b028335f05876d8a38dbea361)
    
    2x:     (z:ET.ZymergenProtocol) <------------------------(RT.Protocol)------------------------ (ET.ZymergenStep)
                (z) <---(c4a7c7ec77ba3fc86ddf8a9b9a2a4649)---- (72aebae628e6b9c63be5713570d23a2d)
                (z) <---(71601970e818150bcfe5c4a433ab1996)---- (3955941efb09d38bb8d213faf94d9f68)
<...snip...>
```
This protocol obviously contains 1 alias and 2 steps. These steps are:
```python
firststep,laststep = (protocols | last) << L[RT.Protocol]
firststep | info
```
```
    1x:     (z:ET.ZymergenStep) -----------------------(RT.ZymergenUUID)---------------------> (AET.String)
                (z) ----(a02f607df69ef4f189a6e7d83f7e02d5)---> (87a9f9eef1e8292cb42a146479543f77 [latest val: 8da7282a-9313-4663-816b-5ded5e2c2071])
    
    1x:     (z:ET.ZymergenStep) -------------------------(RT.Protocol)-----------------------> (ET.ZymergenProtocol)
                (z) ----(c4a7c7ec77ba3fc86ddf8a9b9a2a4649)---> (2657f1f70ac65b5109b77c5dd6d73cc3)
    
    1x:     (z:ET.ZymergenStep) -------------------------(RT.Payload)------------------------> (ET.Payload)
                (z) ----(f436325e0713bcbd2b7a2215385f5707)---> (c0c1ca2c7c272c3155c9e90f853586ab)
    
    1x:     (z:ET.ZymergenStep) ------------------------(RT.Submodule)-----------------------> (RT.Alias)
                (z) ----(087744211c694a63e68cad292cdb83c3)---> (e1e72934ba7ccd30dc4e298f79b4403f)
    
    1x:     (z:ET.ZymergenStep) --------------------------(RT.Recipe)------------------------> (ET.Recipe)
                (z) ----(57fef5ddab03c30caf857ecc2827081b)---> (db43f10bc858c5c5162bd082f663bec9)
    
    1x:     (z:ET.ZymergenStep) <-------------------------(RT.After)-------------------------- (ET.ZymergenStep)
                (z) <---(2767619c0d013b904b73236a983d3992)---- (3955941efb09d38bb8d213faf94d9f68)
```
Note: although `firststep` and `laststep` turn out to be appropriate names here,
the ordering of the list does not have to be in this order. In this case, we can
prove the naming is correct by checking the dependency given in the `RT.After` relation:
```python
(laststep >> RT.After) == firststep
```

There is plenty to explore here. Try exploring, on your own, the `ET.Payload` at
the end of the `RT.Payload` relation using similar commands as above.

After that, let's explore the `ET.Recipe` node.
```python
firststep >> RT.Recipe | info
```
```
<...snip...>
    1x:     (z:ET.Recipe) ---------------------------(RT.Name)-------------------------> (AET.String)
                (z) ----(3f67326a38fb3e3a2f9b26e0172e363f)---> (8b352049cb33a4d18c6b6deb57c9575c [latest val: thermocycle])
<...snip...>
```
This shows the recipe is a thermocycle... but shouldn't there be more
information attached? There is, but it is information which is not specific to
the recipe alone, but rather applies to the combination of both recipe and step.
Hence, this information is stored on the relation which joins the recipe and step: 
```python
(firststep > RT.Recipe) | info
```
```
<...snip...>
    1x:     (z:RT.Recipe) -------------------------(RT.Duration)-----------------------> (AET.Int)
                (z) ----(d9e3329ec618c2f8e25013ee3c3746fb)---> (f052c5038a54059de91cfc0446e62df4 [latest val: 600])
    
    1x:     (z:RT.Recipe) ----------------------(RT.denature_time)---------------------> (AET.Int)
                (z) ----(260d8afef837f42260e952bec5057d58)---> (4cd1199befe121d3d697d345b8072873 [latest val: 30])
    
    1x:     (z:RT.Recipe) -------------------(RT.final_extension_temp)-----------------> (AET.Int)
                (z) ----(99b2922460883fa60d42bfeb130ab08d)---> (1c6f79c811a41c6492a839c3f7c9b559 [latest val: 42])
<...snip...>
```
Here `>` instead of `>>` was used, to land on the outgoing *relation* rather
than following it to its target. Note that the relations shown above have their
source as the `RT.Recipe` relation itself. Relations are not restricted
to only connect entities together.

:::note
Although the `RT.Duration` relation points to a `AET.Int` currently, it is
likely best described as a proper duration, i.e. an interval in units of time.
In the future, this could be either an `AET.QuantityFloat.minutes` or
`AET.QuantityFloat.seconds` which could be used interchangably on the graph.

DANNY DO THIS.
:::

Another similiar case for information residing on an edge is the required
location for a payload in a paritcular step. Check this out yourself by
following a `ET.ZymergenStep` to an `ET.Payload` but stopping on the edge.

## Transport Graph

Let's look at all locations that are within submodules:
```python
all_within = (g | instances[now][ET.Submodule]) << L[RT.Within]
```
```
<ZefRefss at 0x5634a9fb8b20 of length=6>
```
Notice that this returns a `ZefRefss`. A `ZefRefs` is a list of `ZefRef` and a
`ZefRefss` is a list of `ZefRefs` (i.e. a nested list of lists of ZefRef types).
In the current case, we are not interested in the grouping of these locations,
so we can flatten them out: 
```python
locations = all_within | flatten
set(ET(z) for z in locations)
```
```
[...]
{<EntityType: Handoff>, <EntityType: InternalLocation>}
```
Locations are divided into two ET types. Let's also divide these into locations that
belong to one submodule only or multiple submodules:
```python
one_sm_locs = locations | filter[lambda z: len(z >> L[RT.Within]) == 1]
set(ET(z) for z in one_sm_locs)
multi_sm_locs = locations | filter[lambda z: len(z >> L[RT.Within]) >= 2]
set(ET(z) for z in multi_sm_locs)
```
```
{<EntityType: InternalLocation}
{<EntityType: Handoff>}
```
As could have been guessed, `ET.InternalLocation`s are within only one submodule
whereas `ET.Handoff`s are at the boundary of 2 submodules.

Looking at a particular location:
```python
loc = one_sm_locs[0]
loc | info
```
```
    1x:     (z:ET.InternalLocation) -------------------------(RT.IsBuffer)-----------------------> (AET.Bool)
                (z) ----(0df200ef1ceb5d40eaea14a35afa156e)---> (1af117391d2c1b0ef85479a6db959b1a [latest val: False])
    
    1x:     (z:ET.InternalLocation) ------------------------(RT.IsHandoff)-----------------------> (AET.Bool)
                (z) ----(18258813039ca38a0a1205ca8fccc7bf)---> (13fcb842aaa10a1eb8318129e091b5b9 [latest val: False])
    
    1x:     (z:ET.InternalLocation) ------------------------(RT.NodeLabel)-----------------------> (AET.String)
                (z) ----(45dcdce976298ff6a8b4212750e17440)---> (adbf317e8d2ff555ac925244759a7e23 [latest val: atc-sm-1--atc-safe])
    
    1x:     (z:ET.InternalLocation) <-----------------------(RT.CanMoveTo)------------------------ (ET.Handoff)
                (z) <---(f3db5ede886173f43c7af4fedd5067f5)---- (7f2e05b777d92b53fa3f214e0cecef61)
    
    1x:     (z:ET.InternalLocation) ------------------------(RT.CanMoveTo)-----------------------> (ET.InternalLocation)
                (z) ----(b9e5e2908c395463deb27766ceb88c41)---> (d0ad400859e99c032c655f510e35a4a3)
    
    1x:     (z:ET.InternalLocation) ------------------------(RT.CanMoveTo)-----------------------> (ET.Handoff)
                (z) ----(60ed375567b2a817561f584ba7b84fd7)---> (7f2e05b777d92b53fa3f214e0cecef61)
    
    1x:     (z:ET.InternalLocation) <-----------------------(RT.CanMoveTo)------------------------ (ET.InternalLocation)
                (z) <---(19eecbbd5eb2643d2735d21dfd7de145)---- (d0ad400859e99c032c655f510e35a4a3)
    
    1x:     (z:ET.InternalLocation) --------------------------(RT.Within)------------------------> (ET.Submodule)
                (z) ----(997afdc619e5f8279086b80f9e7ecbe2)---> (72335b10cf0d7a9ebb21520f2ea5d08e)
    
```
there is some local information attached to the location (IsBuffer, IsHandoff,
NodeLabel) and a bunch of connections to other locations, given by
`RT.CanMoveTo` relations. Following one of these (to the edge, not the target): 
```python
canmoveto = (loc > L[RT.CanMoveTo]) | first
canmoveto | info
```
we find an attached recipe. Describing this:
```python
canmoveto >> RT.Recipe | info
(canmoveto > RT.Recipe) | info
```
```
type:                   ET.Recipe
<...snip...>
    1x:     (z:ET.Recipe) ---------------------------(RT.Name)-------------------------> (AET.String)
                (z) ----(e99a747491e2ed489fb2e67324e3d06a)---> (94bf02e9388809367c07f837ad922cd1 [latest val: atc_load_plate.recipe])
<...snip...>
type:                   RT.Recipe
<...snip...>
    1x:     (z:RT.Recipe) -------------------------(RT.Duration)-----------------------> (AET.Float)
                (z) ----(59087f8d1b6a0f8b30bceaa28cea074a)---> (f4667f883fec5db53f6d9e04a117c8ab [latest val: 15.0])
<...snip...>
```

:::note
Unfortunately brackets are often required (currently) to order zef operations,
e.g. `canmoveto > RT.Recipe | info` would cause info to operate on RT.Recipe
first. In the future this will be handled using lazily evaluated zefops.
:::

### External graph tools

* How to get an adjacency matrix to describe the transport graph.
