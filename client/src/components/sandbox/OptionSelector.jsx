import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedLength, setSelectedType, setTypingText, reset,setTypingBackgroundInfo, setTotalTime, setSelectedDifficulty, setCurrentSelection, setRefillTypingText } from "../../redux/typingSlice";
import axios from "axios"

import styled from "styled-components";



const OptionSelector = ({ typingRef }) => {
  const dispatch = useDispatch();
  const selectedLength = useSelector((state) => state.typing.selectedLength);
  const selectedType = useSelector((state) => state.typing.selectedType);
  const restart = useSelector((state) => state.typing.restart);
  const currentSelection = useSelector((state) => state.typing.currentSelection);
  const selectedDifficulty = useSelector((state) => state.typing.selectedDifficulty)
  const refillTypingText = useSelector((state) => state.typing.refillTypingText);
  const typingText = useSelector((state) => state.typing.typingText)


  useEffect(() => { // for text lengths!
    let minLength;
    let maxLength

    if (selectedType == 0) { // quotes
      if (selectedLength == 0) { // short
        minLength = 50
        maxLength = 100
      } else if (selectedLength == 1) { // medium
        minLength = 101
        maxLength = 150
      } else if (selectedLength == 2) { // long
        minLength = 151
        maxLength = 200
      } else { // extra long
        minLength = 201
        maxLength = 250
      }

      const queryParams = {minLength, maxLength}
      quoteGetter(queryParams)
    } else if (selectedType == 1) {

      let words = 0;
      if (selectedLength == 0) {
        words = 10
      } else if (selectedLength == 1) {
        words = 25
      } else if (selectedLength == 2) {
        words = 50
      } else if (selectedLength == 3) {
        words = 100
      } else if (selectedLength == 4) { // timer
        words = 100
        dispatch(setTotalTime(30))
      } else if (selectedLength == 5) { // timer
        words = 100
        dispatch(setTotalTime(60))
      }


      if (selectedType == 0 || selectedLength < 4) {
        dispatch(setTotalTime(0)) // reset the totalTime value as it should only be not 0 when it is a timed trial
      }
      wordsGetter(selectedDifficulty, words)
    }
  }, [selectedLength, selectedType, selectedDifficulty, restart, refillTypingText])

  const quoteGetter = async (queryParams) => {
    await axios.get("https://api.quotable.io/random", { 
      params: queryParams
    }).then ((response) => {
      dispatch(setTypingBackgroundInfo(response.data))
      dispatch(reset())
      typingRef.current.value = ""
      dispatch(setTypingText(response.data.content))
    }
    )
  }

  const wordsGetter = async (level, words) => {
    await axios.get(`http://localhost:5000/words/${level}/${words}`).then((response) => {
      if (refillTypingText) {
        dispatch(setTypingBackgroundInfo({content: typingText + response.data.words, author: "Google"}))
        dispatch(setTypingText(typingText + " " + response.data.words))
      } else {
        dispatch(setTypingBackgroundInfo({content: response.data.words, author: "Google"}))
        dispatch(reset())
        typingRef.current.value = ""
        dispatch(setTypingText(response.data.words))
      }

    })
  }


  const onButtonClick = (e, selection) => {
    if (currentSelection > 0 && selection == buttonsToLoad.length-1) { // this is back button
      dispatch(setCurrentSelection(currentSelection - 1));
      return;
    } 
    if (currentSelection == 0) {
      dispatch(setSelectedType(selection))
    } else if (currentSelection == 1) {
      dispatch(setSelectedLength(selection))
    } else if (currentSelection == 2) {
      dispatch(setSelectedDifficulty(selection+1))
    }
  // once current selection goes to 2 it should reset back to 0 and show but if option one is selected it should not show last section
  // since option 2 is value of 1 adding 1 to 2 would allow third section to show 
    dispatch(setCurrentSelection((currentSelection + 1 ) % (2 + selectedType)))
  }

  let buttonsToLoad = []

  if (currentSelection == 0) {
    buttonsToLoad = ["Quote", "Words"]
  } 
  else if (currentSelection == 1) {
    if (selectedType == 0) { // quotes
      buttonsToLoad = ["short", "medium", "long", "extra long", "Back"]
    } else if (selectedType == 1) {
      buttonsToLoad = ["10 Words","25 Words", "50 Words", "100 Words", "30 Seconds", "1 Minute", "Back"]
    } 
  } 
  else if (currentSelection == 2) {
    buttonsToLoad = ["easy", "normal", "hard", "Back"]
  }

  return (
    <OptionsContainer>
      <OptionsDiv>
        {buttonsToLoad.map((element, index) => {
          const borderClass = (index == 0 ? "left-button" : index == buttonsToLoad.length-1 ? "right-button" : "")
          const highlightedClass = ((index == selectedType && currentSelection == 0) || (index == selectedLength && currentSelection == 1) || (index == selectedDifficulty-1 && currentSelection == 2) ? "highlighted" : "")
          const red = (currentSelection > 0 && index == buttonsToLoad.length-1) ? "red" : ""
          return <button key={index} className={`option-button ${borderClass} ${highlightedClass} ${red}`} onClick={(e) => onButtonClick(e, index)}>{element}</button>
        })}
      </OptionsDiv>
    </OptionsContainer>
  );
};

export default OptionSelector;

const OptionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  position: relative;
  width: 100vw;
  margin: 0 auto;

`;

const OptionsDiv = styled.div`
  /* background: #161616;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px 20px;
  border-radius: 10px; */
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  height: 30px;

  .option-button {
    border: 1px solid ${({ theme: { colors } }) => colors.blue};
    background: ${({ theme: { colors } }) => colors.blue};
    opacity: 0.5;
    width: 100px;
    height: 30px;
    color: white;
    transition: 0.1s linear;
    cursor: pointer;
    /* border: 1px solid black; */
  }

  .right-button {
    /* border-left: none; */
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .left-button {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .highlighted {
    opacity: 1
  }

  .red {
    background: ${({ theme: { colors } }) => colors.red};
    opacity: 1;
    border: 1px solid ${({ theme: { colors } }) => colors.red};

  }

`
const Line = styled.div`
  /* height: 2px;
  width: 20vw; */


`

const Options = styled.div`
  display: flex;
  overflow: hidden;
  justify-content: center;
  scroll-behavior: smooth;
  transition: all 0.5s ease;
  width: 350px;
  flex-wrap: wrap;

  .option {
    background: ${({ theme: { colors } }) => colors.textDark};
    padding: 5px 10px;
    margin: 5px;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }

  .option:hover {
    cursor: pointer;
    background: ${({ theme: { colors } }) => colors.blue};
    opacity: 0.4;
  }

  .selected {
    background: ${({ theme: { colors } }) => colors.blue};
    opacity:1;
  }
`;


const BigOptions = styled(Options)`
    .option {
    padding: 10px 20px;
    margin: 5px;
  }
`