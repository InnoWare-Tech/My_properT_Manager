import { Schema } from "mongoose";
import { ObjectId } from "mongoose";
import { Business } from "./Business";

export const acceptedRoleNames = {
  Owner: "Owner",
  CareTaker: "Care-taker",
  Tenant: "Tenant",
  Guest: "Guest",
} as const;

interface RoleProperty {
  propertyId: ObjectId;
  businessId: ObjectId;
}

export interface OwnerRole {
  roleName: typeof acceptedRoleNames.Owner;
  businesses: ObjectId[];
  properties: ObjectId[];
}

const OwnerRoleSchema: Schema<OwnerRole> = new Schema({
  roleName: {
    type: String,
    required: true,
    default: acceptedRoleNames.Owner,
    enum: Object.values(acceptedRoleNames),
  },
  businesses: [{ type: Schema.Types.ObjectId, ref: "Business" }], // Reference array of ObjectIds for businesses
  properties: [
    {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true, // Ensure properties are required
    },
  ],
});

export interface CareTakerRole {
  roleName: typeof acceptedRoleNames.CareTaker;
  properties: RoleProperty[];
}

const CareTakerRoleSchema: Schema<CareTakerRole> = new Schema({
  roleName: {
    type: String,
    required: true,
    default: acceptedRoleNames.CareTaker,
    enum: Object.values(acceptedRoleNames),
  },
  properties: [
    {
      propertyId: {
        type: Schema.Types.ObjectId,
        ref: "Property",
        required: true,
      },
      BusinessId: {
        type: Schema.Types.ObjectId,
        ref: "Business",
        required: true,
      },
    },
  ],
});

// TenantRole and GuestRole: Excludes the businesses property
export interface TenantRole {
  roleName: typeof acceptedRoleNames.Tenant;
  properties: ObjectId[];
}

const TenantRoleSchema: Schema<TenantRole> = new Schema({
  roleName: {
    type: String,
    required: true,
    default: acceptedRoleNames.Tenant,
    enum: Object.values(acceptedRoleNames),
  },
  properties: [
    {
      propertyId: {
        type: Schema.Types.ObjectId,
        ref: "Property",
        required: true,
      },
      BusinessId: {
        type: Schema.Types.ObjectId,
        ref: "Business",
        required: true,
      },
    },
  ],
});

export interface GuestRole {
  roleName: typeof acceptedRoleNames.Guest;
}

const GuestRoleSchema: Schema<GuestRole> = new Schema({
  roleName: {
    type: String,
    required: true,
    default: acceptedRoleNames.Guest,
    enum: Object.values(acceptedRoleNames),
  },
});

// Define the Role type as a union of the specific roles
export type Role = OwnerRole | CareTakerRole | TenantRole | GuestRole;

export {
  GuestRoleSchema,
  OwnerRoleSchema,
  CareTakerRoleSchema,
  TenantRoleSchema,
};
