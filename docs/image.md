---
id: image
title: Image
---

Images are first class citizens in the Zef type system.   
  
### Loading an Image from File  
```python  
file_location = 'Users/yolandi/zef/mastering_pip.jpg'  
image = (file_location  
 | load_file         # creates a wish ("effect")  
 | run               # execute the effect  
 | get['content']    # the return dict contains the image  
 | collect           # trigger evaluation  
 )  
```  
  
  
### What Type is It?  
```python  
zef_type(image)      # => Image  
```  
  
### Which Image Formats are Supported?  
Currently  
- jpg  
- png  
- svg  
- gif  
  
  
### Displaying images  
When using iPython in VSCode interactive mode or Jupyter, Zef will show the actual image  
```python  
image  
```  
![](969826980df00cc0865da17852e66652f232d3ce219400e2e92fa257150b79c0.png)  
  
  
  
### Can I work with images like with other values?  
Yes, you can  
- store them on a graph (DB)  
- assign them to variables  
- use them in composing data structures  
- push them into a stream  
  
  
### Saving Images to a File  
```python  
(image   
 | save_file['Users/yolandi/important/todo.png'] # create wish  
 | run                              # execute the effect  
)  
```  
