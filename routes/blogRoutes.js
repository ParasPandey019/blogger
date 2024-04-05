const {Router} = require('express');
const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const multer = require('multer');
const path = require('path');

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueSuffix);
    }
  })
  
const upload = multer({ storage: storage })

router.get('/add-new', (req,res)=>{
    return res.render('addBlog', {
        user: req.user
    })
})

router.post('/', upload.single('coverImageURL'), async (req,res)=>{
  const {title, body} = req.body;
  const blog = await Blog.create({
    body: body,
    title: title,
    createdBy: req.user._id,
    coverImage: `uploads/${req.file.filename}`
  });
  return res.redirect(`/blog/${blog._id}`);
})


module.exports = router;