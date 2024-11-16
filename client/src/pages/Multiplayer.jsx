import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import 'react-simple-keyboard/build/css/index.css';
import TypingTracker from "../components/generalTyping/TypingTracker";
import TypingSection from "../components/generalTyping/TypingSection";
import PercentageComplete from "../components/generalTyping/PercentageComplete";
import { useDispatch, useSelector} from "react-redux";
import NumberInfo from "../components/generalTyping/NumberInfo";
import axios from "axios";
import { reset, setStartTime, setTypingBackgroundInfo, setTypingMode, setTypingText } from "../redux/typingSlice";
import OtherPlayersPercentageComplete from "../components/multiplayer/OtherPlayersPercentageComplete";
import { setHasRaceStarted, setIsMultiplayer, setOtherPlayersData, setPreRaceTimer, setRacePlacement, setSocketID } from "../redux/multiplayerSlice";
import { socket } from "../Socket";

const Multiplayer = () => {
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

  const percentage = (wordsTyped / typingText.split(" ").length) * 100;

  // const startTimeRef = startTime

  useEffect(() => {
    dispatch(setIsMultiplayer(true));
    dispatch(setTypingMode(1))
  }, [])

  useEffect(() => {
    socket.on("initialize_user_id", (data) => {
      dispatch(setSocketID(data))
    })
    socket.on("initialize_user_data_for_others", (data) => {
      const users = {};
      for (let x in data) { // loop through and keep everyone but the user 
        if(data[x].id !== socket.id) users[data[x].id] = data[x]
      }
      dispatch(setOtherPlayersData(users));
    });

    socket.on("initialize_other_users_data", (data) => {
      dispatch(setOtherPlayersData(data));
    })

    socket.on("initialize_typing_quote", (data) => {
      dispatch(setTypingText(data.words))
      dispatch(setTypingBackgroundInfo(data))
      typingRef.current.value = ""
      dispatch(reset())

    })

    socket.on("pre_game_timer", (data) => {
      dispatch(setPreRaceTimer(data))
      if (data == -1) {

        dispatch(setHasRaceStarted(true));
        console.log(true)
        setTimeout(() => {
          dispatch(setStartTime(Date.now()))
        }, 150)
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
    if (socket.id == undefined) return;
    socket.emit("user_finished_test", {
      username: socket.id,
      wpm: wpm,
      currentWord: "",
      percentage: 100,
      id: socket.id
    });
  }, [finishedTest])



  useEffect(() => {
    socket.connect();
    socket.emit("join_room")
    socket.emit("set_user_data", {
      username: "",
      wpm: 0,
      currentWord: typingText.split(" ")[0],
      percentage: 0,
      id: ""
    })

    return () => {
      socket.off("set_user_data")
      socket.disconnect();
    };
  }, []);

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

export default Multiplayer;

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


