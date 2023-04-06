
const express = require('express')
const app = express()
const path = require('path')
const Port = process.env.PORT || 4000
const multer = require('multer')
// const { error } = require('console')
const fs = require('fs')

app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'Images')
    },
    filename: (req, file, callBack) => {
        console.log(file)
        callBack(null, Date.now() + path.extname(file.originalname))
    }
})

// const upload = multer({
//     storage: storage,
// })

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filePath = path.join(__dirname, 'Images', file.originalname);
        if (fs.existsSync(filePath)) {
            const error = new Error('File already exists');
            cb(error);
        } else {
            cb(null, true);
        }   
    }
});


app.get('/', (req, res) => {
    res.render("upload")
})

// app.post("/", upload.single("inputImage"), (req, res) => {
//     if (!req.file) {
//         res.send("No file Chosen")
//     }
//     res.send("Image Uploaded Successfully !")
// })

app.post("/", upload.array("inputImage", 10), (req, res) => {
    if (!req.files) {
        res.send("No files chosen");
    } else {
        res.send(`${req.files.length} images uploaded successfully!`);
    }
});

app.listen(Port, (req, res) => {
    console.log(`Server is running on Port:${Port}`)
})