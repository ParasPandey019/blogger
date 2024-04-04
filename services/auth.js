const jwt = require("jsonwebtoken");

const secret = "$@secret@key";

function createToken(user) {
    const payload = {
        name: user.fullName,
        _id: user._id,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role
    }

    const token = jwt.sign(payload, secret);
    return token;
}

function validate(token){
    const payload = jwt.verify(token, secret);
    return payload;
}

module.exports = {createToken , validate};