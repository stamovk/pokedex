const express = require("express")

const app = express()

// This is the bad thing
// let pokemonId

// app.use("/pokemon/:pokemonId", (req, res, next) => {
//     pokemonId = req.params.pokemonId

//     next()
// })

// app.get("/pokemon/:pokemonId/status", async (req, res) => {
//     await new Promise((resolve) => {
//         setTimeout(() => {
//             resolve()
//         }, 5000)
//     })

//     res.json({
//         pokemonId,
//     })
// })

//THIS IS HOW TO DO IT CORRECTLY
app.use("/pokemon/:pokemonId", (req, res, next) => {
    res.locals.pokemonId = req.params.pokemonId

    next()
})

app.get("/pokemon/:pokemonId/status", async (req, res) => {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, 5000)
    })

    res.json({
        pokemonId: res.locals.pokemonId,
    })
})

app.listen(3000)
