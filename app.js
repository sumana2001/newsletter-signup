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
    const url="https://us7.api.mailchimp.com/3.0/lists/4f02526b98"
    const options={
        method: "POST",
        auth: "sumana_09:e8f7d74d670d407d2913d97907645225-us7"
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
    //request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(3000,function(){
    console.log("Server started at port 3000");
})

//e8f7d74d670d407d2913d97907645225-us7 APIKEY
//4f02526b98 LIST ID