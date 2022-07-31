const express = require("express");
const cors = require("cors");

const app = express();
const port = 1724;

app.use(express.json());
app.use(cors());

// epyco
var epayco = require("epayco-sdk-node")({
  apiKey: "0a895c39bd4d26d5ef91306494780eb1",
  privateKey: "63e7eb15f132fcb2953869fde1148d0e",
  lang: "ES",
  test: true,
});
// endepayco

app.get("/planes", (req, res) => {
  epayco.plans
    .list()
    .then(function (plans) {
      // console.log(plans);
      res.send(plans.data);
    })
    .catch(function (err) {
      console.log("err: " + err);
    });
});

app.post("/planes", (req, res) => {
  console.log(req.body);
  res.send("Me hicieron un pooooost");
});

app.listen(port, () => {
  console.log(`Listening in http://localhost:${port}`);
});
