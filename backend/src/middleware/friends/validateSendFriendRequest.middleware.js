const { Types } = require('mongoose');

const Friends = require('../../models/friends.model');
const FriendRequest = require('../../models/friendRequest.model');
const User = require('../../models/user.model.js');

async function validateSendFriendRequest(req, res, next) {
    try {
        const senderId = req.user._id;
        const { userId: receiverId } = req.body;

        if (!receiverId) {
            return res.status(400).json({ message: 'Specify whom to send request' });
        }

        if (!Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: 'Invalid userId' });
        }

        if (senderId.toString() === receiverId.toString()) {
            return res.status(400).json({ message: 'You cannot send a request to yourself' });
        }

        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const existingFriends = await Friends.findOne({
            users: { $all: [senderId, receiverId] },
        });

        if (existingFriends) {
            return res.status(409).json({ message: 'Already friends!' });
        }

        const existingRequest = await FriendRequest.findOne({
            senderId,
            receiverId,
            status: 'pending',
        });

        if (existingRequest) {
            return res.status(409).json({ message: 'Friend request already sent' });
        }

        next();
    } catch (error) {
        console.error('Error validating send friend request: ', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}

module.exports = { validateSendFriendRequest };