import {
  faBars,
  faBook,
  faDoorOpen,
  faHammer,
  faHome,
  faHouse,
  faLock,
  faQ,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import CornerButton from "./CornerButton";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { GAME_MODES, PAGES, TYPING_TYPE } from "../../constants";
import { Link } from "react-router-dom";
import { setLookingForRoom, setMode } from "../../redux/multiplayerSlice";
import { setTypingType } from "../../redux/typingSlice";

const Header = (props) => {
  const [toggleHamburger, setToggleHamburger] = useState(false);

  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.user.currentPage);

  const onHamburgerClick = () => {};
  return (
    <Container>
      <div className="logo">
        <span className="typed-logo">Typ</span>
        <span className="untyped-logo">er</span>
        <span className="logo-cursor"></span>
      </div>
      <div className="navbar navbar-large">
        <div className="navbar-container">
          <Link to="/">
            <FontAwesomeIcon
              icon={faHouse}
              className={`icon ${
                currentPage == PAGES.HOME ? "current-page" : ""
              } `}
            />
          </Link>

          <div>
            <Link
              to="/multiplayer"
              onClick={() => {
                dispatch(setMode(GAME_MODES.MULTIPLAYER));
                dispatch(setTypingType(TYPING_TYPE.QUOTES));
                dispatch(setLookingForRoom(true));
              }}
            >
              <FontAwesomeIcon
                icon={faQ}
                className={`icon ${
                  currentPage == PAGES.QUOTE ? "current-page" : ""
                } `}
              />
            </Link>
          </div>
          <div>
            <Link
              to="/multiplayer"
              onClick={() => {
                dispatch(setMode(GAME_MODES.MULTIPLAYER));
                dispatch(setTypingType(TYPING_TYPE.WORDS));
                dispatch(setLookingForRoom(true));
              }}
            >
              <FontAwesomeIcon
                icon={faBook}
                className={`icon ${
                  currentPage == PAGES.DICTIONARY ? "current-page" : ""
                } `}
              />
            </Link>
          </div>
          <Link
            to="/private-race"
            onClick={() => {
              dispatch(setMode(GAME_MODES.MULTIPLAYER));
              dispatch(setTypingType(TYPING_TYPE.WORDS)); // fix this later
            }}
          >
            <FontAwesomeIcon
              icon={faLock}
              className={`icon ${
                currentPage == PAGES.PRIVATE ? "current-page" : ""
              } `}
            />
          </Link>
          <Link to="sandbox">
            <FontAwesomeIcon
              icon={faHammer}
              className={`icon ${
                currentPage == PAGES.SANDBOX ? "current-page" : ""
              } `}
            />
          </Link>
        </div>
      </div>
      <div className="navbar navbar-small">
        <div
          className="hamburger"
          onClick={() => setToggleHamburger(!toggleHamburger)}
        >
          <FontAwesomeIcon
            className={`${toggleHamburger ? "hamburger-accent" : ""}`}
            icon={
              toggleHamburger
                ? currentPage == PAGES.HOME
                  ? faHome
                  : currentPage == PAGES.QUOTE
                  ? faQ
                  : currentPage == PAGES.DICTIONARY
                  ? faBook
                  : currentPage == PAGES.PRIVATE
                  ? faLock
                  : faHammer
                : faBars
            }
          />

          <div
            className={`hamburger-icons ${!toggleHamburger ? "invisible" : ""}`}
          >
            <div
              className={`${currentPage == PAGES.HOME ? "invisible-icon" : ""}`}
            >
              <Link
                className={`${!toggleHamburger ? "invisible-icon" : ""}`}
                to="/"
                onClick={() => {
                  setToggleHamburger(false);
                }}
              >
                <FontAwesomeIcon
                  icon={faHouse}
                  className={`icon ${
                    currentPage == PAGES.HOME ? "current-page" : ""
                  } `}
                />
              </Link>
            </div>
            <div
              className={`${
                currentPage == PAGES.QUOTE ? "invisible-icon" : ""
              }`}
            >
              <Link
                to="/multiplayer"
                className={`${!toggleHamburger ? "invisible-icon" : ""}`}
                onClick={() => {
                  dispatch(setMode(GAME_MODES.MULTIPLAYER));
                  dispatch(setTypingType(TYPING_TYPE.QUOTES));
                  dispatch(setLookingForRoom(true));
                  setToggleHamburger(false);
                }}
              >
                <FontAwesomeIcon
                  icon={faQ}
                  className={`icon ${
                    currentPage == PAGES.QUOTE ? "current-page" : ""
                  } `}
                />
              </Link>
            </div>
            <div
              className={`${
                currentPage == PAGES.DICTIONARY ? "invisible-icon" : ""
              }`}
            >
              <Link
                to="/multiplayer"
                className={`${!toggleHamburger ? "invisible-icon" : ""}`}
                onClick={() => {
                  dispatch(setMode(GAME_MODES.MULTIPLAYER));
                  dispatch(setTypingType(TYPING_TYPE.WORDS));
                  dispatch(setLookingForRoom(true));
                  setToggleHamburger(false);
                }}
              >
                <FontAwesomeIcon
                  icon={faBook}
                  className={`icon ${
                    currentPage == PAGES.DICTIONARY ? "current-page" : ""
                  } `}
                />
              </Link>
            </div>
            <div
              className={`${
                currentPage == PAGES.PRIVATE ? "invisible-icon" : ""
              }`}
            >
              <Link
                className={`${!toggleHamburger ? "invisible-icon" : ""}`}
                to="/private-race"
                onClick={() => {
                  dispatch(setMode(GAME_MODES.MULTIPLAYER));
                  dispatch(setTypingType(TYPING_TYPE.WORDS)); // fix this later
                  setToggleHamburger(false);
                }}
              >
                <FontAwesomeIcon
                  icon={faLock}
                  className={`icon ${
                    currentPage == PAGES.PRIVATE ? "current-page" : ""
                  } `}
                />
              </Link>
            </div>
            <div
              className={`${
                currentPage == PAGES.SANDBOX ? "invisible-icon" : ""
              }`}
            >
              <Link
                to="sandbox"
                className={`${!toggleHamburger ? "invisible-icon" : ""}`}
                onClick={() => {
                  setToggleHamburger(false);
                }}
              >
                <FontAwesomeIcon
                  icon={faHammer}
                  className={`icon ${
                    currentPage == PAGES.SANDBOX ? "current-page" : ""
                  } `}
                />
              </Link>
            </div>
            <div
              className={`${!toggleHamburger ? "invisible-icon" : ""} invisible-until-small`}>
              <FontAwesomeIcon
                icon={faDoorOpen}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="user">
        <CornerButton>
          <button className="corner-button">
            <span>LOGIN</span>
          </button>
        </CornerButton>
      </div>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  position: relative;
  z-index: 10000000 !important;
  width: calc(100vw-78px);
  margin: 39px;
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* height: 45px; */
  height: 83px;

  .logo {
    flex: 1;
    font-family: ${(props) => props.theme.fonts[1]};
    font-size: ${(props) => props.theme.fontSizes.logo.default};
    height: inherit;
    position: relative;
    display: flex;
    align-items: center;
    width: 33%;

    .typed-logo {
      color: ${(props) => props.theme.colors.text};
    }

    .untyped-logo {
      color: ${(props) => props.theme.colors.textDark};
    }

    .logo-cursor {
      position: absolute;
      background: ${(props) => props.theme.colors.accent};

      height: 80%;
      /* left: 80px;
      width: 4px; */

      width: 5px;
      left: 84px;

      border-radius: 10px;
    }
  }

  .navbar {
    flex: 2;
    width: 33%;
    display: flex;
    justify-content: center;

    .navbar-container {
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      width: 266px;
      height: 38px;
      border-radius: 20px;
      background: ${(props) => props.theme.colors.lightBackground};
      color: ${(props) => props.theme.colors.text};

      display: flex;
      align-items: center;
      justify-content: space-evenly;
      font-size: ${(props) => props.theme.fontSizes.navIcons};

      .icon {
        cursor: pointer;
        color: ${(props) => props.theme.colors.text};
      }

      .icon:hover {
        color: ${(props) => props.theme.colors.accent};
        opacity: 0.2;
      }

      .current-page {
        color: ${(props) => props.theme.colors.accent};
      }
    }
  }

  .navbar-small {
    display: flex;
    justify-content: flex-end;
    flex-direction: row !important;
    width: 100%;
    display: none;
    position: relative;
    color: ${(props) => props.theme.colors.text} !important;
    transition: max-height 0.4s ease-in-out;
    width: 50px;

    .hamburger {
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      width: inherit;
      height: 38px;
      width: 50px;

      font-size: ${(props) => props.theme.fontSizes.navIcons};

      display: flex;
      justify-content: center;
      align-items: center;
      background: ${(props) => props.theme.colors.lightBackground};
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      transition: max-height 0.4s ease-in-out;
    }

    .hamburger-accent {
      color: ${(props) => props.theme.colors.accent};
    }

    .hamburger-icons {
      box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
        rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
      transition: height 0.4s ease-in-out;
      background: ${(props) => props.theme.colors.lightBackground};
      height: 38px;
      /* height: inherit; */
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;
      position: absolute;
      right: 45px;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;

      width: 300px;
      /* height: 120px !important; */

      .icon {
        color: ${(props) => props.theme.colors.text} !important;
      }
    }

    .invisible {
      height: 0px;
    }

    .invisible-icon {
      display: none !important;
    }

    .invisible-until-small {
      display: none;
    }
  }

  .user {
    flex: 1;
    width: 33%;
    display: flex;
    justify-content: flex-end;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    height: 50px;
    .logo {
      font-size: ${props => props.theme.fontSizes.logo.sm};

      .logo-cursor {
        height: 100%;
        left: 69px;
      }
    }
    .navbar {
      position: relative;
      top: 50px;
      /* display: none; */
    }

    /* .navbar-small {
      display: flex;
      justify-content: center;

      .hamburger-icons {
        right: 160px;
      }
    } */
  }

  @media (max-width: ${(props) => props.theme.breakpoints.xs}) {
    .logo {
      width: 50% !important;
    }

    .navbar-small {
      align-items: flex-end;
      width: 50%;



      .invisible-until-small {
        display: block;
      }
    }



    .user {
      display: none;
    }
  }
`;
