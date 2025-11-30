
import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';


export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  spotifyId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}


type UserModel = Model<IUser, {}, IUserMethods>;


const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: String,
    spotifyId: String,
  },
  { timestamps: true }
);


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;