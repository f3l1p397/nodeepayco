var epayco = require("epayco-sdk-node")({
  apiKey: "0a895c39bd4d26d5ef91306494780eb1",
  privateKey: "63e7eb15f132fcb2953869fde1148d0e",
  lang: "ES",
  test: true,
});

// ----------------LIST PLANES----------------
// epayco.plans
//   .list()
//   .then(function (plans) {
//     console.log(plans);
//   })
//   .catch(function (err) {
//     console.log("err: " + err);
//   });

// ----------------TOKEN CARD----------------
// var credit_info = {
//   "card[number]": "4575623182290326",
//   "card[exp_year]": "2025",
//   "card[exp_month]": "12",
//   "card[cvc]": "123",
// };
// epayco.token
//   .create(credit_info)
//   .then(function (token) {
//     console.log(token);
//   })
//   .catch(function (err) {
//     console.log("err: " + err);
//   });

// ----------------CREATE CUSTOMER----------------
// var customer_info = {
//   token_card: "2e4369b69c26b00af026615",
//   name: "Joe Mari",
//   last_name: "Doely",
//   email: "joely@payco.co",
//   default: true,
//   //Optional parameters: These parameters are important when validating the credit card transaction
//   city: "Bogota",
//   address: "Cr 4 # 55 36",
//   phone: "3123456765",
//   cell_phone: "3010750001",
// };
// epayco.customers
//   .create(customer_info)
//   .then(function (customer) {
//     console.log(customer);
//   })
//   .catch(function (err) {
//     console.log("err: " + err);
//   });

// {
//   status: true,
//   success: true,
//   type: 'Create Customer',
//   data: {
//     status: 'exitoso',
//     description: 'El cliente fue creado exitosamente con el id: 2e437d90f94ca1b5349b042',
//     customerId: '2e437d90f94ca1b5349b042',
//     email: 'joely@payco.co',
//     name: 'Joe Mari'
//   },
//   object: 'customer'
// }

// ----------------CREATE SUSCRIPTION----------------
// var subscription_info = {
//   id_plan: "Plan_de_Plata",
//   customer: "2e437d90f94ca1b5349b042",
//   token_card: "2e4369b69c26b00af026615",
//   doc_type: "CC",
//   doc_number: "5234567",
//   //Optional parameter: if these parameter it's not send, system get ePayco dashboard's url_confirmation
//   url_confirmation: "https://ejemplo.com/confirmacion",
//   method_confirmation: "POST",
// };
// epayco.subscriptions
//   .create(subscription_info)
//   .then(function (subscription) {
//     console.log(subscription);
//   })
//   .catch(function (err) {
//     console.log("err: " + err);
//   });

// {
//   status: true,
//   message: 'Suscripción creada',
//   created: '29-07-2022',
//   id: '2e43b11c5280d0a002be8c2',
//   success: true,
//   current_period_start: '07/29/2022',
//   current_period_end: '31-08-2022',
//   customer: {
//     _id: '2e437d90f94ca1b5349b042',
//     name: 'Joe Mari',
//     email: 'joely@payco.co',
//     doc_number: '5234567',
//     merchantId: '639960',
//     indicative: '',
//     country: '',
//     city: 'Bogota',
//     address: 'Cr 4 # 55 36',
//     break_card: false,
//     doc_type: 'CC',
//     updated_at: '2022-07-29T19:54:57.576000Z'
//   },
//   status_subscription: 'inactive',
//   type: 'Create Subscription',
//   data: {
//     idClient: 'Plan_de_Plata',
//     name: 'Plan de Plata',
//     description: 'descripcion plan plata',
//     amount: 10000,
//     currency: 'COP',
//     interval: 'month',
//     interval_count: 1,
//     trialDays: 1,
//     createdAt: '2022-07-26T22:15:13.442000Z'
//   },
//   object: 'subscription'
// }

// ----------------PAY SUSCRIPTION----------------
var subscription_info = {
  id_plan: "Plan_de_Plata",
  customer: "2e437d90f94ca1b5349b042",
  token_card: "2e4369b69c26b00af026615",
  doc_type: "CC",
  doc_number: "5234567",
  ip: "201.182.250.134" /*This is the client's IP, it is required */,
};
epayco.subscriptions
  .charge(subscription_info)
  .then(function (subscription) {
    console.log(subscription);
  })
  .catch(function (err) {
    console.log("err: " + err);
  });

// {
//   idPlan: 'Plan_de_Plata',
//   data: {
//     idClient: 'Plan_de_Plata',
//     name: 'Plan de Plata',
//     description: 'descripcion plan plata',
//     amount: 10000,
//     currency: 'COP',
//     interval: 'month',
//     interval_count: 1,
//     trialDays: 1
//   },
//   periodStart: { '$date': { '$numberLong': '1659124497000' } },
//   periodEnd: '30-07-2022',
//   nextVerificationDate: '30-07-2022',
//   status: 'active',
//   first: true,
//   idCustomer: '2e437d90f94ca1b5349b042',
//   tokenCard: '2e4369b69c26b00af026615',
//   ip: '192.168.0.107',
//   paymentAttempts: [],
//   url_confirmation: 'https://ejemplo.com/confirmacion',
//   method_confirmation: 'POST'
// }
