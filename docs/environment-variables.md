---
id: environment-variables
title: Environment Variables
---

  
### ZefHub connections  
  
- `ZEFHUB_AUTH_KEY`: either `GUEST` to authenticate as a guest user or an API  
  key. See [authentication](configuration-auth) for more information.  
- `ZEFHUB_URL`: the URL to connect to, by default `wss://hub.zefhub.io`.  
  
### Information messages  
  
These variables match to [zwitch options](configuration-messages)  
  
- `ZEFDB_QUIET`: changes the default `zwitch` output options to be  
  `zefhub_communication_output(False)`, `extra_quiet(True)`,  
  `graph_event_output(False)`.  
- `ZEFDB_VERBOSE`: changes the default `zwitch` output options to be  
  `zefhub_communication_output(True)`, `graph_event_output(True)` and  
  `extra_quiet(False)`.  
- `ZEFDB_DEVELOPER_ZEFHUB_JSON`: turns on the `zwitch` option `debug_zefhub_json_output`.  
- `ZEFDB_DEVELOPER_OUTPUT`: turns on the `zwitch` options `debug_times`,  
  `zefhub_communication_output`, `graph_event_output` and `developer_output`.  
- `ZEFDB_DEVELOPER_EARLY_TOKENS`: records any `ET`/`RT`/`EN`/`KW` tokens created  
  before the python module is fully loaded. This helps in identifying "core"  
  tokens that are required for the loading of the module which are missing from  
  the public set of ZefHub tokens.  
  
### Local storage  
  
- `ZEFDB_FILEGRAPH_PATH`: where to store filegraphs, the caches for the zef graphs  
- `ZEFDB_MEMORY_STYLE`: set to  
  - `ANONYMOUS`: for mmap-ed in-memory graphs without file backing.  
  - `FILE_BACKED`: for mmap-ed in-memory graphs with cached file backing, see `ZEFDB_FILEGRAPH_PATH`.  
  - blank: for automatic choice. This is currently, `ANONYMOUS` for local graphs and `FILE_BACKED` for graphs accessed from ZefHub.  
  
### Core behavior  
  
- `ZEFDB_OFFLINE_MODE`: runs the butler in offline mode. You can't sync graphs  
  or otherwise communicate with ZefHub in this mode. Currently, it is not  
  possible to persist graphs locally in this mode either. You can create  
  `ET`/`RT`/`EN`/`KW` tokens in this mode, although they will be assigned  
  temporary values and won't persist beyond your python session.  
- `ZEFDB_TRANSFER_CHUNK_SIZE`: influences the transfer of large graphs.  
  Currently a bandaid on the websocket protocol, will be removed in the future.  
  
### Config  
  
- `ZEFDB_SESSION_PATH`: the location of the directory where the config file is  
  stored. Defaults to `$HOME/.zef`. The config file itself is located at `ZEFDB_SESSION_PATH/config.yaml`.  
  
The following variables match to configuration options that can be modified through the  
`config` zefop. The variables will be merely listed here, see [config](configuration-config) for more  
details about their behaviour.  
  
- `ZEFDB_LOGIN_AUTOCONNECT`  
- `ZEFDB_BUTLER_AUTOSTART`  
- `ZEFHUB_URL`  
- `ZEFDB_TOKENS_CACHE_PATH`  
