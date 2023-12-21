const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const app = express()
app.use(express.json())

const port = process.env.PORT || 3000

const users = [
    { id: 1, name: "User 1", refresh: null },
    { id: 2, name: "User 2", refresh: null },
    { id: 3, name: "User 3", refresh: null },
]

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.post("/auth/login", (req, res) => {
    const { name } = req.body

    const user = users.findIndex((e) => e.name === name)

    if (!name || user < 0) {
        return res.status(404).json({ message: "User not found" })
    }

    const access_token = jwtGenerate(users[user])
    const refresh_token = jwtRefreshTokenGenerate(users[user])

    users[user].refresh = refresh_token

    res.json({
        access_token,
        refresh_token,
    })
})

const jwtGenerate = (user) => {
    const accessToken = jwt.sign(
        { name: user.name, id: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "3m", algorithm: "HS256" }
    )

    return accessToken
}

const jwtRefreshTokenGenerate = (user) => {
    const refreshToken = jwt.sign(
        { name: user.name, id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d", algorithm: "HS256" }
    )

    return refreshToken
}

const jwtValidate = (req, res, next) => {
    try {
        if (!req.headers["authorization"]) return res.sendStatus(401)

        const token = req.headers["authorization"].replace("Bearer ", "")

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) throw new Error(error)
        })
        next()
    } catch (error) {
        return res.sendStatus(403)
    }
}

app.get("/hello", jwtValidate, (req, res) => {
    res.send("Hello World!")
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})