import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import 'react-simple-keyboard/build/css/index.css';
import TypingTracker from "../components/generalTyping/TypingTracker";
import TypingSection from "../components/generalTyping/TypingSection";
import OptionSelector from "../components/sandbox/OptionSelector";
import PercentageComplete from "../components/generalTyping/PercentageComplete";
import { useDispatch, useSelector} from "react-redux";
import NumberInfo from "../components/generalTyping/NumberInfo";
import { setIsMultiplayer } from "../redux/multiplayerSlice";
import { setTypingMode } from "../redux/typingSlice";

const Sandbox = () => {
  const dispatch = useDispatch()
  const finishedTest = useSelector((state) => state.typing.finishedTest);

  const typingRef = useRef(null);
  

  useEffect(() => {
    dispatch(setIsMultiplayer(false));
    dispatch(setTypingMode(0))
  }, [])

  return (
    <>
      {finishedTest ? 

        <PostTypingContainer>
          <NumberInfo />
        </PostTypingContainer> 
        :
        <Container>
          <PercentageCompleteSection>
            <PercentageComplete />
          </PercentageCompleteSection>
          <TypingContainer>
            <TypingTracker />
            <TypingSection typingRef={typingRef}/>
          </TypingContainer>
          <Options>
            <OptionSelector typingRef={typingRef}/>
          </Options>
        </Container>
      }
    </>
  );
};

export default Sandbox;

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
  height: 20vh;
  margin-top: 50px;
  margin-bottom: 50px;
`

const RightSideContainer = styled.div`

`


