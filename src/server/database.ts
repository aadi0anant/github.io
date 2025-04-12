import {MongoClient, Db} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const USER_NAME = process.env.MONGO_USER!;
const PASSWORD = process.env.MONGO_PASSWORD!;
const DB_NAME = process.env.MONGO_DB!;
const CLUSTER = process.env.MONGO_CLUSTER!;
const MONGO_URI =`mongodb+srv://${USER_NAME}:${PASSWORD}@${CLUSTER}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

class Database {
    private static instance: Database;
    private client: MongoClient;
    private db:Db | null = null;

    private constructor() {
        this.client = new MongoClient(MONGO_URI);
    }

    public static getInstance(): Database {
        if(!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(): Promise<Db> {

        if(!this.db){
            try {
                await this.client.connect();
                console.log(`[INFO] Connected to Database: ${DB_NAME}`);
                this.db = this.client.db(DB_NAME);
            }catch(err){
                console.error(`[ERROR] Failed to connect to Database: ${err}`);
                throw err;
            }
        }
        return this.db;
    }

    public async disconnect(): Promise<void> {
        await this.client.close();
        console.log(`[INFO] Disconnected to Database: ${DB_NAME}`)
        this.db = null;
    }
}

export default Database;