const express = require("express"); //instance of express
const app = express();

require("dotenv").config(); //loading content of .env file in process.env

const PORT = process.env.PORT || 5000; //accessing the port no.

//adding middlewares recquired
app.use(express.json()); //body parser

const fileupload = require("express-fileupload");
app.use(fileupload({        //middleware for parsing the file from request
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

require("./config/database").dbconnect(); //connecting app with db

//connecting with cloudinary
const cloudinary = require("./config/cloudinary").cloudinaryConnect();

//mounting routes
const upload = require("./routes/FileUpload");
app.use("/api/v1/upload", upload);

//activating the server
app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`);
})