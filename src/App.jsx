import React, { useState, useEffect } from "react";
import ChatBar from "./components/chatbar/ChatsLeftNavBar";
import Chat from "./components/chatbar/Chat";
import ChatBox from "./components/ChatBox";
import * as authService from "../services/authService";
import * as chatService from "../services/messageService";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";

function App() {

  const navigate = useNavigate();


  const [user, setUser] = useState(authService.getUser());






 
  const [loginText, setLoginText] = useState({ username: "", password: "" });
  const [isSignedup, setIsSignedUp] = useState(true);

  



 async function loginSubmit(e) {
  e.preventDefault();
   
  
try {
  
  const user =  await authService.signin(loginText) 
console.log(user)
  setUser(user);
  navigate('/');
} catch (err) {
  console.log('non')
}

  }

  function handleTextInput(event) {
    setLoginText({ ...loginText, [event.target.name]: event.target.value });

   
  }

  return (
    <>
      

      <div
        id="root"
        className=" flex flex-col justify-center items-center w-screen h-screen"
      >
        {user ? (
          <>
          <nav className=" w-full flex justify-between"><Link to="/">Home</Link> <button onClick={() => {authService.signout(); setUser(null)}}>Sign Out</button></nav>
            <div className=" flex  justify-end w-5/6 h-5/6 rounded-lg bg-slate-200">
              <ChatBar user={user} />
              <div className="flex flex-col justify-end h-full w-5/6 border-1 border-black/40 rounded-lg">
                <Routes>
                  <Route path="/" element={<ChatBox user={user} />} />
                  {/* <Route
                    path="/chatlogs/:foundUserId/new"
                    element={<ChatBox user={user} />}
                  /> */}
                  <Route
                    path="/chatlogs/:chatId/user/:foundUserId/:foundUserusername"
                    element={<ChatBox user={user} />}
                  />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col justify-center items-center bg-purple-200 border-black border-1 min-w-96 h-1/2 rounded-lg bg-opacity-100">
              {isSignedup ? (
                <>
                  <div className="h-full flex flex-col items-center justify-center text-slate-600">
                    <section>
                      <h1 className="h-full flex flex-col items-center justify-center text-slate-600">
                        Log In
                      </h1>

                      <div className="h-1/2 flex flex-col justify-center items-center">
                        <form
                          className="flex flex-col w-1/2 "
                          onSubmit={loginSubmit}
                        >
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
                    </section>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <section>
                      <h1 className="h-full flex flex-col items-center justify-center text-slate-600">
                        Sign up
                      </h1>

                      <form
                        className="flex flex-col w-1/2 "
                        onSubmit={loginSubmit}
                      >
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
                    </section>
                  </div>
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
