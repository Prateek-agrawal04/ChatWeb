const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError= require("./ExpressError");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

main().then(()=>{
    console.log("connection successful");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

app.listen(8080, ()=>{
    console.log("App is listening on port 8080");
})

// Root Route
app.get('/',(req,res)=>{
    res.send("root is working");
});

function asyncWrap(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch((err)=> next(err));
    }
}

// Display Route
app.get('/chats',asyncWrap(async (req, res, next)=>{
    let chats = await Chat.find();
    res.render("index.ejs", {chats});
}));

// New Route
app.get('/chats/new', (req, res)=>{
res.render("new.ejs");
});

// Show Route
app.get("/chats/:id", asyncWrap(async (req, res, next)=>{
        let {id}= req.params;
        let chat= await Chat.findById(id);
        if(!chat){
            next(new ExpressError(404, "Chat not Found!!"));
    }
    res.render("edit.ejs", {chat});
}));


app.post('/chats', async (req,res, next)=>{
    try{
        let {from, msg, to} = req.body;
        let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_At: new Date(),
    })
    await newChat.save();
    res.redirect("/chats");
    } catch(err){
        next(err);
    }
});

// Edit Route
app.get('/chats/:id/edit', async (req, res)=>{
    try{
        let {id}= req.params;
        let chat = await Chat.findById(id);
        res.render("edit.ejs", {chat});
    } catch(err){
        next(err);
    }
    
});

app.put('/chats/:id', async (req, res)=>{
    try{
    let {id}= req.params;
    let {newmsg} = req.body;
    let newChat = await Chat.findByIdAndUpdate(id, {msg: newmsg}, {runValidators: true, new: true});
    console.log(newChat);
    res.redirect("/chats");
    } catch(err){
        next(err);
    }
});

// Destroy Route
app.delete('/chats/:id', async (req, res)=>{
    try{
    let {id}= req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
    } catch(err){
        next(err);
    }
});

const handleValidationError= (err)=>{
    console.log("This was a Validation Error. please follow rules!!");
    console.dir(err);
    return err;
}

app.use((err, req, res, next)=>{
    console.log(err.name);
    if(err.name=== "ValidationError"){
        err= handleValidationError(err);
    }
    next(err);
})

// error Handling Middleware
app.use((err, req, res, next)=>{
    let {status= 500, message= "Some Error Occured"}= err;
    res.status(status).send(message);
});