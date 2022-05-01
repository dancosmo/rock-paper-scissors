import React, { useState, useEffect, useRef } from "react";
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

  const popInOut = useRef(null);

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
      popInOut.current.classList.remove('pop-outin');
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
            popInOut.current.classList.add('pop-outin');
            countStart -= 1;
            setCountDownResult(countStart);
          }
        }, 1000);
        setRunOnce(0);
      }
    }
  };

  const getResult = () => {
    const won = new Audio(winSound);
    const lost = new Audio(lostSound);
    if (machineChoiceFinal === playerChoice) {
      setCountDownResult("It's a Draw!");
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

  const renderCountDownResult = () => {
    const result = String(countDownResult);

    return <h2 className="result" ref={popInOut}>{result}</h2>
  }

  return (
    <div
      className="player-vs-machine-container"
    >
      <img style={{width:"150px"}} src={robotImage} alt="robot"></img>
      <div>{renderMachineChoice()} </div>
      <div className="vs-machine-result-container">
        {renderCountDownResult()} {startTimer()}
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
