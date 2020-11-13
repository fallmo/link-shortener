import React, { useContext, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { Context } from "./context/Context";
import Loading from "./pages/Loading";
import Home from "./pages/Home";
import Guest from "./pages/Guest";
import Footer from "./components/Footer";

function App() {
  const { auth, initAuth } = useContext(Context);
  const page = auth.isLoading ? <Loading /> : auth.user ? <Home /> : <Guest />;

  useEffect(() => {
    initAuth();
  }, []);
  return (
    <div className="App">
      <Navbar />
      {page}
      <Footer />
    </div>
  );
}

export default App;
