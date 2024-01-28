import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import { RouteComponent } from "./routes";

function App() {
  return (
    <Router>
      <RouteComponent />
    </Router>
  );
}

export default App;
