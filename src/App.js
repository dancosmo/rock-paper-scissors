import React, { useState } from "react";
import "./App.css";
import PlayerVsMachine from "./components/PlayerVsMachine";
import PlayerVsHuman from "./components/PlayerVsHuman";
import { ChakraProvider } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import Footer from "./components/Footer";

function App() {
  const [selectedVsMachine, setSelectedVsMachine] = useState(false);
  const [selectedVsHuman, setSelectedVsHuman] = useState(false);

  const renderVsMachine = () => {
    if (selectedVsMachine === true) {
      return <PlayerVsMachine />;
    } else return null;
  };

  const renderVsHuman = () => {
    if (selectedVsHuman === true) {
      return <PlayerVsHuman />;
    } else return null;
  };

  return (
    <ChakraProvider>
      <div className="app">
        <div className="menu-container">
        <div className="header">Rock, Paper Scissors ! v0.1</div>
        <Button
          size="md"
          border="2px"
          borderColor="red.500"
          marginBottom="5px"
          marginLeft="10px"
          colorScheme="pink"
          onClick={() => {
            setSelectedVsMachine(true);
            setSelectedVsHuman(false);
          }}
          type="button"
        >
          Versus Machine
        </Button>
        <Button
          size="md"
          border="2px"
          borderColor="red.500"
          marginBottom="5px"
          marginLeft="10px"
          colorScheme="pink"
          onClick={() => {
            setSelectedVsMachine(false);
            setSelectedVsHuman(true);
          }}
          type="button"
        >
          Versus Player
        </Button>
        </div>
        <div className="games-container">
          {renderVsMachine()}
          {renderVsHuman()}
        </div>
        <Footer />
      </div>
      
    </ChakraProvider>
  );
}

export default App;
