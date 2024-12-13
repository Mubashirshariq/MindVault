import { useState } from "react";
import chat from '../assets/chat.svg';
import { BACKEND_URL } from "../config";
import axios from "axios";

function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = input;
    setInput("");

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "You", text: userMessage },
    ]);

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "Gemini", text: "Gemini is typing..." },
    ]);

    try {
      const response = await axios.post(`${BACKEND_URL}/queryai`, {
        inputMessage: userMessage,
      });
      const geminiResponse = response.data.data;
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.text === "Gemini is typing..."
            ? { sender: "Gemini", text: geminiResponse }
            : message
        )
      );
    } catch (error) {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.text === "Gemini is typing..."
            ? { sender: "Gemini", text: "Oops! Something went wrong." }
            : message
        )
      );
    }
  };

  return (
    <div>
      <button
        className="w-16 h-16 bg-cyan-600 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-400 focus:outline-none"
        onClick={() => setIsOpen(true)}
      >
        <img src={chat} alt="Chat Icon" className="w-6 h-6" />
      </button>
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col">
          <div className="bg-blue-500 text-white py-2 px-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-lg font-semibold">Chat</h2>
            <button
              className="text-white hover:text-gray-200 focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.sender === "You"
                    ? "text-right text-blue-600"
                    : "text-left text-gray-800"
                }`}
              >
                <p className="text-sm font-bold">{message.sender}</p>
                <p className="bg-gray-100 inline-block py-1 px-2 rounded-lg mt-1">
                  {message.text}
                </p>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-300 flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
