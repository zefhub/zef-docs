---
title: zefSpec
---

This introduces the basic helper functions available in the python `zefdb.tools`
module, to check a graph's structure against a predefined layout.

## ZefSpec

First of all, a quick introduction to ZefSpec is useful here. As a broader
concept, it will be introduced elsewhere and this page will eventually become a
footnote in the implementation of ZefSpec.

ZefSpec (i.e. a specification of a ZefDB graph) aims to provide the language/tools to:

- Check the validity of a graph.
- Alert users to invalid parts of graph or potential issues.
- Prevent merging of invalid data.
- Connect to Sentry and other monitoring systems.

These points are complementary and not even necessarily overlapping. In
particular there can be different requirements in different contexts:

- Soft vs hard spec: is the spec a warning or an enforced requirement
- In-built vs external: is it a part of the zefdb primary instance, is it
  running on ZefHub, or is it an external monitoring service?
- Graph metadata vs arbitrary code: is the spec expressed simply on the graph
  using a reduced language, or is it an arbitrarily complex piece of code?
  
### ZefSpec helper
What the helper tools described here do is:

- Soft spec: these tools warn but do not prevent a graph from reaching an
  invalid state.
- External: these tools can be run independently of the primary graph instance.
- Python dictionary representation: a meta-language is expressed in python
  dictionaries, which will likely become graph meta-data in the future.
  
### An example

Here is a toy example that is very similar to one of our production graphs. The
code itself is the last three lines, and the rest is the definition of a
dictionary to describe the spec.

```python
types = {
    ET.ProcessMachine: {
        RT.Name: AET.String,
        RT.ProcessMachineStatus: AET.Enum.MachineStatus,
        RT.MinimumCapacity: AET.QuantityFloat.kilogram,
        RT.MaximumCapacity: AET.QuantityFloat.kilogram,
        RT.OutputRate: AET.QuantityFloat.kilogramPerHour,        

        L[RT.ProcessMachineInGroup]: ET.ProcessMachineGroup,
    },
    ET.ProcessMachineGroup: {
        RT.Name: AET.String,
        RT.Description: AET.String,
    },
    ET.Tag: {
        RT.TagInTagGroup: ET.TagGroup,
        RT.Name: AET.String,
        L[RT.TableColor]: AET.String,
    },
    ET.TagGroup: {
        RT.Name: AET.String
    },
    ET.ProcessOrder: {
        RT.ProcessOrderNumber: AET.String,
        RT.ProcessOrderStatus: AET.Enum.ProcessOrderStatus,
        RT.Remarks: AET.String,
        O[RT.Ordered]: ET.Customer,
        O[RT.OrderedMaterial]: (ET.Material, {RT.Amount: AET.QuantityFloat.kilogram}),
    },
    ET.Material: {
        RT.Name: AET.String,
        L[RT.TaggedWith]: ET.Tag,
    },
    ET.Customer: {
        RT.Name: AET.String,
        "additional": "allowed"
    },
}
start_points = [ET.ProcessOrder, ET.Customer, ET.Material, ET.Tag]
from zefdb.tools import zef_spec_check_structure
success,notes = zef_spec_check_structure(types, start_points, g|now)
```

The main function is `zef_spec_check_structure` inside of the `zefdb.tools`
module. It takes 3 arguments:

- `types`: A dictionary describing the graph structure.
- `start_points`: where to start traversing the graph to check the structure.
  Either a list of `ET`s or a `ZefRefs`.
- `frame`: Only required for a list of `ET`s in `start_points`. `frame`
  specifies the transaction in which to search.

The `types` dictionary has a basic flat structure. Each top-level entry should
have a key of an entity type, and a value that is another dictionary. As the
checker traverses the graph, it looks up what to do from this dictionary.

The values in the dictionary should be a set of key-value pairs, where the key
is always a relation of some kind that is outgoing from this node. There is
currently no way to specify an incoming relation. More specifically the key is:

- A plain `RT`, indicating the relation *must* be present.
- A `O[RT]`, indicating the relation is optional.
- A `L[RT]`, indicating any number of the relation can be present (including zero).

These keys mirror the behaviour of traversal. The checker will flag a problem if
the same command in code would raise an exception (e.g. `entity >> O[RT]` would
raise an exception if there are two or more relations on `entity`).

The value is usually simple, being either an `ET`, `RT` or `AET`, which means
the corresponding entity must be the target of the relation.

The more complicated case is where the value is a tuple, where the first item is
a `ET`, `RT` or `AET`, and the second is a nested description of the relations
attached to the midpoint. In the above example there was:

```python
    ET.ProcessOrder: {
        ...
        O[RT.OrderedMaterial]: (ET.Material, {RT.Amount: AET.QuantityFloat.kilogram}),
        ...
    }
```
which means, it should be possible, in some cases, to traverse the graph in this
way:
```python
edge = process_order > RT.OrderedMaterial
edge >> RT.Amount | value.QuantityFloat
```

Note: the checker won't traverse the same entity multiple times.

An example output of running the checker on a graph is given below:

```python
g = Graph()

I = lambda *args: instantiate(*args, g)

I(ET.ProcessOrder) | attach[[
    (RT.ProcessOrderNumber, "1"),
    (RT.ProcessOrderStatus, EN.ProcessOrderStatus.CRTD),
    (RT.Remarks, 1),
    (RT.ExtraRelation, "shouldn't be here"),

    (RT.Ordered, I(ET.Customer) | attach[[
        (RT.Name, "some name"),
        (RT.SecretRelation, True),
        (RT.Another, "secret")
    ]]),

    (RT.OrderedMaterial, I(ET.Material) | attach[[
        (RT.TaggedWith, I(ET.Tag) | attach[[
            (RT.Name, "some tag")
        ]])
    ]])
]]

...

success,notes = zef_spec_check_structure(types, start_points, g|now)
```

returns `success == False` with the notes being a string containing:

```
No TagInTagGroup for relent <uid> of type Tag
No Name for relent <uid> of type Material
Target should be (String) for relation <uid> of type Remarks but was Int
No Amount for relent <uid> of type OrderedMaterial
Extra unspecified relations on relent <uid> of type ProcessOrder: {<RelationType: ExtraRelation>}
```
