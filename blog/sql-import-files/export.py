import sys
import os
from subprocess import check_output

from zef import *
from zef.ops import *

assert len(sys.argv) == 2, "Need one argument: the .sql file to import"

input_filename = sys.argv[1]
assert input_filename.endswith(".sql"), "Can only import .sql files"

temp_db_filename = "temp.db"
assert not os.path.exists(temp_db_filename), f"Need to write to file {temp_db_filename!r}, so remove this first"

print(f"Importing from {input_filename!r} to {temp_db_filename!r}")
with open(input_filename, "rb") as file:
    sql_cmds = file.read()
# sql_cmds.decode("latin").encode("utf-8")
check_output(["sqlite3", temp_db_filename], input=sql_cmds)

# Get all table names
sql_cmds = b"""SELECT name FROM sqlite_schema 
WHERE type = 'table' 
AND name NOT LIKE 'sqlite_%';"""

tables = check_output(["sqlite3", temp_db_filename], input=sql_cmds)
tables = tables.decode()
tables = tables | split['\n'] | filter[length | greater_than[0]] | collect

print("Found these tables in SQL DB: ", tables)

from charset_normalizer import detect

for table in tables:
    csv_filename = to_snake_case(table) + ".csv"
    print(f"Saving SQL data for table {table} to file {csv_filename}")
    csv_data = check_output(["sqlite3", temp_db_filename, "-header", "-csv", f"select * from '{table}'"])

    charset = detect(csv_data)
    csv_data = csv_data.decode(charset["encoding"]).encode()

    with open(csv_filename, "wb") as file:
        file.write(csv_data)

os.unlink(temp_db_filename)