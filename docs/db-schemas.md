---
id: db-schemas
title: DB Schemas
---

In a ZefDB database, we distinguish between a blueprint and  logical schema of a database.  
  
### Three Functions Schemas  
- Encode a domain model: communicate with your team and future self  
- Give an overview of the data that exists  
- Logical Schema: add constraints to the structure of data added / transacted  
  
We refer to the combination of  
`Schema = Logical Schema + Blueprint`  
  
### Creating a Domain Model  
Creating a schema as a domain model can be a useful tool for effectively communicating the structure and organization of your data. By declaring a schema upfront, you can provide a clear and concise overview of the entities and relationships that exist within your domain, making it easier for others to understand and work with your data. Additionally, creating a schema can help you to better organize and structure your data, ensuring that it is consistent and follows a logical pattern. This can be especially useful when working on large and complex datasets, as it can make it easier to find and retrieve specific pieces of information. Overall, declaring a schema as a domain model can help to improve the efficiency and effectiveness of your data management practices.  
Read more:   
  
  
### Logical Schema  
ZefDB's logical schema allows you to express complex constraints and rules on your data, giving you the power to define highly flexible and customizable structures for your data. In ZefDB, you can go beyond the typical constraints found in relational databases and define non-local constraints between fields and even between different entities. And because the schema is defined using Python, you have the flexibility to express virtually any constraint as a predicate function. Take control of your data's structure with ZefDB's powerful logical schema.  
Read more: [ZefDoc - Logical DB Schemas](logical-db-schemas)  
  
### Blueprint  
The blueprint of a ZefDB database, on the other hand, is a summary of all data that has been stored in the database up to a given point in time. This blueprint reflects the state of the database at a particular point in time and includes all entities and relationships that exist in the database.  
  
