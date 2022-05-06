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
  //Player Status
  const [bluePlayerData, setBluePlayerData] = useState(null);
  const [redPlayerData, setRedPlayerData] = useState(null);

  const [blueSelection, setBlueSelection] = useState("not selected");
  const [redSelection, setRedSelection] = useState("not selected");

  const [cleanSpots, setCleanSpots] = useState(false);

  const [runOnce, setRunOnce] = useState(true);

  const [runReset, setRunReset] = useState(true);

  const [result, setResult] = useState(3);

  const [playVisible, setPlayVisible] = useState("flex-visible");

  const popInOut = useRef(null);

  const cleanSpotsButton = useRef(null);

  const navigate = useNavigate();

  const blue = {
    spot: bluePlayerData?.spot,
    choice: bluePlayerData?.choice,
    again: bluePlayerData?.playAgain
  }

  const red = {
    spot: redPlayerData?.spot,
    choice: redPlayerData?.choice,
    again: redPlayerData?.playAgain
  }

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

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && document.hidden === true) {
      if (blueSelection === "selected") {
        setDoc(doc(db, "users", "blue"), {
          spot: "available",
          playAgain: false,
        });
        navigate("/");
      }
      if (redSelection === "selected") {
        setDoc(doc(db, "users", "red"), {
          spot: "available",
          playAgain: false,
        });
        navigate("/");
      }
    } else return null;
  });

  const closingWindow = () => {
    if (blueSelection === "selected") {
      window.addEventListener("beforeunload", function () {
        setDoc(doc(db, "users", "blue"), {
          spot: "available",
          playAgain: false,
        });
      });
    }
    if (redSelection === "selected") {
      window.addEventListener("beforeunload", function () {
        setDoc(doc(db, "users", "red"), {
          spot: "available",
          playAgain: false,
        });
      });
    } else return null;
  };
  closingWindow();

  let countStart = 3;

  const renderResultOnce = () => {
    const beep = new Audio(beepSound);
    if (
      blue.spot === "not available" &&
      red.spot === "not available" &&
      typeof blue.choice ===  "string" &&
      typeof red.choice === "string" &&
      blue.again === false &&
      red.again === false
    ) {
      console.log("running result once");
      if (runOnce === true) {
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
            popInOut.current.classList.add("pop-outin");
            setPlayVisible("flex-not-visible");
            beep.play();
          }
        }, 1000);
        setRunOnce(false);
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
    popInOut.current.classList.remove("pop-outin");
    const click = new Audio(clickSound);
    click.play();
    setResult(3);
    setPlayVisible("flex-visible");
    if (blueSelection === "selected") {
      
      await updateDoc(doc(db, "users", "blue"), {
        playAgain: false,
        choice: null,
      });

      setRunOnce(true);
    }
    if (redSelection === "selected") {
      
      await updateDoc(doc(db, "users", "red"), {
        playAgain: false,
        choice: null,
      });
      setRunOnce(true);
    }
  };

  const calculateResult = () => {
    const won = new Audio(winSound);
    const lost = new Audio(lostSound);
    if (blueSelection === "selected") {
      if (blue.choice === red.choice) {
        setResult("It's a Draw!");
        lost.play();
        console.log(result);
      }
      if (blue.choice === "Rock" && red.choice === "Paper") {
        setResult("Red Wins!");
        lost.play();
        console.log(result);
      }
      if (blue.choice === "Rock" && red.choice === "Scissors") {
        setResult("Blue Wins!");
        won.play();
        console.log(result);
      }
      if (blue.choice === "Paper" && red.choice === "Rock") {
        setResult("Blue Wins!");
        won.play();
        console.log(result);
      }
      if (blue.choice === "Paper" && red.choice === "Scissors") {
        setResult("Red Wins!");
        lost.play();
        console.log(result);
      }
      if (blue.choice === "Scissors" && red.choice === "Paper") {
        setResult("Blue Wins!");
        won.play();
        console.log(result);
      }
      if (blue.choice === "Scissors" && red.choice === "Rock") {
        setResult("Red Wins!");
        lost.play();
        console.log(result);
      }
    }
    if (redSelection === "selected") {
      if (blue.choice === red.choice) {
        setResult("It's a Draw!");
        lost.play();
        console.log(result);
      }
      if (blue.choice === "Rock" && red.choice === "Paper") {
        setResult("Red Wins!");
        won.play();
        console.log(result);
      }
      if (blue.choice === "Rock" && red.choice === "Scissors") {
        setResult("Blue Wins!");
        lost.play();
        console.log(result);
      }
      if (blue.choice === "Paper" && red.choice === "Rock") {
        setResult("Blue Wins!");
        lost.play();
        console.log(result);
      }
      if (blue.choice === "Paper" && red.choice === "Scissors") {
        setResult("Red Wins!");
        won.play();
        console.log(result);
      }
      if (blue.choice === "Scissors" && red.choice === "Paper") {
        setResult("Blue Wins!");
        lost.play();
        console.log(result);
      }
      if (blue.choice === "Scissors" && red.choice === "Rock") {
        setResult("Red Wins!");
        won.play();
        console.log(result);
      }
    }
  };

  const renderCountDownResult = () => {
    const finalResult = String(result);
    if (typeof finalResult === "string") {
      return (
        <h2 className="result" ref={popInOut}>
          {finalResult}
        </h2>
      );
    }
  };

  const selectionCallBack = (data) => {
    popInOut.current.classList.remove("pop-outin");
    if (data?.player === "blue" && data?.spot === "selected") {
      setBlueSelection("selected");
      setRedSelection("already playing");
    }
    if (data?.player === "blue" && data?.spot === "not selected") {
      setResult(3);
      setRunOnce(true);
      setBlueSelection("not selected");
      
      setRedSelection("not selected");
      setPlayVisible("flex-visible");
    }
    if (data?.player === "red" && data?.spot === "selected") {
      setRedSelection("selected");
      setBlueSelection("already playing");
    }
    if (data?.player === "red" && data?.spot === "not selected") {
      setResult(3);
      setRunOnce(true);
      setRedSelection("not selected");
      
      setBlueSelection("not selected");
      setPlayVisible("flex-visible");
    }
  };

  const blueChoiceCallBack = (choice) => {
    if (choice) {
       updateDoc(doc(db, "users", "blue"), {
        choice: choice,
      });
    } else return null;
  };

  const redChoiceCallBack = (choice) => {
    if (choice) {
      
      updateDoc(doc(db, "users", "red"), {
        choice: choice,
      });
    } else return null;
  };

  const renderPlayButtons = () => {

    if (blueSelection === "selected" && red.again === false && blue.spot === "not available" && typeof blue.choice !== "string") {
      return (
        <PlayButtons
          playVisible={playVisible}
          show={blueSelection}
          button="blue"
          choiceCallBack={blueChoiceCallBack}
        />
      );
    }
    if (redSelection === "selected" && blue.again === false && red.spot === "not available" && typeof red.choice !== "string") {
      return (
        <PlayButtons
          playVisible={playVisible}
          show={redSelection}
          button="red"
          choiceCallBack={redChoiceCallBack}
        />
      );
    } 
    if(blueSelection === "selected" && red.again === true && blue.spot === "not available" && typeof blue.choice === "string"){
      return null;
    }
    if(blueSelection === "selected" && red.again === false && blue.spot === "not available" && typeof blue.choice === "string" && typeof result === "string"){
      return <div style={{transform:"translateY(-10rem)"}}>Red wants to play again</div>
    }
    if(redSelection === "selected" && blue.again === true && red.spot === "not available" && typeof red.choice === "string"){
      return null;
    }
    if(redSelection === "selected" && blue.again === false && red.spot === "not available" && typeof red.choice === "string" && typeof result === "string"){
      return <div style={{transform:"translateY(-10rem)"}}>Blue wants to play again</div>;
    }
    if(redSelection === "not selected" && blueSelection === "not selected"){
      return null;
    }
    else return <div style={{transform:"translateY(-10rem)"}}>Waiting for other player...</div>
  };

  const renderBluePlayerChoice = () => {

    if (blueSelection === "selected" && blue.spot === "not available") {
      if (blue.choice === "Rock") {
        return <img src={rock} alt="Rock" style={{ width: "70px" }}></img>;
      }
      if (blue.choice === "Paper") {
        return <img src={paper} alt="Paper" style={{ width: "70px" }}></img>;
      }
      if (blue.choice === "Scissors") {
        return (
          <img src={scissors} alt="Scissors" style={{ width: "70px" }}></img>
        );
      }
    }
    if (redSelection === "selected" && typeof result === "string" && blue.again === true) {
      if (blue.choice === "Rock") {
        return <img src={rock} alt="Rock" style={{ width: "70px" }}></img>;
      }
      if (blue.choice === "Paper") {
        return <img src={paper} alt="Paper" style={{ width: "70px" }}></img>;
      }
      if (blue.choice === "Scissors") {
        return (
          <img src={scissors} alt="Scissors" style={{ width: "70px" }}></img>
        );
      }
    } else return null;
  };

  const cleanAndBackHome = () => {
    if (blueSelection === "selected") {
      setDoc(doc(db, "users", "blue"), {
        spot: "available",
        playAgain: false,
      });
      navigate("/");
    }
    if (redSelection === "selected") {
      setDoc(doc(db, "users", "red"), {
        spot: "available",
        playAgain: false,
      });
      navigate("/");
    } else {
      navigate("/");
    }
  };

  const renderRedPlayerChoice = () => {

    if (redSelection === "selected" && red.spot === "not available") {
      if (red.choice === "Rock") {
        return <img src={rock} alt="Rock" style={{ width: "70px" }}></img>;
      }
      if (red.choice === "Paper") {
        return <img src={paper} alt="Paper" style={{ width: "70px" }}></img>;
      }
      if (red.choice === "Scissors") {
        return (
          <img src={scissors} alt="Scissors" style={{ width: "70px" }}></img>
        );
      }
    }
    if (blueSelection === "selected" && typeof result === "string" && red.again === true) {
      if (red.choice === "Rock") {
        return <img src={rock} alt="Rock" style={{ width: "70px" }}></img>;
      }
      if (red.choice === "Paper") {
        return <img src={paper} alt="Paper" style={{ width: "70px" }}></img>;
      }
      if (red.choice === "Scissors") {
        return (
          <img src={scissors} alt="Scissors" style={{ width: "70px" }}></img>
        );
      }
    } else return null;
  };

  const resetSpots = async () =>{
    
    await setDoc(doc(db, "users", "blue"), {
      spot: "available",
      playAgain:false,
    });
    await setDoc(doc(db, "users", "red"), {
      spot: "available",
      playAgain:false,
    });
    setRunReset(true);
    setCleanSpots(false);
  }
  
  const renderResetSpotsButton = () =>{
      if(runReset === true){
        if((blue.spot === "not available" || red.spot === "not available") && (redSelection === "not selected" && blueSelection === "not selected")){
          let timer = setTimeout(()=>{
              setCleanSpots(true);
              setRunReset(false);
              clearTimeout(timer);
          },5000)
        }
      }
      if(cleanSpots === true && (redSelection ==="not selected" && blueSelection ==="not selected") && (blue.spot === "not available" || red.spot === "not available")){
        return<>
            <Button
            ref={cleanSpotsButton}
            size="md"
            height="48px"
            border="2px"
            borderColor="pink.500"
            marginBottom="5px"
            zIndex="999"
            colorScheme="pink"
            onClick={() => resetSpots()}
            
          >
            Clean Spots
          </Button>
        </>
      }
    if(cleanSpots === false && (redSelection ==="not selected" && blueSelection ==="not selected" && (blue.spot === "not available" || red.spot === "not available"))) {
        return(<>
                
          <Button
          ref={cleanSpotsButton}
          size="md"
          height="48px"
          border="2px"
          borderColor="pink.500"
          marginBottom="5px"
          zIndex="999"
          colorScheme="pink"
          onClick={() => resetSpots()}
          disabled
        >
          30 seconds to reset
        </Button>

        </>)
      }
      else return null;
  }

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
        >
          <Back />
        </Button>
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
        <div>{renderResetSpotsButton()}</div>
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
