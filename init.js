const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main().then(()=>{
    console.log("connection successful");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let AllChats = [{
    from: "Harshit",
    to: "Prateek",
    msg: "Aur bhai kesa hai?",
    created_At: new Date(),
},
{
    from: "Neha",
    to: "Preeti",
    msg: "Syllabus complete ho gya?",
    created_At: new Date(),
},
{
    from: "Ritesh",
    to: "Prateek",
    msg: "Hello How are you",
    created_At: new Date(),
},
{
    from: "Shams",
    to: "Harshit",
    msg: "Exam kesa raha",
    created_At: new Date(),
},
{
    from: "Ajmal",
    to: "Najmul",
    msg: "Kuch padha tune???",
    created_At: new Date(),
},
];

Chat.insertMany(AllChats);