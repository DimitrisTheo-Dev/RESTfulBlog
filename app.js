let express      = require("express"),
app              = express(),
bodyParser       = require("body-parser"),
mongoose         = require("mongoose"),
expressSanitizer = require("express-sanitizer"),
methodOverride   = require("method-override");
    
mongoose.connect("mongodb://127.0.0.1:27017/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
// /app.use(expressSanitizer)
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTful ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});


//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
       if(err){
           console.log("ERROR: " + err)
       }else{
            res.render ("index", {blogs: blogs});
       } 
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
   res.render("new"); 
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
   Blog.create(req.body.blog, function(err, newBlog){
      if(err){
          console.log("new");
      }else{
          res.redirect("/blogs");
      }     
   });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
   //res.send("SHOW PAGE");
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
          res.redirect("/blogs");
      }else{
          res.render("show",{blog: foundBlog});
      }
   });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("edit", {blog: foundBlog});
       }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE

app.delete("/blogs/:id", function(req, res){
   Blog.findByIdAndDelete(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs");
       }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started!"); 
});