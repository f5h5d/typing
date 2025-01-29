import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom"

import styled from 'styled-components'
import Main from './pages/Main'
import Sandbox from './pages/Sandbox'
import Multiplayer from './pages/Multiplayer'
import PrivateRace from './pages/PrivateRace'
import SignUp from './components/authentication/SignUp'
import Login from './components/authentication/Login'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser, setUser, setUserStats } from './redux/userSlice'
import { faL } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { API, GUEST_USER_DEFAULT_WPM } from './constants'

function App() {
  const [openSignUpModal, setOpenSignUpModal] = useState(false)
  const [openLoginModal, setOpenLoginModal] = useState(false) 
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const userStats = useSelector((state) => state.user.userStats)
  const loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])


  // if is a guest user
  useEffect(() => {
    if (!user) {
      const userStatInfo = {
        averageWpm: GUEST_USER_DEFAULT_WPM,
        averageAccuracy: 0,
        totalRaces: 0,
        highestWpm: 0,
        racesWon: 0,
        mostRecentWpm: 0,
        lastTenRacesWpm: 0,
        lastTenRacesAccuracy: 0,
        guest: true,
      }

      dispatch(setUserStats({...userStatInfo}))
    }
  }, [])

  // get user wpm and acc data once actual user is loaded
  useEffect(() => {
    if (user && userStats.guest) {
      axios.get(`${API}/races/stats/${user.id}`).then(response => {

      const { averageWpm, averageAccuracy, totalRaces, highestWpm, totalRacesWon, mostRecentWpm, lastTenRacesWpm, lastTenRacesAccuracy } = response.data;
      const userStatInfo = {
        averageWpm,
        averageAccuracy,
        totalRaces,
        highestWpm,
        totalRacesWon,
        mostRecentWpm,
        lastTenRacesWpm,
        lastTenRacesAccuracy,
        guest: false,
      }
        dispatch(setUser({...user, ...response.data}))
        dispatch(setUserStats({...userStatInfo}))

        console.log(userStatInfo)
      }) 


    }
  }, [user, userStats])



  if (loading) {
    console.log("LOADING")
  }

  const onLoginClick = () => {
    setOpenLoginModal(true)
  }


  return (
  <Router>
    <Container>
      {user ? 
        (<div>HEY</div>) : 
      <div className="button">
        <button onClick={onLoginClick}>Login</button>
      </div>
      }

      <SignUp openSignUpModal={openSignUpModal} setOpenSignUpModal={setOpenSignUpModal} setOpenLoginModal={setOpenLoginModal}/>
      <Login openLoginModal={openLoginModal} setOpenLoginModal={setOpenLoginModal} setOpenSignUpModal={setOpenSignUpModal} />

      {/* <Login style={{display: "none"}}/> */}
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/sandbox" element={<Sandbox />}></Route>
        <Route path="/multiplayer" element={<Multiplayer />}></Route>
        <Route path="/private-race" element={<PrivateRace />}></Route>
      </Routes>
    </Container>
  </Router>
  )
}

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: ${({ theme: { colors } }) => colors.background};
  color: ${({ theme: { colors } }) => colors.text};
  .button {
    position: absolute;
    right: 0;

    button {
      height: 40px;
      width: 120px;
      background: ${({ theme: { colors } }) => colors.lightBackground};
      color: ${({ theme: { colors } }) => colors.white};
      margin: 25px 25px;
      border-radius: 5px;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
      cursor: pointer;
    }
  }
`

export default App
