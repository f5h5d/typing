import React, { useEffect, useRef } from "react";
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

  const lookingForRoom = useSelector((state) => state.multiplayer.lookingForRoom)

  const lookingForRoomRef = useRef(lookingForRoom)

  useEffect(() => {
    dispatch(setIsMultiplayer(true));
    dispatch(setTypingMode(GAME_MODES.MULTIPLAYER))
  }, [])

  // useEffect(() => {
  //   const runCode = () => {
  //     socket.emit('pre_disconnect', [typingMode, roomID]);
  //   }

  //   // Detect tab close or window unload
  //   window.addEventListener('unload', runCode);

  //   return () => {
  //     window.removeEventListener('unload', runCode)
  //   }
  // }, [])

  useEffect(() => {


    socket.connect();

    if (!lookingForRoomRef.current) return;

    const userData = {
      username: "",
      wpm: 0,
      currentWord: typingText.split(" ")[0],
      percentage: 0,
      id: ""
    }

    socket.emit("join_room", [0, 1, userData])
    lookingForRoomRef.current = false;
    return () => {
      socket.disconnect();
    };
  }, []);


  useEffect(() => {
    const onGetRoomId = (id) => {
      dispatch(setRoomID(id))
      socket.emit("track_user", [GAME_MODES.MULTIPLAYER, id])
    }

    const tellUserToStartGame = (roomID) => {
      socket.emit("start_game", [GAME_MODES.MULTIPLAYER, roomID])
    }

    socket.on("get_room_id", onGetRoomId)

    socket.on("tell_user_to_start_game", tellUserToStartGame)

    return () => {
      socket.off("get_room_id", onGetRoomId);
      socket.off("tell_user_to_start_game", tellUserToStartGame);
    }

  }, [dispatch, socket])

  return (
    <MainTypingGame lookingForRoomRef={lookingForRoomRef}/>
  );
};

export default Multiplayer;