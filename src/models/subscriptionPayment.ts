import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISubscriptionPayment extends Document {
    user: Types.ObjectId | string;
    subscription: Types.ObjectId | string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod: 'card' | 'bank_transfer' | 'wallet' | 'paystack' | 'flutterwave';
    paymentReference?: string;
    transactionId?: string;
    gatewayResponse?: any;
    description: string;
    metadata?: any;
}

const subscriptionPaymentSchema = new Schema<ISubscriptionPayment>({
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    subscription: { type: Schema.Types.ObjectId, ref: "Subscription", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed', 'refunded'], 
        default: 'pending' 
    },
    paymentMethod: { 
        type: String, 
        enum: ['card', 'bank_transfer', 'wallet', 'paystack', 'flutterwave'], 
        required: true 
    },
    paymentReference: { type: String },
    transactionId: { type: String },
    gatewayResponse: { type: Schema.Types.Mixed },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed }
}, {
    timestamps: true,
});

// Index for efficient queries
subscriptionPaymentSchema.index({ user: 1, status: 1 });
subscriptionPaymentSchema.index({ paymentReference: 1 });
subscriptionPaymentSchema.index({ transactionId: 1 });

const SubscriptionPayment = mongoose.model<ISubscriptionPayment>("SubscriptionPayment", subscriptionPaymentSchema);

export default SubscriptionPayment; 