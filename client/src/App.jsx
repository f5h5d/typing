import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import styled from 'styled-components'
import Main from './pages/Main'
import Sandbox from './pages/Sandbox'
import Multiplayer from './pages/Multiplayer'
import PrivateRace from './pages/PrivateRace'

function App() {

  return (
  <Router>
    <Container>
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

`

export default App
