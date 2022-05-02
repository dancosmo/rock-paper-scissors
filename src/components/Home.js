import React from "react";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
        <div className="header">Rock, Paper Scissors ! v0.1</div>
      <div className="menu-container">
        <Link to="/Player_Vs_Machine">
          <Button
            size="md"
            border="2px"
            borderColor="red.500"
            marginBottom="5px"
            marginLeft="10px"
            colorScheme="pink"
            type="button"
          > Player Vs Machine</Button>
        </Link>

        <Link to="/Player_Vs_Human">
          <Button
            size="md"
            border="2px"
            borderColor="red.500"
            marginBottom="5px"
            marginLeft="10px"
            colorScheme="pink"
            type="button"
          > Player Vs Human</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
