"use strict";
//import necessary modules and types
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import contactRoutes from "./contactRoutes.js";
// Convert path to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//Initialize Express app
const app = express();
const port = process.env.PORT || 3000;
async function startServer() {
    try {
        app.listen(port, () => {
            console.log(`[INFO] Server running on http://localhost:${port}`);
        });
    }
    catch (err) {
        console.error(`[ERROR] Failed to start server: ${err}`);
        process.exit(1);
    }
}
//Middleware to parse incoming json payloads
app.use(express.json());
// Server static files (HTML, CSS, JS, etc ...) from the project root
app.use(express.static(path.join(__dirname, "../..")));
// Server static assets from node_modules for client-side user and rendering
app.use('/node_modules/@fortawesome/fontawesome-free', express.static(path.join(__dirname, "../../node_modules/@fortawesome/fontawesome-free")));
app.use('/node_modules/bootstrap', express.static(path.join(__dirname, "../../node_modules/bootstrap")));
//Mount all contact endpoint to path /api/contacts
app.use('/api/contacts', contactRoutes);
const users = [
    {
        DisplayName: "Bilbo Baggins",
        EmailAddress: "bilbobaggins@durhamcollege.ca",
        Username: "bbaggins",
        Password: "123456"
    },
    {
        DisplayName: "Samwise Gangee",
        EmailAddress: "samwisegangee@durhamcollege.ca",
        Username: "sgangee",
        Password: "789654"
    },
    {
        DisplayName: "admin",
        EmailAddress: "admin@durhamcollege.ca",
        Username: "admin",
        Password: "password"
    }
];
// Routing
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../", "index.html"));
});
// API endpoint to return the list of users as JSON
app.get("/users", (req, res) => {
    res.json({ users });
});
// Start the Server
await startServer();
//# sourceMappingURL=server.js.map