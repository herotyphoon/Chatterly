const { Types } = require('mongoose');

const Friends = require('../../models/friends.model');

async function validateRemoveFriend(req, res, next) {
    try {
        const userId = req.user._id;
        const { userId: friendId } = req.params;

        if (!Types.ObjectId.isValid(friendId)) {
            return res.status(400).json({ message: 'Invalid friend id' });
        }

        if (userId.toString() === friendId.toString()) {
            return res.status(400).json({ message: 'Cannot remove yourself as a friend' });
        }

        const friendship = await Friends.findOne({
            users: { $all: [userId, friendId] },
        });

        if (!friendship) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        req.friendship = friendship;

        next();
    } catch (error) {
        console.error('Failed to validate remove friend: ', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { validateRemoveFriend };