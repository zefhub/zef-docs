---
id: zef-hub-connection
title: ZefHub Connection
---

  
  
By default, importing the zef module will attempt to connect to ZefHub  
automatically. However, this is only possible if your credentials are known  
(either you have previously logged in, or you have set the `ZEFHUB_AUTH_KEY`  
environment variable). When any command that requires ZefHub is run (for  
example, a requesting a graph by tag, or asking for a new `ET` or `RT`) then it  
will throw an exception if you are not connected to ZefHub.  
  
The two main login methods are either:  
  
1. A refresh token. This is obtained in your client through Google Firebase  
Authentication using either an email/password combination or via OAuth with  
GitHub.  
2. An API key, generated from the ZefHub console.  
  
To login, you should use the `login` effect. Calling this will start a local  
HTTP server to perform auth through either a 3rd-party provider (for example  
GitHub) or an email/password pair. Explicitly, this is the recommended  
code to run on your first zef session:  
  
```py  
from zef import *  
from zef.ops import *  
  
login | run  
```  
  
It is possible to provide credentials for login without using the browser login  
process. ZefDB looks for credentials in the following order:  
  
1. The `ZEFHUB_AUTH_KEY` environment variable (API key).  
2. The `~/.zef/zefhub.key` file (API key).  
3. The `~/.zef/hub.zefhub.io/credentials` file (refresh token).  
  
It is recommended to use the refresh token method from the `~/.zef/hub.zefhub.io/credentials`  
file, which is populated via the `login` effect.  
  
If you are running a non-user service, then `ZEFHUB_AUTH_KEY` can be set to an  
API key generated from the ZefHub console. API keys can have their permissions  
restricted to only the operations your service requires.  
  
As a special case, to login as a guest user, you can set `ZEFHUB_AUTH_KEY` to  
`GUEST`.  
  
### Logging out  
  
To logout, you can use the `logout` effect. This will also unload all graphs and  
is therefore RISKY.  
  
:::danger  
  
When graphs are unloaded, any `ZefRef` referencing that graph is invalidated.  
**Accessing an invalid `ZefRef` will cause a segmentation fault**.  
  
:::  
  
Alternatively, you can logout by deleting the `~/.zef/hub.zefhub.io/credentials`  
file and restarting your python session.  
  
