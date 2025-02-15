import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from "styled-components"
import { setOtherPlayersData, setSocketID } from '../../redux/multiplayerSlice'
import { socket } from '../../Socket'
import { setStartPrivateGame } from '../../redux/privateSlice'
import { setRoomID } from '../../redux/multiplayerSlice'
import { useNavigate } from 'react-router-dom'
import { reset } from '../../redux/typingSlice'
import { GAME_MODES } from '../../constants'
import CornerButton from '../styles/CornerButton'
import OptionSelector from '../sandbox/OptionSelector'
const PrivateLobby = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const otherPlayersData = useSelector((state) => state.multiplayer.otherPlayersData)
  const roomID = useSelector((state) => state.multiplayer.roomID)
  const roomOwner = useSelector((state) => state.private.roomOwner)

  const typingMode = useSelector((state) => state.typing.typingMode)
  const typingType = useSelector((state) => state.typing.typingType)


  const leaderboardData = [
    { username: "bravo435", wpm: 150, acc: 100 },
    { username: "Doggy Doggster", wpm: 150, acc: 90 },
    { username: "bravo435", wpm: 150, acc: 95 },
    { username: "bravo435", wpm: 150, acc: 78 },
    // { username: "bravo435", wpm: 150, acc: 93 },
    // { username: "bravo435", wpm: 150, acc: 99 },
    // { username: "bravo435", wpm: 150, acc: 91 },
    // { username: "bravo435", wpm: 150, acc: 85 },
    // { username: "bravo435", wpm: 150, acc: 82 },
    // { username: "bravo435", wpm: 150, acc: 97 },
  ];

  useEffect(() => {

    const onInitializeUserId = (data) => {
      dispatch(setSocketID(data))
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

    const onStartedGame = () => {
      dispatch(setStartPrivateGame(true))
    }
    socket.on("initialize_user_id", onInitializeUserId)


    socket.on("initialize_user_data_for_others", onInitializeUserDataForOthers);

    socket.on("initialize_other_users_data", onInitializeOtherUsersData)

    socket.on("started_game", onStartedGame)
  
    return () => {
      socket.off("initialize_user_id", onInitializeUserId);
      socket.off("initialize_user_data_for_others", onInitializeUserDataForOthers);
      socket.off("initialize_other_users_data", onInitializeOtherUsersData);
      socket.off("started_game", onStartedGame);
    };
  }, [socket, dispatch]);


  const onStartClick = () => {
    socket.emit("start_game", GAME_MODES.PRIVATE, roomID, typingType)
  }

  const onHomeClick = () => {
    socket.emit("pre_disconnect", [typingMode, roomID])
    dispatch(setRoomID(""))
  }
  
  return (
    <Container>

      <CodeContainer>
        <h1 className="label">ROOM CODE</h1>
        <h1 className="code">610205</h1>
      </CodeContainer>

      <UsersTable>
        <div className="table">
          <div className="table-header">
            <div className="table-header-content">
              <div className="number">#</div>
              <div className="username">name</div>
              <div className="speed">speed</div>
              <div className="acc">acc</div>
            </div>
          </div>

          <div className="data-points">
            {leaderboardData.map((dataPoint, index) => {
              return (
              <div className="data-point" key={index}>
                <div className="data-point-number">{index+1}</div>
                <div className="data-point-username">{dataPoint.username}</div>
                <div className="data-point-speed">{dataPoint.wpm}wpm</div>
                <div className="data-point-acc">{dataPoint.acc}%</div>
              </div>
              )
            })}
          </div>
        </div>
      </UsersTable>
      
      <Options>
        <OptionSelector />
      </Options>

      <Buttons>
        <CornerButton><button className="corner-button"><span>MAIN MENU</span></button></CornerButton>
        <CornerButton><button className="corner-button"><span>START GAME</span></button></CornerButton>
      </Buttons>


      {/* <h1>Room Code: {roomID}</h1>
      <Players>
        <Player><p>{roomOwner ? "Owner" : ""}(You)</p></Player>
        {Object.keys(otherPlayersData).map((id) => {
            return <Player key={id}><p>{otherPlayersData[id].roomOwner ? "Owner" : ""} {otherPlayersData[id].username}</p></Player>
          })}
      </Players>
      <ButtonContainer>
        <button onClick={onHomeClick}>Back</button>
        {roomOwner ? <button onClick={() => onStartClick()}>Start</button> : ""}
      </ButtonContainer> */}



    </Container>
  )
}

export default PrivateLobby

const Container = styled.div`
  position: absolute;
  /* height: 100vh; */
  width: 100vw;
  z-index: 10000;
`

const Options = styled.div`
  margin-top: 50px;

`

const Buttons = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-around;

`

const UsersTable = styled.div`
  margin-top: 50px;
  width: 100%;

  display: flex;
  align-items: center;
  flex-direction: column;

  .table {
    width: 655px;
  }

  .table-header {
    background: ${props => props.theme.colors.darkBackground};
    height: 58px;

    .table-header-content {
      width: 95%;
      margin-left: 2.5%;


      font-size: ${props => props.theme.fontSizes.label};
      display: flex;
      align-items: center;
      height: 100%;

      .number {
        width: 15%;
        text-align: center;
      }

      .username {
        width: 45%;

      }

      .speed {
        width: 30%;
      }

      .acc {
        width: 10%;
      }
    }

    
  }

  .data-points {
    background: ${props => props.theme.colors.lightBackground};
    display: flex;
    flex-direction: column;
    overflow: hidden;



    .data-point {
      width: 95%;
      margin-left: 2.5%;
      margin-top: 10px;
      margin-bottom: 10px; 
      height: 43px;
      display: flex;
      align-items: center;
      font-size: ${props => props.theme.fontSizes.label};
      background: ${props => props.theme.colors.darkBackground};
      border-radius: 10px;



      .data-point-number {
        text-align: center;
        
        width: 15%;
      }
      .data-point-username {
        width: 45%;
      }
      .data-point-speed {
        width: 30%;
      }
      .data-point-acc {
        width: 10%;
      }
    }

    .data-point:first-child {
      margin-top: 20px !important;
    }

    .data-point:last-child {
      margin-bottom: 20px !important;
    }
  }




`

const CodeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .label {
    color: ${props => props.theme.colors.accent};
    font-size: ${props => props.theme.fontSizes.largeLabel};
    margin: 0px;
  }

  .code {
    font-size: ${props => props.theme.fontSizes.mainText.default};
    margin-top: 0px;
    text-decoration: 12px underline ${props => props.theme.colors.accent};
  }
`

// const ButtonContainer = styled.div`
//   width: 80%;
//   display: flex;
//   justify-content: space-between;
//   margin-top: 20px;

//   button {
//     width: 100px;
//     height: 30px;
//     color: white;
//     background: ${({ theme: { colors } }) => colors.blue};
//     border-radius: 10px;
//     margin: 0 20px;
//     cursor: pointer;
//   }

// `

// const Players = styled.div`
//   width: 80%;

//   background: ${({ theme: { colors } }) => colors.background};
//   box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
//   display: flex;
//   justify-content: top;
//   align-items: center;
//   flex-direction: column;

//   border-radius: 10px;
// `

// const Player = styled.div`
//   width: 80%;
//   height: 50px;
//   margin: 10px 0px;

//   border-radius: 10px;
//   background: ${({ theme: { colors } }) => colors.lightBackground};

//   display: flex;
//   align-items: center;



//   p {
//     margin-left: 20px;
//     background: ${({ theme: { colors } }) => colors.background};
//     padding: 5px;
//     border-radius: 10px;
//   }
// `