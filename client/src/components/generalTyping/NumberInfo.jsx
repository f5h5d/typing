import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import CountUp from 'react-countup';
import { Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, ComposedChart, Label} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { nextRacePrivateReset, setStartPrivateGame } from '../../redux/privateSlice';
import { reset, setSavedData } from '../../redux/typingSlice';
import { socket } from '../../Socket';
import { nextRaceMultiplayerReset, setHasRaceStarted } from '../../redux/multiplayerSlice';
import { API, GAME_MODES } from '../../constants';
import axios from 'axios';
import { setGuestAccuracy, setGuestWpm, updateGuestGamesPlayed } from '../../redux/guestUserSlice';
  
const NumberInfo = () => {
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const mistakes = useSelector((state) => state.typing.mistakes);
  const typingText = useSelector((state) => state.typing.typingText);
  const wpmRecord = useSelector((state) => state.typing.wpmRecord);
  const typingBackgroundInfo = useSelector((state) => state.typing.typingBackgroundInfo);
  const selectedType = useSelector((state) => state.typing.selectedType)
  const selectedLength = useSelector((state) => state.typing.selectedLength)
  const wordsTyped = useSelector((state) => state.typing.wordsTyped)
  const typingMode = useSelector((state) => state.typing.typingMode)
  const savedData = useSelector((state) => state.typing.savedData)
  const mistakesList = useSelector((state) => state.typing.mistakesList)


  const roomOwner = useSelector((state) => state.private.roomOwner);
  const roomID = useSelector((state) => state.multiplayer.roomID)

  const racePlacement = useSelector((state) => state.multiplayer.racePlacement)

  const user = useSelector((state) => state.user.user)


  const guestWpm = useSelector((state) => state.guestUser.guestWpm)
  const guestAccuracy = useSelector((state) => state.guestUser.guestAccuracy)
  const guestGamesPlayed = useSelector((state) => state.guestUser.guestGamesPlayed)

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
      const newGuestWpm = Math.round((guestWpm * guestGamesPlayed + values[0]) / (guestGamesPlayed + 1))
      const newGuestAccuracy = Math.round((guestAccuracy * guestGamesPlayed + parseInt(values[1])) / (guestGamesPlayed + 1))
      dispatch(updateGuestGamesPlayed(1))
      dispatch(setGuestAccuracy(newGuestAccuracy))
      dispatch(setGuestWpm(newGuestWpm))
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
    axios.post(`${API}/races/track`, info, { withCredentials: true }).then((response) => {
    })
  }, [racePlacement])

  let typedText = ""
  if (selectedType == 0 || selectedLength < 4) typedText = typingBackgroundInfo.content; // if not timed trial then user has typed all the text
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

      const username = user ? user.username : "Guest"
      const averageWPM = user ? user.averageWPM : guestWpm // need to change 
      const userData = {
        username: username,
        wpm: 0,
        currentWord: typingText.split(" ")[0],
        percentage: 0,
        id: "",
        averageWPM: averageWPM
      }
      socket.emit("join_room", [0, GAME_MODES.MULTIPLAYER, userData])
    }

    else if (typingMode == GAME_MODES.PRIVATE) { 
      socket.emit("reset_game_values", roomID)
      socket.emit("start_game", GAME_MODES.PRIVATE, roomID)
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
              {racePlacement == 1 && prompt == "WPM" ? <FontAwesomeIcon icon={faTrophy} className="trophy" /> : ""}
              <div className="prompt">{prompt}</div>
              <div>
                <CountUp className="value" end={values[index]} duration={1} decimals={index == 2 ? 2 : 0}></CountUp> {/* for decimals only show decimals on second index (the time) */}
                <span className="value">{unit}</span>
              </div>
            </div>
          )})}
        </NumberInfoContainer>
        <RightSideContainer>
          <div className="graph-container">
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
          </div>
          <div className="text-container">
            {/* <Scrollbar style={{ width: '100%', height: '300px' }}> */}
              <div className="text">{typedText}</div>
            {/* </Scrollbar> */}
            <div className="other-info">
              <div className="author">-{typingBackgroundInfo.author}</div>
            </div>
          </div>
        </RightSideContainer >
      </MainContent>
      <Buttons>
        <button onClick={onHomeClick} className="button">Home</button>
        { typingMode == GAME_MODES.PRIVATE && roomOwner ? <button className="button" onClick={onBackToLobby}>Back To Lobby</button> : ""} { /* only allow to go back to lobby if it is private game and user is the owner */}
        { typingMode != GAME_MODES.PRIVATE || (typingMode == GAME_MODES.PRIVATE && roomOwner) ? <button className="button next-race" onClick={onNextRace}>Next Race</button> : ""} {/* people in private lobby should not be able to start game, only lobby owner*/}
      </Buttons>
    </Container>
  )
}


const Buttons = styled.div`

  top: 30px;
  width: 90vw;
  height: 50px;

  display: flex;

  justify-content: space-between;

  align-items: center;

  .button {
    position: relative !important;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    margin: 0 20px;
    height: 25px;
    padding: 15px 20px;
    border-radius: 10px;
    text-decoration: none;
    background: ${({ theme: { colors } }) => colors.blue};
    color: ${({ theme: { colors } }) => colors.white};
    box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
    cursor: pointer;
  }

  .home {

  }
`


const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100vw;

  @media (max-width: 850px) {
    flex-direction: column;
  }
`
const Container = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  transform: scale(0.85);

  @media (max-width: 1550px) {
    transform: scale(0.9)
  }
`

const RightSideContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80vw;
  height: 70vh;

  margin-left: 7px;

  .graph-container, .text-container {
    background: black;
    height: calc(48% + 6px);
    width: 100%;
    background: ${({ theme: { colors } }) => colors.lightBackground};
    border: 1px solid ${({ theme: { colors } }) => colors.black};
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
  }

  .graph-container {
    border-bottom: none;
    margin-bottom: 5px;
    width: 100%;

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

    /* background: black; */
    padding-top: 20px;
  }



  .text-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .text {
    width: 85%;
    height: 50%;
    background: ${({ theme: { colors } }) => colors.mediumBackground};
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    margin-top: 10px;
    padding: 10px 20px;
    font-size: 20px;
    overflow-y: auto;

    scrollbar-color: red orange;
  }

  .other-info {
    display: flex;
    align-items: center;
    width: 85%;
    height: 10%;
    background: ${({ theme: { colors } }) => colors.mediumBackground};
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    padding: 10px 20px;


  }


  @media (max-width: 1250px) {
    width: 75vw;
  }

  @media (max-width: 850px) {
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
    height: 24%;
    background: ${({ theme: { colors } }) => colors.lightBackground};
    border: 1px solid ${({ theme: { colors } }) => colors.black};
    margin: 2.5px 0px;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
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
    color: ${({ theme: { colors } }) => colors.blue};
    font-size: 25px;
  }

  .value {
    font-size: 50px;
  }


  .trophy {
    position: absolute;
    font-size: 35px;
    top: -10px;
    right: -10px;
    color: ${({ theme: { colors } }) => colors.trophy};
    transform: rotate(25deg);
    padding: 10px;
    background: ${({ theme: { colors } }) => colors.trophyBackground};
    border-radius: 50%;
  }

  @media (max-width: 1550px) {
    .prompt {
      font-size: 20px;
    }
    .value {
      font-size: 40px;
    }
  }

  @media (max-width: 1250px) {
    width: 15vw;
  }

  @media (max-width: 850px) {
    flex-direction: row !important;
    justify-content: center;
    width: 100vw;
    height: 20vh;

    .prompt-container {
      width: 40%;
      height: 50%;
      margin: 2.5px;
      border: 1px solid ${({ theme: { colors } }) => colors.black};
    }
  }
`

export default NumberInfo