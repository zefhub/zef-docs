---
id: design-goals
title: Design Goals
---

  
## 📜 Values and their Transformation 📜  
- as opposed to mutating variables or mutating databases  
- reading and observing should require no coordination  
- distinguish and separate data/information from the operations on them  
  
  
  
## 🗺 A language for Distributed Systems 🗺  
- a DSL for coordination of distributed computation  
- based on immutable values  
- time as a first class citizen  
  
  
## 🌍 Domain Objects as Entities 🌍  
- Represent Real World Entities and concepts as part of your information model  
- make them part of the information system  
- knowledge and information should be represented as well thought through data that can be computed on  
  
  
  
## 🎵 Design Coherence 🎵  
- various parts of the system should fit together well.  
- avoid language specific classes and other idiosyncrasies on the system level  
  
  
## ⚙️ Automate all Repetitive Parts ⚙️  
- developers should focus on the problems specific to the problem that they're solving. Not on database migrations, schema maintenance, parallelization of compute, deployment  
  
  
## Separate the Core of your Code from Execution Context  
- Code that you write should be concerned with the computation at hand. As much as possible should be written as pure function: they take values and return values.  
- This leads to less code brittleness and allows the execution in very different contexts. Even if you start writing the code in you local Jupyter Notebook, it can be used for   
	- parallel execution across local processes  
	- on remote processes  
	- on ZefHub  
	- in perfect replay scenarios when debugging  
  
  
  
## 🐰 Optimize for Fast, Incremental Development 🐰  
- minimize state, focus on values and transformations  
- provide excellent tooling to facilitate this  
- writing and execution of programs should be integrated  
  
  
  
## 🐜 Provide Tools to Create Programs in the Small as in the Large 🐳  
- Zef provides a structural framework (lazy values, streams & transformations) that can be used in different contexts across different scales  
- in the **small**: write reactive backends or frontends directly from Python in a local process (Zef allows you to use Python with concepts known from Elm, Re-Frame & React)  
- in the **large**: the same principles can be applied to distributed systems across multiple compute nodes. Get the advantages of complex frameworks like Apache Spark without the large maintenance overhead and better visibility.  
  
  
  
## 🛤 A Set of Tools for Situated Programs 🛤  
- Much of todays professionally written software is different from toy examples. These programs are "situated":   
	- They deal with the external world  
	- existing systems  
	- complex and messy domains  
	- don't run on a single machine  
	- collaborative: different people and teams  
  
Zef aims to provide tools and an alternative way to share and think about information and programs.  
  
  
  
## 📺 Your Codebase as a Database 📺  
- developers have built incredibly powerful tools to operate and query information, but we don't have these tools to deal with our own everyday domain: our code base.  
- Treat your codebase as a database that grows over time  
- Your code base is a dynamic, decentralized graph. It is data. Make this explicit and provide tools to query, monitor, manage, deploy and optimize  
  
  
  
## 📖 Coordination vs Core Language 📖  
- Real World Systems have two parts to them:  
	- A core program part (there may be many)  
	- A coordination part between these running parts / "machines" / "services"  
  
- Zef allows you to use a single language for both  
- If you'd rather write Python than large YAML configs  
- Checking and testing before deployment is helpful: constraints can be expressed as types  
  
  
## 🎻 Expressive Code 🎻  
- less code is often better  
- provide primitives (e.g. ZefOps) that allows you to write code that is   
	- easier to read (for future you and your collaborators)  
	- more composable  
	- and more performant than regular Python (future goal)  
	- can be executed in a distributed systems context  
  
  
  
## 🧵 Simplicity 🧵  
- Much of the current "stack" is too complicated and the tools often don't interface well  
- aspire to radical simplicity  
- simple ≠ easy. If in doubt, favor simplicity  
- simple is not always familiar. Keep an open mind at first  
  
  
  
## 🧐 Listen to Other Fields 🧐  
There is much wisdom in other fields such as   
- Philosophy (Frege, Whitehead, Russel, Wittgenstein, Deleuze)  
- Maths (Lamport, Wolfram, Clifford)  
- Linguistics (Chomsky)  
- Ontology (RDF, Logical Atomism)  
  
  
  
## 🛠 Tools and Visibility Count 🛠  
We believe that a lot more can be done on the front of developer tooling. Especially in the context of larger systems consisting of coupled sub-systems. We spent a lot of time trying to figure out what went wrong.  
Problems we faced:  
 - brittleness of APIs  
 - lack of type checking across API boundaries   
 - lack of tooling to show you what is going on a quickly and cleanly as possible   
 - cryptic error messages  
   
 All of these are part of our missions.  
  
  
  
## 🕸 Information-Based Programming 🕸  
  
