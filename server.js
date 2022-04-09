const express = require("express")

const bodyParser = require("body-parser")

const app = express()

const PORT = process.env.NODE_ENV === "development" ? 3000 : 5000

const pokemon = require("./pokemon.json")

const trainer = {
    name: "claudia",
    capturedPokemon: [],
}

// console.log(typeof pokemon)
// console.log(pokemon.length)

// console.log(process.env)

// console.log(bodyParser.json())

app.use(bodyParser.json())

app.use("/pokemon/:pokemonNameOrId", (req, res, next) => {
    const pokemonNameOrId = req.params.pokemonNameOrId

    const num = Number(pokemonNameOrId)

    let foundPokemon
    if (num) {
        foundPokemon = pokemon.find(function (el) {
            return el.id === num
        })
    } else {
        const pokemonName = pokemonNameOrId
        foundPokemon = pokemon.find(function (el) {
            return el.name.toLowerCase() === pokemonName.toLowerCase()
        })
    }

    if (!foundPokemon) {
        res.status(404).end()
        return
    }

    res.locals.pokemon = foundPokemon
    next()
})

app.post("/pokemon/:pokemonNameOrId/capture", (req, res) => {
    const found = trainer.capturedPokemon.some((el) => {
        return (
            el.id === Number(req.params.pokemonNameOrId) ||
            el.name.toLowerCase() === req.params.pokemonNameOrId.toLowerCase()
        )
    })
    if (!found) {
        trainer.capturedPokemon.push({
            ...res.locals.pokemon,
            attack: 3,
            defense: 3,
        })
        res.json(trainer)
    } else {
        res.status(409).json({
            message: "you have already captured the pokemon",
        })
    }
})

app.get("/pokemon", (req, res) => {
    res.json(pokemon)
})

app.get("/pokemon/:pokemonNameOrId", (req, res) => {
    // console.log("smokey", req.params)

    // const id = Number(req.params.id)

    // const foundPokemon = pokemon.find(function (el) {
    //     return el.id === id
    // })

    // console.log("taco", foundPokemon)

    res.json(res.locals.pokemon)
})

app.delete("/pokemon/:pokemonNameOrId", (req, res) => {
    // Made obsolete by our middleware
    // const id = Number(req.params.id)
    // const index = pokemon.findIndex(function (el) {
    //     return el.id === id
    // })

    // console.log(index)

    // if (index < 0) {
    //     res.status(404).end()
    //     return
    // }

    const index = pokemon.findIndex(function (el) {
        return el === res.locals.pokemon
    })

    const deletedPokemon = pokemon.splice(index, 1)[0]

    res.json({ deleted: true, pokemon: deletedPokemon })
})

app.get("/pokemon/:pokemonName/image", (req, res) => {
    // const pokemonName = req.params.pokemonName
    const { pokemonName } = req.params // a little "cleaner" to use destructuring

    console.log(pokemonName)

    //http://2832-45-45-65-243.ngrok.io/pokemon/pikachu/image
    // res.sendFile(__dirname + "/images/" + pokemonName + ".jpg")
    res.sendFile(`${__dirname}/images/${pokemonName}.jpg`)
})

app.get("/pokemon/image", (req, res) => {
    // const queryParams = req.query
    // console.log(queryParams)

    // Using destructuring with symbol renaming (property: new-name)
    const { name: pokemonName } = req.query

    res.sendFile(`${__dirname}/images/${pokemonName}.jpg`)
})

app.get("/pokemon/original-list", (req, res) => {
    // console.log(req.rawHeaders) // This are the http headers that the client sends to the server
    res.sendFile(__dirname + "/pokemon.json")
})

app.listen(PORT, () => {
    console.log("listening on PORT " + PORT)
})

// Garbage area
// This one demos how to use the request body, pass an array of ids to the server, and delete many pokemon

// We brought in this middleware specifically for the handler below
// app.use(bodyParser.json())

// app.delete("/pokemon", (req, res) => {
//     const ids = req.body

//     console.log("TAOCOOOOO,", ids)
//     if (!ids || typeof ids !== "object" || !ids.length) {
//         res.status(400).end()
//         return
//     }

//     ids.forEach((id) => {
//         const index = pokemon.findIndex(function (el) {
//             return el.id === id
//         })

//         if (index < 0) {
//             return
//         }

//         pokemon.splice(index, 1)
//     })

//     res.end()
// })
