
const {sign, verify} = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || "defaultJwtSecretKey";

const createToken = (user) => {
    const accessToken = sign(
        { email: user.email, id: user._id},
        jwtSecret,
        { expiresIn: "1h" }
    );

    return accessToken;
};

const validateToken = (req, res, next) => {
    console.log(req.cookies);
    const accessToken = req.cookies['access-token'];

    if(!accessToken){
        return res.status(400).json({error: 'User not authenticated!'});
    }

    try{
        const validToken = verify(accessToken, jwtSecret);
        if(validToken){
            req.authenticated = true;
            return next();
        } 
    }catch(err){
        return res.status(400).json({ error: err });
        /*
        Error, we get, while modifying the cookie value, manually
        {
            "error": {
                "name": "JsonWebTokenError",
                "message": "jwt malformed"
            }
        }
        */
    }
}

module.exports = { createToken, validateToken };