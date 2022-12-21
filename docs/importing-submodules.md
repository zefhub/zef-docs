---
id: importing-submodules
title: Importing Submodules
---

  
When importing parts of the zef module as an external user, extension submodule,  
or core development, there are rules about imports which should be followed. The  
below is a list of import styles possible, in order of external to core development.  
  
An exception to all of the rules below is that any imports **inside of a  
function** can access any other part of the library, so long as that function is  
not called as part of the initialization of the zef module. Stick to relative  
imports where possible.  
  
## As a user of the module  
  
Generally, a user will call:  
  
```py  
from zef import *  
from zef.ops import *  
```  
  
Using extension zef modules is done via  
  
```py  
from zef.gql import *  
```  
  
If they need anything more specific, they can call, e.g.  
  
```py  
from zef.core.fx import _Effect_Class  
```  
  
## As an extension module writer  
  
This is, e.g., development of the `gql` extension submodule.  
  
Always use relative imports. Most features are available in a similar manner to  
an external user.  
  
```py  
from ..core import *  
from ..ops import *  
```  
  
## When developing the `ops` submodule  
  
Always use relative imports. The core operators should be imported from the  
`core.op_names` module.  
  
```py  
from ..core import *  
from ..core.op_names import *  
```  
  
If usage of another ZefOp that is outside of the core ZefOps is required, then  
access this relatively:  
  
```py  
from .privileges import grant  
```  
  
## When implementing a core ZefOp  
  
This means touching anything inside of `zefDB/core/op_implementations/*`. This is  
a special case, where we can still import everything from core:  
  
```py  
from .. import *  
from ..op_names import *  
```  
  
All core things, like `GraphDelta`, `GraphSlice`, `FX`, etc... will be  
available. In addition, all core zefops (i.e. those that appear in `op_names`)  
will be available. However, ops that are later defined in `zefDB/ops` will not  
be available. I recommend that core zefops should only depend on other core  
zefops.  
  
If something more specific is required, use a relative import:  
  
```py  
from ..fx.fx_types import _Effect_Class  
```  
  
## When developing a submodule of core  
  
For example, this could be `graph_delta.py` or anything inside of `fx`.  
  
```py  
from ._core import *  
from .op_names import *  
```  
  
A large part is exposed through `_core`, which includes `ZefRef`, `ET`,  
`Transaction`, etc... and the core ZefOps will be exposed through `op_names`.  
However, you will not have immediate access to other things that would normally  
be found through a `from zef.core import *` call.  
  
If anything else is required, import that specifically, e.g. inside of  
`graph_delta.py`:  
  
```py  
from .zef_functions import func  
```  
  
Note that you **must not break** the dependency ordering, which is currently (look  
at `core/__init__.py` for the latest):  
  
- `internals`  
- `error`  
- `op_structs`  
- `op_names`  
- `zef_functions`  
- `abstract_raes`  
- `graph_delta`  
- `graph_slice`  
- `fx`  
- `serialization`  
  
Hence, `graph_delta.py` is not allowed to import from `fx` at the top-level scope.  
  
  
## When developing core itself  
  
This is really only addressing the submodules:  
  
- `core/_core`  
- `core/internals/...`  
- `core/patching`  
- `core/overrides`  
  
In these submodules, everything should only access the C bindings or each other.