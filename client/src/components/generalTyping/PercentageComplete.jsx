import React from 'react'
import { useSelector } from 'react-redux';
import styled from "styled-components"

const PercentageComplete = () => {
  const wordsTyped = useSelector((state) => state.typing.wordsTyped);
  const typingText = useSelector((state) => state.typing.typingText);
  const wpm = useSelector((state) => state.typing.wpm);
  const typingType = useSelector((state) => state.typing.typingType);
  const selectedLength = useSelector((state) => state.typing.selectedLength);
  const totalTime = useSelector((state) => state.typing.totalTime)
  const elapsedTime = useSelector((state) => state.typing.elapsedTime)

  const socketID = useSelector((state) => state.multiplayer.socketID)

  const user = useSelector((state) => state.user.user)

  let percent = 0
  if (typingType == 0 || (typingType == 1 && selectedLength < 4)) { // if percent should be based on words completed
    percent = (wordsTyped / typingText.split(" ").length) * 100;
  } else { // percent should be based on time
    percent = ((Math.trunc(elapsedTime/1000)) / totalTime) * 100
  }
  return (
    <PercentageCompleteContainer>
      <Percentage percent={percent}>
        <div className="wpm-container">
          <p className="wpm">{wpm} wpm</p>
        </div>
        <div className="outline">
          <div className="inline">
          </div>
          <div className="dot-container">
            <div className="dot">{typingText.split(" ")[wordsTyped]}</div>
          </div>
        </div>
        <div className="username-container">
          <p className="username">{user == null ? "Guest" : user.username}</p>
        </div>
      </Percentage>
    </PercentageCompleteContainer>
  )
}


const PercentageCompleteContainer = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;

`

const Percentage = styled.div`
  background: ${({ theme: { colors } }) => colors.lightBackground};
  border-radius: 10px;
  height: 40px;
  width: 80vw;
  display: flex;
  align-items: center;
  justify-content: center;

  .username-container {
    /* background: white; */
    width: 20%;
    display: flex;
    justify-content: center;
  }

  .wpm-container {
    width: 10%;
    display: flex;
    justify-content: center;
  }

  .username, .wpm {
    color: ${({ theme: { colors } }) => colors.white};
    /* font-weight: bold; */
    /* width: 70px; */
    text-align: center;
    background: ${({ theme: { colors } }) => colors.mediumBackground};
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 15px;
  }

  .wpm {
    color: ${({ theme: { colors } }) => colors.white};
    width: 70px;
    padding: 5px 0px;
    /* font-weight: bold; */
    /* margin-left: 30px; */
  }



  .outline {
    width: 70%;
    height: 5px;
    border-radius: ${props => props.percent > 1 ? "10" : "0"}px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background: ${({ theme: { colors } }) => colors.textDark};

    display: flex;

  }

  .inline {
    border-radius: ${props => props.percent > 1 ? "10" : "0"}px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    height: 100%;
    width: ${props => props.percent}%;
    background: ${({ theme: { colors } }) => colors.blue};
    position: relative;
  }

  .dot-container {

    display: flex;
    align-items: center;

  }

  .dot {
    /* position: absolute; */
    left: 500px;
    height: 25px;
    /* width: 50px; */
    min-width: 50px;
    text-wrap: nowrap;
    padding: 0px 10px;
    bottom: -10px; // -(height/2) + inline.height 
    border-radius: 5px;
    background: ${({ theme: { colors } }) => colors.blue};

    display: flex;
    justify-content: center;
    align-items: center;

    box-shadow: rgba(0, 123, 255, 0.19) 0px 10px 20px, rgba(0, 123, 255, 0.23) 0px 6px 6px;
  }



  @media (max-width: 1150px) {
    .username-container{
      width: 25%;
    }

    .wpm-container {
      width: 15%;
    }
    .outline {
      width: 60%;
    }
  }


  @media (max-width: 950px) {
    .username-container {
      width: 30%;
    }
     .wpm-container {
      width: 20%;
    }
    .outline {
      width: 50%;
    }
  }

  @media (max-width: 950px) {
    .username-container {
      justify-content: flex-end;
      width: 50%;
      margin-right: 20px;
    }
     .wpm-container {
      justify-content: flex-start;
      width: 50%;
      margin-left: 20px;
    }
    .outline {
      display: none;
      width: 50%;
    }
  }

  /* @media (max-width: 650px) {

    .username-container {
      width: 40%;
    }
     .wpm-container {
      width: 20%;
    }
    .outline {
      width: 40%;
    }
    .username, .wpm {
      min-width: 50px;
      font-size: 10px;
    }

    .wpm {
      width: 30px;
    }

    .dot {
      font-size: 10px;
      min-width: 10px;
    }
  } */

  /* @media (max-width: 450px) {

.username-container {
  width: 40%;
}
 .wpm-container {
  width: 30%;
}
.outline {
  width: 30%;
}
.username, .wpm {
  min-width: 50px;
  font-size: 10px;
}

.wpm {
  width: 30px;
}

.dot {
  font-size: 10px;
  min-width: 10px;
}
} */
`

export default PercentageComplete