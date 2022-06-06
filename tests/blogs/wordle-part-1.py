# Test for Build Wordle in 30 lines of Python #
#%%
from zef.ops import * 

url = "https://raw.githubusercontent.com/charlesreid1/five-letter-words/master/sgb-words.txt"
wordlist = url | make_request | run | get['response_text'] | split['\n'] | map[to_upper_case] | collect


counter, to_be_guessed = 6, random_pick(wordlist)
discard_words, discard_letters, guesses_list = set(), set(), []

is_eligible_guess = And[length | equals[5]][contained_in[wordlist]][Not[contained_in[discard_words]]]


def make_guess(guess, to_be_guessed, discard_letters):
    def dispatch_letter(arg):
        i, c = arg
        nonlocal to_be_guessed
        if c == to_be_guessed[i]:         # Rule 1 🟩
            to_be_guessed = replace_at(to_be_guessed, i, c.lower()) 
            return f" {c} "
        elif c in to_be_guessed:          # Rule 2 🟨
            to_be_guessed = replace_at(to_be_guessed, to_be_guessed.rindex(c), c.lower())
            return f"[{c}]"
        else:                             # Rule 3 ◻️
            if Not[contains[c.lower()]](to_be_guessed): discard_letters.add(c)
            return " _ "
    
    return (guess                       # "CRANE"
            | enumerate                 # ((0, "C"), (1, "R"), ...)
            | map[dispatch_letter]      # ["_", "[R]", "_", ...]
            | join                      # "  _  [E] _  _  _ "
            | collect 
        ), discard_letters

"~Welcome to Wordle~" | run[print]    # boujee way of printing using zefops

while counter > 0:
    guess = input("Your guess:").upper()
    if is_eligible_guess(guess):     # Calling our predicate zefop on the guess
        counter -= 1
        discard_words.add(guess)
        guess_result, discard_letters = make_guess(guess, to_be_guessed, discard_letters)
        discard_string = discard_letters | func[list] | sort | join | prepend ['     [Not in word]: '] | collect
        guess_string = guess_result | pad_right[20] | append[guess + discard_string] | collect
        guesses_list = guesses_list |  append[guess_string] | collect
        guesses_list | join['\n'] | run[print] 
 
        if guess == to_be_guessed: 
            f"Your guess {guess} is correct!" | run[print]
            counter = -1
    else:
        f"{'Previous guess' if guess in discard_words else f'Invalid guess {guess}'}! Try again." | run[print]

if counter == 0: f"Your ran out of trials, the word was {to_be_guessed}" | run[print]