// let fee = await FeeModel.findOne({
// where: {
// feeEntity: Customer.PaymentEntity.Type,
// feeEntityProperty: Customer.PaymentEntity.ID,
// feeCurrency: Merchant.Currency,
// feeLocale: Merchant.CurrencyCountry,
// },
// });
// if (fee) {
// let { feeType, feeValue } = fee;
// if (feeType === "PERC") {
// appliedFeeValue = (feeValue / 100) _ Amount;
// } else if (feeType === "FLAT") {
// appliedFeeValue = feeValue;
// } else if (feeType === "FLAT_PERC") {
// appliedFeeValue = feeValue + ((feeValue / 100) _ Amount);
// }
// chargeAmount = Amount + appliedFeeValue;
// settlementAmount = chargeAmount - appliedFeeValue;
// appliedFeeId = fee.feeId;
// appliedFee = {
// appliedFeeId,
// appliedFeeValue,
// chargeAmount,
// settlementAmount,
// };
// }

body: {
type: "object",
required: ["transaction"],
properties: {
transaction: {
type: "object",
required: [
"ID",
"Amount",
"Currency",
"CurrencyCountry",
"Customer",
"PaymentEntity",
],
properties: {
ID: { type: "number" },
Amount: { type: "number" },
Currency: { type: "string" },
CurrencyCountry: { type: "string" },
Customer: {
type: "object",
required: ["ID", "EmailAddress", "FullName", "BearsFee"],
properties: {
ID: { type: "number" },
EmailAddress: { type: "string" },
FullName: { type: "string" },
BearsFee: { type: "boolean" },
},
},
PaymentEntity: {
type: "object",
required: [
"ID",
"Issuer",
"Brand",
"Number",
"SixID",
"Type",
"Country",
],
properties: {
ID: { type: "number" },
Issuer: { type: "string" },
Brand: { type: "string" },
Number: { type: "string" },
SixID: { type: "number" },
Type: { type: "string" },
Country: { type: "string" },
},
},
},
},
},
},
},

// Options for post fees
const postFeesOptions = {
schema: {
body: {
type: "object",
properties: {
FeeConfigurationSpec: {
type: "string",
},
},
},
},
handler: createFeeSpec,
};

<!-- options -->

const computeFeeOptions = {
schema: {
response: {
200: {
type: "object",
properties: {
appliedFeeId: { type: "string" },
appliedFeeValue: { type: "number" },
chargeAmount: { type: "number" },
settlementAmount: { type: "number" },
error: { type: "string" },
},
},
},
request: {
type: "object",
properties: {
ID: { type: "number" },
Amount: { type: "number" },
Currency: { type: "string" },
CurrencyCountry: { type: "string" },
Customer: {
type: "object",
properties: {
ID: { type: "number" },
EmailAddress: { type: "string" },
FullName: { type: "string" },
BearsFee: { type: "boolean" },
},
},
PaymentEntity: {
type: "object",
properties: {
ID: { type: "number" },
Issuer: { type: "string" },
Brand: { type: "string" },
Number: { type: "string" },
SixID: { type: "number" },
Type: { type: "string" },
Country: { type: "string" },
},
},
},
},
},
handler: computeTransactionFee,
};
