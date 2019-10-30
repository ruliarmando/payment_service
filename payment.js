const paymentTypes = [
  'credit_card',
  'bank_transfer',
  'echannel',
  'bca_klikpay',
  'bca_klikbca',
  'bri_epay',
  'cimb_clicks',
  'danamon_online',
  'cstore',
  'akulaku',
  'gopay',
];

const banks = [
  'permata',
  'bca',
  'mandiri',
  'bni',
];

function getOrderID(paymentType) {
  const translation = {
    credit_card: 'cc',
    bank_transfer: 'trf',
    echannel: 'trf',
    gopay: 'gopay',
  };
  const now = Date.now();
  return `test-${translation[paymentType]}-${now}`;
}

function getGrossAmount(items) {
  return items.map(item => item.price * item.quantity).reduce((a, c) => a + c);
}

function generatePayment({ paymentType, ccToken, bank, customerDetails, itemDetails }) {
  if (!paymentTypes.includes(paymentType)) {
    throw new Error('Payment type not supported');
  }
  const payment = {
    payment_type: paymentType,
    transaction_details: {
      order_id: getOrderID(paymentType),
      gross_amount: getGrossAmount(itemDetails),
    },
    customer_details: customerDetails,
  };

  if (paymentType === 'credit_card') {
    payment.credit_card = {
      token_id: ccToken,
    };
  }
  if (paymentType === 'bank_transfer') {
    if (!banks.includes(bank)) {
      throw new Error('Bank not supported');
    }
    payment.bank_transfer = { bank };
  }
  if (paymentType === 'echannel') {
    payment.echannel = {
      bill_info1: 'Payment For:',
      bill_info2: 'goods',
    };
  }
  if (paymentType === 'gopay') {
    payment.gopay = {
      "enable_callback": true,
      "callback_url": "someapps://callback",
    };
  }
  return payment;
}

module.exports = generatePayment;
