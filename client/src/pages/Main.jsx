import React, { useEffect, useRef, useState } from 'react'
import styled from "styled-components"
import { faBook, faLock, faQuoteLeft, faScrewdriverWrench, faShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { Link } from "react-router-dom"
import axios from 'axios';
import { setMode } from '../redux/multiplayerSlice';
import { useDispatch } from 'react-redux';
const Main = () => {
  const dispatch = useDispatch()


  return (
    <Container>
      <Title>
        <div className="text-container">
          <h1 className="title">SwiftType.</h1>
        </div>
      </Title>
      
      <Sections>
      <Section>
          <div className="left-side">
            <FontAwesomeIcon className="icon shield" icon={faShield} />
            <div className="title">Ranked</div>
          </div>
          <div className="right-side">
            <div className="button shield shield-button">Coming Soon!</div>
          </div>
        </Section>
        <Section>
          <div className="left-side">
            <FontAwesomeIcon className="icon quote" icon={faQuoteLeft} />
            <div className="title">Multiplayer - Quotes</div>
          </div>
          <div className="right-side">
          <Link to="/multiplayer" onClick={() => dispatch(setMode(0))} className="button screw-driver-wrench">PLAY</Link>
          </div>
        </Section>
        <Section>
          <div className="left-side">
            <FontAwesomeIcon className="icon book" icon={faBook} />
            <div className="title">Multiplayer - Words</div>
          </div>
          <div className="right-side">
          <Link to="/multiplayer" onClick={() => dispatch(setMode(1))} className="button book">PLAY</Link>
          </div>
        </Section>
        <Section>
          <div className="left-side">
            <FontAwesomeIcon className="icon book" icon={faLock} />
            <div className="title">Private Lobby</div>
          </div>
          <div className="right-side">
          <Link to="/private-race" onClick={() => dispatch(setMode(1))} className="button book">PLAY</Link>
          </div>
        </Section>
        <Section>
          <div className="left-side">
            <FontAwesomeIcon className="icon screw-driver-wrench" icon={faScrewdriverWrench} />
            <div className="title">Sandbox</div>
          </div>
          <div className="right-side">
            <Link to="/sandbox" className="button screw-driver-wrench">PLAY</Link>
          </div>
        </Section>
      </Sections>
    </Container>
  )
}


const Container = styled.div`
  height: 100vh;
  width: 100vw;
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
`


const Sections = styled.div`
  height: 80vh;
  width: 40%;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;

`

const Section = styled.div`
  height: 6vh;
  width: 80vw;
  background: ${({ theme: { colors } }) => colors.lightBackground};
  border: 1px solid ${({ theme: { colors } }) => colors.black};
  margin: 10px 0px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
  display: flex;
  align-items: center;
  font-weight: bold;

  .left-side {
    width: 80%;
    display: flex;
    align-items: center
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
`

const Multiplayer = styled.div`
  height: 20vh;
  width: 25vw;
  background: ${({ theme: { colors } }) => colors.lightBackground};
  border: 1px solid ${({ theme: { colors } }) => colors.black};
  border-radius: 0px;
  margin: 10px 5px;
  display: flex;
  justify-content: center;
  flex-direction: column;


  .text-container {

    width: 100%;
    height: 30%;
    display: flex;
    align-items: center;
    /* margin-left: 20px; */
  }

  .titles {
    margin: 0 10px;
  }

  .title {
    font-size: 25px;
  }

  .icon {
    font-size: 20px;
    width: 20px;
    height: 20px;
    padding: 10px;
    background: ${({ theme: { colors } }) => colors.blue};
    border-radius: 50%;
  }

  .left-icon {
    margin-right: 20px;
  }

  .right-icon {
    margin-left: 20px;
  }

  .subtitle {
  }

  .button-container {
    width: 100%;
    height: 30%;

    display: flex;
    align-items: center;
    justify-content: center !important;

    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      width: 60px;
      padding: 20px 80px;
      border-radius: 10px;
      background: ${({ theme: { colors } }) => colors.blue};
    }

    .left-button {
      margin-right: 70px;
    }

    .right-button {
      margin-left: 70px
    }
  }

  .right-align {
    justify-content: flex-end;
    text-align: right;
  }

  .left-align {
    justify-content: flex-start;
    text-align: left !important;
  }
`

const SandBox = styled.div`
  height: 20vh;
  width: calc(80vw + 10px);
  background: ${({ theme: { colors } }) => colors.lightBackground};
  border: 1px solid ${({ theme: { colors } }) => colors.black};
  border-radius: 00px;
`

export default Main