const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// app.use(express.static("public"));
app.use(express.static("web"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res)=> {
  // res.sendFile(__dirname+"/signup.html");
  res.sendFile(__dirname+"/web/index.html");
});

app.post("/", (req, res)=> {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.email;
  
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName
        }
    }
  ]
  };

  const jsonData = JSON.stringify(data);

  const listId = "539dd5e718";
  const apiKey = "78e9ab197dddbe5529f8e693a3ee3abc-us19";

  const url = "https://us19.api.mailchimp.com/3.0/lists/"+listId;

  const options = {
    method: "POST",
    auth: "ladehesa:"+apiKey,
  }

  const request = https.request(url, options, (response) => {

    if(response.statusCode === 200) {
      
        res.sendFile(__dirname+"/web/success.html");     
      
    } else {
        res.sendFile(__dirname+"/web/failure.html");     
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res)=> {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, ()=>{
  console.log("The server started on port 3000");
});