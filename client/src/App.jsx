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
import axios from 'axios'
import { API, GUEST_USER_DEFAULT_WPM } from './constants'
import EmailVerified from './pages/EmailVerified'
import Header from './components/styles/Header'

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
        dispatch(setUserStats({...response.data}))
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
      <Header />

      <SignUp openSignUpModal={openSignUpModal} setOpenSignUpModal={setOpenSignUpModal} setOpenLoginModal={setOpenLoginModal}/>
      <Login openLoginModal={openLoginModal} setOpenLoginModal={setOpenLoginModal} setOpenSignUpModal={setOpenSignUpModal} />

      {/* <Login style={{display: "none"}}/> */}
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/sandbox" element={<Sandbox />}></Route>
        <Route path="/multiplayer" element={<Multiplayer />}></Route>
        <Route path="/private-race" element={<PrivateRace />}></Route>
        <Route path="/users/:id/verify/:token" element={<EmailVerified />}></Route>
      </Routes>
    </Container>
  </Router>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background: ${props => props.theme.colors.mainBackground};
  overflow-y: hidden !important;
  overflow-x: hidden !important; 
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.text};
  font-family: ${props => props.theme.fonts[0]} !important;


  @media (max-width: ${props => props.theme.breakpoints.md}) {
    /* font-size: 20px; */
  }
`





export default App
