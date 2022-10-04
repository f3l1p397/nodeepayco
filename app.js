const express = require("express");
const cors = require("cors");

const app = express();
const port = 1724;

app.use(express.json());
app.use(cors());

let tokenCard = "";
let clienteID = "";

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
  //data card
  var credit_info = {
    "card[number]": "4575623182290326",
    "card[exp_year]": "2025",
    "card[exp_month]": "12",
    "card[cvc]": "123",
  };

  //create token
  epayco.token
    .create(credit_info)
    .then(function (token) {
      console.log("1 -> token");
      tokenCard = token.id;
      createCustomer();
    })
    .catch(function (err) {
      console.log("err: " + err);
    });

  function createCustomer() {
    // data customer
    var customer_info = {
      token_card: tokenCard,
      name: req.body.nombres,
      last_name: req.body.apellidos,
      email: req.body.email,
      default: true,
      //Optional parameters: These parameters are important when validating the credit card transaction
      city: req.body.ciudad,
      address: "",
      phone: req.body.telefono,
      cell_phone: req.body.telefono,
    };

    // create customer
    epayco.customers
      .create(customer_info)
      .then(function (customer) {
        console.log("2 -> customer");
        clienteID = customer.data.customerId;
        createSuscription();
      })
      .catch(function (err) {
        console.log("err: " + err);
      });
  }

  function createSuscription() {
    //data suscription
    var subscription_info = {
      id_plan: req.body.ePlan,
      customer: clienteID,
      token_card: tokenCard,
      doc_type: "CC",
      doc_number: req.body.identificacion,
      //Optional parameter: if these parameter it's not send, system get ePayco dashboard's url_confirmation
      url_confirmation: "https://ejemplo.com/confirmacion",
      method_confirmation: "POST",
    };

    // create suscription
    epayco.subscriptions
      .create(subscription_info)
      .then(function (subscription) {
        console.log("3 -> suscription");
        paySuscription();
      })
      .catch(function (err) {
        console.log("err: " + err);
      });
  }

  function paySuscription() {
    // data pay
    var subscription_pay = {
      id_plan: req.body.ePlan,
      customer: clienteID,
      token_card: tokenCard,
      doc_type: "CC",
      doc_number: req.body.identificacion,
      ip: "201.182.250.134" /*This is the client's IP, it is required */,
      url_response: "http://localhost:3000/confirmation",
      url_confirmation: "http://localhost:3000/confirmation",
      method_confirmation: "GET",
    };

    // pay suscription
    epayco.subscriptions
      .charge(subscription_pay)
      .then(function (subscription) {
        console.log("4 -> pay suscription: ");
        console.log("resume", subscription.data);
        res.send(subscription.data);
      })
      .catch(function (err) {
        console.log("err: " + err);
      });
  }

  // console.log(req.body);
  // res.send("Procesando pago");
});

app.listen(port, () => {
  console.log(`Listening in http://localhost:${port}`);
});
