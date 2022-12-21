---
id: multiple-interlinked-csvs
title: Multiple Interlinked CSVs
---

  
When importing multiple CSV files that reference each other through various IDs, you may want more granular control.  
  
Instead of looking at and modifying the YAML file in a text editor:  
  
![](49eada71a63a3c127e6bf74093e7781af3fcb69ddfb7e9f6d0fad1745fd0bbbf.png)  
  
You can use our graphical ImGui interface!  
  
![](5567c4f539f7e89d99739bbb381bae17c40ab964d8120b66bf862e85e381f6ba.png)  
  
If you're using MacOS, make sure you use Python 3.9 (as of March 2022, Python 3.10 does not play nicely with ImGui).  
  
In this example, we'll use the Northwind dataset. We've made the zipped CSV files available TODO: link northwind.zip  
  
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
  
![](06a3316a97901004245a3f4a1cfc0d516f0bdb9b3cde7d5754934f6da1118af3.png)  
  
## Change cross-referenced IDs from Field to Entity and rename their RTs  
  
![](e14e9e21f25602071b466514ef9cdf1d4b350d76b374ac8595c5fb4483ae6681.png)  
  
See your options through the dropdown (make sure the Entity names are edited first to see the correct options).  
  
## Change AET types  
![](b39ef5dafe56ac067ca768d19fccd7ab8c2a6128e98e35a5f838527fd7eb0975.png)  
  
## Change Entities to Relations  
![](b28f7f02d66af42be0d5e84698d57b21e35b463477cd15432a73b8a6d944862d.png)  
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
  
If you would like, you can use our pre-configured file for this dataset: TODO: northwind_example.yaml  
  
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
