import React from "react";
import "./App.css";
import PlayerVsMachine from "./components/PlayerVsMachine";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayerVsHuman from "./components/PlayerVsHuman";
import { ChakraProvider } from "@chakra-ui/react";
import Home from "./components/Home";
import Footer from "./components/Footer";


function App() {
  return (
    <BrowserRouter>
      <ChakraProvider>
        <div className="app">
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route
              exact
              path="/Player_Vs_Machine"
              element={<PlayerVsMachine />}
            ></Route>
            <Route
              exact
              path="/Player_Vs_Human"
              element={<PlayerVsHuman />}
            ></Route>
          </Routes>
          <Footer />
        </div>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
