---
id: ref-types-vs-uids
title: Ref Types vs UIDs
---

  
  
![](d288dbf7ad61358447c286802b33ad452b260745248a5a71b35275c14f1baa7e.png)  
  
### What do we mean with "Ref Types"?   
ZefRef / EZefRef / Ref / Graph (they have reference semantics too)  
- These represent references to some entity (either within our system or in the outside world)  
  
  
### Ref Types have Value Semantics 😲  
This may sound like a contradiction at first. But references themselves, when properly implemented, have value semantics. They can be copied, compared, used in composition etc.  
If this still  sounds strange, just think of Ref types being a thin wrapper around UIDs. It may be easier to digest that UIDs (like strings) obey value semantics.  
  
  
### But are Refs not wrappers around pointers (for performance)?  
They are in Zef. But that's an implementation detail. I also want automatic safety: If I assign them to a graph, send them over a network, pointers are not stable. They must therefore always behave as if they contained the UID, which remains stable at the highest level of the system. Any performance optimization beyond that is hidden from the user and should occur silently under the hood.  
This allows the user to focus on their domain and Zef to take care of potential optimizations.  
  
  
### So what is the difference between a UID and a Ref?  
A Ref type acts at a higher abstraction level. They behave more like traditional "objects" do in Python and similar languages. You can do things like call "dot some field" on them and they are also aware of their type.  
You can also ask them for their UID, which is returned in a form similar to a String.  
  
This allows literal construction of Ref types, e.g.  
```python  
z1 = ZefRef('32674567523-2378647263-7852437236')  
```  
  
  
### Should UIDs not be strongly typed?  
This is a judgement call and a matter of taste. This inserts one more abstraction layer between the bare string representation and the Ref types.   
One should ask: what is the justification for one more class the user needs to know? If you want type safety to not mix up different Ref types, this is given by the Ref types and their constructors directly.  
  
  
### But not every String is a Valid UID  
That's correct. But with Zef's structural type system, we are not forced to add one more nominal type for UIDs.  
If the problem is to type check valid UIDs, this can be done via a logical type:  
```python  
def is_valid_uid(uid: String) -> Bool:  
	...  
  
UID = String & Is[is_valid_uid]  
```  
  
  
### Is having UIDs be a Subtype of String not a Waste of Space?  
No, they just act like hex string strings to the outside. On the interface level. Their internal representation is in binary form, allowing for the full entropy range that the underlying buffers provide.  
