import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from "axios"
const SignUp = ({ openSignUpModal, setOpenSignUpModal, setOpenLoginModal }) => {

  const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;


  const [username, setUsername] = useState("")
  const [validUsername, setValidUsername] = useState(false)

  const [email, setEmail] = useState("")
  const [validEmail, setValidEmail] = useState(false)

  const [password, setPassword] = useState("")
  const [validPassword, setValidPassword] = useState(false)

  const [matchPassword, setMatchPassword] = useState("")
  const [validMatchPassword, setValidMatchPassword] = useState(false)

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email))
  }, [email])

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password))
    setValidMatchPassword(password == matchPassword)
  }, [password, matchPassword])

  const submit = async (e) => {
    e.preventDefault();

    // if any field is invalid then return
    if (!(validUsername && validPassword && validMatchPassword && validEmail)) return;
    try {
      const response = await axios.post("http://localhost:5000/auth/register", {username, email, password}, {
        withCredentials: true
      })
    } catch (err) {
      console.log(err)
    }
  }

  const onLoginClick = () => {
    setOpenSignUpModal(false);
    setOpenLoginModal(true);
  }

  const onBackgroundClick = () => {
    setOpenSignUpModal(false);
  }

  if (!openSignUpModal) {
    return <></>
  } else {
    return (
      <>
      <Background onClick={onBackgroundClick}></Background>
      <Container>
        <InnerContainer>
          <div className="title">
            <p>Sign Up</p>
          </div>

          <div className="field username-div">
            <p>Username</p>
            <input onChange={(e) => {setUsername(e.target.value)}}/>
          </div>

          <div className="field email-div">
            <p>Email</p>
            <input onChange={(e) => {setEmail(e.target.value)}}/>
          </div>

          <div className="field password-div">
            <p>Password</p>
            <input onChange={(e) => {setPassword(e.target.value)}}/>
          </div>

          <div className="field re-enter-password-div">
            <label>Re-Enter Password</label>
            <input onChange={(e) => {setMatchPassword(e.target.value)}}/>
          </div>

          <div className="button-div">
            <button onClick={(e) => submit(e)}>Sign Up</button>
          </div>
          
          <div className="bottom-text">
            <p onClick={onLoginClick}>Already have an account? Login here</p>
          </div>
        </InnerContainer>
      </Container>
      </>
    )
  }
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 100vh;
  width: 100vw;
`

const Background = styled.div`
  background: ${({ theme: { colors } }) => colors.darkBackground};
  z-index: 2;
  height: 100vh;
  width: 100vw;
  opacity: 0.8;
  position: absolute;
`

const InnerContainer = styled.div`
  z-index: 10;
  opacity: 1 !important;
  height: 60vh;
  width: 25vw;
  background: ${({ theme: { colors } }) => colors.lightBackground};
  border-radius: 10px;

  .title {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 20px;

    p {
      font-size: 25px;
    }
  }

  .field {
    width: 100%;
    margin-left: 5%;
    height: 15%;
  }

  input {
    margin-top: 5px;
    width: 90%;
    background: ${({ theme: { colors } }) => colors.background};
    color: ${({ theme: { colors } }) => colors.white};
    padding: 10px 5px;
  }

  .button-div {
    width: 100%;
    height: 15%;
    display: flex;
    justify-content: center;

    button {
      height: 40px;
      width: 120px;
      background: ${({ theme: { colors } }) => colors.darkBackground};
      color: ${({ theme: { colors } }) => colors.white};
      margin: 25px 25px;
      border-radius: 5px;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
      cursor: pointer;
    }
  }

  .bottom-text {
    width: 100%;
    display: flex;
    justify-content: center;
    font-size: 12px;
    text-decoration: underline;
    p {
      cursor: pointer;
    }
  }
`

export default SignUp