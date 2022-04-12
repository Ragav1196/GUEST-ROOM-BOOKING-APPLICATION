import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongo = {
  db: null,
  owners: null,
  customers: null,
  properties: null,

  async connect() {
    const client = new MongoClient(process.env.MONGO_URL);
    await client.connect();
    console.log("MongoDb connection established");

    this.db = client.db(process.env.MONGO_DB_NAME);
    console.log("MongoDb selected");

    this.owners = this.db.collection("owners");
    this.customers = this.db.collection("customers");
    this.properties = this.db.collection("properties");
    console.log("Collection Initialized");
  },
};

export { mongo };
