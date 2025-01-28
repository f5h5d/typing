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
  // Detect tab close or window unload
  window.addEventListener('beforeunload', () => {
    // Emit data to the backend before the tab closes
    socket.emit('pre_disconnect', [typingMode, roomID]);
  });


  const dispatch = useDispatch()
  const roomID = useSelector((state) => state.multiplayer.roomID)
  const startPrivateGame = useSelector((state) => state.private.startPrivateGame)

  const typingMode = useSelector((state) => state.typing.typingMode)
  
  useEffect(() => {
    dispatch(setIsMultiplayer(true));
    dispatch(setTypingMode(GAME_MODES.PRIVATE))
  }, [])

  useEffect(() => {
    const onUsersBackToLobby = () => {
      dispatch(reset())
      dispatch(setStartPrivateGame(false))
      dispatch(setHasRaceStarted(false));
    }

    const onStartNewPrivateGame = () => {
      console.log("just so I feel less insane")
      dispatch(reset())
      dispatch(setHasRaceStarted(false));
    }

    socket.on("users_back_to_lobby", onUsersBackToLobby)
    socket.on("start_new_private_game", onStartNewPrivateGame)

    return () => {
      socket.off("users_back_to_lobby", onUsersBackToLobby);
      socket.off("start_new_private_game", onStartNewPrivateGame);
    }
  }, [socket, dispatch])


  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      {roomID == "" ? <PrivateLobbyChooser /> : !startPrivateGame ? <PrivateLobby /> : <MainTypingGame />}
    </>
  )
}

export default PrivateRace;