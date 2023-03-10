---
id: data-streaming-with-zef
title: Data Streaming with Zef
---

  
Zef offers a built-in streaming capability as a core feature. This allows users to build reactive systems without requiring any additional libraries. In fact, a significant part of the ZefDB is built on top of streams inherently. Users can leverage this streaming capability to react to various events in the database such as the creation, assignment, or removal of entities. The resulting reactive system can be used for a range of applications such as push notifications or real-time data processing.  
  
A data stream consists of three stages: a data producer (source), a processing engine, and a data sink.    
![](143b23d7fd0bc591afe6c892e7ffa8dba430a0b70310996559c1dee643fbe41f.svg)  
In this tutorial, we will explore three different types of data sources for streaming that zef can produce, and learn how to write simple code to react to them.  
  
## Reacting to Database Events  
Let's say we want to build a reactive system that sends push notifications every time a new movie is created in the database. We can subscribe to the events emitted every time an `ET.Movie` is created using the `on` operator:  
```python  
db | on[Instantiated[ET.Movie]] | subscribe[print]  
```  
  
In Zef, a stream is considered lazy until at least one data sink (or consumer) subscribes to it. The `subscribe` operator essentially activates the stream and triggers it to start producing and emitting data.  
  
Whenever a new movie is created, Zef will emit an `Instantiated` event. Let's create a new movie:  
```python  
new_movie = ET.Movie(title="Hunger Games")  
new_movie | db | run  
```  
  
You should see the following output:  
```console  
Instantiated({'target': <ZefRef #97 ET.Movie slice=2>})  
```  
  
If we want to send a push notification to users, we can do  
```python  
def send_push_notification(event):  
	# do something with the event emitted  
    message = f"{event.target | F.title | collect} is created!"  
      
    effect = FX.HTTP.Request(  
        url="https://<your_push_notification_service>",  
        data={  
            "message" : message  
        }  
    )  
    return effect  
  
(  
	 db | on[Instantiated[ET.Movie]] # Data Source  
	 | map[send_push_notification]   # Stream Processing  
	 | subscribe[run]                # Data Sink  
)  
```  
  
There are two other graph events that we can subscribe to, `Assigned` and `Terminated`. For example:  
```python  
db | on[Assigned[AET]] | subscribe[print]  
db | on[Terminated[ET.Movie]] | subscribe[print]  
```  
  
`Assigned` event is emitted usually when a value is assigned to a node, and usually it is an Attribute Entitiy (AET). Going back to the same example above, when `new_movie` is created, the emitted `Assigned` event looks like this.  
```console  
Assigned({'target': <ZefRef #127 AET.String slice=2>, 'prev': None, 'current': 'Hunger Games'})  
```  
  
When a movie is removed from the database, the `Terminated` event is emitted:  
```  
Terminated({'target': <ZefRef #302 ET.Movie slice=5>})  
```  
  
  
## Pushable Streams  
In addition to graph events, Zef also allows us to create pushable streams where we can push messages or data and react to them. It works similarly to creating a "Topic" in Kafka.  
  
To create a pushable stream, we can run the following command:  
```python  
stream =  FX.Stream.CreatePushableStream() | run  
```  
  
After that, we can create a subscription to the stream like this:  
```python  
def do_something(data):  
	return f"Doing something with {data}"  
	  
(  
	 stream                   # Data Stream  
	| map[do_something]       # Stream Processing  
	| subscribe[print]        # Data Sink  
)  
```  
  
Now, if we have other systems pushing data to this stream, such as data from a HTTP request or a websocket, we can push data to the stream like this:  
  
```python  
"new data" | push[stream] | run  
```  
Note that pushing an event into a stream is a side-effectful operation itself (the stream is potentially observable and not part of the pure functional core).  
  
The output console should show the following:  
```console  
Doing something with new data  
```  
  
## Web Requests as Data Stream  
One can think of web requests as an stream of data. Any incoming requests from a HTTP Server or a Websocket Server can be treated as an event that trigger a series of downstream computation.  
  
```python  
handle = FX.HTTP.StartServer(  
		port=3000  
	) | run            
```  
The return value of executing the `HTTP.StartServer` side effect is a dictionary that consist of:  
* `server_uuid` - unique identifier of the server   
* `stream`  - A pushable stream where all incoming requests will flow into  
  
Similar to the last example, we can subscribe to the request stream by doing the following:  
```python  
def handle_request(req: Dict) -> FX:  
	# construct and return an effect (data)  
    return FX.HTTP.SendResponse(  
			server_uuid=req["server_uuid"],  
			request_id=req["request_id"],  
			response="Welcome to ZefFX!"  
		)  
  
(  
	 handle['stream']        # Data Stream   
	 | map[handle_request]   # Stream Processing  
	 | subscribe[run]        # Data Sink  
)  
```  
The HTTP server converts external requests to a stream of events and expects a response in form of an effect object (action) to be returned to the runtime within the timeout limit.  
`subscribe` is an operator which takes an impure function and executes this using the incoming event as an argument, as the events arrive in the stream.  
  
  
## Recap  
Zef is continuously improving its reactive component and adding more features, such as more advanced stream processing operators and joins. Additionally, the complexity of building distributed streaming process systems will be absorbed by ZefHub.  The goal is to make it easy for users to build streaming and reactive systems.