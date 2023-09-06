//importing the schema from the model and cloudinary
const File = require("../models/File"); 

const cloudinary = require("cloudinary").v2;

//local file upload in server handler
exports.localFileUpload = async (req, res) => {
    try
    {
        //fetching the file from request
        const file = req.files.file;     //here file will be key and value will be th file you want to upload
        if(! file)
        {
            return res.status(400).json({
                success:false,
                message:"Please select the file to upload",
            });
        }

        console.log("File received ", file);

        //creating path in the server to store the file
        const path = __dirname + "/files" + Date.now() + `${file.name.split(".")[1]}`;
        console.log("File path in the server is ", path);

        //moving file to the path
        file.mv(path, (err) => {
            console.log(err);
        });

        //successful response
        res.json({
            success:true,
            message:"Local file uploaded successfully in the server",
        });
    }
    catch(err)
    {
        console.log(err);
        console.log("Uploading local file in server unsuccessful");
    }
}

function isFileTypeSupported(type, supportedType)
{
    return supportedType.includes(type);
}


async function uploadFileToCloudinary(file, folder, quality) //quiality arg to reduce the size of image
{
    const options = {
        folder: folder,
        resource_type: "auto", //recommended practice
    }
    //1st file will store in server tempFIle Path the from there it will move to cloudinary folder then will delete from server 
    console.log("Temp file path is: ", file.tempFilePath);
    if(quality)
    {
        options.quality = quality; //making one more field of quality in options
    }
    //uploading file to cloudinary
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

function isLargeFile(size)
{
    const mbSize = size/(1024*1024); //converting size bytes to mb
    console.log("File size is : ", mbSize);
    return mbSize > 10;
}

//Image upload in cloudinary handler 
exports.imageUpload = async (req, res) => {
    try
    {
        //fetching the data and the file from the request
        const {name, tags, email} = req.body;
        console.log(name, tags, email);
        const file = req.files.imageFile; //here imageFile is key
        if(! file )
        {
            return res.status(400).json({
                success:false,
                message:"Please select the file to upload",
            });
        }

        //validation of uploaded file
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLocaleLowerCase();
        console.log("File type is :", fileType);
        if(! isFileTypeSupported(fileType, supportedTypes))
        {
            return res.status(400).json({
                success:false,
                message:"File type of the file is not supported",
            });
        }

        //when file type is supported, upload it to cloudinary
        console.log("Uploading file to cloudinary");
        const response = await uploadFileToCloudinary(file, "Kushal");
        console.log(response);

        //saving entry of file in database
        const fileData = await File.create({
            name,
            tags,
            email,
            url: response.secure_url, //here cloudinary will generate url from where we cn access that uploaded file
        });
        //successful response
        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image Successfully Uploaded in cloudinary",
        });
    }
    catch(err)
    {
        console.log("Uploading the image in cloudinary unsuccessful");
    }
}

//Video upload in cloudinary handler 
exports.videoUpload = async (req, res) => {
    try
    {
        //fetching the data and the file from the request
        const {name, tags, email} = req.body;
        console.log(name, tags, email);
        const file = req.files.videoFile; //here  videoFile is key
        if(! file )
        {
            return res.status(400).json({
                success:false,
                message:"Please select the file to upload",
            });
        }

        //validation of uploaded video file
        const supportedTypes = ["mp4", "mov"];
        const fileType = file.name.split(".")[1].toLocaleLowerCase();
        console.log("File type is :", fileType);
        if(! isFileTypeSupported(fileType, supportedTypes))
        {
            return res.status(400).json({
                success:false,
                message:"File type of the file is not supported",
            });
        }

        //when file type is supported, upload it to cloudinary
        console.log("Uploading file to cloudinary");
        const response = await uploadFileToCloudinary(file, "Kushal");
        console.log(response);

        //saving entry of file in database
        const fileData = await File.create({
            name,
            tags,
            email,
            url: response.secure_url, //here cloudinary will generate url from where we cn access that uploaded file
        });
        //successful response
        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "Video Successfully Uploaded in cloudinary",
        });
    }
    catch(err)
    {
        console.log("Uploading the video in cloudinary unsuccessful");
    }
}

//imageSizeReducer handler
exports.imageSizeReducer = async (req, res) => {
    try 
    {
        //data fetch from request
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        //Validation of file uploaded
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log("File Type is:", fileType);

        if (!isFileTypeSupported(fileType, supportedTypes)) 
        {
            return res.status(400).json({
                success: false,
                message: "File format not supported",
            });
        }

        //file format and size are supported
        console.log("Uploading to Cloudinary");

        //compressing using quality property of options objects
        const response = await uploadFileToCloudinary(file, "Kushal", 90);
        console.log(response);

        // creating entry of file in DB
        const fileData = await File.create({
            name,
            tags,
            email,
            url: response.secure_url,
        });

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "reduced Image Successfully Uploaded to cloudinary",
        });
    } 
    catch (error) 
    {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Cannot upload image to cloudinary",
        });
    }
};