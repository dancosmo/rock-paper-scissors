import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { setDoc, doc} from "firebase/firestore";
import { Button } from '@chakra-ui/react'

const GameButton = ({ text, playerData, button, selection, selectionCallBack }) => {
    const [hideButton, setHideButton] = useState("no");
    const spot = playerData?.spot;

    useEffect(()=>{
        
    },[selection, spot])

  const playerSelected = () => {
    setHideButton("yes");
    setDoc(doc(db, "users", `${button}`), {
      spot: "not available",
      playAgain:false,
    });
    selectionCallBack({spot:"selected", player:button});
  };

  const playerLeft = () =>{
    setHideButton("no");
    setDoc(doc(db, "users", `${button}`), {
        spot: "available",
        playAgain:false,
      });
      selectionCallBack({spot:"not selected", player:button});
  }

  const renderGameButton = () => {
    if (spot === "available" && selection === "not selected" && hideButton === "no") {
      return (
        <Button margin="2px" size='md'
        border='2px'
        borderColor='pink.500' colorScheme='green' variant='solid' type="button" onClick={() => playerSelected()}>
          <div style={{color:`${button}`}}>
          {text}
          </div>
        </Button>
      );
    }
    if (spot === "not available" && selection === 'selected' && hideButton === "yes") {
      return (
        <Button colorScheme='pink' variant='solid' type="button" onClick={() => playerLeft()}>
          Leave 
        </Button>
      );
    }
    if (spot === "available" && selection === 'selected' && hideButton === "yes") {
      return (
        <Button colorScheme='pink' variant='solid' type="button" onClick={() => playerLeft()}>
          Leave 
        </Button>
      );
    } 
    if( spot === "available" && selection === "already playing"){
      return null;
    }
    if( spot === "not available" && selection === "already playing"){
      return null;
    }
    else return   <Button
    isLoading
    loadingText={`${button} is playing`}
    colorScheme='teal'
    variant='outline'
  >
  </Button>;
  };

  return <>{renderGameButton()}</>;
};

export default GameButton;
