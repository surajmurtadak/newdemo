const https = require("https");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const Fname = req.body.firstName;
  const Lname = req.body.lastName;
  const Email = req.body.email;

  const url = "https://us21.api.mailchimp.com/3.0/lists/1d0d9d7d31";

  const subData = {
    members: [
      {
        email_address: Email,
        status: "subscribed",
        merge_fields: {
          FNAME: Fname,
          LNAME: Lname,
        },
      },
    ],
  };

  const subDataStr = JSON.stringify(subData);

  const option = {
    method: "POST",
    auth: "suraj:5fc0ef8d77b6a7b2629a753547217a4d-us21",
  };

  const request = https.request(url, option, (response) => {
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });

  request.write(subDataStr);
  request.end();
});

app.post("/fail", (req, res) => {
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("server run on port 3000");
});

// Audience id :  1d0d9d7d31
// API key     :  5fc0ef8d77b6a7b2629a753547217a4d-us21
