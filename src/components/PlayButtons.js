import React from "react";
import paper from "../png/paper.png";
import scissors from "../png/scissors.png";
import rock from "../png/stone.png";
import { Button } from "@chakra-ui/react";
import clickSound from "../sounds/click-sound.mp3";

const PlayButtons = ({ button, show, choiceCallBack, playVisible }) => {
  const renderPlayerButtons = () => {
    if (show === "selected") {
      const pickChoiceImg = (e) =>{
        choiceCallBack(e.target.parentElement.value);
      }
      const pickChoice = (e) => {
        const click = new Audio(clickSound);
        click.play();
        choiceCallBack(e.target.value);
      };
      return (
        <div className={`player-${button}-buttons ${playVisible}`}>
          <Button
        size="md"
        height="48px"
        width="90px"
        border="2px"
        borderColor="white"
        marginBottom="5px"
        colorScheme="pink" 
            onClick={(e) => pickChoice(e)}
            value="Rock"
            type="button"
          >
            <img onClick={(e) =>pickChoiceImg(e)} style={{ width: "50px" }} src={rock} alt="rock-icon"></img>
            
          </Button>
          <Button
        size="md"
        height="48px"
        width="90px"
        border="2px"
        borderColor="white"
        marginBottom="5px"
        colorScheme="pink" 
            onClick={(e) => pickChoice(e)}
            value="Paper"
            type="button"
          >
            <img onClick={(e) =>pickChoiceImg(e)}  style={{ width: "50px" }} src={paper} alt="paper-icon"></img>
          </Button>
          <Button
        size="md"
        height="48px"
        width="90px"
        border="2px"
        borderColor="white"
        marginBottom="5px"
        colorScheme="pink" 
            onClick={(e) => pickChoice(e)}
            value="Scissors"
            type="button"
          >
            <img
            onClick={(e) =>pickChoiceImg(e)} 
              style={{ width: "50px" }}
              src={scissors}
              alt="scissors-icon"
            ></img>
          </Button>
        </div>
      );
    } else return null;
  };

  return <>{renderPlayerButtons()}</>;
};

export default PlayButtons;
