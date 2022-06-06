---
title: Zymergen how tos
---

This is a list of very short snippets for how to obtain useful information on a
Zymergen graph with schedule attached.

All the steps below assume you have done something like

```python
from zefdb import *
from zefdb.zefops import *

g = Graph("example-zymergen-schedule")
```

# General protocol information

## Finding the current location of a payload

```python
payload_id = "1111111116"
payload = g | instances[now][ET.Payload] | filter[lambda z: z >> RT.ID | value.String == payload_id] | only
loc = payload >> RT.Location

print(f"Payload {payload_id} is at location {loc >> RT.NodeLabel | value.String}")
```

## Extracting only the dependency tree of steps as an adjacency matrix
```python
# Note: the following is incorrect - some steps (prior transport steps) have been removed
#steps = g | instances[now][ET.ZymergenStep]
steps = (g | instances[now][ET.ZymergenProtocol]) << L[RT.Protocol] | flatten

import numpy as np
A = np.zeros((len(steps), len(steps)), dtype=bool)
for i,step_i in enumerate(steps):
    for j,step_j in enumerate(steps):
        A[i,j] = has_relation(step_i, RT.After, step_j)
print(A)
```

## Finding a specific ZymergenUUID on the graph

Ideally we can go straight to a relation of type `RT.ZymergenUUID`. This will
come in the future, but for now we must filter out all `AET.Strings` which are
at the tip of one of these relations:
```python
desired_uuid = "fe4af42f-8509-4689-a519-1fcbec22ed07"
ae = (g | instances[now][AET.String]
| filter[has_in[RT.ZymergenUUID]] 
| filter[lambda z: z | value.String == desired_uuid]
| only)

entity = ae << RT.ZymergenUUID
```

# Schedule querying

## Getting all schedules on the graph

The schedules themselves:

```python
g | instances[now][ET.Schedule]
```

Each schedule may have multiple update points:

```python
schedule = g | instances[now][ET.Schedule] | only
txs = schedule >> RT.Updated | to_uzefref | value_assignment_txs

schedule_when_created = schedule | to_zefref[txs[0]]
last_update_of_schedule = schedule | to_zefref[txs | last]
```

## Viewing the resources of a schedule

```python
resources = schedule >> L[RT.Resource]
```

Resources can be submodules or payloads:
```python
def resource_summary(resource):
    if resource <= ET.Payload:
        return f"Payload with ID:{resource >> RT.ID | value.String}"
    elif resource <= ET.Submodule:
        return f"SM with name:{resource >> RT.Name | value.String}"
    else:
        return f"Unknown"
```

The events on a schedule are connected to the relation between the schedule and
the resource:

```python
for resource in resources:
    rel = relation(schedule, resource)
    start_events = rel << L[RT.Uses]
    end_events = rel << L[RT.Frees]
    print(f"Resource {resource_summary(resource)} has {len(start_events)} start events")
```

## Get all events in order

```python
events = schedule >> L[RT.ScheduleEventConnection]
# The following should work but is currently broken
#events | sort[lambda z: z >> RT.Time | value.QuantityFloat]
events = ZefRefs(sorted(events, key=lambda z: z >> RT.Time | value.QuantityFloat))
```

Pretty printing some sequential info about resource usage
```python
for ind,event in enumerate(events):
    is_start = event | has_out[RT.Uses]
    resources = event >> L[RT.Uses, RT.Frees] | target
    resource_str = ', '.join(resource_summary(resource) for resource in resources)
    recipe_str = (event >> RT.Recipe | target) >> RT.Name | value.String
    print(f'Event {ind}: recipe {recipe_str}, time {event >> RT.Time | value}')
    print(f'{"using" if is_start else "freeing"} {resource_str}')
    print()
```

## Identifying grouping of events

Collecting start-end events together (these are connected by an `RT.After` with
an `RT.FixedDuration` attached to it)
```python
start_events = events | filter[has_out[RT.Uses]]
for start_event in start_events:
    end_event = (start_event < L[RT.After]) | filter[has_out[RT.FixedDuration]] | only | source
    start_time = start_event >> RT.Time | value.QuantityFloat
    end_time = end_event >> RT.Time | value.QuantityFloat
    duration = end_time - start_time
    recipe_str = (start_event >> RT.Recipe | target) >> RT.Name | value
    print(f"Recipe {recipe_str} took {duration.value} minutes")
```


Collecting recipes into before/after sets
```python
def all_grouped_events(event):
    out = [event]
    todo = [event]
    while todo:
        this = todo.pop()
        rels = (this | ins_and_outs
                | filter[RT.After]
                | filter[lambda z: z >> O[RT.Immediate,RT.FixedDuration] is not None])
        new = (rels | source) + (rels | target)
        new = new | filter[lambda z: z not in out]
        out.extend(new)
        todo.extend(new)
    return out
```

Using this to display all groups of more than 1 recipe
```python
todo = list(events)
while todo:
    event = todo.pop()
    group = all_grouped_events(event)
    for subevent in group:
        if subevent in todo:
            todo.remove(subevent)
    
    if len(group) > 2:
        recipes = [((subevent >> RT.Recipe | target) >> RT.Name | value) for subevent in group]
        recipe_str = ', '.join(set(recipes))
        print(f"Group of recipes: {recipe_str}")
```
    
## Find all events corresponding to a protocol

(This is broken - there is a missing relation on the graph...)

```python
protocol = g | instances[now][ET.ZymergenProtocol] | filter[lambda z: z >> RT.ZymergenUUID | value == "bc746c6c-ab02-4ee9-9529-91194db53339"] | only
steps = protocol << L[RT.Protocol]
event_lists = []
for step in steps:
    rel = relation(schedule, step)
    this_events = rel | ins | source | filter[ET.Event]
    event_lists.append(this_events)
events = sum(event_lists)
```

## TODO: show occupation of submodule during schedule
