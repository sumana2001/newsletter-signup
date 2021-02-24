const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const app=express();

app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.use(bodyParser.urlencoded({extended:true}));

app.post("/",function(req,res){
    const firstName=req.body.fName;
    const lastName=req.body.lName;
    const email=req.body.email;
    const data={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData=JSON.stringify(data);
    const url="https://us7.api.mailchimp.com/3.0/lists/ENTER_YOUR_LIST_ID_HERE"
    const options={
        method: "POST",
        auth: "ENTER_YOUR_USERNAME_HERE:ENTER_YOUR_API_KEY_HERE"
    }
    const request=https.request(url,options,function(response){
        response.on("data",function(data){
            if(response.statusCode==200){
                res.sendFile(__dirname+"/success.html");
            }
            else{
                res.sendFile(__dirname+"/failure.html");
            }
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server started");
})
