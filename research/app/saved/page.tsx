import NavBar from "../components/NavBar";
import InfoIcon from "../components/InfoIcon";
import "../globals.css";

export default function Saved() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* NavBar Component */}
      <NavBar />

      {/* Bottom Right Info Icon Component */}
      <InfoIcon />

    </div>
  );
}
