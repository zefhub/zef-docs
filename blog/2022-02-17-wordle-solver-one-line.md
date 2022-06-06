---
slug: wordle-solver-one-line
title: Wordle Solver in One line of Python
author: Zeyad Abuamer
author_title: Zef Grandmaster
author_url: https://www.linkedin.com/in/zeyadkhaled/
tags: [zef, zefops, python, wordle]
---

In the last blog post, we created a console-playable Wordle game in few lines of Python using ZefOps. In this blog post, we will write a Wordle solver
(or more like your own Wordle assistant) that suggests what your next move could be 😎

So before digging deeper, be sure to check [part 1](/blog/wordle-using-zefops)!


![Wordle](wordle2.png "Wordle")

## What will we do? 🤔

Our aim by the end of this blog post is to write a solver that given a `list of guesses` + `discarded letters` = `a list of possible
answers`. So you can think of it as an eliminator of bad guesses given our previous guesses. 

The idea is pretty straightforward, and given our first one or two guesses are good enough, we can arrive at the correct guess in around 4 guesses 😲
wordlist
Let's look at an example:

```python
["a", "b", "3", "c", "5"] | filter[is_alpha] | collect      # returns ["a", "b", "c"]
```

Each item of the list passes through the filter's predicate which evaluates to a boolean value `True` or `False`.
If the value is `True` the item passes the filter, otherwise it gets discarded.

*PS: `is_alpha` is a ZefOp that takes a string and checks if its is only consists of english alphabet and then returns True or False*

So if we pass the wordlist through enough filters we will reduce our wordlist to only the possible guesses at that stage. So the more information we have, i.e correctly placed letters or misplaced letters, the more filters we can create.

## Let's start building 🏗

- Start by importing ZefOps and loading our word list

```python
from zef import * 
from zef.ops import * 

url = "https://raw.githubusercontent.com/charlesreid1/five-letter-words/master/sgb-words.txt"
wordlist = url | make_request | run | get['response_text'] | split['\n'] | map[to_upper_case] | collect
```

- Let's add our discarded letters and guesses from the game we are stuck on

```python
discard_letters = 'ACLNRT'

guesses = [
    ["_", "_", "_","_","[E]"],
    ["_", "U", "_", "[E]","S"]
] 
```


- Now let's write our filters generator ⚙️

```python
def not_contained_filters(discard_letters: str):
    return discard_letters | map[lambda c: filter[Not[contains[c]]]] | collect
      
def correct_or_misplaced_filters(guess: str):
    misplaced = lambda p: [filter[Not[nth[p[0]] | equals[p[1][1]]]], filter[contains[p[1][1]]]]
    correct   = lambda p: [filter[nth[p[0]] | equals[p[1]]]]
    return (guess                                                       
        | enumerate                                                          
        | filter[Not[second | equals['_']]]                            
        | map[if_then_else_apply[second | is_alpha][correct][misplaced]]         
        | concat                                                                
        | collect                                                       
        )
```

Believe it or not, this is all we need. It might look complicated but it is simpler than it looks. So let's dissect it 🗡

Basically, these 2 functions use ZefOps to generate ZefOps of type `filter` with baked-in predicate functions given both the `discarded_letters` and our previous `guess`.

### Function: not_contained_filters
Let's look at the first function `not_contained_filters`. The function takes the `discarded_letters` as a string and maps each letter `c`
to a `filter` function that has a predicate function `Not[contains[c]]]` which is the ZefOp `Not` taking as an argument another ZefOp `contain`.

If this looks complex try to read it as an english sentence. *filter* what does*not contain* the letter *c* 
So given this example `["ZEFOP", "SMART"] | filter[Not[contains["A"]]] | collect` only `ZEFOP` will pass the filter.

Do you wanna guess the output when we pass `discard_letters = 'ACLNRT'` to this function as an argument?

Well, we are `mapping` each letter of that string to a `filter` so we end up with this *OUTPUT:*


```python 
[
filter[Not[contains['A']]],
filter[Not[contains['C']]],
filter[Not[contains['L']]],
filter[Not[contains['N']]],
filter[Not[contains['R']]],
filter[Not[contains['T']]]
]
```

A list of filters one for each discard letter. This way any word that doesn't pass all these filters will not be part of our possible answers.


### Function: correct_or_misplaced_filters
Let's look at the second function 'correct_or_misplaced_filters', which is pretty similar to the one above. We are returning filters for when we have a correctly placed letter or a misplaced letter. This function could be divided into 2 other functions, but with the `if_then_else_apply` ZefOp we can simply do it in the same function without duplicating the logic. 
*The apply at the end of of the ZefOp name means we apply the passed functions to the first argument.*

Let's take a closer look at the return statement of this function and run our second guess from our guesses list above to walk through the function logic:

*OUTPUT:*
```python
misplaced = lambda p: [filter[Not[nth[p[0]] | equals[p[1][1]]]], filter[contains[p[1][1]]]]
correct   = lambda p: [filter[nth[p[0]] | equals[p[1]]]]

guess = ["_", "U", "_", "[E]","S"]
(guess                                                      # ["_", "U", "_", "[E]", "S"]         
| enumerate                                                 # [(0, "_"), (1, "U"), (2...]         
| filter[Not[second | equals['_']]]                         # [(1, "U"), (3, "[E]"), (4, "S")]    
| map[if_then_else_apply[second | is_alpha][correct][misplaced]]  # [[filter[nth[p[0]] | equals[p[1]..] 
| concat                                                    # [filter, filter, filter..]          
| collect                                                       
)
```

The comments show the transformation the `guess` input is going through until we get out a list of filters that contain predicate functions that
satisfy correct and misplaced letters requirements.

So the output of this snippet given the `guess = ["_", "U", "_", "[E]", "S"]` is this  *OUTPUT:*

```python 
[
filter[nth[1] | equals['U']],       # Second letter should equal U
filter[Not[nth[3] | equals['E']]],  # Fourth letter should NOT equal E
filter[contains['E']],              # Word contains an E
filter[nth[4] | equals['S']]        # Fourth letter should equal S
]
```


## Put it all together 🧩

When we put both of these functions along with our 2 inputs we end up with a pipeline of filters that we can run the whole wordlist through.

```python
filters_pipeline = [
    filter[length | equals[5]],         # Just making sure it is a 5 letter word
    not_contained_filters(discard_letters),                      
    guesses | map[correct_or_misplaced_filters] | concat | collect 
]  | concat | as_pipeline | collect    # Flatten all sublists and turn them into a pipeline
```

We are creating a list of filters coming from the discarded letters and the `mapping` of each guess in our guesses.

*PS: `as_pipeline` takes a list of ZefOps and returns a single ZefOp that we can call or pipe things through*

```python
possible_solutions = wordlist | filters_pipeline | collect
possible_solutions | run[print]
```

We pipe our entire wordlist through the filters pipeline to end up with all possible solutions. In this example, given our wordlist and guesses+discarded letters the possible solutions are: `["GUESS"]`, who could have guessed that 😉

## Wrap up 🔚

And just like that we used ZefOps to generate ZefOps that are used with other ZefOps on our wordlist.. Pheww, how *Zef*!

Given this code is pure ZefOps and ZefOps compose, we can reduce it into one line. But let's not do that, or may be...



## Worduel 👀

In [part 3](/blog/worduel-gql-backend) of this series, we are going to take this to the next level, where we will use ZefDB, ZefGQL, ZefFX to 
create a competitive web game of Wordle where you can take your friends, collegues, or your mom to a game of Worduel 😜