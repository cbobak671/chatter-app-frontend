import React, { useState } from "react";
import { socket } from "../socket";

function ChatBox () {

    const [textInputData, setTextInputData] = useState({ textInput: "" });
    const [messageLog, setMessageLog] = useState([]);

    
    function handleTextInput(event) {
        setTextInputData({
          ...textInputData,
          [event.target.name]: event.target.value,
        });
      }
    
      function handleButtonSubmit(e) {
        e.preventDefault();
    
        socket.emit("message", textInputData.textInput);
        setMessageLog([...messageLog, textInputData.textInput]);
        setTextInputData({ textInput: "" });
      }
    
     
        socket.on('message', (messagecontent) => {
            setMessageLog([...messageLog, messagecontent])
           


        })
     


      
return ( <>
    <ul className="list-none">
      {messageLog.map((message, index) => (
        <li key = {index}>{message}</li>
      ))}
    </ul>

    <form onSubmit={handleButtonSubmit}>
      <label htmlFor="textInput"></label>

      <input
        id="textInput"
        name="textInput"
        type="text"
        value={textInputData.textInput}
        onChange={handleTextInput}
        required
      ></input>

      <button>
        {" "}
        <i className="bx bxs-send"></i>
      </button>
    </form>
  </>)

}


  
  export default ChatBox;
  