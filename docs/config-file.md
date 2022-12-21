---
id: config-file
title: Config File
---

  
  
The Zef configuration file is used for controlling the behaviour of the  
low-level interactions of Zef with your filesystem and ZefHub.  
  
### Location  
  
The file is located at `SESSION_PATH/config.yaml` where `SESSION_PATH` is either:  
  
- under Linux/MacOS: `~/.zef`  
- under Windows: `%APP_DATA%/.zef`  
  
This can be overridden with the `ZEFDB_SESSION_PATH` environment variable.  
  
### Modifying  
  
The file itself is a YAML file and can be edited in any text editor. Inside of a  
python shell, you can also read and set variables with the `config` zefop:  
  
```py  
"login.autoConnect" | config[KW.get] | collect  
("login.autoConnect"  
```  
  
Note that getting a variable will search in the following order:  
  
1. Values that have been set in the current session  
2. The corresponding environment variable (see below)  
3. The config.yaml file  
4. The default value for the variable  
  
### Variable listing  
  
It is possible to obtain a listing of all variables and their currently set  
values by running:  
  
```py  
"login" | config[KW.list] | collect  
```  
  
The string passed into `config[KW.list]` is a filter string. Pass `""` if you  
would like the entire config.  
  
### Purpose  
  
| Variable          | Type                           | Default                     | Purpose                                                                                            | Env var                 |  
|-------------------|--------------------------------|-----------------------------|----------------------------------------------------------------------------------------------------|-------------------------|  
| butler.autoStart  | bool                           | True                        | Whether to start the butler on python module import                                                | ZEFDB_BUTLER_AUTOSTART  |  
| login.autoConnect | "always"<br />"auto"<br />"no" | "auto"                      | Whether to connect to ZefHub on butler startup. "auto" means to connect if credentials are present | ZEFDB_LOGIN_AUTOCONNECT |  
| login.zefhubURL   | string                         | "wss://hub/zefhub.io"       | The ZefHub URL to connect to.                                                                      | ZEFHUB_URL              |  
| tokens.cachePath  | string                         | "$CONFIG/tokens_cache.json" | Where are the tokens cached between sessions.                                                      | ZEFDB_TOKENS_CACHE_PATH |  
