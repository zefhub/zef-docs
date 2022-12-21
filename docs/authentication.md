---
id: authentication
title: Authentication
---

  
## Logging in for the first time  
  
After starting a python session, you can run:  
  
```python  
from zef import *  
from zef.ops import *  
  
FX.ZefHub.Login() | run  
```  
  
This will open a browser to select how you would prefer to authenticate to  
ZefHub. There are several methods:  
  
- "Email": this is to use a given email address and password.  
- "GitHub": use O-Auth to create a ZefHub account that is linked with your  
  GitHub account.  
- "Guest": don't create any account, but login as a guest user for this session only.  
  
Login information for Zef is stored in `~/.zef/hub.zefhub.io/credentials` for future sessions.  
No passwords are stored in this, only a refresh token.  
  
## Logging out  
  
After starting a python session, you can run:  
  
```python  
from zef import *  
from zef.ops import *  
  
logout | run  
```  
  
This is nearly equivalent to deleting the `~/.zef/hub.zefhub.io/credentials`  
file but will also forcibly unload any graphs you have loaded.  
  
:::danger  
  
When graphs are unloaded, any `ZefRef` referencing that graph is invalidated.  
**Accessing an invalid `ZefRef` will cause a segmentation fault**.  
  
:::  
  
  
## Overriding the user account for a session  
  
User accounts can be overridden with an environment variable or a plain text  
file. See the page [[ZefDoc - Environment Variables]] for more details.  
  
  
