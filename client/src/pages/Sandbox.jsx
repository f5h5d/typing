import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsMultiplayer } from "../redux/multiplayerSlice";
import { setTypingMode } from "../redux/typingSlice";

import MainTypingGame from "../components/generalTyping/MainTypingGame"
import { GAME_MODES, PAGES } from "../constants";
import { setCurrentPage } from "../redux/userSlice";

const Sandbox = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setIsMultiplayer(false));
    dispatch(setTypingMode(GAME_MODES.SANDBOX))

    dispatch(setCurrentPage(PAGES.SANDBOX));
  }, [])

  return (
    <>
      <MainTypingGame />
    </>
  );
};

export default Sandbox;


