import React, { useEffect, useRef, useState } from 'react'
import styled from "styled-components"
import { faBook, faLock, faQuoteLeft, faScrewdriverWrench, faShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { Link } from "react-router-dom"
import axios from 'axios';
import { setLookingForRoom, setMode } from '../redux/multiplayerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { API, GAME_MODES } from '../constants';
const Main = () => {
  const dispatch = useDispatch()


  const user = useSelector((state) => state.user.user)



  return (
    <Container>
      <Title>
        <div className="text-container">
          <h1 className="title">SwiftType.</h1>
        </div>
      </Title>
      
      <Sections>
      <Section>
          <Link className="box">
            <FontAwesomeIcon className="icon shield" icon={faShield} />
            <div className="title">Ranked</div>
          </Link>
        </Section>
        <Section>
          <Link className="box" to="/multiplayer" onClick={() => { dispatch(setMode(GAME_MODES.SANDBOX)); dispatch(setLookingForRoom(true))}}>
            <FontAwesomeIcon className="icon quote" icon={faQuoteLeft} />
            <div className="title">Multiplayer - Quotes</div>
          </Link>
        </Section>
        <Section>
          <Link className="box" to="/multiplayer" onClick={() => dispatch(setMode(1))}>
            <FontAwesomeIcon className="icon book" icon={faBook} />
            <div className="title">Multiplayer - Words</div>
          </Link>
        </Section>
        <Section>
          <Link className="box" to="/private-race" onClick={() => dispatch(setMode(1))}>
            <FontAwesomeIcon className="icon book" icon={faLock} />
            <div className="title">Private Lobby</div>
          </Link>
        </Section>
        <Section>
          <Link className="box" to="/sandbox">
            <FontAwesomeIcon className="icon screw-driver-wrench" icon={faScrewdriverWrench} />
            <div className="title">Sandbox</div>
          </Link>
        </Section>
      </Sections>
    </Container>
  )
}


const Container = styled.div`
  height: 100vh;
  /* width: 100vw; */
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.div`
  height: 20vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;

  .text-container {
    display: inline-block;
  }
  .title {
    font-size: 100px;
    font-family: "Sono", monospace;
    width: calc(100%);
    border-right: 6px solid ${({ theme: { colors } }) => colors.blue};
    white-space: nowrap;
    overflow: hidden;
    animation:
      typing 3s steps(10) infinite,
      cursor .4s step-end infinite;
  }

  @keyframes cursor {
    50% { border-color: transparent; }
  }

  @keyframes typing {
    0% { width: 0; }
    80% { width: 100%; }
    100% { width: 0; }
  }


  @media (max-width: 750px) {
    .title {
      font-size: 75px;
    }
  }

  @media (max-width: 550px) {
    .title {
      font-size: 50px;
    }
  }
`


const Sections = styled.div`
  height: 80vh;
  width: 40%;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;


  @media (max-width: 1200px) {
    width: 80%;
  }

`
const Section = styled.div`
  height: 50px;
  width: 80vw;
  background: ${({ theme: { colors } }) => colors.lightBackground};
  border: 1px solid ${({ theme: { colors } }) => colors.black};
  margin: 10px 0px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
  display: flex;
  align-items: center;
  font-weight: bold;

  &:hover {
    background: ${({ theme: { colors } }) => colors.background};
  }

  .box {
    width: 100%;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: ${({ theme: { colors } }) => colors.white}
  }

  .right-side {
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 20px;
  }

  .button {
    width: 60px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 10px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: normal;
    text-decoration: none;
    color: white;

    box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
  }

  .title {
    font-size: 25px;
    margin-left: 10px;
  }

  .icon {
    font-size: 20px;
    width: 20px;
    height: 20px;
    padding: 5px;
    border-radius: 50%;

    margin-left: 20px;
  }

  .quote {
    background: ${({ theme: { colors } }) => colors.blue};
  }

  .book {
    background: ${({ theme: { colors } }) => colors.blue};
  }

  .screw-driver-wrench {
    background: ${({ theme: { colors } }) => colors.blue};
  }

  .shield {
    background: ${({ theme: { colors } }) => colors.blue};
  }

  .shield-button {
    width: 110px;
    cursor: not-allowed;
  }


  @media (max-width: 1250px) {
    .title {
      font-size: 20px;
    }
  }

  @media (max-width: 550px) {

  }
`

export default Main