---
id: funny-how-the-knight-moves
title: Funny How the Knight Moves
---

This is a solution to the  www.funnyhowtheknightmoves.com game.  
  
  
```python  
from zef import *  
from zef.ops import *  
  
@func  
def to_coords(pos):  
    return (ord(pos[0].lower())-96, pos[1])  
  
start_pos = ('h',4)  
target_pos = ('g',4)  
  
# position of knight: p = (x,y)  
# we want to find the shortest path to a target field t = (tx,ty)  
  
# knight_moves = [-2,-1,1,2] | repeat[2] | collect | cartesian_product  | filter[map[abs] | sum |equals[3] ] | collect  
# knight_moves = [(x,y) for x in [-2,-1,1,2] for y in [-2,-1,1,2] if abs(x)+abs(y)==3]  
queen_pos = (4,5)  
knight_moves = [(-2,-1),(-2,1),(-1,-2),(-1,2),(1,-2),(1,2),(2,-1),(2,1)]  
  
OnBoard = Where[lambda p: 1<=p[0]<=8 and 1<=p[1]<=8]  
BlockedByQueen = Where[lambda p: (  
        p[0]==queen_pos[0] or   
        p[1]==queen_pos[1] or   
        abs(p[0]-queen_pos[0])==abs(p[1]-queen_pos[1])  
    )]  
OK = OnBoard & ~BlockedByQueen  
  
# # start move  
# [  
#     [(5,2)],  
# ]  
  
# # sequence after first move  
# [  
#     [(5,2), (6, 4)],  
#     [(5,2), (4, 4)],  
#     [(5,2), (3, 3)],  
#     [(5,2), (7, 3)],  
# ]  
# # then cull any paths that contain points that were already present: these are latecomers  
  
  
def find_path(start_coords, target_coords):  
    @func  
    def pos_add(p1, delta):  
        return (p1[0]+delta[0],p1[1]+delta[1])  
  
    def step(seqs):  
        @func  
        def step_single_seq(seq):  
            return (seq   
            | last   
            | apply[ [pos_add[d] for d in knight_moves] ]   
            | filter[OK]  
            | map[lambda new: [*seq, new]]   
            )      
        PreviousPos = Where[contained_in][set(seqs | concat | collect)]  
        return seqs | map[step_single_seq] | concat | filter[lambda s: s[-1] not in PreviousPos] | collect  
  
  
    return (start_coords  
    | iterate[step]   
    | take_until[map[last] | contains[target_coords] ]   # stop when target is on one path  
    | last  
    | filter[last | equals[target_coords] ]              # remove paths that don't end at target  
    | first                                              # there may be multiple solutions, just take the first  
    | collect  
    )  
  
  
  
# Goal: print out a list of move sequences  
(range(1,9)   
| repeat[2]       # both left-right and up-down  
| cartesian_product   
| reverse   
| map[reverse]      
| filter[OK]      # only positions where the queen would not capture  
| sliding[2]      # pairs of start and target positions for each sequence  
| map[unpack[find_path]]   # for each pair: find the shortest path  
| map[map[lambda p: f"{int_to_alpha(p[0]-1)}{p[1]}" ] | join['->'] ]             # display as ['g', 6]  
| collect  
)  
  
# Output is of form  
# ['h8->g6->f8',  
#  'f8->h7->f6->e8',  
#  'e8->f6->h7->f8->g6->e7->c8',  
#  'c8->b6->a4->c3->b1->a3->c2->b4->a6->b8',  
#  'b8->a6->c7->e8->f6->h7',  
#  ...  
```  
