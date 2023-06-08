import { object, string } from "yup";
import { Network, validate } from "bitcoin-address-validation";

export const verifySchema = object({
  message: string().required(),
  signature: string().required(),
  address: string()
    .required()
    .test({
      name: "address",
      message: "invalid address",
      test: (value) => validate(value, Network.mainnet),
    }),
}).noUnknown();
