---
id: wish
title: Wish
---

  
### Definition  
A wish in Zef is a pure data structure that describes a side-effectful operation. It can be passed to the Zef runtime (specifically the FX system) with the intent/ wish to be executed. The FX system accepts the data structure and does the dirty work of interacting with the outside world. See [Introduction to Zef-FX](introduction-to-zef-fx) to learn more more about the managed effect system in Zef.  
  
  
  
### Naming across Ecosystems  
Expressing effects to be performed as pure data structures that only describe what is to be done is a concept that is common across different languages and libraries.   
We chose the name **wish** after we stumbled across it in [Bret Vicotor's Realtalk](https://omar.website/posts/notes-from-dynamicland-geokit/), since the name was the least overloaded and expresses the fact that it is only an intent.  
  
Naming in other ecosystems:  
- Elm: "command"  
- JS / Redux: "action"  
- Scala / Zio: "effect"  
  
  
  
### Further Material and References  
- [Exotic Programming Ideas: Part 3 (Effect Systems)](https://www.stephendiehl.com/posts/exotic03.html) by Stephen Diehl  
- [Side Effects, Front and Center!](https://queue.acm.org/detail.cfm?id=3099561) by Pat Helland  
- [Effects as Data](https://youtu.be/6EdXaWfoslc) by Richard Feldman  
- [Magic Tricks with Functional Effects](https://youtu.be/xpz4rf1RS8c) by John de Goes  
