# MongoDB

### About Mongo

MongoDB is a NOSQL database which had the capability of storing massive chunks of data in unstructured format.

## Installation of Mongo DB :

To install Mongo DB on Ubuntu: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

*Installation of community edition of Mongo DB 7.0 had some issues to start normally, when installed in ubuntu 22.04 without dist-upgrading the base OS.*

### To install the original community edition of mongo DB from the official doccumentation.

```
sudo apt install -y curl gnupg

# Import the mongoDB public GPG key for the repository:

sudo curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Create a list file for the mongo DB in apt sources.list with link pointing to the official Mongo DB repo :

sudo echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update the apt index page:

sudo apt update

# Install the mongo DB:

sudo apt install -y mongodb-org

# Start and Enable the mongod service

sudo systemctl start mongod
sudo systemctl enable mongod

```

### To restrict the mongo DB and it's components from auto upgrading on perferming the apt upgrade commands, execute

```
apt-mark hold mongodb-org 
apt-mark hold mongodb-org-database 
apt-mark hold mongodb-org-server 
apt-mark hold mongodb-org-mongosh 
apt-mark hold mongodb-org-mongos 
apt-mark hold mongodb-org-tools

```

The installation package itself creates an init service "mongod" for the mongo DB for systemctl.

If mongo DB is running on the localhost we can directly connect to the database by running `mongosh` in the command line. mongosh refers to 'mongo shell'.

In order to connect to the mongo DB from a remote host, the options to be used with the mongosh are:

 `--port 27017` `--dbpath /var/lib/mongod` 

 ```
 mongosh --auth --port 27017 --dbpath /var/lib/mongo --host

 ```

### Important Paths for mongo DB in ubuntu :

`/var/lib/mongodb` - Data Directory of mongo DB
`/var/log/mongodb` - Logs directory for mongo DB
`/etc/mongod.conf` - Configuration file for mongo DB

### Protect the DB from being publicly accessible :

  In Mongo DB, the DB with the title admin holds all the administration and sensitive authorization and authentication info such as databases, permissions, users, their privileges and roles...

 So, create a user in that database for creating a system admin role for maintaining the mongoDB. Admin user is like a sudo user in ubuntu and he will be able to access any section of the DB. To switch to the "admin" DB execute `use admin;` and create a user by executing the following query:

 ```
 db.createUser(
  {
    user:"adminUser",
    pwd:passwordPrompt(),
    roles:[{role:"userAdminAnyDatabase",db:"admin"},"readWriteAnyDatabase"]
  } 
 )
 ```
 In the above stated query,
        `adminUser` - The custom username for the administrator
        `passwordPrompt()` - Prompts for password instead of directly pasting it in the bare human readble text format.
        `admin` - under db in the roles line indicates the database `admin`.
        `userAdminAnyDatabase` - a role which is available by default

 Then, stop the mongo DB through running the query, `db.adminCommand({shutdown:1})`

 Now, edit the /etc/mongod.conf file and make an entry by uncommenting the `security` section in the file viz., `authorization:enabled` by giving two spaces under `security:`

 Now, restart the mongo by logging in via :
 `mongosh --port 27017 --authenticationDatabase "admin" -u "adminUser" -p`

 This, prompts for the password to login to the mongo shell (mongosh).

 We shouldn't use these credentials every where as it has admin privileges and have viable potential to lead us towards any unprecedented incidents. So, We have to create an application user for our application with read Write access to the application DB alone. Any no. of users can be created by executing the query as follows: 

 ```
 
    db.createUser(
...    {
...      user:"appUser",
...      pwd:passwordPrompt(),
...      roles:[{role:"readWrite",db:"application"},
...             {role:"read",db:"additional"}]
...    }
... )

 ```
 The above query creates the user with username `appUser` with two roles attached i.e., one with read and write permissions on `application` database while the other grants read permissions to `additional` database.

### Basic Queries:
`use goalsetter;` - creates a new database goalsetter and switches to it.
`show dbs;` - Displays the list of all the databases
` db.goals.insertOne({name:"goals"})` - Creates a collection named `goals` in the current db.
`show collections` - Displays the list of all the collections.

URI for mongoDB, when running on a local machine : mongodb://goaluser:12345@localhost:27017/goalsetter

the above URI is from the format : mongodb://username:password@localhost:27017/db_name

To search for the data in a collection in the db, login to the db and run the query as follows:
`db.<collection>.find()`

This command prints all the data written to that particular collection of the DB.

For example, to fetch the contents of the collection 'goals' in the db 'goalsetter',

First login to the mongo application in the db server using proper auth info viz.,
```
mongosh --authenticationDatabase "<db_name>" -u "<username>" -p
```
In the above command, the option "authenticationDatabase" refers to the DB to which you are trying to connect and the username is your name.

Now, it will take you to mongo shell, even if you have no privileges. But, user will be able to execute queries only if he is authorized to perform the intended action of the query.