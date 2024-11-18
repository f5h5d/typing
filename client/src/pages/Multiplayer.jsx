import React, { useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { setTypingMode } from "../redux/typingSlice";
import { setIsMultiplayer } from "../redux/multiplayerSlice";
import { socket } from "../Socket";
import MainTypingGame from "../components/generalTyping/MainTypingGame";
import { setRoomID } from "../redux/privateSlice";
import { GAME_MODES } from "../constants";

const Multiplayer = () => {

  // Detect tab close or window unload
  window.addEventListener('beforeunload', () => {
    // Emit data to the backend before the tab closes
    socket.emit('pre_disconnect', [typingMode, roomID]);
  });


  const dispatch = useDispatch()
  const typingText = useSelector((state) => state.typing.typingText)

  const typingMode = useSelector((state) => state.typing.typingMode)
  const roomID = useSelector((state) => state.private.roomID)

  useEffect(() => {
    dispatch(setIsMultiplayer(true));
    dispatch(setTypingMode(GAME_MODES.MULTIPLAYER))
  }, [])

  useEffect(() => {
    const runCode = () => {
      socket.emit('pre_disconnect', [typingMode, roomID]);
    }

    // Detect tab close or window unload
    window.addEventListener('unload', runCode);

    return () => {
      window.removeEventListener('unload', runCode)
    }
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

      console.log(roomID)
      socket.disconnect([typingMode, roomID]);
    };
  }, []);


  useEffect(() => {
    socket.on("get_room_id", (id) => {

      console.log("ROOM ID GETTING: "  + id)
      dispatch(setRoomID(id))

      console.log('i thought that you were dreaming of')
      socket.emit("track_user", id)
    })

    socket.on("tell_user_to_start_game", (roomID) => {
      socket.emit("start_game", [GAME_MODES.MULTIPLAYER, roomID])
    })

    return () => {
      socket.off("get_room_id");
      socket.off("ell_user_to_start_game");
    }

  }, [dispatch, socket])
  return (
    <MainTypingGame />
  );
};

export default Multiplayer;