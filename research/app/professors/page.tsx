import NavBar from "../components/NavBar";
import Card from "../components/Card";
import "../globals.css";

export default function Professors() {
  const professors = Array(20).fill({
    name: "Kris Jordan",
    school: "UNC Chapel Hill",
    department: "Computer Science",
    title: "Professor of the Practice",
    email: "kris@cs.unc.edu",
    research_interests: "Computer science education, educational technology, internet systems, entrepreneurship.",
    image: "/assets/pic-placeholder-lg.png",
    website: "https://krisjordan.com",
  });

  return (
    <div className="min-h-screen flex flex-col overflow-auto">
      <NavBar />
      <div className="flex-grow mt-[125px] pb-8 px-4 overflow-auto flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {professors.map((professor, index) => (
            <Card key={index} {...professor} />
          ))}
        </div>
      </div>
    </div>
  );
}
