import React from 'react';
import { Button } from '@chakra-ui/react';
import paper from "../png/paper.png";
import scissors from "../png/scissors.png";
import rock from "../png/stone.png";



const VsMachineButton = ({choice, choiceCallBack, image}) => {

    const getImage = () =>{
        if(image === "rock"){
            return rock;
        }
        if(image === "paper"){
            return paper;
        }
        if(image === "scissors"){
            return scissors;
        }
    }

    const getChoice = () =>{
        choiceCallBack(choice);
    }

    return (
        <Button 
        size="md"
        height="48px"
        width="auto"
        border="2px"
        borderColor="white"
        marginBottom="5px"
        zIndex="999"
        colorScheme="pink" 
        onClick={() => getChoice()}>
            <img width="50px" src={getImage()} alt={`${choice}-icon`}></img>
        </Button>
    );
}

export default VsMachineButton;