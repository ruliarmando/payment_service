require('dotenv').config();
const express = require('express');
const midtrans = require('midtrans-client');

const generatePayment = require('./payment');

const app = express();
const PORT = 3210;

const coreApi = new midtrans.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => res.json({ result: 'Payment API' }));

app.post('/payment', ({ body }, res) => {
  const { payment_type, cc_token, bank, customer_details, item_details } = body;
  const payment = generatePayment({
    paymentType: payment_type,
    ccToken: cc_token,
    bank,
    customerDetails: customer_details,
    itemDetails: item_details,
  });
  coreApi.charge(payment)
    .then((response) => {
      console.log({ response });
      res.json({ status: '201', message: 'Transaction Created', response });
    })
    .catch((error) => {
      console.log({ error });
      res.json({ status: '500', message: 'Transaction Failed' });
    });
});

app.listen(PORT, () => { console.log(`Backend started on port ${PORT}`) });
