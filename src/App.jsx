import Header from "@components/Header";
import SideMenu from "@components/SideMenu";
import WorkSpace from "@components/WorkSpace";
import { DataContext } from "./DataContext";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

function App() {
  const [dataState, setDataState] = useImmer(() => {
    try {
      const kanbanData = JSON.parse(localStorage.getItem("kanban-board-data"));
      return kanbanData ? kanbanData : [];
    } catch (error) {
      console.error("Error Parsing localStorage", error);
      return [];
    }
  });
  const [isHamburgerOpen, setHamburgerOpen] = useState(false);

  const [activeBoardIndex, setActiveBoardIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem("kanban-board-data", JSON.stringify(dataState));
  }, [dataState]);

  return (
    <DataContext.Provider
      value={{
        dataState,
        setDataState,
        activeBoardIndex,
        setActiveBoardIndex,
        isHamburgerOpen,
        setHamburgerOpen,
      }}
    >
      <div className="min-h-screen dark:bg-[#1B1B1B] bg-white text-black dark:text-white transition-colors duration-300">
        <Header />
        <div className="flex">
          <SideMenu />
          <WorkSpace columns={dataState[activeBoardIndex]?.columns} />
        </div>
      </div>
    </DataContext.Provider>
  );
}

export default App;
