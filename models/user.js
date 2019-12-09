// external packages
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: { type: String, minlength: 3, maxlength: 30, required: true },
    lastName: { type: String, minlength: 3, maxlength: 30, required: true },
    email: { type: String, minlength: 3, maxlength: 255, required: true, unique: true },
    password: { type: String, minlength: 6, maxlength: 255, required: true }
});

userSchema.methods.encryptPassword = async function () {
    const user = this;
    return new Promise(async (resolve, reject) => {
        user.password = await bcrypt.hash(user.password, parseInt(process.env.PASSWORD_SALT));
        resolve();
    });
};

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);;
};

const User = mongoose.model('User', userSchema);

function validateUser (user) {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(30).required(),
        lastName: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(3).max(255).email().required(),
        password: Joi.string().min(6).max(255).required()
    });
    return schema.validate(user);
}

module.exports.validate = validateUser;
module.exports.User = User;