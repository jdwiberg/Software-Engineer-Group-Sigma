## SQLTools setup
 - Allows for database access within VScode

### Install
1. Go to VScode extensions (Ctrl+Shift+X)
2. Select SQLTools (the one with the yellow cylindar icon)
3. Install

### Setup
1. Click Ctrl+Shift+P and type "SQLTools: Add New Connection" into search bar
2. Select MySQL
3. Type in connection name - you can name it whatever you want
4. Enter DB endpoint "shopcompdatabase.cof0swi2myzq.us-east-1.rds.amazonaws.com" as the Server Address
5. Enter "shopcomp" as the Database
6. Enter "admin" as the Username
7. Select "ask on connect" as the password mode
8. Keep all other fields as default
9. Click save connection and enter "groupsigma69!" as the password

### Accessing database
1. Open up SQLCommands.sql or any SQL file
2. Enter desired SQL command and press "run on active connection  
   - This will actively run all sql commands in the file on the database
3. Sample SQL commands are in UsefulCommands.txt  
   - Use SHOW or SELECT to retrieve data, do not use INSERT unless it is necessary to input data