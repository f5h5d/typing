import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import { socket } from '../../Socket'
import { useDispatch, useSelector } from 'react-redux'
import { setJoiningRoom, setRoomID, setStartPrivateGame } from '../../redux/privateSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
const JoinRoomModal = ({ }) => {
  const dispatch = useDispatch()
  const typingMode = useSelector((state) => state.typing.typingMode)
  const [errMessage, setErrMessage] = useState("")

  let id = ""

  const onRoomIDChange = (e) => {
    if (e.target.value.length > 6) {
      e.target.value = e.target.value.slice(0, 6)
    }
    id = e.target.value
  }

  useEffect(() => {
    socket.on("successfuly_joined_private_room", (roomID) => {
      dispatch(setRoomID(roomID))
    })

    socket.on("room_doesnt_exist", () => {
      setErrMessage("invalid room code - room doesn't exist")
    })

    return () => {
      socket.off("successfuly_joined_private_room");
      socket.off("room_doesnt_exist");
    }
  }, [socket, dispatch])


  const joinRoom = () => {
    socket.emit("join_private_room", id)

    const userData = {
      username: "",
      wpm: 0,
      currentWord: "",
      percentage: 0,
      id: "",
      roomOwner: false,
    }
    socket.emit("join_room", [id, typingMode, userData])
  }

  const onCancel = () => {
    dispatch(setJoiningRoom(false));
  }
  return (
    <Container>
      <JoinBox>
        <FontAwesomeIcon icon={faX} className="close-box" onClick={onCancel}/>
        <h1>Join Room</h1>
        <input onChange={(e) => onRoomIDChange(e)}/>
        <button onClick={joinRoom}>Join</button>
        {errMessage == "" ? "" : <div className="err-message">{errMessage}</div>}
      </JoinBox>
    </Container>
  )
}

export default JoinRoomModal

const Container = styled.div`
  position: absolute;
  height: 100vh;
  width: 100vw;
  background: rgba(0,0,0,0.5);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
`

const JoinBox = styled.div`
  height: 400px;
  width: 800px;
  background: ${({ theme: { colors } }) => colors.lightBackground};
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;


  .close-box {
    position: absolute;
    top: 0;
    right: 0;
    color: white;
    font-size: 20px;

    padding: 10px;
    color: ${({ theme: { colors } }) => colors.red};
    cursor: pointer;
  }

  .close-box:hover {
    color: ${({ theme: { colors } }) => colors.white};
    background: ${({ theme: { colors } }) => colors.red};
    border-radius: 10px;
  }

  input {
    width: 50%;

    height: 50px;
    font-size: 50px;
    background: ${({ theme: { colors } }) => colors.background};
    border-bottom: 5px solid ${({ theme: { colors } }) => colors.blue};
    color: white;
    font-weight: bold;
    text-align: center;
  }

  button {
    background: ${({ theme: { colors } }) => colors.blue};
    font-size: 25px;
    padding: 5px 20px;

    margin-top: 50px;
    border-radius: 10px;
    color: ${({ theme: { colors } }) => colors.white};
    cursor: pointer;
  }

  .err-message {
    position: absolute;
    bottom: 50px;
    color: ${({ theme: { colors } }) => colors.red};
  }

`