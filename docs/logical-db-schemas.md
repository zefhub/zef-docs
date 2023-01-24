---
id: logical-db-schemas
title: Logical DB Schemas
---

  
  
Rules specified in the logical schema must be true at every point in time, i.e. in each DB state.  
  
### Local Constraints  
```python  
x = V.x  
  
Email = String & Contains['@']  
# every customer must have a valid email address  
for_all[x: ET.Customer][x | F.email | is_a[Email]]  
  
# every customer must have a first name field set  
for_all[x: ET.Customer][x.first_name != nil]  
```  
  
  
### The structure of Schema Constraints  
A typical constraint is formulated in the following form:  
`for_all[quantifier][sentence]`  
- **Quantifier**: The quantifier specifies which values the variable can take on. Using an entity type and additional constraints is the typical pattern here.  
- **Sentence**: this is a clause which must evaluate to true for any valid database state (time slice). It can contain a combination of   
	- variables  
	- concrete instances (values or references to atoms)  
	- ZefOps (and Zef Functions)  
  
  
  
### Non-Local Constraints  
```python  
# for a transaction to close: an account's balance may not be lower than its credit limit  
for_all[x: ET.Account][x.balance >= -x.credit_limit]  
  
  
# every minor must specify a guardian  
for_all[x: ET.Person & (Z.age<18)][x.guardian | is_a[ET.Person & (Z.age >= 18)]]  
```  
  
  
### Related  
- Zef DB schemas are in line with the 