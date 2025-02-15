import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import CountUp from 'react-countup';
import { Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, ComposedChart, Label} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { nextRacePrivateReset, setStartPrivateGame } from '../../redux/privateSlice';
import { reset, setSavedData } from '../../redux/typingSlice';
import { socket } from '../../Socket';
import { nextRaceMultiplayerReset, setHasRaceStarted } from '../../redux/multiplayerSlice';
import { API, GAME_MODES } from '../../constants';
import axios from 'axios';
import { setGuestAccuracy, setGuestWpm, updateGuestRacesWon, updateGuestTotalRaces, setGuestHighestWpm, setGuestMostRecentWpm } from '../../redux/guestUserSlice';
import { setUser, setUserStats } from '../../redux/userSlice';
import CornerButton from '../styles/CornerButton';
  
const NumberInfo = () => {

  const [currentOption, setCurrentOption] = useState(0) // 0 == graph / 1 == text
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const mistakes = useSelector((state) => state.typing.mistakes);
  const typingText = useSelector((state) => state.typing.typingText);
  const wpmRecord = useSelector((state) => state.typing.wpmRecord);
  const typingBackgroundInfo = useSelector((state) => state.typing.typingBackgroundInfo);
  const typingType = useSelector((state) => state.typing.typingType)
  const selectedLength = useSelector((state) => state.typing.selectedLength)
  const wordsTyped = useSelector((state) => state.typing.wordsTyped)
  const typingMode = useSelector((state) => state.typing.typingMode)
  const savedData = useSelector((state) => state.typing.savedData)
  const mistakesList = useSelector((state) => state.typing.mistakesList)


  const roomOwner = useSelector((state) => state.private.roomOwner);
  const roomID = useSelector((state) => state.multiplayer.roomID)

  const racePlacement = useSelector((state) => state.multiplayer.racePlacement)

  const user = useSelector((state) => state.user.user)
  const userStats = useSelector((state) => state.user.userStats)


  const guestWpm = useSelector((state) => state.guestUser.guestWpm)
  const guestAccuracy = useSelector((state) => state.guestUser.guestAccuracy)
  const guestTotalRaces = useSelector((state) => state.guestUser.guestTotalRaces)
  const guestHighestWpm = useSelector((state) => state.guestUser.guestHighestWpm)
  const guestRacesWon = useSelector((state) => state.guestUser.guestRacesWon)
  const guestMostRecentWpm = useSelector((state) => state.guestUser.guestMostRecentWpm)

  const prompts = ["WPM", "Accuracy", "Time", "Mistakes"]

  const onHomeClick = () => {
    if (typingMode !== GAME_MODES.SANDBOX) { 
      socket.emit("pre_disconnect", [typingMode, roomID])
      socket.disconnect();
    }
    dispatch(nextRaceMultiplayerReset())
    dispatch(reset())
    navigate("/")
  }

  // wpm, accuracy, time, mistakes
  const values = [wpmRecord[wpmRecord.length-1].wpm, Math.round(((typingText.length / (typingText.length + mistakes)) * 100)*100) / 100, wpmRecord[wpmRecord.length-1].time, mistakes]
  let lowerDomain = wpmRecord.find(({wpm}) => wpm < 25) == undefined ? "dataMin - 25" : 0 // if user has wpm lower than 25 then y axis would go into negatives


  useEffect(() => {

    if (racePlacement == 0 || typingMode == GAME_MODES.SANDBOX ) return; // the race placement updates after this runs so without this it would just have race placement = 0 for all
    
    if (!user) { // if guest user
      const previousRaceWpm = values[0];
      const previousRaceAccuracy = values[1];
      const newAverageGuestWpm = Math.round((guestWpm * guestTotalRaces + previousRaceWpm) / (guestTotalRaces + 1))
      const newAverageGuestAccuracy = Math.round((guestAccuracy * guestTotalRaces + parseInt(previousRaceAccuracy)) / (guestTotalRaces + 1))
      // check if guest user won and update the stat if they did
      if (racePlacement == 1) dispatch(updateGuestRacesWon(1))
      if (previousRaceWpm > guestHighestWpm) dispatch(setGuestHighestWpm(newAverageGuestWpm))
      dispatch(setGuestMostRecentWpm(previousRaceWpm))
      dispatch(updateGuestTotalRaces(1))
      dispatch(setGuestAccuracy(newAverageGuestAccuracy))
      dispatch(setGuestWpm(newAverageGuestWpm))
    }

    if (!user || typingMode == GAME_MODES.SANDBOX || savedData ) return;

    const info = {
      user_id: user.id,
      words_id: typingBackgroundInfo.words_id,
      quote_id: null,
      wpm: values[0],
      accuracy: Math.round(values[1]),
      duration: values[2],
      mistakes: mistakesList,
      won: racePlacement == 1,
      ranked: false,
    }
    
    dispatch(setSavedData(true))

    axios.post(`${API}/races/track`, info, { withCredentials: true }).then(() => {

      axios.get(`${API}/races/stats/${user.id}`).then(response => {
          dispatch(setUserStats({...response.data}))
          dispatch(setSavedData(false));
        }) 
    });


  }, [racePlacement])

  let typedText = ""
  if (typingType == 0 || selectedLength < 4) typedText = typingBackgroundInfo.content; // if not timed trial then user has typed all the text
  else typedText = typingText.split(" ").slice(0,wordsTyped).join(" ")


  const onBackToLobby = () => {
    socket.emit("back_to_lobby", roomID)
    // reset things
    dispatch(setStartPrivateGame(false))
    dispatch(setHasRaceStarted(false));
    dispatch(reset())
  }

  const onNextRace = () => {
    dispatch(reset())
    
    if (typingMode == GAME_MODES.MULTIPLAYER) { // multiplayer
      dispatch(nextRaceMultiplayerReset())
    

      const username = user?.username || "Guest"
      const userData = {
        username: username,
        wpm: 0,
        currentWord: typingText.split(" ")[0],
        percentage: 0,
        id: "",
        ...userStats
      }
      socket.emit("join_room", [0, GAME_MODES.MULTIPLAYER, userData, typingType]) // 0 here is just the default id
    }

    else if (typingMode == GAME_MODES.PRIVATE) { 
      socket.emit("reset_game_values", roomID)
      socket.emit("start_game", GAME_MODES.PRIVATE, roomID, typingType)
    }
  }

  return (
    <Container>
      <MainContent>
        <NumberInfoContainer>
          {prompts.map((prompt, index) => {
            const unit = prompt == "Accuracy" ? "%" : prompt == "Time" ? "s" : ""
            return (
            <div key={index} className={`prompt-container prompt-container-${index}`}>
              {racePlacement == 1 && prompt == "WPM" ? <FontAwesomeIcon icon={faCrown} className="crown" /> : ""}
              <div className="prompt">{prompt}</div>
              <div>
                <CountUp className="value" end={values[index]} duration={1} decimals={index == 2 ? 2 : 0}></CountUp> {/* for decimals only show decimals on second index (the time) */}
                <span className="value">{unit}</span>
              </div>
            </div>
          )})}
        </NumberInfoContainer>
        <RightSideContainer>
          <SwitchButtons>
            <button className={`option-button left-button ${currentOption == 0 ? "highlighted" : ""}`} onClick={() => setCurrentOption(0)}>Graph</button>
            <button className={`option-button right-button ${currentOption == 1 ? "highlighted" : ""}`} onClick={() => setCurrentOption(1)}>Text</button>
          </SwitchButtons>
          <div className="graph-container">
          {currentOption == 0 ? (
            <div className="graph-inner-container">
              <ResponsiveContainer>
                <ComposedChart data={wpmRecord}>

                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007BFF" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#007BFF" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#121212" />
                    <XAxis height={50} dy={10} tickCount={10} angle={0} interval="equidistantPreserveStart" dataKey="time" stroke="#121212" tick={{fill: "#626262"}}>
                      <Label dy={20} value="Time (Seconds)"  position="middle" />
                    </XAxis>
                    <YAxis yAxisId="left" stroke="#121212" tick={{fill: "#626262"}} domain={[lowerDomain, "dataMax+30"] } tickCount={6}>
                      <Label dy={20} value="WPM" angle={270} position="insideLeft" />
                    </YAxis>
                    <YAxis yAxisId="right" orientation="right" stroke="#121212" tick={{fill: "#626262"}} domain={[0, "dataMax + 5"]}>
                      <Label dy={40} value="Mistakes" angle={90} position="insideRight" />
                    </YAxis>
                    <Tooltip contentStyle={{
                      background: "#242424",
                      border: "1px solid #121212",
                      borderRadius: "5px"
                      }} 
                      cursor={{stroke: "transparent"}}
                    
                    />
                    <Area yAxisId="left" type="monotone" dataKey="wpm" stroke="#007BFF" fillOpacity={1} fill="url(#colorUv)" />
                    <Line dot={false} yAxisId="right" dataKey="mistakes" fill="transparent" stroke="#FF4D4D" />
                </ComposedChart>
              </ResponsiveContainer>
              </div>
            ) : (
            <div className="text-container">
              <div className="text">{typedText}</div>
              <div className="other-info">
                <div className="author">-{typingBackgroundInfo.author}</div>
              </div>
            </div>
            )}
          </div>
        </RightSideContainer >
      </MainContent>
      <Buttons>
        <CornerButton onClick={onHomeClick}><button className="corner-button"><span>Home</span></button></CornerButton>
        { typingMode == GAME_MODES.PRIVATE && roomOwner ?       <CornerButton onClick={onBackToLobby}><button className="corner-button"><span>Back To Lobby</span></button></CornerButton> : ""} { /* only allow to go back to lobby if it is private game and user is the owner */}
        { typingMode != GAME_MODES.PRIVATE || (typingMode == GAME_MODES.PRIVATE && roomOwner) ? <CornerButton onClick={onNextRace}><button className="corner-button "><span>Next Race</span></button></CornerButton>: ""} {/* people in private lobby should not be able to start game, only lobby owner*/}
      </Buttons>
    </Container>
  )
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  transform: scale(0.85);

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    transform: scale(0.9)
  }
`

const BottomRow = styled.div`
  height: 25%;

`

const SwitchButtons = styled.div`
  position: absolute;
  right: 30px;
  top: 20px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  height: 30px;

  .option-button {
    border: 1px solid ${({ theme: { colors } }) => colors.accent};
    background: ${({ theme: { colors } }) => colors.accent};
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


const Buttons = styled.div`
  margin-top: 50px;
  top: 30px;
  width: 90vw;
  height: 50px;

  display: flex;

  justify-content: space-between;

  align-items: center;
`


const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  /* align-items: center; */
  width: 100vw;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`

const RightSideContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80vw;
  height: 70vh;

  /* margin-left: 7px; */

  .graph-container, .text-container {
    /* height: calc(48% + 6px); */
    width: 100%;
    background: ${props => props.theme.colors.lightBackground};

  }

  .graph-container {
    border: 1px solid ${props => props.theme.colors.darkBackground};
    height: 100%;
    border-bottom: none;
    width: 100%;

    border-bottom: none;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .graph-inner-container {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 95%;
    height: 80%;
    padding-top: 20px;
  }
  .text-container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .text {
    width: 85%;
    height: 50%;
    background: ${props => props.theme.colors.mediumBackground};
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    margin-top: 10px;
    padding: 10px 20px;
    font-size: ${props => props.theme.fontSizes.text};
    overflow-y: auto;

  }

  .other-info {
    display: flex;
    align-items: center;
    width: 85%;
    height: 10%;
    background: ${props => props.theme.colors.mediumBackground};
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    padding: 10px 20px;


  }


  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    width: 75vw;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-left: 0px;
    width: 100vw;
    margin-top: 15px;

    .graph-container {
      margin-bottom: 7px;
    }
  }
`

const NumberInfoContainer = styled.div`
  width: 10vw;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;

  .prompt-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: calc(25%);
    background: ${props => props.theme.colors.lightBackground};
    border: 1px solid ${props => props.theme.colors.darkBackground};
    border-right: none;
    /* margin: 2.5px 0px; */
    /* box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px; */
    position: relative !important;
  }

  .prompt-container-1 {
    border-top: none;
  }

  .prompt-container-2 {
    border-bottom: none;
    border-top: none;
  }

  .prompt {
    color: ${props => props.theme.colors.accent};
    font-size: ${props => props.theme.fontSizes.label};
  }

  .value {
    font-size: ${props => props.theme.fontSizes.largeLabel} !important;
  }


  .crown {
    position: absolute;
    font-size: 35px;
    top: -10px;
    right: -10px;
    color: ${({ theme: { colors } }) => colors.special};
    padding: 10px;
    border-radius: 50%;
  }

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    width: 15vw;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: row !important;
    justify-content: center;
    width: 100vw;
    height: 20vh;

    .prompt-container {
      width: 40%;
      height: 50%;
      margin: 2.5px;
      border: 1px solid ${({ theme: { colors } }) => colors.darkBackground};
    }
  }
`

export default NumberInfo