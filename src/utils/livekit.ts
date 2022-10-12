import { ParticipantInfo, Room, RoomServiceClient } from "livekit-server-sdk";
import { host as livekitHost } from '../config/livekit'

const svc = new RoomServiceClient(livekitHost)

export const getRoom = async (name: string): Promise<Room | undefined> => {

  const rooms = await getAllRooms()
  if(rooms) {
    return rooms.find(room => room.name === name) 
  }
  return
}

export const getAllRooms = async (): Promise<Room[] | undefined> => {
  
  return svc.listRooms().then((rooms: Room[]) => {
    return rooms
  }).catch(error => {
    console.log(error.message?error.message:error)
    return undefined
  })

}

export const createRoom = async (name: string): Promise<Room> => {

  const opts = {
    name: name,
    emptyTimeout: 10 * 60, // timeout in seconds
  }

  return await svc.createRoom(opts)
}

export const getParticipant = async (room: string, identity: string): 
  Promise<ParticipantInfo | undefined> => {
    return svc.getParticipant(room, identity)
      .then(
        (participant: ParticipantInfo) => {
          return participant
        }
      )
      .catch(error => {
        console.log(error.message?error.message:error)
        return undefined
      }) 
  }

