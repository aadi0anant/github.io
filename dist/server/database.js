import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const USER_NAME = process.env.MONGO_USER;
const PASSWORD = process.env.MONGO_PASSWORD;
const DB_NAME = process.env.MONGO_DB;
const CLUSTER = process.env.MONGO_CLUSTER;
const MONGO_URI = `mongodb+srv://${USER_NAME}:${PASSWORD}@${CLUSTER}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
class Database {
    constructor() {
        this.db = null;
        this.client = new MongoClient(MONGO_URI);
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async connect() {
        if (!this.db) {
            try {
                await this.client.connect();
                console.log(`[INFO] Connected to Database: ${DB_NAME}`);
                this.db = this.client.db(DB_NAME);
            }
            catch (err) {
                console.error(`[ERROR] Failed to connect to Database: ${err}`);
                throw err;
            }
        }
        return this.db;
    }
    async disconnect() {
        await this.client.close();
        console.log(`[INFO] Disconnected to Database: ${DB_NAME}`);
        this.db = null;
    }
}
export default Database;
//# sourceMappingURL=database.js.map