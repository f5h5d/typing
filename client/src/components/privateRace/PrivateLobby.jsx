import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from "styled-components"
import { setOtherPlayersData, setSocketID } from '../../redux/multiplayerSlice'
import { socket } from '../../Socket'
import { setRoomID, setStartPrivateGame } from '../../redux/privateSlice'
import { useNavigate } from 'react-router-dom'
import { reset } from '../../redux/typingSlice'
const PrivateLobby = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const otherPlayersData = useSelector((state) => state.multiplayer.otherPlayersData)
  const roomID = useSelector((state) => state.private.roomID)
  const roomOwner = useSelector((state) => state.private.roomOwner)

  const typingMode = useSelector((state) => state.typing.typingMode)

  useEffect(() => {

    const onInitializeUserId = (data) => {
      dispatch(setSocketID(data))
    }

    const onInitializeUserDataForOthers = (data) => {
      const users = {};
      for (let x in data) { // loop through and keep everyone but the user 
        if(data[x].id !== socket.id) users[data[x].id] = data[x]
      }
      dispatch(setOtherPlayersData(users));
    }

    const onInitializeOtherUsersData = (data) => {
      const users = {};
      for (let x in data) { // loop through and keep everyone but the user 
        if(data[x].id !== socket.id) users[data[x].id] = data[x]
      }
      dispatch(setOtherPlayersData(users));
    }

    const onStartedGame = () => {
      dispatch(setStartPrivateGame(true))
      socket.emit("track_user", [typingMode, roomID])
    }
    socket.on("initialize_user_id", onInitializeUserId)


    socket.on("initialize_user_data_for_others", onInitializeUserDataForOthers);

    socket.on("initialize_other_users_data", onInitializeOtherUsersData)

    socket.on("started_game", onStartedGame)
  
    return () => {
      socket.off("initialize_user_id", onInitializeUserId);
      socket.off("initialize_user_data_for_others", onInitializeUserDataForOthers);
      socket.off("initialize_other_users_data", onInitializeOtherUsersData);
      socket.off("started_game", onStartedGame);
    };
  }, [socket, dispatch]);


  const onStartClick = () => {
      socket.emit("start_game", [typingMode, roomID])
      socket.emit("track_user", [typingMode, roomID])
      dispatch(setStartPrivateGame(true));
  }

  const onHomeClick = () => {
    socket.emit("pre_disconnect", [typingMode, roomID])
    dispatch(setRoomID(""))
  }
  
  return (
    <Container>
      <h1>Room Code: {roomID}</h1>
      <Players>
        <Player><p>{roomOwner ? "Owner" : ""}(You)</p></Player>
        {Object.keys(otherPlayersData).map((id) => {
            return <Player><p>{otherPlayersData[id].roomOwner ? "Owner" : ""} {otherPlayersData[id].username}</p></Player>
          })}
      </Players>
      <ButtonContainer>
        <button onClick={onHomeClick}>Back</button>
        {roomOwner ? <button onClick={() => onStartClick()}>Start</button> : ""} {/* should only be able to start game if room owner */}
      </ButtonContainer>
    </Container>
  )
}

export default PrivateLobby

const Container = styled.div`
  position: absolute;
  height: 100vh;
  width: 100vw;
  background: rgba(0,0,0,0.5);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1 {
    font-size: 45px;
  }
`

const ButtonContainer = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  button {
    width: 100px;
    height: 30px;
    color: white;
    background: ${({ theme: { colors } }) => colors.blue};
    border-radius: 10px;
    margin: 0 20px;
    cursor: pointer;
  }

`

const Players = styled.div`
  width: 80%;

  background: ${({ theme: { colors } }) => colors.background};
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  display: flex;
  justify-content: top;
  align-items: center;
  flex-direction: column;

  border-radius: 10px;
`

const Player = styled.div`
  width: 80%;
  height: 50px;
  margin: 10px 0px;

  border-radius: 10px;
  background: ${({ theme: { colors } }) => colors.lightBackground};

  display: flex;
  align-items: center;



  p {
    margin-left: 20px;
    background: ${({ theme: { colors } }) => colors.background};
    padding: 5px;
    border-radius: 10px;
  }
`