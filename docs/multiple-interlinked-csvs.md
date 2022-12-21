---
id: multiple-interlinked-csvs
title: Multiple Interlinked CSVs
---

  
When importing multiple CSV files that reference each other through various IDs, you may want more granular control.  
  
Instead of looking at and modifying the YAML file in a text editor:  
  
![](2763153f45d7753d13ea07f0298092880cb2a7a74a1947e92bd497ef76d14278.png)  
  
You can use our graphical ImGui interface!  
  
![](0554a1a0906293888ae0579f2601e790250a68dba01788f9ce005da19a79369b.png)  
  
If you're using MacOS, make sure you use Python 3.9 (as of March 2022, Python 3.10 does not play nicely with ImGui).  
  
In this example, we'll use the Northwind dataset. We've made the zipped CSV files available [northwind.zip](sql-import-files/northwind.zip).  
  
Also check out our blog post on [SQL imports](https://zef.zefhub.io/blog/sql-import).  
  
## Install ImGui and SDL2  
  
```python  
pip3 install "imgui[sdl2]"  
  
# On MacOS:  
brew install SDL2  
  
# On other systems, install with your package manager, apt, pacman, yum, etc...  
```  
  
## Generate YAML file  
  
Unzip the CSV files into a new empty directory and then start your interpreter  
from this directory. Then:  
  
```python  
from zef import *  
from zef.ops import *  
from zef.experimental import sql_import  
  
decl = sql_import.guess_csvs("*.csv")  
decl | save_file["sql_import.yaml"] | run  
```  
  
## Open YAML file with ImGui interface  
  
```python  
python3 -m zef.experimental.sql_ui.wizard sql_import.yaml  
```  
  
If using MacOS, make sure you use Python 3.9 (as of March 2022) and are using the Python 3.9 Zef wheel.  
  
```python  
python3.9 -m zef.experimental.sql_ui.wizard sql_import.yaml  
```  
  
## Change Entity names from plural to singular  
  
![](9224f45ea477ed0f582617f15fac97f50d081ea90461c845b4b5157f6db7e03f.png)  
  
## Change cross-referenced IDs from Field to Entity and rename their RTs  
  
![](a968835df8df94823ef355a90c1806a187bf0a1407f985cd2140f0b8be7d0277.png)  
  
See your options through the dropdown (make sure the Entity names are edited first to see the correct options).  
  
## Change AET types  
![](0936e169866ee6fcc5e9835383ae52ab4f95948e74429b24bcbb74af3acba16e.png)  
  
## Change Entities to Relations  
![](aac869a6e7ba151d479bb1aa898a68dd303be29eb89e315ad855596c614b98e7.png)  
Set the correct Source and Target.  
  
## Save your edited YAML file  
  
The edited YAML results will save to the current filename.  
  
If needed, we may add an option to save to a new filename in the future.  
  
## Load edited YAML file into Zef  
  
If you have appropriately configured the importer you should be able to run the  
following code to perform the actual import:  
  
```python  
decl = "sql_import.yaml" | load_file | run | get["content"] | collect  
g = Graph()  
actions = sql_import.import_actions(decl)  
actions | transact[g] | run  
```  
  
If you would like, you can use our pre-configured file for this dataset [here](northwind_example.yaml).  
  
See the results of your import!  
  
```python  
yo(g)  
  
<...snip...>  
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Atomic Entities ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  
[5993 total, 5993 alive]       AET.String  
[5217 total, 5217 alive]       AET.Float  
[3496 total, 3496 alive]       AET.Int  
[2487 total, 2487 alive]       AET.Time  
  
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Entities ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  
[11 total, 11 alive]           ET.Employee  
[93 total, 93 alive]           ET.Customer  
[9 total, 9 alive]             ET.EmployeeTerritory  
[53 total, 53 alive]           ET.Territory  
[4 total, 4 alive]             ET.Region  
[830 total, 830 alive]         ET.Order  
[3 total, 3 alive]             ET.Shipper  
[77 total, 77 alive]           ET.Product  
[29 total, 29 alive]           ET.Supplier  
[8 total, 8 alive]             ET.Category  
  
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  Relations ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  
[4 total, 4 alive]             RT.RegionDescription  
       [4 total, 4 alive]             (ET.Region, RT.RegionDescription, AET.String)  
[2155 total, 2155 alive]       RT.OrderDetails  
       [2155 total, 2155 alive]       (ET.Order, RT.OrderDetails, ET.Product)  
[8 total, 8 alive]             RT.ReportsTo  
       [8 total, 8 alive]             (ET.Employee, RT.ReportsTo, ET.Employee)  
<...snip...>  
```  
