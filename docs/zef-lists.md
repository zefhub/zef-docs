---
id: zef-lists
title: ZefLists
---

  
### What is a ZefList?  
a builtin mechanism to expand a regular list (as in a value `[42, 'hello', True]`) into a "flattened out" data structure on a graph that does not lose the semantic meaning.  
  
  
### How do I create a ZefList?  
```python  
my_obj = ET.Protocol(  
	actions = [  
		'install Python',  
		'pip install zef',  
		'get going'  
	]  
)  
  
db = DB()  
z1 = transact(my_obj, db)  
```  
Fields which are Python lists or tuples are automatically converted to ZefLists.  
  
  
### How do I convert a ZefList into a regular Python list?  
```python  
z1 | Fs.actions | collect   # returns the original list  
z1.actions                 # also returns the original list  
```  
Both the field operator (F), as well as the dot-notation provide a high level syntax that automatically hooks into the ZefList mechanism.  
  
  
### What does a ZefList concretely look like on a graph?  
If we were to look at a DB state for the above data, we would see.  
![[ZefDoc - ZefList 2022-11-14 12.31.00.excalidraw]]  
The `RT.ZEF_NextListElement` relations exist to define a unique order.  
  
  
### If this is the Graph Structure, how can I explicitly traverse it?  
The operators  
```python  
In  
Out  
Ins  
Out  
in_rels  
out_rels  
```  
operate at this lower semantic level (in contrast to the field operators `F` and `Fs`).  
  
  
### Do Zef Lists also work on FlatGraphs?  
Yes, in exactly the same way.  
  
  
### Related  
- if ordering is not important, [[ZefDoc - ZefSet]]  
