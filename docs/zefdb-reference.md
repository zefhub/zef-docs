---
id: reference-zefdb
description: detailed reference of ZefDB's API
title: Reference
---

A detailed reference of ZefDB's API ...

| A     | B   | C        |
| ----- | --- | -------- |
| hello | 67  | "sdkhfj" |
| 🔥     | 9   | -        | 
| 🔥     | 9   | -        | 
| 🔥     | 9   | -        | 
| 🔥 Zef Objects    | 🌿   | [objects](zef-objects)       | 
| 🔥     | 9   | -        | 

## 🚜 Getting Started 🚜

## 🌿 Growing Your Data Model 🌿

```python
(FX.Websocket.StartServer(port=9000) 
  | run 
  | get['stream']
  | expect[Stream[Dict['user': String, ...]]]
  | map[lambda d: FX.Websocket.SendMessage(
    recipients={ws1},
    content=b'hello!'
  )]
  | subscribe
)
```

