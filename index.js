const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

main().then(()=>{
    console.log("connection successful");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

app.listen(8080, ()=>{
    console.log("App is listening on port 8080");
})

// Root Route
app.get('/',(req,res)=>{
    res.send("root is working");
});

// Display Route
app.get('/chats',async (req, res)=>{
    let chats = await Chat.find();
    res.render("index.ejs", {chats});
});

// New Route
app.get('/chats/new', (req, res)=>{
res.render("new.ejs");
});

app.post('/chats', (req,res)=>{
    let {from, msg, to} = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
created_At: new Date(),
    })
    newChat.save().then((res)=>{
        console.log("Chat was Saved")
    }).catch((err)=>{
        console.log(err);
    });
    res.redirect("/chats");
});

// Edit Route
app.get('/chats/:id/edit', async (req, res)=>{
    let {id}= req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", {chat});
});

app.put('/chats/:id', async (req, res)=>{
    let {id}= req.params;
    let {newmsg} = req.body;
    let newChat = await Chat.findByIdAndUpdate(id, {msg: newmsg}, {runValidators: true, new: true});
    console.log(newChat);
    res.redirect("/chats");
});

// Destroy Route
app.delete('/chats/:id', async (req, res)=>{
    let {id}= req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
});