---
title: RFZ - Tokolosh
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Motivation

Allow for:

- Distributed handling of graphs.
- Local sharing of graphs amongst processes.
- Caching of graph data via file backing.

### Requirements

- Can handle permissions, or understand who to ask for permissions.
- Can store graphs and unload graphs when they are no longer needed.
- Can provide shared access (shared memory or file-backed graphs).

### More Requirements (Ulf)

- The Tokolosh foundational architecture should be compatible with all significant OSes (Linux, MacOS, Windows)
- Provide the foundation for ZefHub: scalability, actor model. Communication with other Tokoloshes can't always be via the parent, but inter-Tokolosh communication should be possible on ZefHub nodes
- 
- zefDB should be easily usable, even if no system Tokolosh is running in the background.


# Danny ideas for Tokolosh

Everything is a Tokolosh. Zefhub, distribution points, system-wide handling, process groups, single-process. Each has simple rights, some are configurable and some may be disallowed without appropriate permissions.

Stored information:

- Tracked graphs:
  - graph uid
  - upstream data source ("parent", "store", "local", "shm", "file", ...) 
    - "parent": this Tokolosh's parent passes requested pages and updates to this Tokolosh automatically
    - "store": this Tokolosh can get the data from a central store (i.e. s3)
    - "local": this graph exists only in memory or file on the local system.
    - "shm": this graph exists as virtual shared memory
    - "file": this graph should be accessed via a collection of files at a given location
    - A direct connection (CONNECTION) can be provided in the case of distributed handling.
  - data stored as ("shm", "file", "local")
  - loaded pages: type(BITFIELD)
  - listeners:
    - connection uid: type(CONNECTION)
    - is primary role?
    - pages loaded: type(BITFIELD)
- Routing graph: type(GRAPH or NONE)
  - This is optional. With the routing graph synced, the Tokolosh understands permissions. Otherwise it needs to ask its parent.
- Parent: type(CONNECTION or NONE). Who should this Tokolosh answer to? If none, then this is the core of Zefhub.

Comment about data source: this is who is responsible for being the source of truth. For example, if a client creates a graph without sync, data source will be "local". If the client requests to sync the graph, it will push it out and make the data source "parent", which will propagate all the way up to zefhub.

Of the types, CONNECTION is the one which might be most flexible. This could represent a WS connection (e.g. from the Tokolosh to a client) or a local connection... Although the more I think about it, restricting it to WS connections would be preferable.

## Types of Tokoloshes

### Zefhub

- Owns the routing graph (can answer permissions)
- Has no parent (loads all graphs from store, or delegates loading to another)

Other notes:
- Data source of a graph on zefhub may still be another Tokolosh that is privileged enough to read from s3
- ZH may also keep a list of currently active privileged Tokolosh's.

### Client Tokolosh
Part of each process (the replacement for the zefscription manager)

- parent is always present
- no routing graph (must ask parent for permissions)
- does not accept any connections
- can take primary role (after asking for permission)

### System-wide Tokolosh
Optionally runs on a PC/docker container as a caching/coordination point to optimise memory usage on a computer.

- parent is generally present (option for no parent, implying running in anonymous mode, yet coordinating local processes amongst one another)
- accepts connections
- no routing graph (must ask for permissions)
- cannot take primary role

### Distributed balancer
Runs as helper for Zefhub

- parent is present (Zefhub? Might also be other balancers)
- subscribed to routing graph (can answer permission requests)
- accepts connections
- cannot take primary role

## Tokolosh handling of pages

The Tokolosh can store consecutive runs of pages as files, grouped into directories of graph uids. When loading a new page that is after the final page of an existing file, it will append to that file, otherwise it'll create a new file. On startup it can connect any files that have become consecutive, to reduce the number of files. On startup, it can also remove graph files which haven't been accessed in a long time, or limit the graph storage to a certain size.

Options for Tokolosh handling of data in memory:
1. plain mmap: 
  - no file backend
  - no sharing possible
2. file mmap:
  - indicated by file location on disk
  - sharing possible
  - permissions are provided by file permisions (i.e. OS user permissions, not ZH user permissions)
3. shm mmap:
  - indicated by a shm location (could be a filesystem location or a ?FD?)
  - sharing possible
  - permissions: ???? might be similar to file mmap permissions.

## Communication

(P->C) = Parent -> child message

(C->P) = Child -> parent message

All messages should have a corresponding "response message". In the simplest of cases this is just an ACK, maybe with a success/failure. Even for "new blobs" an ACK should be required so that no assumptions are made about client/parent knowledge.

1. C->P: establish connection
  - Initial connection by the child
  - For balancer Tokoloshes this might include more information.
  - Response by the parent may be "connect to this balancer instead".

1. C->P: request graph
  - Parent checks permissions for graph
  - Parent adds child to listeners for graph
  - If no permission, send denial response.

1. P->C: response to request graph
  - Either: "graph ready" or "denied"
  - If "graph ready" and using memory sharing, graph needs to be fully ready.
  - Sends the data source (but no data)
  - Child adds graph to known graphs. Could then inform downstream children of graph ready.

1. C->P: req page
  - If parent doesn't have page, it will load that from the upstream data source.
  - Updates bitfield of child pages to keep up to date.
  - For no shared data source (i.e. not using file/shm mmap) then parent sends page to client (using message below).
  - Otherwise parent just informs child that page should be ready to go in mmap.
  - Note: for non-shared memory, this could be used to "refetch" a graph, e.g. from zefhub in a resubscription.

1. P->C: page loaded
  - if not shared mmap, message contains page data.
  - if shared mmap, child is now allowed to access that memory.

1. P->C: new blobs
  - this is for automatic informing of the client of updates to a page.
  - for not shared mmap, message contains the updated blobs.
  - if shared mmap, message lets child know to update its maximum blob range.

1. P->C: graph metadata changed
  - if tags or access rights changed

1. C->P: request metadata change
  - for tag or user rights changes



# ZefHub Coordinator

Coordinate work of all zefhub worker nodes: graph hosting,  Given input


### ZetaFunction Scheduling
  Goal: determine which node  to run on
  Inout
### Input 

### Restrictions:
- regional restrictions (e.g. never violate GDPR restrictions declared by graphs from first principles)


# Zeta Functions

Why should these run on the same nodes as ZefHub? They may be very lightweight functions / execute quickly, but require access to a large graph. A case for "bring the compute to the data".

# Function parameters
- as which user to run (zefhub checks rights etc.)
- list of required graphs with secondary role
- list of required graphs with primary role
- computational power requirements (or in the further future: max execution time)
- required languages / libraries (e.g. is Julia, Amandla, PyTorch, ... required?)
- account for EGress costs if present (could be very significant)
- policy
  - run until complete: function returns (timeout optional)
  - run for fixed duration: function running does not return (may be infinite)


Zeta functions should run in separate processes: not all code may be trusted and running it in the same process where other graphs are accessible is unacceptable from a security point of view
  


## Client Connecting to ZefHub
What happens when a user connects to ZefHub?
- Upon a client connecting, all new EntityTypes, RelationTypes, Enums are sent to the client. If we open zefDB to a wider audience, zefhub would have to keep track of each user / graphs they know about to only inform them about the types that they are allowed to know about.
- WS connects to URL: should automatically be routed to 'nearest' Shongololo
- Authenticates with zefhub user key and and name with Shongololo: if accepted, WS remains terminated and connected here
- The user may subscribe to different graphs in both primary and secondary roles: Shongololo needs to route the requests for graph updates to the respective zefhub node (it gets this info either from a graph it subscribed to or asks the zefhub coordinator explicitly). This may be on the same physical node that terminates the connection or may be one somewhere completely different
- When the user creates and syncs a new graph, Shongololo may need to coordinate with the zefhub coordinator on which zefhub worker node this should be cached.

