import { Switch, Route, Router as WouterRouter } from "wouter";
import Splash from "@/pages/Splash";
import Onboarding from "@/pages/Onboarding";
import Home from "@/pages/Home";
import TaskDetail from "@/pages/TaskDetail";
import MapView from "@/pages/MapView";
import PostTask from "@/pages/PostTask";
import Messages from "@/pages/Messages";
import Chat from "@/pages/Chat";
import TaskExecution from "@/pages/TaskExecution";
import TaskCompletion from "@/pages/TaskCompletion";
import Profile from "@/pages/Profile";
import Ranking from "@/pages/Ranking";
import Plans from "@/pages/Plans";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Splash} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/home" component={Home} />
      <Route path="/task/:id" component={TaskDetail} />
      <Route path="/map" component={MapView} />
      <Route path="/post" component={PostTask} />
      <Route path="/messages" component={Messages} />
      <Route path="/chat/:id" component={Chat} />
      <Route path="/task-execution" component={TaskExecution} />
      <Route path="/task-completion" component={TaskCompletion} />
      <Route path="/profile" component={Profile} />
      <Route path="/ranking" component={Ranking} />
      <Route path="/plans" component={Plans} />
    </Switch>
  );
}

function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <div className="app-shell">
      <WouterRouter base={base}>
        <Router />
      </WouterRouter>
    </div>
  );
}

export default App;
