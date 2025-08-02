import sideIcon from "@assets/icon-board.svg";
import clsx from "clsx";
import { useContext, useState } from "react";
import DialogDemo from "@components/Dialog";
import { DataContext } from "@/DataContext";
import AddNewBoardFoarm from "@components/AddNewBoardFoarm";

/**
 *
 * @param {object} props
 * @param {Array} props.dataState
 * @param {Number} props.activeBoardIndex
 * @param {Function} props.setActiveBoardIndex
 * @returns {JSX.Element}
 */

export default function SideMenu() {
  const { activeBoardIndex, setActiveBoardIndex, dataState, isHamburgerOpen } =
    useContext(DataContext);
  const [open, setOpen] = useState(false);

  return (
    <aside
      className={clsx(
        "h-screen border-lines-light transition-all duration-200 overflow-hidden",
        {
          "w-[250px] border-r": isHamburgerOpen,
          "w-0": !isHamburgerOpen,
        }
      )}
    >
      {isHamburgerOpen && (
        <div className="w-[250px] h-full border-lines-light">
          <p className="px-8 py-4 text-heading-s font-heading-s">
            ALL BOARDS ({dataState?.length ? dataState?.length : 0})
          </p>
          <ul>
            {dataState?.map((item, index) => {
              return (
                <li key={item.id}>
                  <button
                    className={clsx(
                      "flex cursor-pointer w-11/12 items-center gap-4 rounded-e-full px-8 py-4 text-heading-m font-heading-m text-medium-grey transition data-[isactive=false]:hover:bg-main-purple/10 data-[isactive=false]:hover:text-main-purple",
                      {
                        "bg-main-purple !text-white hover:bg-main-purple":
                          activeBoardIndex === index,
                      }
                    )}
                    onClick={() => {
                      setActiveBoardIndex(index);
                    }}
                    data-isactive={activeBoardIndex === index}
                  >
                    <img src={sideIcon} alt="" />
                    <span>{item.title}</span>
                  </button>
                </li>
              );
            })}
            <li>
              <DialogDemo
                isOpen={open}
                SetOpen={setOpen}
                title="Create New Board"
                description="Form to Create New Board"
                triggerComponante={
                  <button className="flex cursor-pointer w-11/12 items-center px-8 py-4 gap-4 text-heading-m font-heading-m text-main-purple">
                    <img src={sideIcon} alt="" />
                    <span> + New Board</span>
                  </button>
                }
              >
                <AddNewBoardFoarm setDialogState={setOpen} />
              </DialogDemo>
            </li>
          </ul>
        </div>
      )}
    </aside>
  );
}
