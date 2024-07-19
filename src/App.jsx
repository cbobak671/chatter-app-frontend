import React, { useState, useEffect } from "react";
import ChatBar from "./components/chatbar/ChatBar";
import Chat from "./components/chatbar/Chat";
import ChatBox from "./components/ChatBox";
import * as authService from "../services/authService";
import * as chatService from "../services/messageService";
import { Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";

function App() {
  const [user, setUser] = useState(authService.getUser());

  const [loginText, setLoginText] = useState({ username: "", password: "" });
  const [isSignedup, setIsSignedUp] = useState(true);

  function loginSubmit(e) {
    console.log(loginText);
    isSignedup ? authService.signin(loginText) : authService.signup(loginText);
    e.preventDefault();
  }

  function handleTextInput(event) {
    setLoginText({ ...loginText, [event.target.name]: event.target.value });

    console.log(loginText);
  }

  return (
    <>
      <div
        id="root"
        className=" flex justify-center items-center w-screen h-screen"
      >
        {user ? (
          <>
            <div className=" flex justify-end w-5/6 h-5/6 rounded-lg bg-slate-200 ">
              <ChatBar user={user} />
              <div className="flex flex-col justify-end h-full w-5/6 border-1 border-black/40 rounded-lg">
                <Routes>
                  <Route path="/" element={<ChatBox user={user} />} />
                  <Route
                    path="/chatlogs/:foundUserId/new"
                    element={<ChatBox user={user} />}
                  />
                  <Route
                    path="/chatlogs/:chatId/user/:foundUserId"
                    element={<ChatBox user={user} />}
                  />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className=" flex flex-col h-1/2 justify-center items-center bg-purple-200 border-black border-1 w-2/6 h-1/2 rounded-lg">
              {isSignedup ? (
                <>
                <div className="h-full flex flex-col items-center justify-center">
                  <h1>Log In</h1>

<div className="h-1/2 flex flex-col justify-center items-center">
                  <form className="flex flex-col w-1/2 " onSubmit={loginSubmit}>
                    <label htmlFor="username"></label>

                    <input 
                      className="border-black border-2 w-full"
                      id="username"
                      name="username"
                      type="text"
                      onChange={handleTextInput}
                      value={loginText.username}
                    ></input>

                    <input
                      className="border-black border-2"
                      id="password"
                      name="password"
                      type="text"
                      onChange={handleTextInput}
                      value={loginText.password}
                    ></input>

                    <button
                      className="bg-blue-500 rounded text-white p-1"
                      type="submit"
                    >
                      Log In
                    </button>
                  </form>
                  </div>
                  <button
                    onClick={function () {
                      setIsSignedUp(!isSignedup);
                    }}
                  >
                    Don't have an account ?
                  </button>
                  </div>
                </>
              ) : (
                <>
                  <h1>Sign up</h1>

                  <form className="flex flex-col w-1/2 " onSubmit={loginSubmit}>
                    <label htmlFor="username"></label>

                    <input
                      className="border-black border-2"
                      id="username"
                      name="username"
                      type="text"
                      onChange={handleTextInput}
                      value={loginText.username}
                    ></input>

                    <input
                      className="border-black border-2"
                      id="password"
                      name="password"
                      type="text"
                      onChange={handleTextInput}
                      value={loginText.password}
                    ></input>

                    <button
                      className="bg-blue-500 rounded text-white p-1"
                      type="submit"
                    >
                      Sign Up
                    </button>
                  </form>

                  <button
                    onClick={function () {
                      setIsSignedUp(!isSignedup);
                    }}
                  >
                    Already have an account ?
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
