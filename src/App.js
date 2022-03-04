import React, { useState } from "react";
import "./App.css";
import Registration from "./components/Registration";
import Upload from "./components/Upload";

function App() {
  //Registration handler
  const [isRegistered, setIsRegistered] = useState(true);
  const [item, setItem] = useState({});
  const [youWon, setYouWon] = useState();
  const [success, setSuccess] = useState(false);

  const registerHandler = (registered, item) => {
    setItem(item);
    setIsRegistered(registered);
  };

  let content = <p></p>;

  async function addCodeHandler(item) {
    const response = await fetch(
      "https://ncp.staging.moonproject.io/api/juhasz-norbert/code/upload",
      {
        method: "POST",
        body: JSON.stringify(item),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if(data.data && data.data.success === true) {
        if(data.data.won) {
          setYouWon(1);
          setSuccess(true);
        } 
        if(!data.data.won) {
          setYouWon(0);
          setSuccess(true);
        }
    }
    
    if (data.errors && data.errors[0].code === "email:not_found") {
      registerHandler(false, item);
    } 
  }


  if(youWon === 1) {
    content = <p>Gratulálunk, nyertél!</p>;
  } 

  if(youWon === 0) {
    content = <p>Sajnos most nem nyertél</p>;
  }

  return (
    <React.Fragment>
      <section>
        {isRegistered && <Upload addCodeHandler={addCodeHandler} isSuccess={success}/>}
        {!isRegistered && <Registration item={item} addCodeHandler={addCodeHandler} isSuccess={success}/>}
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
