import mongoose, { Document, Schema, Types } from "mongoose";

export enum SubscriptionPlan {
    BASIC = "BASIC",
    PRO = "PRO",
    ELITE = "ELITE"
}

export interface ISubscription extends Document {
    user: Types.ObjectId | string;
    plan: SubscriptionPlan;
    status: 'active' | 'inactive' | 'cancelled' | 'expired';
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
    paymentMethod?: string;
    lastPaymentDate?: Date;
    nextPaymentDate?: Date;
    amount: number;
    currency: string;
    features: {
        maxHostels: number;
        priorityListing: boolean;
        analytics: boolean;
        instantAlerts: boolean;
        featuredBadge: boolean;
        customProfile: boolean;
        promoCodes: boolean;
        pushNotifications: boolean;
        phoneSupport: boolean;
        earlyAccess: boolean;
    };
}

const subscriptionSchema = new Schema<ISubscription>({
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    plan: { 
        type: String, 
        enum: Object.values(SubscriptionPlan), 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive', 'cancelled', 'expired'], 
        default: 'inactive' 
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true },
    paymentMethod: { type: String },
    lastPaymentDate: { type: Date },
    nextPaymentDate: { type: Date },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    features: {
        maxHostels: { type: Number, required: true },
        priorityListing: { type: Boolean, default: false },
        analytics: { type: Boolean, default: false },
        instantAlerts: { type: Boolean, default: false },
        featuredBadge: { type: Boolean, default: false },
        customProfile: { type: Boolean, default: false },
        promoCodes: { type: Boolean, default: false },
        pushNotifications: { type: Boolean, default: false },
        phoneSupport: { type: Boolean, default: false },
        earlyAccess: { type: Boolean, default: false }
    }
}, {
    timestamps: true,
});

// Index for efficient queries
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });

const Subscription = mongoose.model<ISubscription>("Subscription", subscriptionSchema);

export default Subscription; 