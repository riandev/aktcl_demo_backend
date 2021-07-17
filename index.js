const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ObjectID = require("mongodb").ObjectID;
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 5001;

const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://127.0.0.1:27017/aktcl_eas";
const uri = "mongodb+srv://aktcl:01939773554op5t@cluster0.9akoo.mongodb.net/aktcl_eas?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const userCollection = client.db("aktcl_eas").collection("users");
  const leadsCollection = client.db("aktcl_eas").collection("leads");
  console.log("user Connection");
  app.get("/agent", (req, res) => {
    const email = req.query.email;
    console.log(email);
    userCollection.find({ email: email }).toArray((err, agents) => {
      console.log(agents[0]);
      res.send(agents[0]);
    });
  });
  app.get("/dMatched/:Consumer_No", (req, res) => {
    const for_d = "d";
    leadsCollection.find({ for_d: for_d }).toArray((err, d) => {
      const Consumer_No=req.params.Consumer_No;
      const dNumber=d.find((dOut) => dOut.Consumer_No===Consumer_No)
      console.log(dNumber);
      res.send(dNumber);
    });
  });
  app.patch("/answers/:id", (req, res) => {
    const answers = req.body;
    console.log(answers);
    const id = ObjectID(req.params.id);
    leadsCollection
      .updateOne(
        { _id: id },
        {
          $set: {
            answer1: answers.ans1,
            answer2: answers.ans2,
            answer3: answers.ans3,
            answer4: answers.ans4,
            answer5: answers.ans5,
            answer6: answers.ans6,
            answer7: answers.ans7,
            answer8: answers.ans8,
            answer9: answers.ans9,
            answer10: answers.ans10,
            answer11: answers.ans11,
            agentID:answers.agentID
          },
        }
      )
      .then((result) => {
        console.log(result);
      });
  });
  app.get("/reports", (req, res) => {
    leadsCollection.find({}).toArray((err, reports) => {
      res.send(reports);
    });
  });
  app.get("/qc/:number", (req, res) => {
    const number = req.params.number;
    leadsCollection.find({ Consumer_No: number }).toArray((err, qcs) => {
      console.log(qcs);
      res.send(qcs);
    });
  });
  app.get("/update/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    leadsCollection
      .find({ _id: ObjectID(req.params.id) })
      .toArray((err, update) => {
        console.log(update);
        res.send(update);
      });
  });
  app.delete('/deleteAll', (req, res) => {
    leadsCollection.deleteMany({})
    .then(result=>{
      console.log(result);
      res.send(result.deletedCount>0);
    })
  })
  app.patch("/finalUpdate/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    const update = req.body;
    console.log(id);
    leadsCollection
      .updateOne(
        { _id: id },
        {
          $set: {
            answer1: update.answer1,
            answer2: update.answer2,
            answer3: update.answer3,
            answer4: update.answer4,
            answer5: update.answer5,
            answer6: update.answer6,
            answer7: update.answer7,
            answer8: update.answer8,
            answer9: update.answer9,
            answer10: update.answer10,
            answer11: update.answer11,
          },
        }
      )
      .then((result) => {
        console.log(result);
        res.send(result.modifiedCount > 0);
      });
  });
});

app.get("/",(req,res)=>{
res.sendFile(__dirname+"/build/index.html")
})

app.listen(process.env.PORT || port);
