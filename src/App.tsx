import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Route, BrowserRouter, Routes  } from "react-router-dom";
import { createContext, useState, useEffect } from "react"
import { auth, firebase } from "./services/firebase";
import { AuthContextProvider } from "./contexts/AuthContext";




function App() {

  return (
    <BrowserRouter>
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/rooms/new" element={<NewRoom/>}/>
      </Routes>
    </AuthContextProvider>
    
    </BrowserRouter>
  );
}

export default App;
