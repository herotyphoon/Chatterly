const { Schema, model } = require('mongoose');

const friendSchema = new Schema({
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ]
},
    { timestamps: true }
);

friendSchema.index(
    { users: 1 },
    { unique: true }
);

friendSchema.statics.createFriendship = async function (userA, userB) {
    if (userA.toString() === userB.toString()) {
        throw new Error('Users cannot be friends with themselves');
    }

    const users = [userA, userB].sort((a, b) =>
        a.toString().localeCompare(b.toString())
    );

    const existing = await this.findOne({ users });
    if (existing) return existing;

    return this.create({ users });
};

friendSchema.statics.getFriendsForUser = async function (userId) {
    const friendships = await this.find({ users: userId })
        .populate('users', 'fullName username profileImageUrl');

    return friendships
        .map(f => f.users.find(u => u._id.toString() !== userId.toString()))
        .filter(Boolean)
        .sort((a, b) =>
            a.fullName.localeCompare(b.fullName, undefined, { sensitivity: 'base' })
        );
};

friendSchema.pre('validate', function () {
    if (this.users.length !== 2) {
        throw new Error('Friendship must contain exactly 2 users');
    }

    this.users = this.users.sort((a, b) =>
        a.toString().localeCompare(b.toString())
    );
});

module.exports = model('Friendship', friendSchema);