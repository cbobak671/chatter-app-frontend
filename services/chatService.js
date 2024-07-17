const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const chatLogIndex = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/chatlogs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
  };
  
  const create = async function (participants, messageId) {
    try {
      const res = await fetch(`${BACKEND_URL}/chatlogs/new/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            participants: [participants],
            messages: [messageId]
        }),
      });
      // return res.json();
    } catch (error) {
      console.log(error);
    }
  };

  const update = async function (chatId, messageId) {
    try {
      const res = await fetch(`${BACKEND_URL}/chatlogs/${chatId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageId),
      });
      // return res.json();
    } catch (error) {
      console.log(error);
    }
  };
  