import React, { useEffect } from 'react'
import styled from "styled-components"
import PrivateLobbyChooser from '../components/privateRace/PrivateLobbyChooser'
import PrivateRaceGame from '../components/privateRace/PrivateRaceGame'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '../Socket'
import PrivateLobby from '../components/privateRace/PrivateLobby'
import { setIsMultiplayer } from '../redux/multiplayerSlice'
import { setTypingMode } from '../redux/typingSlice'
import { setStartPrivateGame } from '../redux/privateSlice'


const PrivateRace = () => {
  const dispatch = useDispatch()
  const roomID = useSelector((state) => state.private.roomID)
  const wordsTyped = useSelector((state) => state.typing.wordsTyped)
  const startPrivateGame = useSelector((state) => state.private.startPrivateGame)
  const reset = useSelector((state) => state.typing.reset);


  
  useEffect(() => {
    console.log(roomID)
    dispatch(setIsMultiplayer(true));
    dispatch(setTypingMode(2))
  }, [])

  useEffect(() => {
    socket.on("users_back_to_lobby", () => {
      dispatch(setStartPrivateGame(false))
      reset()
    })
  }, [socket, dispatch])


  useEffect(() => {
    socket.connect();

    return () => {
      socket.off("set_user_data")
      socket.disconnect();
    };
  }, []);
  return (
    <>
      {roomID == "" ? <PrivateLobbyChooser /> : !startPrivateGame ? <PrivateLobby /> : <PrivateRaceGame />}
    </>
  )
}

export default PrivateRace

const Container = styled.div`
  

`