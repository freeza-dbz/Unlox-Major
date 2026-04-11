import mongoose from "mongoose";

const connectdb = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`mongoDB connection established!! DB host: ${connectionInstance.connection.host}`);
    } catch (err) {
        console.error(`Error connecting to mongoDB: ${err.message}`);
        process.exit(1);
    }
}


export default connectdb;
