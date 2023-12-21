const jwt = require('jsonwebtoken');

const jwtGenerate = (user) => {
    const accessToken = jwt.sign(
        { name: user.name, id: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '3m', algorithm: 'HS256' },
    );

    return accessToken;
};

const jwtRefreshTokenGenerate = (user) => {
    const refreshToken = jwt.sign(
        { name: user.name, id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d', algorithm: 'HS256' },
    );

    return refreshToken;
};

const jwtValidate = async (req, res, next) => {
    try {
        if (!req.headers.authorization) return res.sendStatus(401);

        const token = req.headers.authorization.replace('Bearer ', '');

        await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
        next();
        return true;
    } catch (error) {
        return res.sendStatus(403);
    }
};

module.exports = { jwtGenerate, jwtRefreshTokenGenerate, jwtValidate };