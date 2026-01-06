const { Schema, model } = require('mongoose');

const Friends = require('./friends.model.js');
const {tryCompleteMutualRequest}= require('../utils/completeMutualRequest.util.js');

const friendRequestSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    }
},
    { timestamps: true }
);

friendRequestSchema.index(
    { senderId: 1, receiverId: 1 },
    { unique: true }
);

friendRequestSchema.methods.accept = async function () {
    const friendship = await Friends.createFriendship(
        this.senderId,
        this.receiverId
    );

    await this.deleteOne();
    return friendship;
};

friendRequestSchema.methods.reject = async function () {
    await this.deleteOne();
};

friendRequestSchema.methods.cancel = async function() {
    return await this.deleteOne();
};

friendRequestSchema.statics.send = async function (senderId, receiverId) {
    const FriendRequest = this;

    const mutualResult = await tryCompleteMutualRequest(FriendRequest, senderId, receiverId);
    if (mutualResult) return mutualResult;

    try {
        const request = await FriendRequest.create({
            senderId,
            receiverId
        });

        return {
            accepted: false,
            request
        };
    } catch (error) {
        if (error.code === 11000) {
            const mutualResult = await tryCompleteMutualRequest(FriendRequest, senderId, receiverId);
            if (mutualResult) return mutualResult;

            throw new Error('Friend request already exists');
        }
        throw error;
    }
};

module.exports = model('FriendRequest', friendRequestSchema);