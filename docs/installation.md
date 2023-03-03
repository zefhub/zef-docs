---
id: quick-install-guide
title: Installation
---

  
Before you can use Zef, you’ll need to get it installed. We have an [extensive guide](extensive-install-guide) that covers all corners; this guide will guide you to a minimal installation that’ll work while you walk through the introduction.  
  
## Install Python  
Get the latest version of Python 3 at [https://www.python.org/downloads/](https://www.python.org/downloads/) or with your operating system’s package manager, such as Homebrew for MacOS. Zef only works for Python 3.7 and above.  
  
Type `python` from your shell to verify that you have Python 3 installed. You should see something like  
```console  
Python 3.x.y  
[GCC 4.x] on linux  
Type "help", "copyright", "credits" or "license" for more information.  
>>>  
```  
  
  
## Installing Zef  
There are three options to install Zef:  
1. Installing from official release. This is the best approach for most users. Run `pip install zef` from your shell.  
2. Installing the latest development version. This option is for user who wants the coolest and later feature of Zef. You might encounters bugs or breaking changes to your existing codebase, but reporting them would help the development of Zef!  
3. Installing Zef via a special script that allows you to track the bleeding edge changes to the codebase without recompiling (most of the time). This is an option for developers who are interested to contribute to Zef.  
  
## Dependencies  
  
If you are installing zef from the official release, the only additional dependency requirement to use `zef` is OpenSSL. If you are on  
a linux distribution, this is likely already installed. If you are on Windows, OpenSSL is compiled into the wheel. If you are on MacOS, you can install it with:  
```console  
brew install openssl  
```  
  
Verify your installation by running the following command from shell:  
```bash   
python -c "from zef import DB"`    
```  
  
or from your python repl:  
```python  
from zef import DB  
```  
  
If this runs without error, you have successfully installed Zef!  
  
## Sign up for a free ZefHub account  
:::info  
  
You are still able to work locally without a ZefHub account, however there are myriads of cool things that you can do with one. Check out this page to see the full benefits.  
  
:::  
  
Login to ZefHub by either creating an account in the process, or using an existing account. This can be done via the following commands:  
  
```python  
from zef.ops import *  
login | run  
```  
  
The `login` command is needed only once. Future sessions will use a refresh token generated in the login process. <FutureFeature>Note: your password is _not_  
stored, only the refresh token, which is located at ~/.zef/hub.zefhub.io/credentials by  
default.</FutureFeature>  
  
  
  
## You are good to go!  
You journey with Zef starts here! [Get started](manage-your-data-with-zef-db)! 