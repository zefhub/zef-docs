---
title: RFZ - Filegraphs
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Motivation

Allow for:

- Storing files or other pieces of binary data.
- Accesing files by UID or by name.
- Accesing files by HTTP via ZefHub service

## Overview

Files on a graph are created in `ET.File` nodes. Each file graph begins wtih
`filegraph-`.

In the future, a ZefHub service (communication subprotocol) for obtaining a file
"from storage" or putting a file "into storage" could be done through
filegraphs. As graphs are backed by s3, this is equivalent to storing in s3.

The path to a file in a filegraph could be specified in this protocol via
`<filegraph-name>/<filename>` and the rights on the graph itself limit users to
the ability to read/add files.

## Structure on graph

- ET.File
  - `RT.Data` -> `AET.String`: file bytes (endianess??)
  - `RT.Name` -> `AET.String`: filename (for later lookups)
  - `RT.Description` -> `AET.String`
  - `RT.Type` -> `AET.String`: extension or maybe mimetype (mimetype would be more
    useful for serving files from a HTTP connection)
  
  
## Names

As the unique IDs on the filegraph are UIDs, these can be used to lookup a file.
In contrast, it is possible to give multiple files the same filename. This could
be considered to be equivalent to overwriting a file: i.e. if one would move a
file into the place of a second file (identities are different but the
filename has been taken over). However, in the case of the filegraph, the
history of the file name is preserved, and the original file can still be
accessed via UID (it hasn't been deleted).

## Serving files by HTTP

The service running on ZefHub could serve up files which are part of filegraphs
that are specially designated to be `AllowView` to the `everyone` user.
