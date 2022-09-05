---
id: websocket
title: Websocket
---

  
  
Websocket effects are process-based: a service will be running after a server or  a connection to a server is launched successfully.  
  
## As a Client  
### ConnectToServer  
```python  
my_wish = FX.Websocket.ConnectToServer(  
	'ip_address': '127.0.0.1',  
	'port': 6000  
)  
  
d_response = my_wish | run  
```  
  
##### Output:  
```python  
d_response = {  
	'stream': s1,         # an instance of type Stream[Dict],  
	'port': 6000,         # which fields do we want to forward through?  
}  
```  
  
  
  
## As a Server  
### StartServer  
  
### StopServer  
  
### SendMessage  
  
### CloseConnections  
  
  
  
## Inspecting Running Servers / Connections  
```python  
pg = this_process_graph()   
  
# returns a List[ZefRef] of all connections  
pg | now | all[ET.WebsocketConnection]      
  
this_process() | all[FX.Websocket, 'servers']  
  
```  
  
  
