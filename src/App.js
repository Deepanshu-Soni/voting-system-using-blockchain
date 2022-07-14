import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./Components/Login";
import NavHeading from "./Components/NavHeading";
import Elections from "./Components/MainScreen";
import Election from "./Components/Election";
import SpinnerBar from "./Components/CustomSpinner";
import NotFound from "./Components/NotFound"
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavHeading />
        <Switch>
          <Route path="/:address/verify/:id" component={Login} />
          <Route path="/notfound" component={NotFound} />
          <Route path="/:id" component={Election} />
          <Route path="/" component={Elections} exact />
          <Redirect to="/" />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
