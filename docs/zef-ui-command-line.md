---
id: zef-ui-command-line
title: ZefUI - Command Line
---

  
UI Components as plain data. The type encodes the component and a variable number of arguments can be wrapped. Typically a component has one "main" data arguments and sometimes a variable number of parameters.  
  
For instance the data argument for a `Text` component is the string of the text to be displayed. Additional optional parameters are `bold`, `italic`, `color`, `background_color`, ...  
  
The data argument can be specified by keyword or as the first argument (Zef is data-first)  
```python  
my_text = Text(data='Hello World!')  
my_text = Text('Hello World!', bold=True)  
```  
  
### Using the types as Constructors  
`Text` is a ValueType and can be understood as the type of any text instance. It can also be used as a constructor function.  
  
### Sequential Application  
```python  
BoldText = Text(bold=True)  
GreenBoldText = BoldText(color='green')  
  
my_text = GreenBoldText('Typing lives on a spectrum')  
```  
  
  
## Predefined Components  
ZefUI components are data with value semantics. You can send them over the wire, save them, operate on them and all the other things you are used to from values.  
  
#### Typed Values  
Each instance of a component has a type. It is created by using the bare type as a constructor which then wraps some data.  
What is the type useful for? It determines the way in which the component is interpreted and drawn by the respective rendering function. Each component type has a handler function within each rendering system that implements it, to which an instance is dispatched.  
User can create new components from scratch as well.  
We want this to be safe and stable over the network. Therefore we do not use the types name as an identifier (what if two users who don't knmow )  
  
  
  
## Rendering in the Terminal  
ZefUI components are plain data. They describe what is to be shown with the data structure being congruent with the inherent structure of the UI tree.  
The same component can be rendered in very different contexts:   
- the terminal  
- a Jupyter notebook  
- a static website  
- a native phone app  
...  
  
To render in the terminal, we can use the `show` function. This is side effectful and renders the component to stdout, using the "rich" library.  
```python  
my_text | show     # triggers the side effect  
show(my_text)      # or in usual function notation  
```  
  
  
  
### Text  
  
  
  
### Code  
```python  
from zef.ui import Frame, Text, Code, Style, VStack  
  
code = '''\  
def die_antwoord():		  
    return 42\  
'''  
      
MY_CODE = Code(code, language = 'python', line_numbers=True)  
  
```  
  
  
  
### Frame  
Draw a frame / box around a given component. Adding a header is optional.  
```python  
...  
```  
  
  
### Combinators  
These are used for combining components into new components.   
**VStack** and **HStack** are the most prominent clear examples and they simply place a list of other components vertically or horizontally next to each other.  
```python  
...  
```  
  
  
### BulletList  
  
  
### NumberedList  
  
  
### Table  
  
  
  
  
  
  
  
  
## Dynamic UIs  
These change over time. Think of most complicated apps, either web, native phone or native PC / MacOS.  
  
### Value Changes  
  
  
### Structural Changes  
  
  
  
  
### from Zeyad  
```python  
# ----Text Example----  
style  = Style(bold= True, background_color="red")  
ulf    = Text("Ulf", style = style)  
hello  = Text(["Hello ", ulf, " Bissbort"], italic=True, justify="center")  
Frame(data=hello, title="Text Example") | show  
  
# ----Code Example----  
code = '''def trying_rich():  
    return 'Coooool\''''  
      
snippet = Code(code, language = "python3", line_numbers=True)  
Frame(snippet, title="Code Example") | show  
  
  
# ----Frame Example----   
title = Text("Cool code", color = "magenta", background_color = "#000000")  
f = Frame(snippet, title = title, subtitle = "Zef", box="ascii")   
  
Frame(f, title="Frame Example") | show  
  
  
# ----Tables Example----   
columns = [  
    Column("Released", style = Style(color="green"), justify="left", vertical = "middle"),  
    Column(Text("Title", color = "green"), justify="center",  style = Style(color= "cyan")),  
    "Box Office",  
]  
  
rows = [  
    ("Dec 20, 2019", "Star Wars: The Rise of Skywalker", "$952,110,690"),  
    ("Dec 20, 2019", "Star Wars: The Rise of Skywalker", "$952,110,690"),  
    (Text("Dec 16, 2016", style= style), "Star Wars Ep. [b]I[/b]: [i]The phantom Menace", "$1,332,439,889"),  
    ("Dec 20, 2019", "Star Wars: The Rise of Skywalker", "$952,110,690"),  
]  
  
title = Text("Star Wars Movies", color = "magenta", justify="center")  
  
row_styles  = [Style(background_color="#222232"), ""]  
  
table = Table(  
    show_edge=False,  
    expand=True,       
    box = 'double',          
    title=title,  
    rows = rows,  
    cols = columns,  
    row_styles=row_styles,  
)   
  
Frame(table, title="Table Example") | show  
  
# ----Stacks Example----   
hstack = HStack([ulf, "Zeyad",f], cols= [Column(vertical="middle")], expand=True, padding=5)   
Frame(hstack, title="HStack Example") | show  
  
  
vstack = VStack([table, hstack], expand=True, padding=5)   
Frame(vstack, title="VStack Example") | show  
  
# ----Lists Example----   
  
data = ["Go to market", "Code some stuff", "Prepare Food"]  
Frame(VStack([BulletList(data, title = "Bulletlist"), NumberedList(data, title = "NumberedList")]), title="Lists Example") | show  
```  
