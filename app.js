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
      console.log("token");
      console.log(token);
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
      city: "Bogota",
      address: "Cr 4 # 55 36",
      phone: "3123456765",
      cell_phone: "3010750001",
    };

    // create customer
    epayco.customers
      .create(customer_info)
      .then(function (customer) {
        console.log("customer");
        console.log(customer);
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
      id_plan: "Plan_de_Plata",
      customer: clienteID,
      token_card: tokenCard,
      doc_type: "CC",
      doc_number: "5234567",
      //Optional parameter: if these parameter it's not send, system get ePayco dashboard's url_confirmation
      url_confirmation: "https://ejemplo.com/confirmacion",
      method_confirmation: "POST",
    };

    // create suscription
    epayco.subscriptions
      .create(subscription_info)
      .then(function (subscription) {
        console.log("suscription");
        console.log(subscription);
        paySuscription();
      })
      .catch(function (err) {
        console.log("err: " + err);
      });
  }

  function paySuscription() {
    // data pay
    var subscription_pay = {
      id_plan: "Plan_de_Plata",
      customer: clienteID,
      token_card: tokenCard,
      doc_type: "CC",
      doc_number: "5234567",
      ip: "201.182.250.134" /*This is the client's IP, it is required */,
    };

    // pay suscription
    epayco.subscriptions
      .charge(subscription_pay)
      .then(function (subscription) {
        console.log("pay suscription");
        console.log(subscription);
      })
      .catch(function (err) {
        console.log("err: " + err);
      });
  }

  // console.log(req.body);
  res.send("Me realizando pago");
});

app.listen(port, () => {
  console.log(`Listening in http://localhost:${port}`);
});
