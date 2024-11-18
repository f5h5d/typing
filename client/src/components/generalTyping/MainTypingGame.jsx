import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import 'react-simple-keyboard/build/css/index.css';
import TypingTracker from "./TypingTracker";
import TypingSection from "./TypingSection";
import PercentageComplete from "./PercentageComplete";
import { useDispatch, useSelector} from "react-redux";
import NumberInfo from "./NumberInfo";
import { reset, setStartTime, setTypingBackgroundInfo, setTypingText } from "../../redux/typingSlice";
import OtherPlayersPercentageComplete from "../multiplayer/OtherPlayersPercentageComplete";
import { setHasRaceStarted, setIsMultiplayer, setOtherPlayersData, setPreRaceTimer, setRacePlacement, setSocketID } from "../../redux/multiplayerSlice";
import { socket } from "../../Socket";
import OptionSelector from "../sandbox/OptionSelector";
import { GAME_MODES } from "../../constants";

const PrivateRaceGame = ({ lookingForRoomRef }) => {
  const dispatch = useDispatch()
  const finishedTest = useSelector((state) => state.typing.finishedTest);
  const wpm = useSelector((state) => state.typing.wpm);
  const wordsTyped = useSelector((state) => state.typing.wordsTyped)
  const typingText = useSelector((state) => state.typing.typingText)
  const wpmRecord = useSelector((state) => state.typing.wpmRecord)
  const typingMode = useSelector((state) => state.typing.typingMode)
  const typingRef = useRef(null);

  const preRaceTimer = useSelector((state) => state.multiplayer.preRaceTimer)
  const hasRaceStarted = useSelector((state) => state.multiplayer.hasRaceStarted)

  const percentage = (wordsTyped / typingText.split(" ").length) * 100;

  useEffect(() => {
    const onInitializeTypingQuote = (data) => {
      dispatch(reset())
      dispatch(setTypingText(data.words))
      dispatch(setTypingBackgroundInfo(data))
      typingRef.current.value = ""
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
    
    const onPreGameTimer = (data) => {
      console.log(data)
      dispatch(setPreRaceTimer(data))
      if (data == -1) {

        dispatch(setHasRaceStarted(true));
        setTimeout(() => {
          dispatch(setStartTime(Date.now()))
        }, 300)
      };
    }

    const updateUsersData = (data) => {
      const users = {};
      for (let x in data) { // loop through and keep everyone but the user 
        if(data[x].id !== socket.id) users[data[x].id] = data[x]
      }

      dispatch(setOtherPlayersData(users));
    }

    const onUserFinishedPosition = (data) => {
      dispatch(setRacePlacement(data));
    }


    socket.on("initialize_typing_quote", onInitializeTypingQuote)

    socket.on("initialize_user_data_for_others", onInitializeUserDataForOthers);

    socket.on("initialize_other_users_data", onInitializeOtherUsersData)

    socket.on("pre_game_timer", onPreGameTimer)

    socket.on("update_users_data", updateUsersData)

    socket.on("user_finished_position", onUserFinishedPosition)
  
    return () => {
      socket.off("initialize_typing_quote", onInitializeTypingQuote);
      socket.off("initialize_user_data_for_others", onInitializeUserDataForOthers);
      socket.off("initialize_other_users_data", onInitializeOtherUsersData);
      socket.off("pre_game_timer", onPreGameTimer);
      socket.off("update_users_data", updateUsersData);
      socket.off("user_finished_position", onUserFinishedPosition);
    };
  }, [socket, dispatch]);


  useEffect(() => {
    if (socket.id == undefined) return;
    socket.emit("update_users_scores", {
      username: socket.id,
      wpm: wpm,
      currentWord: typingText.split(" ")[wordsTyped],
      percentage: percentage,
      id: socket.id
    });
  }, [wpmRecord])

  useEffect(() => {
    if (!finishedTest) return;
    socket.emit("user_finished_test", {
      username: socket.id,
      wpm: wpm,
      currentWord: "",
      percentage: 100,
      id: socket.id
    });
  }, [finishedTest])


  return (
    <>
      {finishedTest ? 

        <PostTypingContainer>
          <NumberInfo />
        </PostTypingContainer> 
        :
        <Container>
          {!hasRaceStarted && typingMode !== GAME_MODES.SANDBOX ? (
            <PreRaceTimer><div className="timer">{preRaceTimer}</div></PreRaceTimer>
          ) : ""}
            <PercentageCompleteSection>
            <PercentageComplete />
            <OtherPlayersPercentageComplete typingRef={typingRef} />
          </PercentageCompleteSection>
          <TypingContainer>
            <TypingTracker />
            <TypingSection typingRef={typingRef}/>
          </TypingContainer>
          <Options>

            {typingMode == GAME_MODES.SANDBOX ? <OptionSelector typingRef={typingRef} /> : ""}
          </Options>
          
        </Container>
}
    </>
  );
};

export default PrivateRaceGame;

const PreRaceTimer = styled.div`
  position: absolute;
  height: 100vh;
  width: 100vw;
  background: rgba(0,0,0,0.5);
  z-index: 10000;

  display: flex;
  justify-content: center;
  align-items: center;
  .timer {
    width: 100px;
    height: 100px;
    background: ${({ theme: { colors } }) => colors.background};
    color: ${({ theme: { colors } }) => colors.blue}; 
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    font-weight: bold;
    border-radius: 10px;
    
  }
`
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;

  overflow-y: auto;
  overflow-x: hidden;
`;

const PostTypingContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`

const TypingContainer = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

`

const Options = styled.div`
  height: 20vh;
`

const PercentageCompleteSection = styled.div`
  max-height: 240px;
  overflow-y: auto;
  margin-top: 50px;
  margin-bottom: 50px;
`


