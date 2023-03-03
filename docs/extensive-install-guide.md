---
id: extensive-install-guide
title: Extensive Install Guide
---

  
## Install from PyPI  
Simply run:  
```bash  
pip install zef  
```  
You may have to replace `pip` with `pip3` in some distributions.  
  
Native Windows installs are currently not supported, although it is possible to install Zef in a WSL (Windows Subsystem for Linux) environment. We are aiming to include native Windows support soon.  
  
## Install from Latest Development Version  
### Requirements  
Compiling from source requires the following system libraries:  
-   OpenSSL and headers  
  
and the following build-time python libraries:  
-   pybind11  
-   cogapp  
-   pyfunctional  
  
If you want to compile from the latest of a branch from the GitHub repo, then you have two choices:  
  
1.  Use a system-installed libzef. This is currently not possible.  
2.  Use a bundled lizef. In order to do this you should make an sdist package yourself. This is because of the way that pip and friends find files to copy. Hence:  
  
```bash  
git clone https://github.com/zefhub/zef  
cd zef/python  
python setup.py sdist  
pip install dist/zef-<version>.tar.gz  
```  
  
## For Developers  
A convenience script exists in the repo root:  
`bash compile_for_local_dev.sh`  
  
which compiles both libzef and the python bindings, along with including a symlink to the library in the source repo. Adding the `<repo_root>/python` path to `PYTHONPATH` will then allow `import zef` to find the package.  
  
You may need to manually include all of the python requirements for Zef by running:  
```bash  
pip install -r python/requirements.txt  
```  
  
### Possible Errors when Compiling from source  
```console  
CMake Error: CMake was unable to find a build program corresponding to "Unix Makefiles".  CMAKE_MAKE_PROGRAM is not set.  You probably need to select a different build tool.  
CMake Error: CMAKE_C_COMPILER not set, after EnableLanguage  
CMake Error: CMAKE_CXX_COMPILER not set, after EnableLanguage  
-- Configuring incomplete, errors occurred!  
```  
#### Solution  
`sudo apt install build-essential`  
  
---  
  
```console  
-- The C compiler identification is GNU 11.3.0  
-- The CXX compiler identification is GNU 11.3.0  
-- Detecting C compiler ABI info  
-- Detecting C compiler ABI info - done  
-- Check for working C compiler: /usr/bin/cc - skipped  
-- Detecting C compile features  
-- Detecting C compile features - done  
-- Detecting CXX compiler ABI info  
-- Detecting CXX compiler ABI info - done  
-- Check for working CXX compiler: /usr/bin/c++ - skipped  
-- Detecting CXX compile features  
-- Detecting CXX compile features - done  
CMake Error at /home/js-work/code/venv/lib/python3.11/site-packages/cmake/data/share/cmake-3.25/Modules/FindPackageHandleStandardArgs.cmake:230 (message):  
  Could NOT find Python3 (missing: Python3_INCLUDE_DIRS Development.Module)  
  (found version "3.11.2")  
Call Stack (most recent call first):  
  /home/js-work/code/venv/lib/python3.11/site-packages/cmake/data/share/cmake-3.25/Modules/FindPackageHandleStandardArgs.cmake:600 (_FPHSA_FAILURE_MESSAGE)  
  /home/js-work/code/venv/lib/python3.11/site-packages/cmake/data/share/cmake-3.25/Modules/FindPython/Support.cmake:3245 (find_package_handle_standard_args)  
  /home/js-work/code/venv/lib/python3.11/site-packages/cmake/data/share/cmake-3.25/Modules/FindPython3.cmake:490 (include)  
  CMakeLists.txt:23 (find_package)  
```  
### Solution  
`sudo apt install python3.{x}-dev`  
  
---  
  
```console  
CMake Error at /home/js-work/code/zef/core/external/external.cmake:202 (message):  
  Couldn't find openssl via cmake, pkg-config or find_library  
Call Stack (most recent call first):  
  /home/js-work/code/zef/core/CMakeLists.txt:55 (include)  
```  
### Solution  
`sudo apt-get install libssl-dev`