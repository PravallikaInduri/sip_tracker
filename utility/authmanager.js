const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || "edchbelwvhidbhieyfrwiugvfbyvrwiuhFSclzknq";

function signJwt(payload){
    try{
        const token=jwt.sign(payload,secret,{expiresIn:'1h'});
        return token;
    }catch(err){
        console.log(err);
    }
}

function verifyJwt(token){
    try{
        const payload=jwt.verify(token,secret);
        return payload;
    }catch(err){
        console.log(err);
        return null;
    }
}

module.exports = { signJwt, verifyJwt };