import Dropdown from "@components/Dropdown";
import iconVerticalEllipsis from "@assets/icon-vertical-ellipsis.svg";
import DialogDemo from "@components/Dialog";
import { useContext, useEffect, useState } from "react";
import AddNewBoardFoarm from "@components/AddNewBoardFoarm";
import { DataContext } from "@/DataContext";
import lightModeIcon from "@assets/icon-light-theme.svg";
import darkModeIcon from "@assets/icon-dark-theme.svg";
import { Twirl as Hamburger } from "hamburger-react";

export default function Header() {
  const {
    dataState,
    setDataState,
    activeBoardIndex,
    setActiveBoardIndex,
    isHamburgerOpen,
    setHamburgerOpen,
  } = useContext(DataContext);

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = JSON.parse(localStorage.getItem("tasksTheme"));
    return savedTheme !== null ? savedTheme : true;
  });

  const [open, setOpen] = useState(false);
  const onEditBoard = () => setOpen(true);

  const onDeleteBoard = () => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      setDataState((draft) => draft.toSpliced(activeBoardIndex, 1));
      setActiveBoardIndex((prev) => (prev ? prev - 1 : 0));
    }
  };

  useEffect(() => {
    JSON.stringify(localStorage.setItem("tasksTheme", darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleModeHandlet = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <header className="flex h-[97px] shrink-0 items-center border-b px-6 max-sm:px-2">
      <div className="flex flex-1">
        <Hamburger toggled={isHamburgerOpen} toggle={setHamburgerOpen} />
      </div>
      <div className="flex w-[300px] items-center gap-4 self-stretch flex-1 justify-center border-lines-light  text-[32px] font-bold max-sm:text-heading-l">
        <img src="Logo.jpg" alt="Logo icon" className="w-8 max-sm:w-6" />
        Task Flow
      </div>
      <div className="flex flex-1 items-center justify-end self-stretch  border-lines-light  gap-8 max-sm:gap-2">
        <button
          onClick={toggleModeHandlet}
          className="cursor-pointer transition-all ease-in-out"
        >
          {darkMode ? (
            <img src={lightModeIcon} alt="" />
          ) : (
            <img src={darkModeIcon} alt="" />
          )}
        </button>

        <Dropdown
          triggerComponent={() => (
            <button className="flex px-5 py-5 focus:outline-none  border-none items-center gap-2 text-[14px] font-bold text-main-purple cursor-pointer">
              <img src={iconVerticalEllipsis} alt="icon vertical ellipsis " />
            </button>
          )}
          items={{
            edit: { label: "Edit Board", onClick: onEditBoard },
            delete: {
              label: "Delete Board",
              onClick: onDeleteBoard,
            },
          }}
        />
        <DialogDemo isOpen={open} SetOpen={setOpen}>
          <AddNewBoardFoarm
            setDialogState={setOpen}
            boardID={dataState[activeBoardIndex]?.id}
            columnsData={dataState[activeBoardIndex]?.columns}
            title={dataState[activeBoardIndex]?.title}
            saveChange="Save Changes"
          />
        </DialogDemo>
      </div>
    </header>
  );
}
