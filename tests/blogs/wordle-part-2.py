# Test for Wordle Solver in One line of Python #
#%%%
from zef import * 
from zef.ops import * 

url = "https://raw.githubusercontent.com/charlesreid1/five-letter-words/master/sgb-words.txt"
wordlist = url | make_request | run | get['response_text'] | split['\n'] | map[to_upper_case] | collect

discard_letters = 'ACLNRT'

guesses = [
    ["_", "_", "_","_","[E]"],
    ["_", "U", "_", "[E]","S"]
] 

def not_contained_filters(discard_letters: str):
    return discard_letters | map[lambda c: filter[Not[contains[c]]]] | collect
      
def correct_or_misplaced_filters(guess: str):
    misplaced = lambda p: [filter[Not[nth[p[0]] | equals[p[1][1]]]], filter[contains[p[1][1]]]]
    correct   = lambda p: [filter[nth[p[0]] | equals[p[1]]]]
    return (guess                                                       
        | enumerate                                                          
        | filter[Not[second | equals['_']]]                            
        | map[If[Is[second | is_alpha]][correct][misplaced]]         
        | concat                                                                
        | collect                                                       
        )

filters_pipeline = [
    filter[length | equals[5]],         # Just making sure it is a 5 letter word
    not_contained_filters(discard_letters),                      
    guesses | map[correct_or_misplaced_filters] | concat | collect 
]  | concat | to_pipeline | collect    # Flatten all sublists and turn them into a pipeline

possible_solutions = wordlist | filters_pipeline | collect
possible_solutions | run[print]
# %%