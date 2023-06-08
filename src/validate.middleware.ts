import { NextFunction, Request, Response } from "express";

import { Schema } from "yup";

export const validate =
  (schema: Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.query, {
        stripUnknown: false,
      });
      return next();
    } catch (err) {
      let message = "Request schema validation failed";
      if (err instanceof Error) {
        message = err.message;
        return res.status(500).json({ error: message });
      }
      return res.status(500).json({ error: message });
    }
  };

export const validateBody =
  (schema: Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, {
        stripUnknown: false,
      });
      return next();
    } catch (err) {
      let message = "Request schema validation failed";
      if (err instanceof Error) {
        message = err.message;
        return res.status(500).json({ error: message });
      }
      return res.status(500).json({ error: message });
    }
  };
