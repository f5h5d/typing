import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setJoiningRoom, setRoomOwner } from "../../redux/privateSlice"
import { setRoomID } from '../../redux/multiplayerSlice'
import styled from "styled-components"
import { socket } from '../../Socket'
import JoinRoomModal from './JoinRoomModal'


const PrivateLobbyChooser = () => {
  const dispatch = useDispatch()

  const typingType = useSelector((state) => state.typing.typingType)

  const joiningRoom = useSelector((state) => state.private.joiningRoom)
  const roomID = useSelector((state) => state.multiplayer.roomID)

  const user = useSelector((state) => state.user.user)
  const userStats = useSelector((state) => state.user.userStats)

  const guestWpm = useSelector((state) => state.guestUser.guestWpm)

  const TYPING_MODE = 2;


  const onCreateRoom = () => {
    socket.emit("create_private_room")
  }

  const onJoinRoom = () => {
    dispatch(setJoiningRoom(true));
  }

  useEffect(() => {

    const onCreatedRoom = (id) => {
      dispatch(setRoomOwner(true))
      dispatch(setRoomID(id))

      const username = user ? user.username : "Guest"
      
      const userData = {
        username: username,
        wpm: 0,
        currentWord: "",
        percentage: 0,
        id: "",
        roomOwner: false,
        ...userStats
      }



      socket.emit("join_room", [id, TYPING_MODE, userData, typingType])
    }

    socket.on("created_room", onCreatedRoom)

    return () => {
      socket.off("created_room", onCreatedRoom);
    }
  }, [socket, dispatch])
  return (
    <>
    <Container>
      {joiningRoom ? <JoinRoomModal /> : ""}
      <Option>
        <div className="content-container" onClick={onCreateRoom}>
        <FontAwesomeIcon className="icon" icon={faPlus} />
        <div className="text">Create Room</div>
        </div>
      </Option>
      <Option>
        <div className="content-container" onClick={onJoinRoom}>
          <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
          <div className="text">Join Room</div>
        </div>
      </Option>
    </Container>
    </>
  )
}

export default PrivateLobbyChooser


const Container = styled.div`
  height: 100vh;
  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;

`

const Option = styled.div`
  height: 200px;
  width: 200px;
  margin: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;



  .content-container {
    height: 100%;
    width: 100%;
    background: ${({ theme: { colors } }) => colors.lightBackground};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    border-radius: 10px;
    transition: 0.2s linear;
    cursor: pointer;
  }

  .content-container:hover {
    transform: scale(1.1)
  }

  .text {
    font-size: 25px;
  }
  .icon {
    color: ${({ theme: { colors } }) => colors.blue};
    font-size: 35px;
  }


`