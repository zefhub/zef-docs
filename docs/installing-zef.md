---
id: installing-zef
title: Installing Zef
---

  
Zef is available from the PyPI repository as the package `zef`. This includes  
all of the submodules.  
  
It is recommended to use the binary wheels available on PyPI, which are compiled  
for the following platform/version combinations:  
  
- CPython 3.10 and manylinux/MacOS/Windows.  
- CPython 3.9 and manylinux/MacOS.  
- CPython 3.8 and manylinux.  
- CPython 3.7 and manylinux/Windows.  
  
If your system fits into the above, then this is as easy as running:  
  
```  
pip3 install zef  
```  
  
Replace `pip3` by the appropriate executable for your python installation or  
virtual environment.  
  
The only external dependency requirement to use `zef` is OpenSSL. If you are on  
a linux distribution, this is likely already installed. If you are on Windows,  
OpenSSL is compiled into the wheel. If you are on MacOS, you  
can install it with:  
  
```  
brew install openssl  
```  
  
## First steps after installing  
  
After the package is installed, you should first login to ZefHub, either  
creating an account in the process, or using an existing account. This can  
be done by following the browser prompt opened<FutureFeature>  
If the login command shows "Opened auth browser session at ..." but does not  
open a browser automatically, you can click on the given link to open it  
manually.</FutureFeature> via the following commands:  
  
```py  
from zef.ops import *  
login | run  
```  
  
The `login` command is needed only once. Future sessions will use a refresh  
token generated in the login process.<FutureFeature>Note: your password is _not_  
stored, only the refresh token, which is located at ~/.zef/hub.zefhub.io/credentials by  
default.</FutureFeature>  
  
:::note Why should I get a ZefHub account?  
Our mission with Zef is to give developers the best experience possible when working with graph data.  
ZefHub provides a big part of that experience by making distributed, real-time infrastructure hassle-free.  
With a free ZefHub account, you can persist, sync, and distribute your Zef graphs in real-time.  
  
You can think of ZefHub as the graph of all graphs, the mother of all graphs if you will.  
As the primary coordinator, you'll soon be able to merge and interconnect your graphs with other public and private graphs.  
We believe the benefits of being part of ZefHub (and getting free persistence and storage) are compelling and even more so for the earliest of users.  
  
If you're worried that there's catch - there is no catch.  
We will always have a free ZefHub account tier available and Zef is open source, which means you will always have control over your graphs.  
  
:::  
  
## Testing your installation  
  
If you have logged in and run  
  
```py  
import zef  
zef.zearch("northwind")  
```  
  
then you should list a list containing at least the entry `blog/northwind`. This  
is a sample graph you can load with `g = zef.Graph("blog/northwind")`. See  
[quick-start](quick-start) and the rest of the docs to get started.  
  
If you run into any issues or have any questions, ping us on [zef.chat](https://zef.chat)!  
  
## Other platforms / Compiling from source  
  
If your system is not listed above, then you can try compiling from source, by  
either grabbing the python `sdist` package (this may happen automatically for  
you with `pip3 install zef`) or pulling the latest from the GitHub repository.  
There are a few more dependencies required when installing from source -- please  
see the `INSTALL.md` file in our [GitHub repo](https://github.com/zefhub/zef).  
  
For Windows, there is a native wheel available, but you can also use the Linux  
wheel inside of WSL (Windows Subsystem for Linux).  
