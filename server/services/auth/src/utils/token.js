import jwt from 'jsonwebtoken';


const generateAccessToken = (user) =>{

    const data = {
        id: user.id
    };

    return jwt.sign(
        data,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

const generateRefreshToken = (user) =>{
    const data = {
        id: user.id
    };

    return jwt.sign(
        data,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};


export {
    generateAccessToken,
    generateRefreshToken
};