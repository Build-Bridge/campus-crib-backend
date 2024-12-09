import { Response } from "express";

export interface Payload{
  message?: string,
  data?: any
}

export const successResponse = (payload:  Payload, res: Response) => {
  return res.json({
    message:payload.message || "Successful",
    data: payload.data,
    status:200
  })
};

export const errorResponse =  (message:  string, res: Response) => {
  return res.json({
    message,
    status:400
  })
};
