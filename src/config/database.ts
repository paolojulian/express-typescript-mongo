// tslint:disable:no-console
import mongoose from "mongoose";
import { Mockgoose } from "mockgoose";

export const close = () => {
    if (process.env.NODE_ENV === 'test') {
        const mock = new Mockgoose(mongoose);
        return mock.helper.reset().then(() => {
            mongoose.connection.close();
        });
    }
    return mongoose.connection.close();
}

export const connect = async (db: string) => {
    try {
        if (process.env.NODE_ENV === 'test') {
            const mock = new Mockgoose(mongoose);
            await mock.prepareStorage();
        }

        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Successfully connected to ${db}`);
    } catch (e) {
        console.log("Error connecting to database: ", e);
        throw e;
    }
};

/**
 * @param string db - The databse URI
 */
export default () => {

    // Try to reconnect on disconnect
    mongoose.connection.on("disconnected", connect);
};