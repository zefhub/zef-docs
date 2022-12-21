---
id: z-expression
title: Z-Expression
---

  
### What is `Z`?  
- `Z` provides a convenient, succinct and expressive way to express sets of things.   
- Within a simple view, `Z` denotes the subject (in a subject, predicate, object) relationship: what is the thing / set of things we are talking about?  
- `Z` is **not** an operator: it must be its own type to play nicely with the type system.  
  
  
### Usage with Binary Boolean Operators  
```python  
T1 = (Z < 10)  # the set / type of all things considered to be less than 10.  
5 | is_a[T1]         # True  
15 | is_a[T1]        # False  
'hi' | is_a[T1]      # False  
```  
  
On the type level, `Z` is of type `ZExpression`. As soon as a `ZExpression` is combined with some value using one of the binary boolean operators `==, !=, <, >, <=, >=`, this evaluates to a [[ZefDoc - Zef Value Types |Zef ValueType]].  
  
  
  
### Nesting and Function Application  
###### On Graphs and for Zef UserValueTypes ("Objects")  
```python  
T2 = (Z.FirstName == 'Peter')   # the set of all things we consider to have a first name to be `Peter`. The dot-notation applies to Zef Objects and to a ZefRef on a graph.  
```  
  
###### Dictionaries  
You use the same operators you would on a dictionary to define a set of dictionaries that fulfill the specified criterion.  
```python  
T3 = (Z['x'] > 0)  
  
{'x': 42, 'y': 1} | is_a[T3]               # True  
{'x': 0}          | is_a[T3]               # False  
```  
  
###### Function Application  
Using Zef Functions and piping notation (making use of laziness)  
```python  
StringsOfLength10 = String & (Z | length == 10)  
  
'good night' | is_a[StringsOfLength10]    # True  
'hi' | is_a[StringsOfLength10]            # False  
```  
  
  
Boolean functions:  
```python  
LowerCaseString = (Z | is_lower_case == True)  
  
'hello' | is_a[LowerCaseString]     # True  
'Hello' | is_a[LowerCaseString]     # False  
```  
Note: even in the case of the applied function returning a Bool, the `== True` is required to trigger the conversion of the Z-Expression to a ValueType.  
  
  
  
### Combining ValueTypes  
ValueTypes can be composed using  
- Intersection (`&`)  
- Union (`|`)  
- Complement (`~`)  
operators  
```python  
# this allows us to use types as queries:  
my_query = (  
    ET.Person   
    & (Z.FirstName == 'Peter')  
    & (Z.YearOfBirth > 1950)  
)  
```  
All ValueTypes in Zef are expressions, which themselves obey [[ZefDoc Value Semantics |value semantics]].  
Above, we combined the various types to define a hypothetical set of things that fulfill **all** of the stated conditions by using the shorthand `&` for `Intersection`.  
  
Sometime it is also convenient to use the `|` operator for set `Union`.  
```python  
HasFirstNamePeter = (  
 (Z.FirstName == 'Peter') |     # English  
 (Z.FirstName == 'Pieter') |    # Afrikaans  
 (Z.FirstName == 'Pedro') |     # Spanish  
 (Z.FirstName == 'Pyotr')       # Russian  
)  
```  
  
  
  
### Use with RelationType `RT`  
The `RT` expression is used to define sets of entities (generally: sets of atoms) based on connected neighboring structure.  
```python  
AtomsNamedPeter = RP[(Z, RT.FirstName, 'Peter')]  # a ValueType / Set  
```  
Importantly, `Z` indicates the position of the **subject**/thing we are looking for.  
For more details, see the [[ZefDoc - RelationType Expression |RelationType]] docs.  
  
  
### Multiple Occurrences of Z  
```python  
T1 = (Z[0] < Z[1])  
  
[1,2] in T1    # True  
[3,2] in T1    # False  
```  
  
  
### Disclaimer  
It is an opinionated and somewhat unusual approach to create expressions for sets which rubs some people the wrong way, so feel free to ignore it. There is nothing you can express with `Z` that could not also be expressed in  ore explicit ways.  
  
  
  
### Relation to the `dplyr` Package in R  
> "A lot of it *(R's success)* is because of one man, which is [[Hadley Wickham]], who has created a set of beautiful libraries that have a better developer experience for stuff like data munging and things like than any other language. ...   
> I do feel that Hadley's libraries are the best in the world for doing what they do."   -   Jeremy Howard  
  
Z-Expressions allow for syntax that is similar to that of dplyr's, but in Python.  
  
For instance  
```R  
data %>%  
   filter(  
     country=='Oman' &  
     year > 1980 &  
     year < 2000  
   )  
```  
  
can be expressed in Zef with Z-Expressions as  
```python  
data  
 | filter[  
     (Z.country=='Oman') &  
     (Z.year > 1980) &  
     (Z.year < 2000)  
   ]  
```  
  
  
  
### Set Membership  
```python  
ET.Person & (Z.country_of_birth == countries.egypt)  
  
  
# all people born in africa  
ET.Person & (Z.country_of_birth <= continents.africa )  
# continents.africa can be interpreted as a set  
  
```  
  
  
