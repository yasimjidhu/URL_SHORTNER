import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name:string;
  email: string;
  password: string;
  googleId:string;
}

const userSchema = new Schema<IUser>({
  name:{type:String,required:true},
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
});

const UserModel = mongoose.model<IUser & Document>('User', userSchema);

export default UserModel;
