import { Document } from "mongoose";

export interface Driver extends Document {
  id: number;
  name: string;
  email: string;
  phone: number;
  password: string;
  cnfPassword?: string;
}

export interface customError{
  status: number;
  success: boolean;
  message: string;
}
