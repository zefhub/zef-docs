---
id: single-csv-new
title: Single CSV New
---

  
  
In this example, we'll use a CSV file of [Netflix movies](movies.csv).  
  
## Load CSV file  
  
Let's start with a new graph and load our CSV file.  
  
```python  
from zef import *  
from zef.ops import *  
  
g = Graph()  
  
file_path = "something/my_file.csv"                                     # this is where your CSV file is located  
df = file_path | load_file | run | get['content']  | collect            # the loaded file is now a pandas dataframe object  
```  
  
## Mapping rows and columns into graph entities  
  
Each row should represent a specific entity. In this example, each row will be represented as an **ET.Movie**. Column names will be imported over as is by default.  
  
```python  
mapping = {"row": "Movie"}  
```  
  
You also have the option of renaming the column names upon import.  
  
```python  
mapping = {"row": "Movie", "columns": {"ratingLevel": "RatingDescription", "ratingDescription": "RatingScore"}}  
```  
  
Here, the columns **"ratingLevel"** and **"ratingDescription"** will be renamed while the other column names will remain as is.  
  
## Importing pandas dataframe object into a Zef graph  
  
Passing our dataframe with mapping into **"pandas_to_gd"** produces a GraphDelta with the required transformations that can be applied to any Zef graph (in this instance, a new graph **g**).  
  
```python  
pandas_to_gd(df, mapping) | g | run  
```  
  
Note that when you run the above command, it may take a few seconds (depending on the size of the CSV).  
  
## Explore the graph  
  
You can now take a quick look at the graph and begin exploring!  
  
```python  
yo(g)  
```  
