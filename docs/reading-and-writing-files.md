---
id: reading-and-writing-files
title: Reading and Writing Files
---

  
Interacting with files on the actor's local filesystem is done via the `FX.LocalFile. ...` module.  
  
There are two basic categories:  
- `FX.LocalFile.Read` and `FX.LocalFile.Write` are low level and do not care about the contents or format of the file. They take bare `Bytes` as values and  read or write this value to a file.  
- `FX.LocalFile.Load` and `FX.LocalFile.Save`  are opinionated and attempt to perform the conversion to a higher level data type based on the file extension.  
  
  
## Unopinionated API  
```python  
my_image = ('/Users/ninja/album_cover.png'  
 | read_file               # returns a wish (data)  
 | run                     # executes the effect, returns a dict  
 | get['content']          # the file content stored as Bytes  
 | collect                 # trigger the last part to evaluate  
)  
```  
**TODO**: this always reads into strings and fails for some binary files  
  
  
## Opinionated API  
  
#### Reading from a Supported File Type  
```python  
my_image = ('/Users/ninja/album_cover.png'  
 | load_file               # returns a wish (data)  
 | run                     # executes the effect, returns a dict  
 | get['content']          # the file content stored as an Image  
 | collect                 # trigger the last part to evaluate  
)  
```  
  
  
