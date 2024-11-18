import React, { useEffect } from 'react'
import styled from "styled-components"
import PrivateLobbyChooser from '../components/privateRace/PrivateLobbyChooser'
import MainTypingGame from '../components/generalTyping/MainTypingGame'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '../Socket'
import PrivateLobby from '../components/privateRace/PrivateLobby'
import { setHasRaceStarted, setIsMultiplayer } from '../redux/multiplayerSlice'
import { reset, setTypingMode } from '../redux/typingSlice'
import { setStartPrivateGame } from '../redux/privateSlice'
import { GAME_MODES } from '../constants'


const PrivateRace = () => {
  const dispatch = useDispatch()
  const roomID = useSelector((state) => state.private.roomID)
  const startPrivateGame = useSelector((state) => state.private.startPrivateGame)
  
  useEffect(() => {
    dispatch(setIsMultiplayer(true));
    dispatch(setTypingMode(GAME_MODES.PRIVATE))
  }, [])

  useEffect(() => {
    socket.on("users_back_to_lobby", () => {
      dispatch(reset())
      dispatch(setStartPrivateGame(false))
      dispatch(setHasRaceStarted(false));
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
      {roomID == "" ? <PrivateLobbyChooser /> : !startPrivateGame ? <PrivateLobby /> : <MainTypingGame />}
    </>
  )
}

export default PrivateRace

const Container = styled.div`
  

`