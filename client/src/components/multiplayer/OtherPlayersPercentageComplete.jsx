import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { socket } from "../../Socket";
import { setInitalOtherPlayersData, setOtherPlayersData, setSocketID } from "../../redux/multiplayerSlice";
import { useDispatch, useSelector } from "react-redux";
import { reset, setTypingBackgroundInfo, setTypingText } from "../../redux/typingSlice";
const OtherPlayersPercentageComplete = ({ typingRef }) => {
  const dispatch = useDispatch();
  
  const otherPlayersData = useSelector( (state) => state.multiplayer.otherPlayersData );
  const userStats = useSelector( (state) => state.user.userStats)



  const onOtherPlayerHover = (data) => {
    // e.preventDefault();
    // e.stopPropogation();

    console.log(data)
  }



  return (
    <>
      {Object.keys(otherPlayersData).map((data, index) => {
        const { wpm, currentWord, percentage, username } = otherPlayersData[data];
        return (
          <PercentageCompleteContainer key={index} onMouseOver={(e) => onOtherPlayerHover(otherPlayersData[data])}>
            <Percentage percent={percentage}>
              <div className="wpm-container">
                <p className="wpm">{wpm} wpm</p>
              </div>
              <div className="outline">
                <div className="inline"></div>
              </div>
              <div className="username-container">
                <p className="username">{username}</p>
              </div>
            </Percentage>
          </PercentageCompleteContainer>
        );
      })}
    </>
  );
}

const PercentageCompleteContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Percentage = styled.div`
  width: 60vw;
  padding: 5px 10px;

  margin: 10px 0px;

  background: ${props => props.theme.colors.lightBackground};
  border-radius: 10px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;

  .username-container {
    width: 25%;
    display: flex;
    justify-content: center;
  }

  .wpm-container {
    width: 25%;
    display: flex;
    justify-content: center;
  }

  .username, .wpm {
    text-align: center;
    background: ${props => props.theme.colors.mediumBackground};
    padding: 5px 15px;
    border-radius: 10px;
  }

  .wpm {
    width: 70px;
    padding: 5px 0px;
  }



  .outline {
    width: 50%;
    height: 5px;
    border-radius: ${props => props.percent > 1 ? "10" : "0"}px;
    border-radius: 10px;
    background: ${props => props.theme.colors.textDark};

    display: flex;

  }

  .inline {
    border-radius: ${props => props.percent > 1 ? "10" : "0"}px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    height: 100%;
    width: ${props => props.percent}%;
    background: ${props => props.theme.colors.accent};
    position: relative;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 70%;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 80%;
    justify-content: space-between;

    .wpm {
      margin-left: 25px;
    }

    .username {
      margin-right: 25px;
    }
    .outline {
      display: none !important;

    }

    .username-container {
      width: 50%;
      justify-content: flex-end;
    }

    .wpm-container {
      width: 50%;
      justify-content: flex-start;
    }
  }
`;

export default OtherPlayersPercentageComplete;
