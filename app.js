import express from 'express'
import bodyParser from 'body-parser'
import router from './routes'

const app = express()

// parse incoming requests data (global).
// example of middleware.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

//use personal router
app.use(router)

const PORT = 5000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})


