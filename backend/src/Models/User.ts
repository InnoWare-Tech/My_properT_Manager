import mongoose, { Document, Schema } from "mongoose";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface Role {
  roleName: "Owner" | "Care-taker" | "Tenant" | "Guest";
  // properties: [Propero];
  businessAddress?: Address;
  bankAccountDetails?: {
    accountNumber: string;
    bankName: string;
    routingNumber: string;
  };
}

export interface IUser extends Document {
  name?: string;
  email: string;
  phone: string;
  password: string;
  address?: Address;
  profilePicture?: string;
  emergencyContact?: EmergencyContact;
  roles: Role[];
  selectedRole: string;
  createdDate: Date;
  lastUpdated: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  googleId: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
  },
  profilePicture: { type: String },
  emergencyContact: {
    name: { type: String },
    relation: { type: String },
    phone: { type: String },
  },
  selectedRole: {
    type: String,
    enum: ["Owner", "Care-taker", "Tenant", "Guest"],
    default: "Guest",
  },
  roles: [
    {
      roleName: {
        type: String,
        required: true,
        default: "Guest",
        enum: ["Owner", "Care-taker", "Tenant", "Guest"],
      },
      businessAddress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String },
      },
      bankAccountDetails: {
        accountNumber: { type: String },
        bankName: { type: String },
        routingNumber: { type: String },
      },
    },
  ],
  createdDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
});
export default mongoose.model<IUser>("User", UserSchema);
