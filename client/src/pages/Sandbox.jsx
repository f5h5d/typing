import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsMultiplayer } from "../redux/multiplayerSlice";
import { setTypingMode } from "../redux/typingSlice";

import MainTypingGame from "../components/generalTyping/MainTypingGame"
import { GAME_MODES } from "../constants";

const Sandbox = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setIsMultiplayer(false));
    dispatch(setTypingMode(GAME_MODES.SANDBOX))
  }, [])

  return (
    <>
      <MainTypingGame />
    </>
  );
};

export default Sandbox;


