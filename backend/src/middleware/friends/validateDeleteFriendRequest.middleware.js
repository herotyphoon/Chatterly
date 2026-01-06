const {Types} = require('mongoose');

const FriendRequest = require('../../models/friendRequest.model');

async function validateDeleteFriendRequest (req, res, next) {
    try {
        const requestId = req.params.id;
        const userId = req.user._id;

        if (!Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: 'Invalid request id' });
        }

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.senderId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: 'Not authorized to delete this request',
            });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({
                message: 'Request already processed',
            });
        }

        req.friendRequest = request;
        next();
    } catch (error) {
        console.error('Error validating delete friend request: ', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {validateDeleteFriendRequest};