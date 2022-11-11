
const models=require("./userdata.js");
const User_model=models[0];




const express=require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

//MiddleWare
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


// Address
var templates = __dirname+"/templates";


//Local DataBase Start
var login = false;
var CurrentUser;
//local DataBase End

//login page handling start here

var incorrect_crediential_flag = false;
app.get("/login",(req,res)=>{
    if(login==true){
        res.redirect("/");
    }else{
    res.render(templates+"/login.ejs",{succesful_signup_flag,incorrect_crediential_flag});
    succesful_signup_flag=false;
    incorrect_crediential_flag=false;
    }
});
app.post("/login",(req,res)=>{
    User_model.find({email:req.body.email},{password:req.body.password},(err,data)=>{
        console.log("Posted data match to---> ");
        console.log(data);
        if(data.length==1){
            User_model.find({id:data[0].id},(err,data)=>{
                CurrentUser=data[0];
                login=true;
                res.redirect("/");
            });
        }else if(data.length>1){
            res.send("Multiple user with same email found, inform developer to make hard reset :(");
        }
        else{
            incorrect_crediential_flag=true;
            res.redirect("/login");
        }
    })
});
//login page handling finish here


//Signup page handling start here
let invalid_signup_flag;
let succesful_signup_flag = false;
app.get("/signup",(req,res)=>{
    if(login){
        res.redirect("/");
    }else{
    res.render(templates+"/signup.ejs",{invalid_signup_flag});
    }
});
app.post("/signup",(req,res)=>{
    User_model.find({email:req.body.email},{number:req.body.number},{name:req.body.name},(err,data)=>{
        if(data.length>0){
            invalid_signup_flag = true;
            res.redirect("/signup");
        }else{
            const NewUser = new User_model({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                number:req.body.number,
                detail:req.body.detail
            });
            NewUser.save((err,doc)=>{
                if(err){
                    console.log(err);
                    invalid_signup_flag = true;
                    res.send("<h1 style='color:red;'>Have a look in the console, somthing gone wrong :(<h1>");
                }else{
                    succesful_signup_flag=true;
                    res.redirect("/login");
                }
            });
        }
    })
});
//Signup page handling finish here


app.get("/",(req,res)=>{
    if(login){
        console.log(CurrentUser);
        if(CurrentUser==null){
            res.redirect("/login")
        }else{
            res.render(templates+"/home.ejs",{CurrentUser});
        }
    }else{
        return res.redirect("/login");
    }
});
app.post("/",(req,res)=>{
    login=false;
    CurrentUser=null;
    res.redirect("/login");
});
app.get("/profile",(req,res)=>{
    if(login){
        res.render(templates+"/profile.ejs",{CurrentUser});
    }else{
        return res.redirect("/");
    }
    
});

app.listen(3000,()=>{
    console.log("Server start at 3000 port");
});