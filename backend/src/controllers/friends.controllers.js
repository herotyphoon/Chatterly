const FriendRequest = require('../models/friendRequest.model.js');
const Friends = require('../models/friends.model');

async function handleSendRequest(req, res) {
    try {
        const { _id: senderId } = req.user;
        const { userId: receiverId } = req.body;

        const result = await FriendRequest.send(senderId, receiverId);

        if (result.accepted) {
            return res.status(200).json({
                message: 'Friend request accepted!',
                friends: result.friendship
            });
        }

        return res.status(201).json({
            message: 'Successfully sent request!',
            request: result.request
        });
    } catch (error) {
        console.error('Failed to send friend request: ', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function handleGetIncomingFriendRequests(req, res) {
    try {
        const incomingFriendRequests = await FriendRequest.find({
            receiverId: req.user._id,
            status: 'pending',
        })
            .select('senderId createdAt')
            .populate('senderId', 'fullName username profileImageUrl')
            .sort({createdAt: -1});

        return res.status(200).json({
            incomingFriendRequests,
        });
    } catch (error) {
        console.error('Failed to get incoming friend requests: ', error.message);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

async function handleGetOutgoingFriendRequests(req, res) {
    try {
        const outgoingFriendRequests = await FriendRequest.find({
            senderId: req.user._id,
            status: 'pending',
        })
            .select('receiverId createdAt')
            .populate('receiverId', 'fullName username profileImageUrl')
            .sort({createdAt: -1});

        return res.status(200).json({
            outgoingFriendRequests,
        });
    } catch (error) {
        console.error('Failed to get outgoing friend requests: ', error.message);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

async function handleAcceptFriendRequest(req, res) {
    try {
        const friendship = await req.friendRequest.accept();

        return res.status(200).json({
            message: 'Friend request accepted',
            friends: friendship
        });
    } catch (error) {
        console.error('Failed to accept friend request: ', error.message);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

async function handleRejectFriendRequest(req, res) {
    try {
        await req.friendRequest.reject();
        return res.status(200).json({ message: 'Friend request rejected successfully' });
    } catch (error) {
        console.error('Failed to reject friend request: ', error.message);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

async function handleDeleteFriendRequest(req, res) {
    try {
        await req.friendRequest.cancel();

        return res.status(200).json({
            message: 'Friend request cancelled successfully',
        });
    } catch (error) {
        console.error('Failed to delete friend request: ', error.message);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

async function handleGetAllFriends(req, res) {
    try {
        const friends = await Friends.getFriendsForUser(req.user._id);
        return res.status(200).json({ friends });
    } catch (error) {
        console.error('Failed to get friends list: ', error.message);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

async function handleRemoveFriend(req, res) {
    try {
        await Friends.findOneAndDelete({_id: req.friendship._id});

        return res.status(200).json({
            message: 'Friend removed successfully',
        });
    } catch (error) {
        console.error('Failed to remove friend: ', error.message);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

module.exports = {
    handleSendRequest,
    handleGetIncomingFriendRequests,
    handleGetOutgoingFriendRequests,
    handleAcceptFriendRequest,
    handleRejectFriendRequest,
    handleDeleteFriendRequest,
    handleGetAllFriends,
    handleRemoveFriend
};