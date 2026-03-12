const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("UEI Backend Running 🚀");
});

app.post("/login",(req,res)=>{

const {username,password} = req.body

if(username === "student" && password === "1234"){

res.json({message:"Login Successful"})

}else{

res.json({message:"Invalid Login"})

}

})

app.listen(5000,()=>{
console.log("Server running on http://localhost:5000")
})