const express = require('express')
const Notes = require('../models/notes')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/notes', auth, async (req, res) => {
    const notes = new Notes({
        ...req.body,
        owner: req.user._id
    })

    try {
        await notes.save()
        res.status(201).send(notes)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/notes', auth, async (req, res) => {
    try {
        await req.user.populate('notes').execPopulate()
        res.send(req.user.notes)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/notes/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const notes = await Notes.findOne({ _id, owner: req.user._id })

        if (!notes) {
            return res.status(404).send()
        }

        res.send(notes)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/notes/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const notes = await Notes.findOne({ _id: req.params.id, owner: req.user._id})

        if (!notes) {
            return res.status(404).send()
        }

        updates.forEach((update) => notes[update] = req.body[update])
        await notes.save()
        res.send(notes)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/notes/:id', auth, async (req, res) => {
    try {
        const notes = await Notes.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!notes) {
            res.status(404).send()
        }

        res.send(notes)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
