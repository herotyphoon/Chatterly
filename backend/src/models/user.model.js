const path = require('path');
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 50,
    },
    fullName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        select: false,
    },
    profileImageUrl: {
        type: String,
        required: false,
        default: path.resolve(__dirname, '..' ,'../public/default.png'),
    },
    isDiscoverable: {
        type: Boolean,
        default: true,
        select: false,
    }
},
    { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
})

module.exports = model('User', userSchema);