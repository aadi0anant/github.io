"use strict";
import express from "express";
import Database from "./database.js";
const router = express.Router();
/**
 * Retrieve all contacts
 */
router.get('/', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const contacts = await db.collection("contacts").find().toArray();
        res.json(contacts);
    }
    catch (err) {
        console.error(`[ERROR] Failed to fetch contacts: ${err}`);
        res.status(500).json({ message: "Server Connection Error" });
    }
});
/**
 * Retrieve a single contact (by id)
 */
router.get('/:id', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const contact = await db.collection("contacts").findOne({ id: req.params.id });
        if (contact) {
            res.json(contact);
        }
        else {
            res.status(404).json({ message: "Could not find contact" });
        }
    }
    catch (err) {
        console.error(`[ERROR] Failed to fetch contacts: ${err}`);
        res.status(500).json({ message: "Server Connection Error" });
    }
});
/**
 * Post for adding a new contact
 */
router.post('/', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const contacts = await db.collection("contacts").find().toArray();
        const newId = contacts.length > 0 ? (Math.max(...contacts.map(c => parseInt(c.id))) + 1).toString() : '1';
        const newContact = { id: newId, ...req.body };
        await db.collection("contacts").insertOne(newContact);
        res.status(201).json(newContact);
    }
    catch (err) {
        console.error(`[ERROR] Failed to add contact: ${err}`);
        res.status(500).json({ message: "Server Connection Error" });
    }
});
/**
 * PUT for updating a contact.
 */
router.put('/:id', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const { ...updateData } = req.body;
        const result = await db.collection("contacts").findOneAndUpdate({ id: req.params.id }, { $set: updateData }, { returnDocument: "after" });
        if (result && result.value) {
            res.json(result.value);
        }
        else {
            const updateContact = await db.collection("contacts").findOne({ id: req.params.id });
            if (updateContact) {
                res.json(updateContact);
            }
            else {
                res.status(404).json({ message: "Could not find contact: " });
            }
        }
    }
    catch (err) {
        console.error(`[ERROR] Failed to update contact: ${err}`);
        res.status(500).json({ message: "Server Connection Error" });
    }
});
/**
 * DELETE for contact deletion
 */
router.delete('/:id', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const result = await db.collection("contacts").deleteOne({ id: req.params.id });
        if (result.deletedCount > 0) {
            res.json({ message: "Contact deleted successfully." });
        }
        else {
            res.status(404).json({ message: "Could not find contact" });
        }
    }
    catch (err) {
        console.error(`[ERROR] Failed to fetch contacts: ${err}`);
        res.status(500).json({ message: "Server Connection Error" });
    }
});
export default router;
//# sourceMappingURL=contactRoutes.js.map