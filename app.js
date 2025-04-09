import express from 'express'
import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import { error, log } from 'console'
import { fileURLToPath } from 'url'

import mongodb from './utils/mogoClient.js'

import authenRouter from './routes/authenRouter.js'
import citiesRouter from './routes/citiesRouter.js'
import typesRouter from './routes/typeRouter.js'
import hotelsRouter from './routes/hotelsRouter.js'
import transactionRouter from './routes/transactionRouter.js'



// Get _dirname equivalent in ES6 modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



const app = express()
app.use(cors())
app.use(express.json())
// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     log(req.body)
//     next()
// })

app.use(express.static(path.join(__dirname, 'public')))



// Simulate latency of network from server to client

// app.use((req, res, next) => {
//     setTimeout(() => {
//         next()
//     }, 3000);
// })



app.use(authenRouter)
app.use(citiesRouter)
app.use(typesRouter)
app.use(hotelsRouter)
app.use(transactionRouter)

app.use((error, req, res, next) => {
    const status = error.status || 500
    error.message = error.message || 'Internal Serser Error'
    console.error(error)
    res.status(status).json(error)
})

mongoose.connect(process.env.MongoDb_URI)
    .then(() => mongodb.connect())
    .then(client =>
        app.listen(5000)
    )
    .catch(err => error(err))

/*
mongoimport --uri="mongodb://127.0.0.1:27017/asm2?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.9" --collection="hotels" --file hotels.json --jsonArray
*/