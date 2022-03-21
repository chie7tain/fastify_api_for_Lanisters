import memoizeOne from "memoize-one";
import { isEqual } from "lodash";
import path from "path";
import fs from "fs";
const pathToData = path.join(__dirname, "../../database/fees.json");
let feeHolder = JSON.parse(
  fs.readFileSync(pathToData, {
    encoding: "utf-8",
  })
);
import { writeDataToFile } from "../helpers";

export const createFeeSpec = async (
  req: { body: { FeeConfigurationSpec: string } },
  reply: any
) => {
  console.log(req.body);
  try {
    let { FeeConfigurationSpec } = req.body;
    let fees = FeeConfigurationSpec.split("\n");

    let feeSpecList: {}[] = [];

    feeSpecList = fees.map((fee: string) => {
      let feeDetails = fee.split(" ");
      let feeId = feeDetails[0];
      let feeCurrency = feeDetails[1];
      let feeLocale = feeDetails[2];
      let feeEntity = feeDetails[3].split("(")[0];
      let feeEntityProperty = feeDetails[3].split("(")[1].replace(")", "");
      let feeType = feeDetails[6];
      let feeValue = feeDetails[7];
      let feeSpec = {
        feeId,
        feeCurrency,
        feeLocale,
        feeEntity,
        feeEntityProperty,
        feeType,
        feeValue,
      };
      return feeSpec;
    });

    //@ts-ignore
    writeDataToFile(pathToData, feeSpecList);

    reply.send({
      status: "ok",
    });
  } catch (err) {
    console.log(err);
  }
};

export const computeTransactionFee = async (
  req: {
    body: {
      ID: number;
      Amount: number;
      Currency: string;
      CurrencyCountry: string;
      Customer: {
        ID: number;
        EmailAddress: string;
        FullName: string;
        BearsFee: boolean;
      };
      PaymentEntity: {
        ID: number;
        Issuer: string;
        Brand: string;
        Number: string;
        SixID: number;
        Type: string;
        Country: string;
      };
    };
  },
  reply: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      send: {
        (arg0: {
          appliedFeeId?: string;
          appliedFeeValue?: number;
          chargeAmount?: number;
          settlementAmount?: number;
          error?: unknown;
        }): void;
        new (): any;
      };
    };
  }
) => {
  try {
    let { ID, Amount, Currency, CurrencyCountry, Customer, PaymentEntity } =
      req.body;
    let localFeeConfig;
    let internationalFeeconfig;

    // check fee locale
    if (CurrencyCountry === PaymentEntity.Country) {
      // transaction is local
      // find fee configuration that matches local ones

      localFeeConfig = feeHolder.filter(
        (fee: { feeLocale: string }) => fee.feeLocale !== "INTL"
      );
    } else {
      // transaction is international
      // find fee configuration that matches international ones

      internationalFeeconfig = feeHolder.filter(
        (fee: { feeLocale: string }) => fee.feeLocale === "INTL"
      );
    }
    //  select the feeconfig to use
    let feeConfig = localFeeConfig || internationalFeeconfig;
    //  check if fee config is empty
    if (!feeConfig) {
      throw new Error("No fee configuration found");
    }
    // check fee entity type
    let feeEntityArr = feeConfig.filter(
      (fee: { feeEntity: string; feeEntityProperty: string }) => {
        if (fee.feeEntity === PaymentEntity.Type || fee.feeEntity === "*") {
          if (
            fee.feeEntityProperty === PaymentEntity.Brand ||
            fee.feeEntityProperty === "*"
          ) {
            return true;
          }
        }
      }
    );

    // check if fee entity is empty
    if (feeEntityArr.length === 0) {
      return reply.status(400).send({
        error: `No fee configuration for ${Currency} transactions`,
      });
    }

    // create a ranker function to rank the fee configs
    let ranker = (feeConfig: {
      feeId: string;
      feeCurrency: string;
      feeLocale: string;
      feeType: string;
      feeEntity: string;
      feeProperty: string;
    }) => {
      let feeConfigRanker = {
        feeConfigId: feeConfig.feeId,
        rank: 4,
      };
      // check if the fee config has a * value
      if (feeConfig.feeCurrency === "*") {
        feeConfigRanker.rank -= 1;
      }
      // check if the fee config has a * value
      if (feeConfig.feeLocale === "*") {
        feeConfigRanker.rank -= 1;
      }
      // check if the fee config has a * value
      if (feeConfig.feeType === "*") {
        feeConfigRanker.rank -= 1;
      }
      // check if the fee config has a * value
      if (feeConfig.feeEntity === "*") {
        feeConfigRanker.rank -= 1;
      }
      // check if the fee config has a * value
      if (feeConfig.feeProperty === "*") {
        feeConfigRanker.rank -= 1;
      }
      return feeConfigRanker;
    };
    // memoize the ranker function
    let memoizeRanker = memoizeOne(ranker, isEqual);
    // rank the fee configs
    let rankedFeeConfigs = feeEntityArr
      .map(memoizeRanker)
      .sort((a: any, b: any) => {
        return a.rank === b.rank ? 0 : a.rank > b.rank ? -1 : 1;
      });

    // get the fee config to use from feeEntityArr

    let feeConfigToUse = feeEntityArr.filter(
      (fee: { feeId: any }) => fee.feeId === rankedFeeConfigs[0].feeConfigId
    );

    // use the fee config to compute the fee
    let [fee] = feeConfigToUse;

    let { feeType, feeValue } = fee;
    let appliedFeeId = "";
    let appliedFeeValue = 0;
    let chargeAmount = 0;
    let settlementAmount = 0;
    let appliedFee = {
      appliedFeeId,
      appliedFeeValue,
      chargeAmount,
      settlementAmount,
    };
    if (feeType === "PERC") {
      appliedFeeValue = (feeValue * Amount) / 100;
    } else if (feeType === "FLAT") {
      appliedFeeValue = Number(feeValue.split(":")[0]);
    } else if (feeType === "FLAT_PERC") {
      let flatFee = Number(feeValue.split(":")[0]);
      let percFee = Number(feeValue.split(":")[1]);

      appliedFeeValue = flatFee + (percFee * Amount) / 100;
    }
    if (Customer.BearsFee) {
      chargeAmount = Amount + appliedFeeValue;
    } else {
      chargeAmount = Amount;
    }
    settlementAmount = chargeAmount - appliedFeeValue;
    appliedFeeId = fee.feeId;
    appliedFee = {
      appliedFeeId,
      appliedFeeValue,
      chargeAmount,
      settlementAmount,
    };
    reply.status(200).send({ ...appliedFee });
  } catch (error) {
    console.log(error);
    reply.status(400).send({
      error,
    });
  }
};
