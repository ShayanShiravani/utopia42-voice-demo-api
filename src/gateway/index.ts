import express, { Router, Request, Response } from 'express'
import { AccessToken } from 'livekit-server-sdk'
import { body, validationResult } from 'express-validator'
import bodyParser from 'body-parser'
import { createRoom, getParticipant, getRoom} from '../utils/livekit'

const router: Router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/join', 
  body('verse').isString().not().isEmpty().trim().escape(),
  body('participant').isString().not().isEmpty().trim().escape(),
  async (req: Request, res: Response, next): Promise<void> => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.json({
        success: false,
        message: "INVALID_PARAMS"
      })
      return next()
    }

    const {verse: roomName, participant: participantName}: 
    { verse: string, participant: string } = req.body

    try {

      let room = await getRoom(roomName)
      if(!room) {
        if(!await createRoom(roomName)) {
          res.json({
            success: false,
            message: "CANNOT_CREATE_ROOM"
          })
          return next()
        }
      }
      
      if(await getParticipant(roomName, participantName)) {
        res.json({
          success: false,
          message: "DUPLICATE_USERNAME"
        })
        return next()
      }

      const at = new AccessToken(undefined, undefined, {
        identity: participantName,
      })
      at.addGrant(
        { 
          roomJoin: true, 
          room: roomName,
        }
      )
      const token = at.toJwt()

      res.json({
        success: true,
        data: token
      })

    } catch(err: any) {
      let message = err.message?err.message:err
      res.json({
        success: false,
        message: message
      })
    }
})

export default router