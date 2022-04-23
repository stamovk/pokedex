const { json } = require("express/lib/response")
const { pokemonMiddleware, trainerMiddleware } = require("./middlewares")

const trainers = require("./state").trainers

const router = require("express").Router()
module.exports = router

router.use("/:trainerNameOrId", trainerMiddleware)

// router.get("/", getAllTrainers)
// router.get("/:trainerNameOrId", trainerMiddleware, getTrainerByName)

// With 3 arguments, it means | PATH | MIDDLEWARE (or array of middleware) | HANDLER
router.post(
    "/:trainerNameOrId/pokemon/:pokemonNameOrId/capture",
    pokemonMiddleware,
    capturePokemon
)

function capturePokemon(req, res) {
    const { trainer, pokemon } = res.locals

    console.log("taco", pokemon)
    trainer.capturedPokemon.push({
        ...pokemon,
        attack: Math.floor(Math.random() * 10),
        defense: Math.floor(Math.random() * 10),
    })
    if (trainer.capturedPokemon.length === 2) {
        if (
            trainer.capturedPokemon[0].attack >
            trainer.capturedPokemon[1].attack
        ) {
            const winner = trainer.capturedPokemon[0]
            const looser = trainer.capturedPokemon[1]
            trainer.capturedPokemon.splice(1, 1)
            res.json({ winner: winner, looser: looser, trainer })
        } else {
            const winner = trainer.capturedPokemon[1]
            const looser = trainer.capturedPokemon[0]
            trainer.capturedPokemon.splice(0, 1)
            res.json({ winner: winner, looser: looser, trainer })
        }
    } else {
        res.status(200).json({
            trainer,
            message: "choose another pokemon to fight",
        })
    }
}
