import { Schema, model, Document, ObjectId } from "mongoose";

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Property extends Document {
  propertyName: string;
  propertyType: "Residential" | "Commercial"; // Type of property
  address: Address;
  businessId: ObjectId;
  sizeInSqFt?: number; // Optional, depending on whether it's important to track
  numberOfUnits?: number; // For apartment buildings or multi-unit properties
  owner: Schema.Types.ObjectId; // Reference to the Owner model
  caretaker?: Schema.Types.ObjectId; // Optional reference to a Caretaker
  tenantIds?: Schema.Types.ObjectId[]; // Array of tenants, if applicable
  isActive: boolean; // Whether the property is currently being managed
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<Address>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

const PropertySchema = new Schema<Property>(
  {
    propertyName: { type: String, required: true },
    propertyType: {
      type: String,
      enum: ["Residential", "Commercial"],
      required: true,
    },
    businessId: { type: Schema.Types.ObjectId, ref: "Owner", required: true },
    address: { type: AddressSchema, required: true },
    sizeInSqFt: { type: Number },
    numberOfUnits: { type: Number },
    owner: { type: Schema.Types.ObjectId, ref: "Owner", required: true },
    caretaker: { type: Schema.Types.ObjectId, ref: "Caretaker" },
    tenantIds: [{ type: Schema.Types.ObjectId, ref: "Tenant" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

export default model<Property>("Property", PropertySchema);
