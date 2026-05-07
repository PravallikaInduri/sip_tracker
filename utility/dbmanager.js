const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("C:/Users/saran/sip_database", (error) => {
    if(error){
        console.log("Error connecting to DB:", error.message);
    }
    else{
        console.log("Db connected successfully"); 
    }
});

module.exports = db;