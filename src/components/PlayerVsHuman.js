import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import GameButton from "./GameButton";
import PlayButtons from "./PlayButtons";
import User from "../svg/User";
import paper from "../png/paper.png";
import scissors from "../png/scissors.png";
import rock from "../png/stone.png";
import { Button } from "@chakra-ui/react";
import lostSound from "../sounds/lost-sound.mp3";
import winSound from "../sounds/win-sound.mp3";
import clickSound from "../sounds/click-sound.mp3";
import beepSound from "../sounds/beep-sound.mp3";
import { Link } from "react-router-dom";
import Back from "../svg/Back";


const PlayerVsHuman = () => {
  //Player Choices
  const [bluePlayerChoice, setBluePlayerChoice] = useState(null);
  const [redPlayerChoice, setRedPlayerChoice] = useState(null);
  //Player Status
  const [bluePlayerData, setBluePlayerData] = useState(null);
  const [redPlayerData, setRedPlayerData] = useState(null);

  const [blueSelection, setBlueSelection] = useState("not selected");
  const [redSelection, setRedSelection] = useState("not selected");

  const [once, setOnce] = useState(1);

  const [result, setResult] = useState(3);

  const [playVisible, setPlayVisible] = useState("flex-visible");

  const popInOut = useRef(null);

  const navigate = useNavigate();

  document.addEventListener('visibilitychange', function(){
    if(document.visibilityState !== 'visible' || document.visibilityState !== 'hidden'){
      if(blueSelection === "selected"){
        setDoc(doc(db, "users", "blue"), {
          spot: "available",
          playAgain:false,
        });
        navigate("/");
      }
      if(redSelection === "selected"){
        setDoc(doc(db, "users", "red"), {
          spot: "available",
          playAgain:false,
        });
        navigate("/");
      }
    }
    else return null;
  });

  useEffect(() => {
    let blueUserStatus = onSnapshot(doc(db, "users", "blue"), (doc) => {
      setBluePlayerData(doc.data());
    });
    let redUserStatus = onSnapshot(doc(db, "users", "red"), (doc) => {
      setRedPlayerData(doc.data());
    });
    return () => {
      blueUserStatus();
      redUserStatus();
    };
  }, []);

  const closingWindow = () =>{
    if(blueSelection === "selected"){
      window.addEventListener('beforeunload', function () {
        setDoc(doc(db, "users", "blue"), {
          spot: "available",
          playAgain:false,
        });
    });
    }
    if(redSelection === "selected"){
      window.addEventListener('beforeunload', function () {
        setDoc(doc(db, "users", "red"), {
          spot: "available",
          playAgain:false,
        });
    });
    }
    else return null;
  }
  closingWindow();

  let countStart = 3;

  const renderResultOnce = () => {
    const beep = new Audio(beepSound);
    const blueChoice = bluePlayerData?.choice;
    const redChoice = redPlayerData?.choice;
    const bluePlayAgain = bluePlayerData?.playAgain;
    const redPlayAgain = redPlayerData?.playAgain;
    if (
      blueChoice !== undefined &&
      redChoice !== undefined &&
      blueChoice !== null &&
      redChoice !== null &&
      bluePlayAgain === false &&
      redPlayAgain === false
    ) {
      console.log("Im working");
      if (once === 1) {
        let timer = setInterval(function () {
          if (countStart === 0) {
            calculateResult();
            clearInterval(timer);
            if (blueSelection === "selected") {
              updateDoc(doc(db, "users", "blue"), {
                playAgain: true,
              });
            }
            if (redSelection === "selected") {
              updateDoc(doc(db, "users", "red"), {
                playAgain: true,
              });
            }
          } else {
            countStart -= 1;
            setResult(countStart);
            popInOut.current.classList.add('pop-outin');
            setPlayVisible("flex-not-visible");
            beep.play();
          }
        }, 1000);
        setOnce(0);
      }
    } else return null;
  };

  const playAgainButton = () => {
    if (blueSelection === "selected" && typeof result !== "number") {
      return (
        <Button
          size="md"
          height="40px"
          width="122px"
          border="2px"
          marginBottom="10px"
          borderColor="pink.500"
          variant="solid"
          colorScheme="pink"
          onClick={() => playAgain()}
          type="button"
        >
          Play Again
        </Button>
      );
    }
    if (redSelection === "selected" && typeof result !== "number") {
      return (
        <Button
          size="md"
          height="40px"
          width="122px"
          border="2px"
          marginBottom="10px"
          borderColor="pink.500"
          variant="solid"
          colorScheme="pink"
          onClick={() => playAgain()}
          type="button"
        >
          Play Again
        </Button>
      );
    } else return null;
  };

  const playAgain = async () => {
    popInOut.current.classList.remove('pop-outin');
    const click = new Audio(clickSound);
    click.play();
    setResult(3);
    setPlayVisible("flex-visible");
    if (blueSelection === "selected") {
      setBluePlayerChoice(null);
      await updateDoc(doc(db, "users", "blue"), {
        playAgain: false,
        choice: null,
      });

      setOnce(1);
    }
    if (redSelection === "selected") {
      setRedPlayerChoice(null);
      await updateDoc(doc(db, "users", "red"), {
        playAgain: false,
        choice: null,
      });
      setOnce(1);
    }
  };

  const calculateResult = () => {
    const blueChoice = bluePlayerData?.choice;
    const redChoice = redPlayerData?.choice;
    const won = new Audio(winSound);
    const lost = new Audio(lostSound);
    if (blueSelection === "selected") {
      if (blueChoice === redChoice) {
        setResult("It's a Draw!");
        lost.play();
      }
      if (blueChoice === "Rock" && redChoice === "Paper") {
        setResult("Red Wins!");
        lost.play();
      }
      if (blueChoice === "Rock" && redChoice === "Scissors") {
        setResult("Blue Wins!");
        won.play();
      }
      if (blueChoice === "Paper" && redChoice === "Rock") {
        setResult("Blue Wins!");
        won.play();
      }
      if (blueChoice === "Paper" && redChoice === "Scissors") {
        setResult("Red Wins!");
        lost.play();
        
      }
      if (blueChoice === "Scissors" && redChoice === "Paper") {
        setResult("Blue Wins!");
        won.play();
      }
      if (blueChoice === "Scissors" && redChoice === "Rock") {
        setResult("Red Wins!");
        lost.play();
      }
    }
    if (redSelection === "selected") {
      if (blueChoice === redChoice) {
        setResult("It's a Draw!");
        lost.play();
      }
      if (blueChoice === "Rock" && redChoice === "Paper") {
        setResult("Red Wins!");
        won.play();
      }
      if (blueChoice === "Rock" && redChoice === "Scissors") {
        setResult("Blue Wins!");
        lost.play();
      }
      if (blueChoice === "Paper" && redChoice === "Rock") {
        setResult("Blue Wins!");
        lost.play();
      }
      if (blueChoice === "Paper" && redChoice === "Scissors") {
        setResult("Red Wins!");
        won.play();
      }
      if (blueChoice === "Scissors" && redChoice === "Paper") {
        setResult("Blue Wins!");
        lost.play();
      }
      if (blueChoice === "Scissors" && redChoice === "Rock") {
        setResult("Red Wins!");
        won.play();
      }
    }
  };

  const renderCountDownResult = () => {
    const finalResult = String(result);
    if(typeof finalResult === "string"){
      return <h2 className="result" ref={popInOut}>{finalResult}</h2>
    }
  }

  const selectionCallBack = (data) => {
    popInOut.current.classList.remove('pop-outin');
    if (data?.player === "blue" && data?.spot === "selected") {
      setBlueSelection("selected");
      setRedSelection("already playing");
    }
    if (data?.player === "blue" && data?.spot === "not selected") {
      setResult(3);
      
      setOnce(1);
      setBlueSelection("not selected");
      setBluePlayerChoice(null);
      setRedSelection("not selected");
      setPlayVisible("flex-visible");
    }
    if (data?.player === "red" && data?.spot === "selected") {
      setRedSelection("selected");
      setBlueSelection("already playing");
    }
    if (data?.player === "red" && data?.spot === "not selected") {
      setResult(3);
      setOnce(1);
      setRedSelection("not selected");
      setRedPlayerChoice(null);
      setBlueSelection("not selected");
      setPlayVisible("flex-visible");
    }
  };

  const blueChoiceCallBack = async (choice) => {
    if (choice) {
      setBluePlayerChoice(choice);
      await updateDoc(doc(db, "users", "blue"), {
        choice: choice,
      });
    } else return null;
  };

  const redChoiceCallBack = async (choice) => {
    if (choice) {
      setRedPlayerChoice(choice);
      await updateDoc(doc(db, "users", "red"), {
        choice: choice,
      });
    } else return null;
  };

  const renderPlayButtons = () => {
    const bluePlayAgain = bluePlayerData?.playAgain;
    const redPlayAgain = redPlayerData?.playAgain;
    if (blueSelection === "selected" && redPlayAgain === false) {
      return (
        <PlayButtons
          playVisible={playVisible}
          show={blueSelection}
          button="blue"
          choiceCallBack={blueChoiceCallBack}
        />
      );
    }
    if (redSelection === "selected" && bluePlayAgain === false) {
      return (
        <PlayButtons
          playVisible={playVisible}
          show={redSelection}
          button="red"
          choiceCallBack={redChoiceCallBack}
        />
      );
    } else return <>Waiting for players...</>;
  };

  const renderBluePlayerChoice = () => {
    const bluePlayAgain = bluePlayerData?.playAgain;
    const blueChoice = bluePlayerData?.choice;
    if (blueSelection === "selected") {
      if (bluePlayerChoice === "Rock") {
        return <img src={rock} alt="Rock" style={{ width: "70px" }}></img>;
      }
      if (bluePlayerChoice === "Paper") {
        return <img src={paper} alt="Paper" style={{ width: "70px" }}></img>;
      }
      if (bluePlayerChoice === "Scissors") {
        return (
          <img src={scissors} alt="Scissors" style={{ width: "70px" }}></img>
        );
      }
    }
    if (
      redSelection === "selected" &&
      result === 0 &&
      bluePlayAgain === true
    ) {
      if (blueChoice === "Rock") {
        return <img src={rock} alt="Rock" style={{ width: "70px" }}></img>;
      }
      if (blueChoice === "Paper") {
        return <img src={paper} alt="Paper" style={{ width: "70px" }}></img>;
      }
      if (blueChoice === "Scissors") {
        return (
          <img src={scissors} alt="Scissors" style={{ width: "70px" }}></img>
        );
      }
    }
    else return null;
  };

  const cleanAndBackHome = () =>{
    if(blueSelection === "selected"){
      setDoc(doc(db, "users", "blue"), {
        spot: "available",
        playAgain:false,
      });
      navigate("/");
    }
    if(redSelection === "selected"){
      setDoc(doc(db, "users", "red"), {
        spot: "available",
        playAgain:false,
      });
      navigate("/");
    }
    else{
      navigate("/");
    }
  }

  const renderRedPlayerChoice = () => {
    const redPlayAgain = redPlayerData?.playAgain;
    const redChoice = redPlayerData?.choice;
    if (redSelection === "selected") {
      if (redPlayerChoice === "Rock") {
        return <img src={rock} alt="Rock" style={{ width: "70px" }}></img>;
      }
      if (redPlayerChoice === "Paper") {
        return <img src={paper} alt="Paper" style={{ width: "70px" }}></img>;
      }
      if (redPlayerChoice === "Scissors") {
        return (
          <img src={scissors} alt="Scissors" style={{ width: "70px" }}></img>
        );
      }
    }
    if (
      blueSelection === "selected" &&
      result === 0 &&
      redPlayAgain === true
    ) {
      if (redChoice === "Rock") {
        return <img src={rock} alt="Rock" style={{ width: "70px" }}></img>;
      }
      if (redChoice === "Paper") {
        return <img src={paper} alt="Paper" style={{ width: "70px" }}></img>;
      }
      if (redChoice === "Scissors") {
        return (
          <img src={scissors} alt="Scissors" style={{ width: "70px" }}></img>
        );
      }
    }
    else return null;
  };

  return (
    <>
          <Link onClick={() => cleanAndBackHome()} to="/">
      <Button
          size="md"
          height="48px"
          width="90px"
          border="2px"
          borderColor="pink.500"
          marginBottom="5px"
          zIndex="999"
          colorScheme="pink"
        ><Back/></Button>
      </Link>
      <div className="vs-player-title">Player vs Player</div>
      <div className="player-vs-player-container">
        <div className="player-blue-container">
          <div>
            <User color="blue" />
          </div>
        </div>

        <div className="render-blue-choice">
          Blue {renderBluePlayerChoice()}
        </div>
        <div style={{ marginLeft: "auto", textAlign: "center" }}>
          {renderResultOnce()}
          <div className="result-container">{renderCountDownResult()}</div>
        </div>
        <div className="render-red-choice">
          Red
          {renderRedPlayerChoice()}
        </div>

        <div className={`player-red-container`}>
          <div>
            <User color="red" />
          </div>
        </div>
      </div>
      <div className="player-selector-container">
        <div>{playAgainButton()}</div>
        <div>{renderPlayButtons()}</div>

        <GameButton
          selectionCallBack={selectionCallBack}
          selection={blueSelection}
          playerData={bluePlayerData}
          button="blue"
          text="Join Blue"
        />

        <GameButton
          selectionCallBack={selectionCallBack}
          selection={redSelection}
          playerData={redPlayerData}
          button="red"
          text="Join Red"
        />
      </div>
    </>
  );
};

export default PlayerVsHuman;
