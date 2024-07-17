import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket";
import * as chatService from "../../services/chatService";
import useChats from "../zustand/useChatLogs";
import UserProfile from "./chatbar/UserProfile";
import { useParams } from "react-router-dom";

function ChatBox({ user }) {
  const [textInputData, setTextInputData] = useState({
    senderId: [{ username: user.username }],
    message: "",
  });

  // const { selectedChats, setSelectedChats } = useChats();
  const [messageLog, setMessageLog] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [currentRoom, setCurrentRoom] = useState("");
  const [chatParticipants, setChatParticipants] = useState([])

  // const [userId, setUserId] = useState(useParams())

  const { userId } = useParams();

  useEffect(() => {
    async function getUser(userId) {
      const foundUserObject = await chatService.getUser(userId);
      setSelectedUser(foundUserObject);
    }

    const handleRoomChange = function (newRoom) {
      if (currentRoom) {
        // Leave the current room
        socket.emit("leave", currentRoom, user.username);
      }

      socket.emit("join", newRoom, user.username);
      // Update the current room state
      setCurrentRoom(newRoom);
    };

    if (userId) getUser(userId);
    handleRoomChange(userId);
  }, [userId]);

  const messageListener = (messagecontent) => {
    console.log(messagecontent);
    setMessageLog([messagecontent, ...messageLog]);
  };

  useEffect(() => {
    socket.on("message", messageListener);
    return () => socket.off("message", messageListener);
  }, []);

  useEffect(() => {
   const createChatRouter = async function() {
    
    setChatParticipants([ user,selectedUser])
  

    const newChat = await chatService.create(chatParticipants)
  console.log(newChat) 
   
   }
   createChatRouter()
  }, [selectedUser]);


  function handleTextInput(event) {
    setTextInputData({
      ...textInputData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleButtonSubmit(e) {
    e.preventDefault();

    // const messageData = await chatService.messageIndex();

    // setMessageLog([textInputData, ...messageData.reverse()]);
    setMessageLog([textInputData, ...messageLog]);

    socket.emit(
      "message",
      {
        senderId: [{ username: user.username }],
        message: textInputData.message,
      },
      currentRoom
    );

    // console.log(message);
    // console.log(textInputData);
    // chatService.create(textInputData);
    setTextInputData({ senderId: [{ username: user.username }], message: "" });
  }

  async function handleDeleteButtonSubmit(
    usermessageObject,
    userMessageObjectIndex
  ) {
    console.log(usermessageObject._id);
    await chatService.deleteMessage(usermessageObject._id);

    const filteredLog = messageLog.filter((usermessageObject, index) => {
      return index != userMessageObjectIndex;
    });

    setMessageLog(filteredLog);
  }
 

  return (
    <>
      {userId ? <h1>{selectedUser.user?.username}</h1> : ""}
      <ul className="list-none flex flex-col-reverse items-center overflow-auto">
        {messageLog.map((userMessageObject, index) => (
          <div
            className={`w-5/6 flex ${
              userMessageObject.senderId[0]?.username === user.username
                ? `justify-end`
                : `justify-start`
            }`}
          >
            <div className="border-2 border-black rounded-xl pl-2 pr-2 pb-2 m-1 ">
              <div key={index + 1} className="font-semibold pt-1 ">
                {`${
                  userMessageObject.senderId[0]?.username
                    ? userMessageObject.senderId[0]?.username
                    : user.username
                }`}{" "}
                <button
                  onClick={function () {
                    handleDeleteButtonSubmit(userMessageObject, index);
                  }}
                >
                  <i className="bx bx-trash-alt"></i>
                </button>
              </div>
              <li key={index}>{` ${userMessageObject.message}`}</li>
            </div>
          </div>
        ))}
      </ul>

      <form
        className="w-full h-10 flex justify-center mb-2"
        onSubmit={handleButtonSubmit}
      >
        <label htmlFor="message"></label>

        <input
          className="w-5/6 h-full border-2 rounded-lg border-black/30 pl-2"
          id="message"
          name="message"
          type="text"
          value={textInputData.message}
          onChange={handleTextInput}
          required
        ></input>

        <button className="w-10 rounded-lg border-black border-2">
          <i className="bx bxs-send"></i>
        </button>
      </form>
    </>
  );
}

export default ChatBox;
