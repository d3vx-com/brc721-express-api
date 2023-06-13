import axios, { AxiosError } from "axios";
import { Request, Response } from "express";

export const verifyController = async (req: Request, res: Response) => {
  const { address, signature, message } = req.body;
  const { data, status } = await axios({
    method: "POST",
    url: "verifymessage",
    baseURL: "http://45.55.104.148:3000",
    data: { address, signature, message },
  }).catch((err: AxiosError) => {
    if (err.response) {
      const data = err.response.data;
      const status = err.response.status;
      return { data, status };
    }

    throw new Error("Unknown error occurred");
  });

  return res.status(status).json(data);
};
