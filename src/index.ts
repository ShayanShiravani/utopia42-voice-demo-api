import config from './config/core'
import express, { Express } from 'express'
import cors from 'cors'
import gateway from './gateway/index'

const app: Express = express()

app.use(cors({ origin: true, credentials: true }))
app.use('/v1/', gateway)

const port = config.server.port || 5005

app.listen(port, () => console.log(`Server running on port ${port}`))