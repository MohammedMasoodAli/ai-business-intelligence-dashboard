import "./Intro.css";
import logo from "./assets/intro.png";

export default function IntroScreen() {
  return (
    <div className="intro">
      <img src={logo} alt="Intro" />
      <h1>AI Business Intelligence Platform</h1>
      <div className="spinner"></div>
    </div>
  );
}
