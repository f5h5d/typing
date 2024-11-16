import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import 'react-simple-keyboard/build/css/index.css';
import TypingTracker from "../generalTyping/TypingTracker";
import TypingSection from "../generalTyping/TypingSection";
import PercentageComplete from "../generalTyping/PercentageComplete";
import { useDispatch, useSelector} from "react-redux";
import NumberInfo from "../generalTyping/NumberInfo";
import axios from "axios";
import { reset, setStartTime, setTypingBackgroundInfo, setTypingMode, setTypingText } from "../../redux/typingSlice";
import OtherPlayersPercentageComplete from "../multiplayer/OtherPlayersPercentageComplete";
import { setHasRaceStarted, setIsMultiplayer, setOtherPlayersData, setPreRaceTimer, setRacePlacement, setSocketID } from "../../redux/multiplayerSlice";
import { socket } from "../../Socket";

const PrivateRaceGame = () => {
  const dispatch = useDispatch()
  const finishedTest = useSelector((state) => state.typing.finishedTest);
  const wpm = useSelector((state) => state.typing.wpm);
  const wordsTyped = useSelector((state) => state.typing.wordsTyped)
  const typingText = useSelector((state) => state.typing.typingText)
  const wpmRecord = useSelector((state) => state.typing.wpmRecord)
  const startTime = useSelector((state) => state.typing.startTime)
  const typingRef = useRef(null);

  const mode = useSelector((state) => state.multiplayer.mode);
  const preRaceTimer = useSelector((state) => state.multiplayer.preRaceTimer)
  const hasRaceStarted = useSelector((state) => state.multiplayer.hasRaceStarted)

  const roomOwner = useSelector((state) => state.private.roomOwner)
  const percentage = (wordsTyped / typingText.split(" ").length) * 100;

  // const startTimeRef = startTime

  useEffect(() => {
    socket.on("initialize_typing_quote", (data) => {
      dispatch(reset())
      dispatch(setTypingText(data.words))
      dispatch(setTypingBackgroundInfo(data))
      typingRef.current.value = ""

    })

    socket.on("pre_game_timer", (data) => {
      console.log(data)
      dispatch(setPreRaceTimer(data))
      if (data == -1) {

        dispatch(setHasRaceStarted(true));
        setTimeout(() => {
          dispatch(setStartTime(Date.now()))
        }, 300)
      };
    })

    socket.on("update_users_data", (data) => {
      const users = {};
      for (let x in data) { // loop through and keep everyone but the user 
        if(data[x].id !== socket.id) users[data[x].id] = data[x]
      }

      dispatch(setOtherPlayersData(users));
    })

    socket.on("user_finished_position", (data) => {
      console.log(data)
      dispatch(setRacePlacement(data));
    })
  
    return () => {
      socket.off("initalize_users_data");
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
          {!hasRaceStarted ? (
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

const RightSideContainer = styled.div`

`

