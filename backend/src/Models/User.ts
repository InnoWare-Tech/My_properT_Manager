import mongoose, { Document, Schema } from "mongoose";
import {
  acceptedRoleNames,
  CareTakerRoleSchema,
  OwnerRoleSchema,
  Role,
} from "./Role";
import { Address } from "./Address";

interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface IUser extends Document {
  _id: string;
  name?: string;
  email: string;
  phone: string;
  password: string;
  address?: Address;
  profilePicture?: string;
  emergencyContact?: EmergencyContact;
  roles: [];
  selectedRole: string;
  googleId?: string;
  createdDate: Date;
  lastUpdated: Date;
  facebookId?: string;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  googleId: { type: String },
  facebookId: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    block: { type: String },
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
    default: acceptedRoleNames.Guest,
  },
  roles: [{ type: Schema.Types.Mixed }],
  createdDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", UserSchema);
