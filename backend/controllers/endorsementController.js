const Endorsement = require("../models/Endorsement");

/**
 * GET /api/endorsements
 * List all endorsements for the authenticated user.
 */
async function listEndorsements(req, res, next) {
    try {
        const endorsements = await Endorsement.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 200,
            endorsements: endorsements.map((e) => ({
                id: e._id,
                name: e.name,
                type: e.type,
                phone: e.phone,
                status: e.status,
                strength: e.strength,
                duration: e.duration,
                score: e.score,
            })),
        });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/endorsements
 * Create a new endorsement / community reference.
 */
async function createEndorsement(req, res, next) {
    try {
        const { name, type, phone, strength, duration } = req.body;

        const endorsement = await Endorsement.create({
            userId: req.user.id,
            name,
            type: type || "Peer",
            phone,
            strength: strength || 3,
            duration: duration || 0,
            status: "Pending",
            score: 0,
        });

        res.status(201).json({
            status: 200,
            message: "Endorsement created successfully",
            endorsement: {
                id: endorsement._id,
                name: endorsement.name,
                type: endorsement.type,
                phone: endorsement.phone,
                status: endorsement.status,
                strength: endorsement.strength,
                duration: endorsement.duration,
                score: endorsement.score,
            },
        });
    } catch (err) {
        next(err);
    }
}

/**
 * DELETE /api/endorsements/:id
 * Remove an endorsement.
 */
async function deleteEndorsement(req, res, next) {
    try {
        const endorsement = await Endorsement.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!endorsement) {
            return res.status(404).json({
                status: 404,
                message: "Endorsement not found",
            });
        }

        await Endorsement.deleteOne({ _id: endorsement._id });

        res.status(200).json({
            status: 200,
            message: "Endorsement deleted successfully",
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { listEndorsements, createEndorsement, deleteEndorsement };
