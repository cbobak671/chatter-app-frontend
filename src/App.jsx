import React, { useState, useEffect, useContext,useRef } from "react";
import { useParams } from "react-router-dom";
import ChatBar from "./components/chatbar/ChatsLeftNavBar";

import ChatBox from "./components/ChatBox";
import * as authService from "../services/userService";
import * as chatService from "../services/chatService";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import UserAvatar from "./components/chatbar/UserAvatar";
import { ChatContext } from "../src/context";

import { VscSquirrel } from "react-icons/vsc";
import ImageUploadModal from "./components/ImageUploadModal";
import {Avatar, AvatarImage, AvatarFallback} from "./components/ui/avatar"
import "./App.css";

function App() {
  const navigate = useNavigate();
  
  const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

  const [user, setUser] = useState(authService.getUser());

  const [loginText, setLoginText] = useState({ username: "", password: "" });
  const [isSignedup, setIsSignedUp] = useState(true);
  const [loginMessage, setLoginMessage] = useState(
    "Connect with your friends and family, build your community, and deepen your interests."
  );

  const [userChats, setUserChats] = useState([]);
  const { previewMessage, setPreviewMessage } = useContext(ChatContext);
  const {foundUserId} =useParams();
  const userId = user?._id;
  const [isInChat, setIsInChat] =useState(false);
 const [imageUploadOpen, setImageUploadOpen]= useState(false);

const handleImageUploadModalClose = function () {

setImageUploadOpen(false)

}

const handleImageUploadModalOpen = function () {

  setImageUploadOpen(true)
  
  }

const handleIsInChat = function () {
  setIsInChat(true)
}


  useEffect(() => {
    if (userId) {
      refreshUserChats(userId);
    }
  }, [previewMessage, user]);
 

  // useEffect(()=>{
    
  //   if (userChats.length>0 && !isInChat && user){
  //     navigate(`/chatlogs/${userChats[0][0]?._id}/user/${userChats[0][0]?.participants[0].username === user.username ? `${userChats[0][0]?.participants[1]._id}`: `${userChats[0][0]?.participants[0]._id}`}/${userChats[0][0]?.participants[0]?.username === user.username ? `${userChats[0][0]?.participants[1]?.username}`: `${userChats[0][0]?.participants[0].username}` }
  //       ` );
  //   } else if (userChats.length === 0 && user) {
  //     navigate(`/chatlogs/undefined/user/${user._id}/${user.username} ` );
  //   }
    
      
    
    
  //   },[userChats])

  


  const refreshUserChats = async function (userId) {
    if (userId) {
      const allUserChats = await chatService.getUserChats(userId);

      setUserChats([allUserChats]);
    } else {
      setUserChats([]); 
    }
  };

  async function loginSubmit(e) {
    e.preventDefault();

    try {
      const userToken = isSignedup
        ? await authService.signin(loginText)
        : await authService.signup(loginText);

      setUser(userToken);
    } catch (err) {
      console.log(err);
      setLoginMessage("Invalid username or password");
    }

  }

  function handleTextInput(event) {
    setLoginText({ ...loginText, [event.target.name]: event.target.value });
  }

  const [openSearchBox, setOpenSearchBox] = useState(false);

  const onOpen = () => {
    
    setOpenSearchBox(!openSearchBox);
  };

  const onClose = () => {
    setOpenSearchBox(false);
  };


  return (
    <>
      <div id="root">
        {user ? (
          <>
         <ImageUploadModal imageUploadOpen={imageUploadOpen} handleImageUploadModalClose= {handleImageUploadModalClose} user={user}/>

            <section className="chat-screen-container">
              <nav className=" chat-top-navbar ">
                <button onClick={handleImageUploadModalOpen}>
              

                <Avatar className='h-8 w-8 ml-2' >
      <AvatarImage className   src={`${BACKEND_URL}/users/${user._id}/images`} alt="@shadcn" />
      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  
                  
                 
                </button>
                <VscSquirrel size={30} className="chat-logo" />
                <button
                  onClick={() => {
                    authService.signout();
                    setUser(false);
                    setUserChats([]);
                    setIsInChat(false)
                    navigate("/");
                  }}
                >
                  Sign Out
                </button>
              </nav>
              <div className=" chat-window ">
                <ChatBar
                  user={user}
                  userId={userId}
                  onOpen={onOpen}
                  onClose ={onClose}
                  userChats={userChats}
                  refreshUserChats={refreshUserChats}
                  handleIsInChat ={handleIsInChat}
                />

                <div className="chat-window-right-panel">
                  <Routes>
                    <Route path="/" element={<ChatBox user={user} />} />

                    <Route
                      path="/chatlogs/:chatId/user/:foundUserId/:foundUserusername"
                      element={
                        <ChatBox
                          user={user}
                          onOpen={onOpen}
                          onClose ={onClose}
                          openSearchBox={openSearchBox}
                          refreshUserChats={refreshUserChats}
                          
                        />
                      }
                    />
                  </Routes>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
          
            <nav className="navbar-container">
              {" "}
              <div className="navbar">
                <VscSquirrel size={50} className="logo" />{" "}
                <p className="chatter-title">Chatter</p>
              </div>
            </nav>
            <div className="login-container">
              <div className="login-inner">
                <>
                  <div className="landing-column-left-container">
                    <div className="landing-column-left">
                      <h1 className="landing-column-left-header">
                        A place for meaningful conversations
                      </h1>

                      <p id="landing-column-left-pitch">{loginMessage}</p>

                      <div id="login-form-container">
                        <form id="login-form" onSubmit={loginSubmit}>
                          <label htmlFor="username"></label>

                          <input
                            className="form-input"
                            id="username"
                            name="username"
                            type="text"
                            onChange={handleTextInput}
                            value={loginText.username}
                            placeholder="Username"
                          ></input>

                          <input
                            className="form-input"
                            id="password"
                            name="password"
                            type="text"
                            onChange={handleTextInput}
                            value={loginText.password}
                            placeholder="Password"
                          ></input>
                          <div id="form-buttons">
                            <button id="login-button" type="submit">
                              {isSignedup ? "Log In" : "Sign Up"}
                            </button>
                            <button
                              type="button"
                              onClick={function () {
                                setIsSignedUp(!isSignedup);
                              }}
                            >
                              Don't have an account ?
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="landing-column-right-container">
                    <div className="landing-column-right">hey</div>
                  </div>
                </>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
