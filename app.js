let express      = require("express"),
app              = express(),
bodyParser       = require("body-parser"),
mongoose         = require("mongoose"),
expressSanitizer = require("express-sanitizer"),
methodOverride   = require("method-override");


app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
// /app.use(expressSanitizer)
app.use(methodOverride("_method"));

mongoose.Promise = global.Promise;

// Connect to db
mongoose.connect("mongodb://127.0.0.1:27017/restful_blog_app", {
    useUnifiedTopology: true
}).then(() => {
    console.log("Succesful connection to the db");
}).catch(err => {
    console.log("Could not connect to db. Exiting...", err);
    process.exit();
});


let blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

let Blog = mongoose.model("Blog", blogSchema);

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

app.listen(3000, () => {
    console.log("Listening on 3000");
});