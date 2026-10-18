import { useState } from "react";
import axios from "axios";
function App(){
  const [userQuery,setUserQuery] =useState("");
  const [conversation,setConversation] = useState([]);
 async function handleSubmit(e){
    e.preventDefault();
    setConversation((prevConversation)=>[
      ...prevConversation,
      {role:"user",content:userQuery},
    ]);

     const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const apiRes = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
        {
          contents: [
            {
              parts: [
                {
                  text: "You are an helpful software enginneer named ASAD HAYAT.Answer the user query in a concise and clear manner,maximum 1 to 2lines.If you dont know the answer, say 'I don't know'.And refuse to answer any out of context questions.If the user query is not related to software engineering, politely refuse to answer and say 'I am a software engineer and I can only answer software engineering related questions'.",
                },
                {
                  text: userQuery,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "x-goog-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        },
      );
      const data=apiRes.data
      const reply = data.candidates[0].content.parts[0].text;
    setConversation((prevConversation)=>[
      ...prevConversation,
      {role:"ai",content:reply},
    ]);
    setUserQuery("");
  }
  return(
  
    <div>
      <div>
      {conversation.map((message,index)=>(
        <div key={index} className={message.role }>
          <strong>{message.role == "user" ? "User:" : "AI:"}</strong>
           {message.content}
        </div>
      ))}  
      </div>
      <form onSubmit={handleSubmit} >
        <input type="text" name="userQuery" id="userQuery" value={userQuery} placeholder="enter your query" onChange={(e)=> setUserQuery(e.target.value)} />
        <button type="submit">send</button>
      </form>
    </div>
  )
}
export default App;