const {Router} = require('express');
const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const Comment = require("../models/commentModel");
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

router.get('/:id',async (req,res) =>{
  const blog = await Blog.findById(req.params.id).populate('createdBy');
  const comments = await Comment.find({blogId: req.params.id}).populate('createdBy');
  return res.render('blog', {
    user: req.user,
    blog: blog,
    comments: comments
  })
})

router.post('./comment/:id'), async (req,res)=>{
  const comment = await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id
  });

  return res.redirect(`/blog/${req.params.blogId}`);
}




module.exports = router;