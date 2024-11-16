import React, { useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  setUserTyped,
  setIncorrectText,
  setWordsTyped,
  setMouseX,
  setWordsPerLine,
  setStartTime,
  setFinishedTest,
  setEndTime,
  setMistakes,
  setWpmRecord,
  setTypedAtAll,
  setRestart,
  setRefillTypingText,
  setLastTyped
} from "../../redux/typingSlice";
import { checkBeforeKeyPress, updateText, getStyledText } from "../../logic/typing";


const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const TypingSection = ({ typingRef }) => {
  const dispatch = useDispatch();
  const typingText = useSelector((state) => state.typing.typingText);
  const userTyped = useSelector((state) => state.typing.userTyped);
  const incorrectText = useSelector((state) => state.typing.incorrectText);
  const mistakes = useSelector((state) => state.typing.mistakes);
  const wordsTyped = useSelector((state) => state.typing.wordsTyped);
  const mouseX = useSelector((state) => state.typing.mouseX);
  const wordsPerLine = useSelector((state) => state.typing.wordsPerLine);
  const wpmRecord = useSelector((state) => state.typing.wpmRecord)
  const typedAtAll = useSelector((state) => state.typing.typedAtAll)
  const startTime = useSelector((state) => state.typing.startTime)
  const wpm = useSelector((state) => state.typing.wpm)
  const selectedType = useSelector((state) => state.typing.selectedType)
  const selectedLength = useSelector((state) => state.typing.selectedLength)
  const isMultiplayer = useSelector((state) => state.multiplayer.isMultiplayer)
  const preRaceTimer = useSelector((state) => state.multiplayer.preRaceTimer)
  const hasRaceStarted = useSelector((state) => state.multiplayer.hasRaceStarted)
  const typingTextRef = useRef(null);
  const cursorRef = useRef(null)


// stores value for the fake input field, uses regex to keep the deliminator while splitting ( a space )
  let textToShow = typingRef.current == null ? "" : typingRef.current.value == "" ? "" : typingRef.current.value.match(new RegExp(`[^${" "}]+|${" "}`, "g")).slice(wordsTyped*2);
  let test = ""
  for (let x of textToShow) {
    if (x !== " ") test += x
    else test += "\u00A0"
  }

  const findCurrentLineNum = useCallback(() => {
    const updatedWordsPerLine = [];
    const words = [...typingTextRef.current.children]
    const invisibleWords = words.filter(child => child.classList[2] == "invisible") 
    for (const child of invisibleWords) { // used for resetting invisible to be off on words that have it to accurately find numOfLines
      child.classList.toggle("invisible")
    }


    const numOfLines = (cursorRef.current.getBoundingClientRect().top-words[0].getBoundingClientRect().top)/40+1; // gets difference of cursor and typing div relative to top of page and divides by the "lineheight" to get number of lines

    for (let i = 0; i < numOfLines; i++) {
      updatedWordsPerLine[i] = 0;
    }

    for (const child of words) {  // convert children of typingtext to array to loop over
      if (child.getElementsByClassName("cursor").length) break; // stop loop when loop has reached where user has typed upto
      const index = (cursorRef.current.getBoundingClientRect().top-child.getBoundingClientRect().top)/40
      updatedWordsPerLine[index] +=1 // check if index exists, if not set to 1 otherwise increment => recreates the "wordsPerLine" array
    }

    for (const child of invisibleWords) { // used for resetting everything
        child.classList.toggle("invisible")
      }
    dispatch(setWordsPerLine(updatedWordsPerLine.reverse()));
    dispatch(setMouseX(-1)) // set to -1 because text has not updated yet so tells the isNewLine function to update it 
  }, [wordsPerLine,typingTextRef, cursorRef])


  const debouncedResizeHandler = useMemo(() => debounce(findCurrentLineNum, 700), [findCurrentLineNum]);

  useEffect(() => { // for implementing finding resize
    window.addEventListener('resize', debouncedResizeHandler);
    
    return () => {
     window.removeEventListener('resize', debouncedResizeHandler);
    };
    
  }, [findCurrentLineNum]);

  const isNewLine = () => {
    let clonedWordsPerLine = [...wordsPerLine];
    const cursorPos = cursorRef.current.getBoundingClientRect();
    clonedWordsPerLine[clonedWordsPerLine.length - 1] += 1;
    if (mouseX !== 0 && cursorPos.x < mouseX) { // check if the user has gone to the next line => if previous x value is greater than current means reset line | check for -1 because -1 signifies user resized page which can cause misalignment
      dispatch(setMouseX(cursorPos.x))
      if (mouseX != 0) {
        clonedWordsPerLine[clonedWordsPerLine.length] = 0; // first word of next line has been typed so must account for that
        // clonedWordsPerLine[clonedWordsPerLine.length-2] -= 1; // must account for the "accidental" increment earlier in the function call
      }
    } else { // otherwise update the current position of the cursor
      dispatch(setMouseX(cursorPos.x))
    }
    dispatch(setWordsPerLine(clonedWordsPerLine));
  }


  return (
        <TypingText>
          <div
            onBlur={(e) => e.target.focus()}
            onKeyDown={(e) => checkForBackspace(e)}
          >
            {getStyledText(typingText, typingRef, typingTextRef, wordsTyped, wordsPerLine, cursorRef)}
          </div>
          <textarea
            onBlur={(e) => e.target.focus()}
            onChange={(e) => updateText(e, typingRef, typingText, dispatch, wordsTyped, incorrectText, mistakes, wpmRecord, typedAtAll, wpm, startTime, selectedType, selectedLength, isMultiplayer, hasRaceStarted, setWordsTyped, setIncorrectText, setUserTyped, setStartTime, setFinishedTest, setEndTime, setMistakes, setWpmRecord, setTypedAtAll, setRefillTypingText, isNewLine)}
            onKeyDown={(e) => checkBeforeKeyPress(e, incorrectText, typingText, wordsTyped, isMultiplayer, hasRaceStarted, typingRef, typingTextRef, cursorRef, dispatch, setUserTyped, setIncorrectText, setLastTyped, setRestart)}
            onMouseDown={(e) => e.preventDefault()}
            autoFocus
            ref={typingRef}
          />
          {/* input portion */}
          <div className="typingArea">
            <div className="fake-input">
              {test}
              <div className="fake-cursor"></div>
            </div>
          </div>
        </TypingText>
  );
};

export default TypingSection;

const TypingText = styled.div`
  max-width: 1000px;
  position: relative;
  width: 50vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  font-family: "JetBrains Mono", serif !important;

  .typingArea {
    width: 50vw;
    height: 50px;
    background: #0a0a0a;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    padding: 0 20px;
    /* box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px; */
    display: flex;
    align-items: center;
    max-width: 1000px;
    .fake-input {
      width: 100%;
      height: 65%;
      border-radius: 10px;
      font-size: 15px;
      background: #161515;
      color: white;
      padding-left: 10px;
      
      display: flex;
      align-items: center;
      cursor:text;
      max-width: 1000px;
    }

    .fake-cursor {
    display: inline-block;
    height: 20px !important;
    width: 2px !important;
    background: ${({ theme: { colors } }) => colors.blue};
    border-radius: 4px;
    animation: blink 2s infinite;
  }
  }

  .typingTextContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: hidden;
    height: 160px;
    width: 50vw;
    max-width: 1000px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    padding: 10px 20px;
    background: #161515;
    letter-spacing: 0px;
    /* box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px; */
  }

  .typingTextContainer::after {
  content: "Lorem ipsum dolor sit amet consectetur adipiscing elit"; /* Placeholder text */
  opacity: 0; /* Makes it invisible */
  visibility: visible; /* Ensures the content still takes up space */
  white-space: pre-wrap; /* Ensures it wraps like normal text */
  display: block;
  width: 100%;
  min-height: 3em; /* Adjust for the number of lines you want to simulate */
}

  div {
    color: ${({ theme: { colors } }) => colors.textDark};
    line-height: 40px;
    font-size: 23px;
    cursor: default;
    position: relative;
  }

  textarea {
    resize: none;
    height: 100%;
    /* width: 100%; */

    min-width: 10%;
    max-width: 100%;
    position: absolute;
    color: transparent;
    cursor: default;
    overflow: hidden;
  }

  .word {
    margin: 0 5px;
  }

  .finished {
    color: ${({ theme: { colors } }) => colors.text};
  }

  .incorrect {
    background: ${({ theme: { colors } }) => colors.red};
    color: ${({ theme: { colors } }) => colors.text};
  }

  .cursor {
    position: absolute;
    display: inline-block;
    height: 40px !important;
    width: 3px !important;
    background: ${({ theme: { colors } }) => colors.blue};
    border-radius: 4px;
    animation: blink 2s infinite;
  }

  .cursor-line-two {
    top: 40px;
  }

  .cursor-line-two {
    top: 80px;
  }

  .invisible {
    display: none;
  }

  @keyframes blink {
    from {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }


  @media (max-width: 1050px) {
    div {
      font-size: 20px
    }
  }

  @media (max-width: 550px) {
    div {
      font-size: 17px
    }
  }
`;
