import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket";
import * as chatService from "../../services/chatService";
import * as messageService from "../../services/messageService";
import useChats from "../zustand/useChatLogs";
import UserProfile from "./chatbar/UserProfile";
import { useParams } from "react-router-dom";
import UserAvatar from "./chatbar/UserAvatar";

function ChatBox({ user }) {
  const [textInputData, setTextInputData] = useState({
    senderId: [{ username: user.username }],
    message: "",
  });
const [databaseMessageLog, setDatabaseMessageLog] = useState([])
  const [messageLog, setMessageLog] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [currentRoom, setCurrentRoom] = useState("");
  const [chatParticipants, setChatParticipants] = useState([]);
  const [chatlogId, setChatLogId] = useState("");
  const [inputValue, setInputValue] = useState("");
const [userChats,setUserChats] = useState('')
  const { userId } = useParams();
  const {foundUserId} =useParams();
const { chatId } =useParams();

// console.log('chatId', chatId)
// console.log('founduser', foundUserId)


  useEffect(() => {
    async function getUser(foundUserId) {
      const foundUserObject = await chatService.getUser(foundUserId);
      setSelectedUser(foundUserObject);
    }

const handleChatChange = async function (newChatId) {
  const chatMessages = await chatService.getChatMessages(newChatId)
setDatabaseMessageLog(chatMessages.messages)



}

// { senderId: [{ username: user.username }], message: "" }



    const handleRoomChange = function (newRoom) {
      if (currentRoom) {
        socket.emit("leave", currentRoom, user.username);
      }

      socket.emit("join", newRoom, user.username);
      setCurrentRoom(newRoom);
    };

    if (foundUserId) getUser(foundUserId);
    handleRoomChange(userId);
    handleChatChange(chatId)
  }, [foundUserId]);

 
  
  const messageListener = (messagecontent) => {
    console.log(messagecontent);
    setMessageLog([messagecontent, ...messageLog]);
  };

  useEffect(() => {
    socket.on("message", messageListener);
    return () => socket.off("message", messageListener);
  }, []);

  useEffect(() => {
    const createChatRouter = async function () {
      setChatParticipants([user, selectedUser]);

      const newChat = await chatService.create(chatParticipants);
// console.log('new chat id' ,newChat)
      setChatLogId(newChat._id);
    };
    createChatRouter();
  }, [selectedUser]);

  function handleTextInput(event) {
    setTextInputData({
      ...textInputData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleButtonSubmit(e) {
    e.preventDefault();

    setMessageLog([textInputData, ...messageLog]);

    socket.emit(
      "message",
      {
        senderId: [{ username: user.username }],
        message: textInputData.message,
      },
      currentRoom
    );

    const newMessage = await messageService.create(textInputData);
    
    const updateChat = await chatService.update(chatlogId, newMessage._id);
   
    
     setTextInputData({ senderId: [{ username: user.username }], message: "" });
    setInputValue("");
  }
  console.log('DB message log', databaseMessageLog)
  console.log('message log', messageLog)
  async function handleDeleteButtonSubmit(
    usermessageObject,
    userMessageObjectIndex
  ) {
   
    await messageService.deleteMessage(usermessageObject._id);

    const filteredLog = messageLog.filter((usermessageObject, index) => {
      return index != userMessageObjectIndex;
    });

    setMessageLog(filteredLog);
  }

  return (
    <>
      <header className="sticky top-0 h-16 bg-slate-300 flex justify-between items-center px-4 my-0">
        {foundUserId ? (
          <div>
            <UserAvatar width={20} height={2} />
            <div>
              <h1 className="text-slate-800 text-xl ml-5 font-semibold line-clamp-1">
                {selectedUser.user?.username}
              </h1>
            </div>
          </div>
        ) : (
          ""
        )}
      </header>

      <ul className="list-none flex flex-col items-center overflow-auto">
 
      {databaseMessageLog?.map((dbMessageObject,index) => ( <div
            // className={`w-5/6 flex ${
            //   userMessageObject.senderId[0]?.username === user.username
            //     ? `justify-end`
            //     : `justify-start`
            // }`}
          >
            <div className="border-2 border-slate-500 rounded-xl pl-2 pr-2 pb-2 m-1 ">
              <div key={index + 1} className="font-semibold pt-1 ">
                {/* {`${
                  userMessageObject.senderId[0]?.username
                    ? userMessageObject.senderId[0]?.username
                    : user.username
                }`}{" "} */}
                <button
                  onClick={function () {
                    handleDeleteButtonSubmit(dbMessageObject, index);
                  }}
                >
                  <i className="bx bx-trash-alt"></i>
                </button>
              </div>
              <li key={index}>{` ${dbMessageObject.message}`}</li>
            </div>
          </div>
        ))}
</ul>





      <ul className="list-none flex flex-col-reverse items-center overflow-auto">
      
         {messageLog?.map((userMessageObject, index) => (
          <div
            className={`w-5/6 flex ${
              userMessageObject.senderId[0]?.username === user.username
                ? `justify-end`
                : `justify-start`
            }`}
          >
            <div className="border-2 border-slate-500 rounded-xl pl-2 pr-2 pb-2 m-1 ">
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
          className="w-5/6 h-full border-2 rounded-lg border-black/30 pl-2 text-slate-700"
          id="message"
          name="message"
          type="text"
          placeholder="Start typing..."
          value={textInputData.message}
          onChange={handleTextInput}
          required
        ></input>

        <button className="w-10 ml-1 rounded-lg border-purple-400 border-2">
          <i className="bx bxs-send"></i>
        </button>
      </form>
    </>
  );
}

export default ChatBox;
