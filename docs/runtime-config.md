---
id: runtime-config
title: Runtime Config
---

  
The `zwitch` interface controls the kind and level of information messages that  
are displayed to `stderr`. Options are controlled by, e.g.  
`zwitch.zefhub_communication_output(True)` and are read by  
`zwitch.zefhub_communication_output()`. The options are:  
  
| `zwitch.<...>`                | Default | Purpose                                                                            |  
|------------------------------:|:--------|:-----------------------------------------------------------------------------------|  
| `short_output`                | `True`  | cause the `info` output to be more concise                                         |  
| `zefhub_communication_output` | `True`  | show messages about connections with ZefHub.                                       |  
| `graph_event_output`          | `True`  | show messages about graph updates                                                  |  
| `extra_quiet`                 | `False` | when `True` will suppress other messages that do not fit into the categories above |  
  
  
### Controlling behavior  
Some more low-level options are also available that affect behavior rather than output:  
  
| `zwitch.<...>`                            | Default | Purpose                                                                                                                                                                                      |  
|------------------------------------------:|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| `allow_dynamic_entity_type_definitions`   | `False` |                                                                                                                                                                                              |  
| `allow_dynamic_relation_type_definitions` | `False` |                                                                                                                                                                                              |  
| `allow_dynamic_enum_type_definitions`     | `False` | these three options override whether `ET`, `RT`, or `EN` creation is allowed. Primarily used for service jobs.                                                                               |  
| `default_rollback_empty_tx`               | `True`  | If `True`, any transaction which is empty is undone, leaving the graph in exactly the same state before opening the transaction.                                                             |  
| `default_wait_for_tx_finish`              | `True`  | If `True`, the closing of a transaction is blocking until all of the data is processed. When a function that closes a transaction returns, the `read_head` and `write_head` will be in sync. |  
