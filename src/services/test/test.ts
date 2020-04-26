import mongoose, { Schema, Document } from "mongoose";

export interface TestInterface extends Document {
    name: string;
    job: string;
}

const TestSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    job: {
        type: String,
        required: true
    }
});

const Test = mongoose.model<TestInterface>("Test", TestSchema);
export default Test;