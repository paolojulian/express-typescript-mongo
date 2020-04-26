import mongoose, { Schema, Document } from "mongoose";

export interface TokenInterface extends Document {
    token: string;
    expired: boolean
}

const TokenSchema: Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    expired: {
        type: Boolean,
        required: false,
        default: false
    }
});

const Token = mongoose.model<TokenInterface>("Token", TokenSchema);
export default Token;