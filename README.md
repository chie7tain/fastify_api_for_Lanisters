# fastify_api_for_Lanisters

## how to use the api

## for /fees

pass in the fee spec to be parsed
{
"FeeConfigurationSpec": "LNPY1221 NGN \* _(_) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(_) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN _ BANK-ACCOUNT(_) : APPLY FLAT 100\nLNPY1225 NGN _ USSD(MTN) : APPLY PERC 0.55"
}

it should return a status of 200 and a message of ok
{
  "status": "ok"
}



## for /compute-transaction-fee

pass in a transaction object
{
    "ID": 91203,
    "Amount": 5000,
    "Currency": "NGN",
    "CurrencyCountry": "NG",
    "Customer": {
        "ID": 2211232,
        "EmailAddress": "anonimized29900@anon.io",
        "FullName": "Abel Eden",
        "BearsFee": true
    },
    "PaymentEntity": {
        "ID": 2203454,
        "Issuer": "GTBANK",
        "Brand": "MASTERCARD",
        "Number": "530191******2903",
        "SixID": 530191,
        "Type": "CREDIT-CARD",
        "Country": "NG"
    }
}



it should return a status of 200 and an object of applied fees
{
    "appliedFeeId": "LNPY1223",
    "appliedFeeValue": 120,
    "chargeAmount": 5120,
    "settlementAmount": 5000
}