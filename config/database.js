const mongoose = require("mongoose");

exports.connect = () => {
    // Connecting to the database
    mongoose
        .connect('mongodb+srv://healfy:IOmQTQP26s594lvR@cluster0.xjoz1.mongodb.net/rec?retryWrites=true&w=majority', {
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