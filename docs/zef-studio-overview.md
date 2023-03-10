---
id: overview-zefstudio
title: Zef Studio Overview
---

  
# ❓Overview❓  
zef-studio is a companion application to help you visually explore the data stored in zef.  
It's free provided that you have signed up for a [zefhub account]([[https://console.zefhub.io/](https://console.zefhub.io/)](https://console.zefhub.io/](https://console.zefhub.io/))).  
  
# Getting started  
Zef Studio is a web application, so there is no need to download and install any software to run it.  
To start it simply make sure you have the latest version of zef installed `pip install zef` and run the following commands to get started.  
```python  
# Import nessasary zef packages  
from zef.core import *  
from zef.ops import *  
from zef.graphql import *  
  
# Pull the graphs that you want to explore  
worduel_graph = Graph("some/graph")  
  
# Fire up zef studio server and open connection in browser  
d = FX.Studio.Start() | run  
```  
  
### Options  
Options can be passed to the `FX.Studio.Start()` command as arguments.  
Eg: `FX.Studio.Start(report_errors=True)`.  
  
| Option | Required | Default | Description |  
|:----------|:--|:-------------|:------|  
| `report_errors` | No |  False | Sends crash reports to the zef team to help improve the product |  
  
# Interacting with zef studio  
  
TODO: screenshots  
