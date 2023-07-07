import { Document } from "mongoose";

export interface User extends Document {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  cnfPassword?: string;
}

export interface customError {
  status: number;
  success: boolean;
  message: string;
}

export interface Driver extends Document {
  driverId: number;
  driverName: string;
  driverEmail: string;
  driverPhone: string;
  cabId: string;
}

export interface Cab extends Document {
  cabRegistrationNumber: string;
  cabModel: string;
  cabColour: string;
  driverId?: number;
}
