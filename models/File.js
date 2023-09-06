const mongoose = require("mongoose"); //for making schema
const nodemailer = require("nodemailer"); //for making post middleware for sending mail

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true,
    },
    tags:{
        type:String,
    },
    email:{
        type:String,
    }
});

//post middleware for sending mail (should always be written before const File = mongoose.model("File", fileSchema);)
fileSchema.post("save", async function(doc){  //doc is storing the entry of the database
    try
    {
        console.log("Doc is :", doc);
        //creating transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            },
        })
        //sending email
        const info = await transporter.sendMail({
            from:`Kushal`,
            to:doc.email,
            subject: "File uploaded to cloudinary",
            html:`<h3>File uploaded successfully to cloudnary</h3>`
        });
        console.log("Info is : ",info);
    }
    catch(err)
    {
        console.log(err);
    }
})


const File = mongoose.model("File", fileSchema);
module.exports = File;