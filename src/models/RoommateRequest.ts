import mongoose, { Schema, Document } from 'mongoose';

export interface IRoommateRequest extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  department: string;
  level: string;
  religion: string;
  sex: string;
  hobbies: string[];
  picture?: string;
  hostelId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comments: {
    userId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
}

const RoommateRequestSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  religion: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  hobbies: [{
    type: String
  }],
  picture: {
    type: String
  },
  hostelId: {
    type: Schema.Types.ObjectId,
    ref: 'Hostels'
  },
  comments: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model<IRoommateRequest>('RoommateRequest', RoommateRequestSchema); 