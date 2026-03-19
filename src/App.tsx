import Header from "./components/Header";
import Timer from "./components/Timer";

function App() {
  return (
    <div className="bg-teal-900 w-full h-dvh flex flex-col gap-16 justify-center items-center overflow-hidden">
      <Header />
      <main className="w-full md:1/2 lg:w-2/5 flex flex-col justify-center items-center px-8 md:px-12 lg:px-16">
        <Timer />
      </main>
    </div>
  );
}

export default App;
