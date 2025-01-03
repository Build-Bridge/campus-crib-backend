import { Response } from "express";

export interface Payload{
  message?: string,
  payload?: any
}

export const successResponse = (payload:  Payload, res: Response) => {
  return res.json({
    message:payload.message || "Successful",
    data: payload.payload,
    status:200
  })
};

export const errorResponse =  (message:  string, res: Response) => {
  return res.json({
    message,
    status:400
  })
};
