// Connect to your MongoDB server by providing the connection string.
const connectionStr = "mongodb://localhost:27017/";
const conn = new Mongo(connectionStr);

// Use the admin database for user creation.
const adminDb = conn.getDB("admin");

// Create the sysadmin user in the admin database.
adminDb.createUser({
  user: "sysadmin", // Enclose in quotes as it's a string
  pwd: "12345", // Enclose in quotes as it's a string
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
});

// Define the new database name and user credentials.
const newDatabaseName = "goalsetter";
const newUsername = "goaluser";
const newPassword = "12345";

// Create the new database.
conn.getDB(newDatabaseName).runCommand({ create: newDatabaseName });

// Switch to the new database.
const newDb = conn.getDB(newDatabaseName);

db.getCollection("myCollection").insertOne({ name:"goals" });

// Create a new user with specific roles and privileges in the new database.
newDb.createUser({
  user: "goaluser",
  pwd: "12345",
  roles: [
    { role:"readWrite", db:"goalsetter" },
    { role:"dbAdmin", db:"goalsetter" }
  ]
}
);

