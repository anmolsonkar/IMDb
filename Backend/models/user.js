const mongoose = require('mongoose');
const isEmail = require('validator').isEmail;
const bcrypt = require('bcrypt');
const dompurify = require('dompurify');
const { JSDOM } = require('jsdom');
const { window } = new JSDOM('');
const DOMPurify = dompurify(window);

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password must be at least 6 characters']
    },
});

userSchema.pre('save', async function (next) {
    this.email = DOMPurify.sanitize(this.email);

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema);

module.exports = User;
