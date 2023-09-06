const mongoose = require("mongoose"); //instance of mongoose
require("dotenv").config();

exports.dbconnect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log(`DB connected successfullt at port ${process.env.PORT}`))
    .catch( (error) => {
        console.log("Error while connecting with DB");
        console.error(error);
        process.exit(1);
    });
};