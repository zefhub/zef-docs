---
id: collaborate
title: Collaborate
---

  
  
  
  
  
## Collaborating on Live Data  
You can think of ZefDB instances as a data structure that can be safely distributed, since there is always at most one transactor. This allows you to think of using a ZefDB as "Dropbox for your data structure": you can collaborate on the same data in real-time.  
Is this not unsafe? No, it puts each user in control of which version of the data (DBState) they want to operate on. Very much like Git: once you check out a commit, you don't need to coordinate with others anymore. You're in charge of pulling the latest changes from GitHub and then resolving any conflicts. It is this conceptual basis which also underlies collaborating with ZefDB, albeit on a much more granular level than Git.  
  
In case you want to persist or collaborate on a specific DB, syncing of this DB with ZefHub must be enabled. Thereafter, if the respective privileges have been granted to other users or service accounts, ZefHub manages all cooridnation and streaming of updates.  
  
  
### Syncing your Graph with Other Processes  
When you create a graph via `Graph(True)` it is automatically synced to ZefHub.  
A local-only graph can also be synced via `g | sync | run`.  
  
Synced graphs can be shared with other users.  
  
  
### Managing Access Rights  
To give other users access to your graph, you can run:  
  
```python  
"joe.bloggs@gmail.com" | grant[KW.view][g] | run  
```  
  
The user `joe.bloggs@gmail.com` can then see your graph by its UID, i.e. they  
can then run:  
  
```python  
g = Graph("<uid here>")  
```  
  
where the uid can be discovered by running `uid(g)`.  
  
Privileges that are allowed are:  
- `KW.view`: viewing (subscribing to) the graph contents.  
- `KW.host`: taking the host role of a graph.  
- `KW.append`: appending to the graph. This could be done by taking the host  
  role or by sending merge requests.  
- `KW.discover`: seeing the graph's tags in `zearch` queries.  
- `KW.modify_rights`: changing the privileges of the graph.  
  
To make a graph publically available, you can use:  
  
```python  
"group:everyone" | grant[KW.view][g] | run  
```  
  
## Tagging graphs  
  
As sharing UIDs is tedious, you can also tag your graphs:  
  
```python  
g | tag["secret-santa-planning"] | run  
```  
  
You and other users with viewing rights can then access this graph via `Graph("<your-user-name>/secret-santa-planning")`.  
  
Unless specified, your tags will be grouped into your user namespace. If you  
want to override this, you can provide a qualified name with extra `/`  
divisions:  
  
```python  
g | tag["ACME-company/secret-santa-planning"] | run  
```  
  
## Revoking access privileges  
  
The `revoke` zefop is the opposite of `grant`:  
  
```python  
"joe.bloggs@gmail.com" | revoke[KW.view][g] | run  
```  
  
## Appending to a shared graph  
  
If you have subscribed to a graph that you have append-privileges, then you can  
directly add new facts to the graph:  
  
```python  
g = Graph("secret-santa-planning")  
  
(ET.Participant, RT.Name, "Krampus") | g | run  
```  
  
This will cause a "merge request" to be sent via the network and wait for a  
successful response to be received.  
  
If many rapid updates need to be applied, you should take the transactor role:  
  
```python  
g | take_transactor_role | run  
for i in range(1000):  
    ET.Participant | g | run  
g | release_transactor_role | run  
```  
  
Acquiring host role means that all updates are performed in-memory with maximum  
speed. These updates are synchronized with ZefHub in a background process. Note  
that only one python process can have host role at any one time.  
  
## Future plans  
  
In the future, graph tags will be made available via projects. So expect to  
see something similar to:  
  
```python  
g = Graph()  
g | sync["project-name"] | run  
g | tag["specific-graph"] | run  
  
g2 = Graph("project-name", "specific-graph")  
  
g == g2  
```