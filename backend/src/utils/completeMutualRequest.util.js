const Friends = require('../models/friends.model.js')

async function tryCompleteMutualRequest(FriendRequest, senderId, receiverId) {
    const reverseRequest = await FriendRequest.findOneAndDelete({
        senderId: receiverId,
        receiverId: senderId,
        status: 'pending'
    });

    if (reverseRequest) {
        const friendship = await Friends.createFriendship(senderId, receiverId);
        return { accepted: true, friendship };
    }
    return null;
}

module.exports = {tryCompleteMutualRequest};