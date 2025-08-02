import { DataContext } from "@/DataContext";
import Card from "@components/Card";
import { useSortable } from "@dnd-kit/sortable";
import { useContext, useState } from "react";
import crossIcon from "@assets/icon-cross.svg";

export default function Column({ column }) {
  const { setDataState, activeBoardIndex } = useContext(DataContext);
  const [activeEditField, setActiveEditField] = useState(false);

  const addTask = () => {
    return {
      id: Date.now() + Math.random(),
      title: "",
      description: "",
    };
  };

  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column: column.id,
    },
  });

  const addNewTaskHandler = (column) => {
    const newTask = addTask();
    setDataState((draft) => {
      const activeBoard = draft[activeBoardIndex];
      if (activeBoard) {
        const targetColumn = activeBoard.columns.find(
          (col) => col.id === column.id
        );
        if (targetColumn) {
          targetColumn.tasks.push(newTask);
        } else {
          console.warn(
            `Column with ID ${column.id} not found in active board.`
          );
        }
      } else {
        console.warn(`Active board at index ${activeBoardIndex} not found.`);
      }
    });
  };

  const deleteColumnHandler = () => {
    if (
      window.confirm(
        `Are you sure to want to delete this Column "${column.title}" ?`
      )
    ) {
      setDataState((draft) => {
        const activeBoard = draft[activeBoardIndex];
        if (activeBoard) {
          const targetColumnIndex = activeBoard.columns.findIndex(
            (col) => col.id === column.id
          );
          activeBoard.columns.splice(targetColumnIndex, 1);
        } else {
          console.warn(`Active board at index ${activeBoardIndex} not found.`);
        }
      });
    }
  };

  const saveChanges = (e) => {
    const newValue = e.target.value.trim();
    if (newValue === column.title) {
      return;
    }
    setDataState((draft) => {
      const currentBoard = draft[activeBoardIndex];
      if (currentBoard) {
        const currentColumn = currentBoard.columns.find(
          (col) => col.id === column.id
        );
        currentColumn.title = newValue;
      }
    });
  };

  const toggleEditMode = () => {
    setActiveEditField(true);
  };

  const onBlurHandler = (e) => {
    setActiveEditField(false);
    saveChanges(e);
  };

  const onKeyDownHandler = (e) => {
    if (e.key === "Enter") {
      setActiveEditField(false);
      saveChanges(e);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className="max-sm:self-center flex w-72 max-sm:w-80 shrink-0 flex-col self-start rounded-lg bg-lines-light dark:bg-[#1B1B1B] shadow-main-purple px-2 shadow"
      >
        <div className="group/column flex justify-between">
          {activeEditField ? (
            <textarea
              name="columnTitle"
              onBlur={onBlurHandler}
              onKeyDown={onKeyDownHandler}
              className="h-10 w-full outline-0 resize-none p-2"
              onFocus={(e) => e.target.select()}
              autoFocus
              defaultValue={column.title}
            ></textarea>
          ) : (
            <button
              className="group/column relative top-0 rounded bg-lines-light dark:bg-[#1B1B1B] px-2 py-4 text-heading-l font-heading-l w-full text-start"
              onClick={toggleEditMode}
              defaultValue={column.title}
            >
              {`${column.title} (${
                column?.tasks?.length ? column?.tasks?.length : 0
              })`}
            </button>
          )}
          <button
            className="text-red-200 opacity-50 group-hover/column:opacity-100 group-hover/column:text-red-400 cursor-pointer text-heading-m font-heading-s pr-4"
            onClick={deleteColumnHandler}
          >
            <img src={crossIcon} alt="delete icon" />
          </button>
        </div>

        <div className="flex flex-col gap-5 mb-5">
          {column?.tasks?.map((cardData, index) => (
            <Card key={index} cardData={cardData} column={column} />
          ))}
        </div>
        <button
          className="mx-2 cursor-pointer mt-auto border-t dark:border-main-purple border-light-grey bg-lines-light dark:bg-[#1B1B1B] px-2 py-4 text-heading-m font-heading-m text-medium-grey"
          onClick={() => addNewTaskHandler(column)}
        >
          + Add New Task
        </button>
      </div>
    </>
  );
}
