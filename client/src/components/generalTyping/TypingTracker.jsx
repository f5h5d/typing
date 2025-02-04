import React, {useCallback, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styled from "styled-components"
import { setElapsedTime, setEndTime, setFinishedTest, setWpm, setWpmRecord, setRestart } from "../../redux/typingSlice";

const TypingTracker = () => {
  const dispatch = useDispatch()
  const typingText = useSelector((state) => state.typing.typingText);
  const userTyped = useSelector((state) => state.typing.userTyped)
  const wordsTyped = useSelector((state) => state.typing.wordsTyped);
  const startTime = useSelector((state) => state.typing.startTime);
  const wpm = useSelector((state) => state.typing.wpm);
  const wpmRecord = useSelector((state) => state.typing.wpmRecord)
  const mistakes = useSelector((state) => state.typing.mistakes)
  const finishedTest = useSelector((state) => state.typing.finishedTest)
  const typingType = useSelector((state) => state.typing.typingType)
  const selectedLength = useSelector((state) => state.typing.selectedLength)
  const typedAtAll = useSelector((state) => state.typing.typedAtAll)
  const elapsedTime = useSelector((state) => state.typing.elapsedTime)
  const totalTime = useSelector((state) => state.typing.totalTime)
  const lastTyped = useSelector((state) => state.typing.lastTyped)

  const preRaceTimer = useSelector((state) => state.multiplayer.preRaceTimer)
  const isMultiplayer = useSelector((state) => state.multiplayer.isMultiplayer)
  const hasRaceStarted = useSelector((state) => state.multiplayer.hasRaceStarted)
  const deltaTime = useRef(startTime) 

  const wpmRef = useRef(wpm);
  const mistakesRef = useRef(mistakes)
  const wordsTypedRef = useRef(wordsTyped)
  const wpmRecordRef = useRef(wpmRecord)
  const typingTextRef = useRef(typingText)
  const startTimeRef = useRef(startTime)
  const typedAtAllRef = useRef(typedAtAll);
  const selectedTypeRef = useRef(typingType)
  const selectedLengthRef = useRef(selectedLength);
  const totalTimeRef = useRef(totalTime)
  const lastTypedRef = useRef(lastTyped);
  const isMultiplayerRef = useRef(isMultiplayer);
  const preRaceTimerRef = useRef(preRaceTimer);
  const hasRaceStartedRef = useRef(hasRaceStarted)

  useEffect(() => {
    wpmRef.current = wpm
  }, [wpm])

  useEffect(() => {
    mistakesRef.current = mistakes
  }, [mistakes])

  useEffect(() => {
    wordsTypedRef.current = wordsTyped
  }, [wordsTyped])

  useEffect(() => {
    wpmRecordRef.current = wpmRecord
  }, [wpmRecord])

  useEffect(() => {
    typingTextRef.current = typingText
  }, [typingText])

  useEffect(() => {
    startTimeRef.current = startTime
  }, [startTime])


  useEffect(() => {
    typedAtAllRef.current = typedAtAll
  }, [typedAtAll])

  useEffect(() => {
    selectedTypeRef.current = typingType
  }, [typingType])

  useEffect(() => {
    selectedLengthRef.current = selectedLength
  }, [selectedLength])

  useEffect(() => {
    totalTimeRef.current = totalTime
  }, [totalTime])

  useEffect(() => {
    lastTypedRef.current = lastTyped
  }, [lastTyped])

  useEffect(() => {
    isMultiplayerRef.current = isMultiplayer
  }, [isMultiplayer])

  useEffect(() => {
    preRaceTimerRef.current = preRaceTimer
  }, [preRaceTimer])

  useEffect(() => {
    hasRaceStartedRef.current = hasRaceStarted
  }, [hasRaceStarted])


  
  useEffect(() => {
    let deltaTime = startTimeRef.current;
    const intervalID = setInterval(() => {
      if ((!isMultiplayerRef.current && !typedAtAllRef.current) || (isMultiplayerRef.current && !hasRaceStartedRef.current)) { // if single player check if user has not typed yet or if in multiplayer check if pregame timer is still going ended, if either true then reset delta time and wait
        deltaTime = Date.now()
      } else {
        if (((Date.now() - startTimeRef.current) % 1000 > 9 && deltaTime !== 0) || Math.trunc((Date.now() - startTimeRef.current)/1000) == 0) return; // if less than 1 second has passed dont run the function or if atleast one second hasnt passed
        
        if ((Date.now() - lastTypedRef.current)/1000 > 20) { // has been longer than 20 seconds since user last typed, so void test
          dispatch(setRestart(true))
        }
        if (selectedTypeRef.current == 0 || (selectedLengthRef.current >= 4)) {
          dispatch(setElapsedTime(Date.now() - startTimeRef.current))

          if (totalTimeRef.current - Math.trunc((Date.now() - startTimeRef.current)/1000) == 0) { // the total time has elapsed for the timed trials
            dispatch(setEndTime(Date.now()))
            console.log("finished time trial")
            dispatch(setFinishedTest(true));
          }
        }
        

        const lettersTyped = typingTextRef.current.split(" ").slice(0,wordsTypedRef.current).join(" ").length;
        const newWpm = Math.round((lettersTyped / 5) / ((Date.now() - startTimeRef.current)/60000));
        dispatch(setWpm(newWpm))
        dispatch(setWpmRecord([...wpmRecordRef.current, {time: Math.trunc((Date.now() - startTimeRef.current)/1000), wpm: newWpm, mistakes: mistakesRef.current}]))
        deltaTime = Date.now();
      }

    }, 10)

    return () => clearInterval(intervalID)
  }, [wpmRef, mistakesRef, wordsTypedRef, wpmRecordRef, typingTextRef, startTimeRef, typedAtAllRef, selectedTypeRef, selectedLengthRef, totalTimeRef, lastTypedRef, isMultiplayerRef, preRaceTimerRef, hasRaceStartedRef])

  

  const accuracy = Math.round(typingText.length / (mistakes + typingText.length) * 100)
  let firstSection = ""

  if (typingType == 0) {
    firstSection = `${Math.trunc(elapsedTime/1000)}s`
  } else if (selectedLength >= 4) {
    firstSection = `${totalTime - Math.trunc(elapsedTime/1000)}s`
  } else {
    firstSection = `${wordsTyped}/${typingText.split(" ").length} words`;
  }
  return (
    <Container>
      <div className="first-section">{firstSection}</div>
      <div className="wpm">{wpm} WPM</div>
      <div className="acc">{accuracy}%</div>
      </Container>
  )
}

export default TypingTracker

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 50%;
  /* background: black; */
  margin-bottom: 5px;
  padding: 0 20px;
  text-align: center;
  max-width: 1000px;


  div {
    width: 110px;
    background: ${({ theme: { colors } }) => colors.lightBackground};
    padding: 5px 10px;
    border-radius: 10px;
    
  }


  @media (max-width: 1050px) {
    div {
      padding: 5px 5px;
    }

    .acc {
      display: none;
    }
  }

  @media (max-width: 550px) {
    justify-content: center;
    div {
      padding: 5px 5px;
    }

    .first-section {
      display: none;
    }
  }
`