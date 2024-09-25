const express = require('express');
const Note = require('../models/Note');
const redisClient = require('../config/redis');
const router = express.Router();

// Create a new note
router.post('/', async (req, res) => {
    try {
        const note = new Note({
            title: req.body.title,
            content: req.body.content,
        });
        const savedNote = await note.save();
        redisClient.del('notes'); // Invalidate the cache
        res.status(201).json(savedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all notes (with Redis caching)
router.get('/', async (req, res) => {
    try {
        const cachedNotes = await redisClient.get('notes');
        if (cachedNotes) {
            return res.json(JSON.parse(cachedNotes));
        } else {
            const notes = await Note.find();
            redisClient.setEx('notes', 3600, JSON.stringify(notes));
            res.json(notes);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a note
router.put('/:id', async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title, content: req.body.content },
            { new: true }
        );
        redisClient.del('notes'); // Invalidate the cache
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a note
router.delete('/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        redisClient.del('notes'); // Invalidate the cache
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
