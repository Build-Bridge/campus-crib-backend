import { Response } from "express";

export interface Payload{
  message?: string,
  payload?: any
}

export const successResponse = (payload:  Payload, res: Response) => {
  if(payload.payload){
    return res.json({
    message:payload.message || "Successful",
    data: payload.payload,
    status:200
  })
  }
  
  else{
    return res.status(400).json({
      message: payload.message,
      status:400
    })
  }
};

export const errorResponse =  (message:  string, res: Response) => {
  return res.status(400).json({
    message,
    status:400
  })
};
