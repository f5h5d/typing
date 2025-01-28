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
import { fetchUser, setUser } from './redux/userSlice'
import { faL } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { API } from './constants'

function App() {
  const [openSignUpModal, setOpenSignUpModal] = useState(false)
  const [openLoginModal, setOpenLoginModal] = useState(false) 
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    dispatch(fetchUser())
    


  }, [dispatch])

  // get user wpm and acc data once actual user is loaded
  useEffect(() => {
    if (user && !user.averageWPM) {
      axios.get(`${API}/races/stats/${user.id}`).then(response => {
        dispatch(setUser({...user, averageWPM: response.data.wpm}))
      }) 
    }
  }, [user])



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
