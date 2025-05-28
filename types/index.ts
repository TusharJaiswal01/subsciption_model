export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export interface IUser {
  id: string;
  email: string;
}

export interface IPlan {
  _id?: string;
  id: string;
  name: string;
  price: number;
  features: string[];
  duration: number; // in days
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubscription {
  _id?: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
