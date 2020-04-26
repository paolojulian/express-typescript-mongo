import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import { Func } from "mocha";

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.statics.comparePassword = function (candidatePassword: string, callback: any) {
  bcrypt.compare(candidatePassword, this.password, (err: Error, isMatch: boolean) => {
    callback(err, isMatch);
  });
};

UserSchema.statics.findByUsername = function (username: string) {
    return this.findOne({ username }).exec();
}

UserSchema.statics.findByEmail = function (email: string) {
    return this.findOne({ email }).exec();
}

export interface UserInterface extends Document {
    username: string;
    password: string;
}

interface UserModelInterface extends Model<UserInterface> {
    comparePassword: (candidatePassword: string, callback: any) => void;
    findByUsername: (username: string) => Promise<UserInterface>;
    findByEmail: (email: string) => Promise<UserInterface>;
}

const User = mongoose.model<UserInterface, UserModelInterface>("User", UserSchema);
export default User;