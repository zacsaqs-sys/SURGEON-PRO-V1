import "./App.css";
import CaseRunner from "./components/CaseRunner";
import { CASES } from "./data/cases";

export default function App() {
  return <CaseRunner mod={CASES[0]} allMods={CASES} />;
}
