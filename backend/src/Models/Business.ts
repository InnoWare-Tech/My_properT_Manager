import { Schema, model, Document, ObjectId } from "mongoose";
import { Address, AddressSchema } from "./Address";

// BusinessDetails Interface
export interface BusinessDetails extends Document {
  businessName: string;
  businessAddress?: Address;
  bankAccountDetails?: {
    accountNumber: string;
    bankName: string;
    routingNumber: string;
  };
  owner: ObjectId; // Reference to the Owner model
}

// Business Schema
const BusinessSchema = new Schema<BusinessDetails>(
  {
    businessName: { type: String, required: true },
    businessAddress: { type: AddressSchema, required: true },
    bankAccountDetails: {
      accountNumber: { type: String, required: true },
      bankName: { type: String, required: true },
      routingNumber: { type: String, required: true },
    },
    owner: { type: Schema.Types.ObjectId, ref: "Owner", required: true }, // Foreign key reference to Owner
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Create and export the Business model
export const Business = model<BusinessDetails>("Business", BusinessSchema);
