from zefdb import *
from zefdb.zefops import *

##

g_orig = Graph("zymergen-scenario1")
g = clone(g_orig)
g | info

##

sms = g | instances[now][ET.Submodule]
sms | first | info

##

details = {}
for sm in sms:
    details[sm >> RT.Name | value.String] = {
        "z": sm,
        "type": sm >> RT.Type | value.String
    }
details

##

(details['atc-sm-1']['z'] >> RT.Type) == (details['atc-sm-2']['z'] >> RT.Type)
details['atc-sm-1']['z'] >> RT.Type | uid
details['atc-sm-2']['z'] >> RT.Type | uid

##


mm_out_edges = details['magnemotion-sm-1']['z'] | outs
rt_outs = [RT(out) for out in mm_out_edges]
details['magnemotion-sm-1']['z'] >> RT.Capacity | value

##

# The (...) are required for operator precedence. This restriction will be
# lifted in the future
anyof = (sms | first) << RT.Option
anyof | info

##

for sm in anyof >> L[RT.Option]:
    print(sm >> RT.Type | value)


##

protocols = g | instances[now][ET.ZymergenProtocol]
len(protocols)

##

difference = protocols | without[anyof << L[RT.Alias]]

##

protocols | last | info

##

firststep,laststep = (protocols | last) << L[RT.Protocol]
firststep | info

##

(laststep >> RT.After) == firststep

##

firststep >> RT.Recipe | info

##

(firststep > RT.Recipe) | info

##

(g | instances[now][ET.Submodule]) << L[RT.Within]

##

all_within = (g | instances[now][ET.Submodule]) << L[RT.Within]

##

locations = all_within | flatten

##

one_sm_locs = locations | filter[lambda z: len(z >> L[RT.Within]) == 1]
set(ET(z) for z in one_sm_locs)
multi_sm_locs = locations | filter[lambda z: len(z >> L[RT.Within]) >= 2]
set(ET(z) for z in multi_sm_locs)

##

loc = one_sm_locs[0]
loc | info

##

canmoveto = (loc > L[RT.CanMoveTo]) | first
canmoveto | info

##

canmoveto >> RT.Recipe | info
(canmoveto > RT.Recipe) | info
