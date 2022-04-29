import React, { useState, useEffect } from "react";
import VsMachineButton from "./VsMachineButton";
import { Button } from "@chakra-ui/react";
import lostSound from "../sounds/lost-sound.mp3";
import winSound from "../sounds/win-sound.mp3";
import clickSound from "../sounds/click-sound.mp3";
import beepSound from "../sounds/beep-sound.mp3";
import robotImage from "../png/robot.png";
import paper from "../png/paper.png";
import scissors from "../png/scissors.png";
import rock from "../png/stone.png";

const PlayerVsMachine = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [machineNumber, setMachineNumber] = useState(null);
  const [machineChoiceFinal, setMachineChoiceFinal] = useState(null);
  const [countDownResult, setCountDownResult] = useState(3);
  const [runOnce, setRunOnce] = useState(1);
  const [playAgain, setPlayAgain] = useState(true);

  useEffect(() => {
    const defineMachineChoice = () => {
      switch (machineNumber) {
        case 1:
          setMachineChoiceFinal("Rock");
          break;
        case 2:
          setMachineChoiceFinal("Paper");
          break;
        case 3:
          setMachineChoiceFinal("Scissors");
          break;
        default:
          break;
      }
    };
    defineMachineChoice();
  }, [playerChoice, machineNumber]);

  const choiceCallBack = (choice) => {
    const click = new Audio(clickSound);
    click.play();
    setMachineNumber(Math.floor(Math.random() * 3) + 1);
    setPlayerChoice(choice);
    setPlayAgain(false);
    console.log(machineChoiceFinal);
  
  };
  


  const renderMachineChoice = () => {
    if (typeof countDownResult !== "number") {
      if(machineChoiceFinal === "Rock"){
        return <img style={{width:"54px", margin:"10px auto 10px auto"}} src={rock} alt="rock"></img>
      }
      if(machineChoiceFinal === "Paper"){
        return <img style={{width:"54px", margin:"10px auto 10px auto"}} src={paper} alt="paper"></img>
      }
      if(machineChoiceFinal === "Scissors"){
        return <img style={{width:"54px", margin:"10px auto 10px auto"}} src={scissors} alt="scissors"></img>
      }
    }
    else return null;
  };

  const renderPlayerChoice = () => {
    if (typeof countDownResult !== "number") {
      if(playerChoice === "Rock"){
        return <img style={{width:"54px", margin:"10px auto 10px auto"}} src={rock} alt="rock"></img>
      }
      if(playerChoice === "Paper"){
        return <img style={{width:"54px", margin:"10px auto 10px auto"}} src={paper} alt="paper"></img>
      }
      if(playerChoice === "Scissors"){
        return <img style={{width:"54px", margin:"10px auto 10px auto"}} src={scissors} alt="scissors"></img>
      }
    }
    else return null;
  };

  const renderPlayAgain = () => {
    if (typeof countDownResult !== "number") {
      return (
        <Button
          size="md"
          height="48px"
          width="90px"
          border="2px"
          borderColor="blue.500"
          marginBottom="5px"
          zIndex="999"
          colorScheme="pink"
          onClick={() => resetMatch()}
        >Play Again</Button>
      );
    }
  };

  const resetMatch = () =>{    
      setPlayerChoice(null);
      setMachineNumber(null);
      setMachineChoiceFinal(null);
      setCountDownResult(3);
      setRunOnce(1);
      setPlayAgain(true);
  }

  let countStart = 3;
  const startTimer = () => {
    const beep = new Audio(beepSound);
    if (machineChoiceFinal !== null && playerChoice !== null) {
      if (runOnce === 1) {
        let timer = setInterval(function () {
          if (countStart === 0) {
            clearInterval(timer);
            getResult();
          } else {
            beep.play();
            countStart -= 1;
            setCountDownResult(countStart);
          }
        }, 600);
        setRunOnce(0);
      }
    }
  };

  const getResult = () => {
    const won = new Audio(winSound);
    const lost = new Audio(lostSound);
    if (machineChoiceFinal === playerChoice) {
      setCountDownResult("Its a Draw!");
      lost.play();
    }
    if (machineChoiceFinal === "Rock" && playerChoice === "Paper") {
      setCountDownResult("You Won!");
      won.play();
    }
    if (machineChoiceFinal === "Rock" && playerChoice === "Scissors") {
      setCountDownResult("You Lost...");
      lost.play();
    }
    if (machineChoiceFinal === "Paper" && playerChoice === "Rock") {
      setCountDownResult("You Lost...");
      lost.play();
    }
    if (machineChoiceFinal === "Paper" && playerChoice === "Scissors") {
      setCountDownResult("You Won!");
      won.play();
    }
    if (machineChoiceFinal === "Scissors" && playerChoice === "Rock") {
      setCountDownResult("You Won!");
      won.play();
    }
    if (machineChoiceFinal === "Scissors" && playerChoice === "Paper") {
      setCountDownResult("You Lost...");
      lost.play();
    } else return null;
  };

  const renderPlayButtons = () => {
    if(playAgain === false){
      return null;
    }
    if(playAgain === true){
      return <>
            <VsMachineButton
          choice="Rock"
          choiceCallBack={choiceCallBack}
          image="rock"
        />
        <VsMachineButton
          choice="Paper"
          choiceCallBack={choiceCallBack}
          image="paper"
        />
        <VsMachineButton
          choice="Scissors"
          choiceCallBack={choiceCallBack}
          image="scissors"
        />
    </>
    }
    else return null;
  }

  return (
    <div
      className="player-vs-machine-container"
    >
      <img style={{width:"200px"}} src={robotImage} alt="robot"></img>
      <div>{renderMachineChoice()} </div>
      <div className="vs-machine-result-container">
        {countDownResult} {startTimer()}
      </div>
      <div className="player-one-container">
        {renderPlayerChoice()}
      <div className="game-buttons-container">
      {renderPlayAgain()}
      {renderPlayButtons()}
      </div>
      </div>
    </div>
  );
};

export default PlayerVsMachine;
