const express = require('express');
const myJwt = require('./jwt');
const data = require('./data');

const router = express.Router();

router.post('/login', (req, res) => {
    const { name } = req.body;

    const user = data.users.findIndex((e) => e.name === name);

    if (!name || user < 0) {
        return res.status(404).json({ message: 'User not found' });
    }

    const accessToken = myJwt.jwtGenerate(data.users[user]);
    const refreshToken = myJwt.jwtRefreshTokenGenerate(data.users[user]);

    data.users[user].refresh = accessToken;

    return res.json({
        accessToken,
        refreshToken,
    });
});

module.exports = router;