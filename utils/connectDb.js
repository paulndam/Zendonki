import mongoose from "mongoose";

const connection = {};

async function connectDB() {
  if (connection.isConnected) {
    // use existing db connection
    console.log(`Using existing connection`);
    return;
  }
  // use new db connections
  const db = await mongoose.connect(process.env.MONGO_SRV, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // to connect mongo db with a serverless applictaion

  console.log(`Database is connected`);
  connection.isConnected = db.connections[0].readyState;
}

export default connectDB;
