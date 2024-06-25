import * as bcrypt from 'bcrypt';
import mongoose, { CallbackError } from 'mongoose';
import { CollectionTypes } from '@microrealestate/types';
import RealmModel from './realm.js';

const AccountSchema = new mongoose.Schema<CollectionTypes.Account>({
  firstname: {
    type: String,
    trim: true,
    required: true,
  },
  lastname: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  createdDate: Date,
});

// lowercase email
// hash user password before saving into database
AccountSchema.pre('save', function (next) {
  if (!this.createdDate) {
    this.createdDate = new Date();
  }
  this.email = this.email.toLowerCase();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

AccountSchema.post('save', function (account) {
  const name = `${account.firstname} ${account.lastname}`;
  RealmModel.updateMany(
    {
      members: {
        $elemMatch: { email: account.email },
      },
    },
    {
      $set: {
        'members.$.registered': true,
        'members.$.name': name,
      },
    },
    (error: CallbackError) => {
      if (error) {
        console.error(error);
      }
    }
  );
});

export default mongoose.model<CollectionTypes.Account>(
  'Account',
  AccountSchema
);
