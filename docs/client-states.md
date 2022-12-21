---
id: client-states
title: Client States
---

  
The service that manages graphs and the connection to ZefHub is known as the zef  
"butler". To start the butler manually, you can use the function  
`zef.internals.initialise_butler`. Note that the butler is required even if  
only a local unsynchronised graph is created.  
  
Similarly, if you wish to stop the connection without terminating your python  
process, you can use the function `zef.internals.stop_butler`. Stopping the  
butler will forcibly unload all graphs which is RISKY.  
  
The client can be several states. These are listed below:  
  
1. The zef module is imported but the butler has not been started.  
2. The butler has been started, but no ZefHub connection has been made.  
3. The butler is started and connected to ZefHub.  
  
By default, if login credentials are known, a client will attempt to progress to  
state 3, and otherwise move to state 2. If you wish to control the behaviour you can:  
  
- Set the `ZEFDB_BUTLER_AUTOSTART` environment variable (needs reimplementing)  
  to make the process not progress past state 1.  
- Configure the `login.autoConnect` setting (needs implementing - link here to  
  settings) to determine how to progress from state 2 to state 3.  
    
You may then use the functions `zef.internals.initialise_butler`,  
`zef.internals.stop_butler`, `zef.internals.connect` and  
`zef.internals.disconnect` to manually move between the states 1-3.  
    
