---
id: managing-atom-encodings
title: Managing Atom Encodings
---

Encodings / "Tokens" are the 32bit encodings used to identify entity and relation types.  
To achieve agreement of what encodings mean across the system of various nodes running Zef, ZefHub manages the coordination of these encodings.   
  
Here we document some internal details to deal with issues when things go wrong and manual intervention is required.  
  
## Symptoms  
  
If `import zefdb` is erroring, it could be because it is unable to connect to  
ZefHub and doesn't know about a new `RT` in the import process. Similarly, if  
zefdb takes a long time to import, because it needs to connect to ZefHub, then  
this process is useful.  
  
## Adding new global tokens  
  
### Manual method  
  
To do this manaully, you can use the `token_management` command. This requires  
that you can start a zef session somehow (e.g. from a previous commit).  
  
```py  
from zef.pyzef.admins import token_management  
  
token_management("add", ET.NewEntity, "group:everyone")  
token_management("add", RT.NewRelation, "group:everyone")  
token_management("add", EN.NewEnum.Value, "group:everyone")  
```  
  
If you can start a session but are unable to create tokens, you can do the same  
commands via pure strings:  
  
```py  
token_management("add", "ET", "NewEntity", "group:everyone")  
token_management("add", "RT", "NewRelation", "group:everyone")  
token_management("add", "EN", "NewEnum.Value", "group:everyone")  
```  
  
### Automatic method  
  
If there are a lot of tokens, or you are unable to import zef, then you can  
use the scripts in the `update_tokens` directory of the git repo. (TODO:  
actually this does require a working build, I will have to work on this...)  
  
Follow these steps:  
  
1. Get the latest tokens for your build: `python3 get_zeftypes.py` in the git  
   repo.  
2. Build zefDB `./make_everything.sh`  
3. `cd` to the `update_tokens` directory.  
4. Run `python3 create_tokens_files.py`.  
5. Run `python3 ensure_tokens_in_public.py early`.  
6. Check the list of tokens to be added and answer `yes` to the prompt.  
  
### Tidying up  
  
Once the new tokens have been added, you will need to reget and rebuild zefDB:  
  
1. Run `python3 get_zeftypes.py` in the git repo.  
2. Build zefDB `./make_everything.sh`.  
  
  
## What does this do?  
  
On ZefHub, the tokens are stored uniquely, so that their integer value can be  
used instead of their string value. Users should not be aware of all of the  
created tokens, in case they contain sensitive information in string form.  
Hence, users only initially see the global tokens in the "everyone" group.  
  
New tokens created via `ET.x` commands, etc... are automatically added to the  
known list of tokens by ZefHub, and are added to that specific user's list of  
known tokens. However, they are not added to the "everyone" group.  
  
When developing zefDB and adding new tokens to represent, e.g. `RT`s, means that  
the import of the `zef` module will come across tokens that are not part of  
the everyone group and so require connection to ZefHub. If a user is not logged  
in, this means importing the `zef` module is impossible.  
  
Hence, when we are creating new "core requirement" tokens, we should also add  
these to the "everyone" group on ZefHub.  
