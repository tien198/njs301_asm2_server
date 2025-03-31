import dotenv from 'dotenv'
dotenv.config()
import { error } from 'console'
import { MongoClient } from 'mongodb'

const MongoDb_URI = process.env.MongoDb_URI

const client = new MongoClient(MongoDb_URI, {
    maxPoolSize: 10,
    minPoolSize: 2
})

export default client

export async function connect() {
    try {
        return await client.connect()
    }
    catch (err) {
        error(err)
    }
}

export function getHotelsDb() {
    return client.db('hotels')
}