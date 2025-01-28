import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  typingMode: 0, // 0 is sandbox, 1 is multiplayer, 2 is private game
  typingText: ``,
 // know same all a these do last with govern need hand play off it just any can do both a not up for general increase a not up for general increase how all person fact good day however should begin long mean about program then around make day when if like good must tell set mean child well interest much would while because seem will see fact word between general around a child keep under but after such real move just interest
  userTyped: "",
  typingBackgroundInfo: [],
  incorrectText: [0, 0],
  wordsTyped: 0,
  mouseY: 0,
  mouseX: 0,
  wordsPerLine: [0], // each index represents a line, showing how many words in each => start at -1 because of just how it starts cba to fix it
  selectedLength: 0,
  selectedType: 1,
  selectedDifficulty: 1,
  currentSelection: 0, // 0 is type, 1 is length, 2 is difficulty
  wpm: 0,
  startTime: 0,
  endTime: 0,
  totalTime: 0,
  elapsedTime: 0,
  finishedTest: false,
  typedAtAll: false,
  mistakes: 0,
  wpmRecord: [],
  refillTypingText: 0, // this is for when user is doing timed test and if user has typed almost all of the typing text and more is needed (adds by 1 every time)
  lastTyped: 0, // this is a date, used for checking if user has typed in the last 10 seconds if not it voids the test
  restart: false,
  savedData: false,

  reloadedPage: false,

  mistakesList: [], 
};

const typingSlice = createSlice({
  name: "typing",
  initialState,
  reducers: {
    setTypingMode: (state, action) => {
      state.typingMode = action.payload;
    },
    setTypingText: (state, action) => {
      state.typingText = action.payload;
    },
    setTypingBackgroundInfo: (state, action) => {
      state.typingBackgroundInfo = action.payload;
    },
    setUserTyped: (state, action) => {
      state.userTyped = action.payload;
    },
    setIncorrectText: (state, action) => {
      state.incorrectText = action.payload;
    },
    setWordsTyped: (state, action) => {
      state.wordsTyped = action.payload;
    },
    setMouseY: (state, action) => {
      state.mouseY = action.payload;
    },
    setMouseX: (state, action) => {
      state.mouseX = action.payload;
    },
    setWordsPerLine: (state, action) => {
      state.wordsPerLine = action.payload;
    },
    setSelectedLength: (state, action) => {
      state.selectedLength = action.payload;
    },
    setSelectedType: (state, action) => {
      state.selectedType = action.payload;
    },
    setWpm: (state, action) => {
      state.wpm = action.payload;
    },
    setStartTime: (state, action) => {
      state.startTime = action.payload;
    },
    setFinishedTest: (state, action) => {
      state.finishedTest = action.payload;
    },
    setTypedAtAll: (state, action) => {
      state.typedAtAll = action.payload;
    },
    setEndTime: (state, action) => {
      state.endTime = action.payload;
    },
    setMistakes: (state, action) => {
      state.mistakes = action.payload;
    },
    setWpmRecord: (state, action) => {
      state.wpmRecord = action.payload;
    },
    setRestart: (state, action) => {
      state.restart = action.payload;
    },
    setTotalTime: (state, action) => {
      state.totalTime = action.payload;
    },
    setElapsedTime: (state, action) => {
      state.elapsedTime = action.payload;
    },
    setSelectedDifficulty: (state, action) => {
      state.selectedDifficulty = action.payload;
    },
    setCurrentSelection: (state, action) => {
      state.currentSelection = action.payload;
    },
    setRefillTypingText: (state, action) => {
      state.refillTypingText = state.refillTypingText + action.payload;
    },
    setLastTyped: (state, action) => {
      state.lastTyped = action.payload;
    },
    setSavedData: (state, action) => {
      state.savedData = action.payload;
    },

    setReloadedPage: (state, action) => {
      state.reloadedPage = action.payload;
    },

    addToMistakesList: (state, action) => {
      state.mistakesList.push(action.payload);
    },
    reset: (state) => {
      state.typingText = initialState.typingText
      state.userTyped = initialState.userTyped;
      // state.mistakesList = initialState.mistakesList
      state.incorrectText = initialState.incorrectText;
      state.wordsTyped = initialState.wordsTyped;
      state.wpm = initialState.wpm;
      state.accuracy = initialState.accuracy;
      state.time = initialState.time;
      state.mistakes = initialState.mistakes;
      state.mouseX = initialState.mouseX;
      state.mouseY = initialState.mouseY;
      state.wordsPerLine = initialState.wordsPerLine;
      state.startTime = initialState.startTime;
      state.endTime = initialState.endTime;
      state.finishedTest = initialState.finishedTest;
      state.typedAtAll = initialState.typedAtAll;
      state.wpmRecord = initialState.wpmRecord;
      state.restart = initialState.restart;
      state.elapsedTime = initialState.elapsedTime;
      state.lastTyped = initialState.lastTyped;
    },

    backToLobbyReset: (state) => {
      state.userTyped = initialState.userTyped;
      state.incorrectText = initialState.incorrectText;
      state.wordsTyped = initialState.wordsTyped;
      state.wpm = initialState.wpm;
      state.accuracy = initialState.accuracy;
      state.time = initialState.time;
      state.mistakes = initialState.mistakes;
      state.mouseX = initialState.mouseX;
      state.mouseY = initialState.mouseY;
      state.wordsPerLine = initialState.wordsPerLine;
      state.startTime = initialState.startTime;
      state.endTime = initialState.endTime;
      state.finishedTest = initialState.finishedTest;
      state.typedAtAll = initialState.typedAtAll;
      state.wpmRecord = initialState.wpmRecord;
      state.restart = initialState.restart;
      state.elapsedTime = initialState.elapsedTime;
      state.lastTyped = initialState.lastTyped;
    },
  },
});


export const {
  setTypingMode, 
  setTypingText,
  setTypingBackgroundInfo,
  setUserTyped,
  setIncorrectText,
  setWordsTyped,
  setMouseY,
  setMouseX,
  setWordsPerLine,
  setSelectedLength,
  setSelectedType,
  setWpm,
  setStartTime,
  setFinishedTest,
  setTypedAtAll,
  setEndTime,
  setMistakes,
  setWpmRecord,
  setRestart,
  setTotalTime, 
  setElapsedTime,
  setSelectedDifficulty,
  setCurrentSelection,
  setRefillTypingText,
  setLastTyped,
  addToMistakesList,
  setReloadedPage,
  reset,
  backToLobbyReset,
  setSavedData,
} = typingSlice.actions;

export default typingSlice.reducer;
