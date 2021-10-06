const mongoose = require("mongoose");

exports.connect = () => {
    // Connecting to the database
    mongoose
        .connect(`${process.env.DB_CONNECTION}`, {
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Successfully connected to database");
        })
        .catch((error) => {
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });
};