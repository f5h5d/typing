import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsMultiplayer } from "../redux/multiplayerSlice";
import { setTypingMode } from "../redux/typingSlice";

import MainTypingGame from "../components/generalTyping/MainTypingGame"

const Sandbox = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setIsMultiplayer(false));
    dispatch(setTypingMode(0))
  }, [])

  return (
    <>
      <MainTypingGame />
    </>
  );
};

export default Sandbox;


