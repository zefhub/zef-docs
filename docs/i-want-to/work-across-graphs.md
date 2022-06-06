---
id: work-across-graphs
title: Work across Graphs
---

Suppose you're given the task of building a customer analytics system in your company. Your company's infra is designed using a microservice architecture and the data your system requires is located in multiple services. Most of the customer's data is stored in the 'customer service', but you also need access to related data in the 'shipping service', as well as the 'warehouse service'.

todo: table of pros and cons for design decisions.

```python
g_customers = Graph('customer-graph')
g_shipping  = Graph('shipping-graph')
g_warehouse = Graph('warehouse-graph')
```



https://stackoverflow.com/questions/65254769/should-database-primary-keys-be-used-to-identify-entities-across-microservices

Let us take a step back and think about what the problem is? 
* The real world problem is not in line with the domain boundary of how the microservices were decoupled. The customer entities within each microservice refer to the same person in the real world. There is nothing we can do about that.

