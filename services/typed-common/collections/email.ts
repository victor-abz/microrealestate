import mongoose from 'mongoose';
import { CollectionTypes } from '@microrealestate/types';

const EmailSchema = new mongoose.Schema<CollectionTypes.Email>({
  templateName: String,
  recordId: String,
  params: {},
  sentTo: String,
  sentDate: Date,
  status: String,
  emailId: String,
});

export default mongoose.model<CollectionTypes.Email>('Email', EmailSchema);
