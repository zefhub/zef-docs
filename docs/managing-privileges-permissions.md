---
id: managing-privileges-permissions
title: Managing Privileges (Permissions)
---

  
The privilege system's function is to manage access and appending privileges to projects and graphs. In the zef spirit, it is also data-oriented.  
  
## Zefhub Users  
When a user that signs up with zefhub, a new user graph is automatically created. An entity of type `ET.ZefhubUser` is instantiated on the user graph (i.e. the user graph is the origin). Hence, every user is also a first class citizen on graphs and in code by using EZefRefs to this user entity.  
  
## Zefhub Projects  
Any graphs that are persisted and functionality that is run is created in the context of a zefhub project. Upon instantiation of a zefhub user a default user project graph is also created. Unless specified otherwise (or changing the user's project policy), the user's default project will be used to persist graphs or deploy services.  
Additional projects can be created and the project creator will be automatically added to the project will full admin privileges.  
Other zefhub users can be added to a project and their privileges can be set using the provided admin zefops.  
  
Upon creation, an `ET.ZefhubProject` entity is created in the project graph that serves as a stable reference to it and can be used across other graphs. When a user is added to a project, this project entity is automatically merged into the user's Zefhub user graph. Hence, all projects that a user is associated with can easily be inferred by looking only at the user graph.  
  
Typically, any persisted graph or RZ stream lives within the bounds of a single project by which it is owned / hosted.  
  
## Project Roles  
In addition to Zefhub users, roles can be created in the context of any project.  
  
  
## Privileges  
Privileges can be set in the context of any Zefhub project for users and roles. Roles can be applied to   
- graphs    (persisted state)  
- streams   (upcoming. ephemeral state)  
- functions (upcoming. Zepto-Services etc.)  
  
  
```python  
z_zefhub_user | grant[view][g]  
z_zefhub_user | grant[append][g]                # can exist without view privileges. TXs executed on zefhub  
z_zefhub_user | grant[primary_role/host][g]  
  
z_zefhub_user | revoke[append][g]  
z_zefhub_user | revoke[view][g]  
z_zefhub_user | revoke[all][g]  
```  
  
  
## Future Functionality  
```python  
FX.Privilege.Grant(  
	my_stream,  
	roles=privilege.view,  
)  
```