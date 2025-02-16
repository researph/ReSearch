import NavBar from "../components/NavBar";
import Letter from "../components/Letter";
import "../globals.css";

export default function Mail() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* NavBar Component */}
      <NavBar />

      <div className="min-h-screen flex items-center justify-center">
        <Letter />
      </div>

    </div>
  );
}
