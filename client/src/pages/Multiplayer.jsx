import React, { useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { setTypingMode } from "../redux/typingSlice";
import { setIsMultiplayer } from "../redux/multiplayerSlice";
import { socket } from "../Socket";
import MainTypingGame from "../components/generalTyping/MainTypingGame";
import { setRoomID } from "../redux/privateSlice";

const Multiplayer = () => {
  const dispatch = useDispatch()
  const typingText = useSelector((state) => state.typing.typingText)

  useEffect(() => {
    dispatch(setIsMultiplayer(true));
    dispatch(setTypingMode(1))
  }, [])

  useEffect(() => {
    socket.connect();

    const userData = {
      username: "",
      wpm: 0,
      currentWord: typingText.split(" ")[0],
      percentage: 0,
      id: ""
    }

    socket.emit("join_room", [0, 1, userData])
    return () => {
      socket.disconnect();
    };
  }, []);


  useEffect(() => {
    socket.on("get_room_id", (id) => {
      setRoomID(id)
      socket.emit("track_user", id)
    })

    socket.on("tell_user_to_start_game", (roomID) => {
      socket.emit("start_game", [1, roomID])
    })

  }, [dispatch, socket])
  return (
    <MainTypingGame />
  );
};

export default Multiplayer;