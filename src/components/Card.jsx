import { DataContext } from "@/DataContext";
import { useContext, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Card({ cardData, column }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: cardData.id,
    data: { column: column.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
    zIndex: isDragging ? 100 : 1,
  };

  const { setDataState, activeBoardIndex } = useContext(DataContext);
  const [activeEditField, setActiveEditField] = useState(null);

  const deleteTaskHandler = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setDataState((draft) => {
        const currentBoard = draft[activeBoardIndex];
        if (currentBoard) {
          const currentColumn = currentBoard.columns.find(
            (col) => col.id === column.id
          );
          const taskIndex = currentColumn.tasks.findIndex(
            (task) => task.id === cardData.id
          );
          if (taskIndex !== -1) {
            currentColumn.tasks.splice(taskIndex, 1);
          }
        }
      });
    }
  };

  const saveChanges = (e, field) => {
    const newValue = e.target.value.trim();
    if (
      newValue === (field === "title" ? cardData.title : cardData.description)
    ) {
      return;
    }
    setDataState((draft) => {
      const currentBoard = draft[activeBoardIndex];
      if (currentBoard) {
        const currentColumn = currentBoard.columns.find(
          (col) => col.id === column.id
        );
        const task = currentColumn.tasks.find(
          (task) => task.id === cardData.id
        );
        if (task) {
          if (field === "title") {
            task.title = newValue;
          } else if (field === "details") {
            task.description = newValue;
          }
        }
      }
    });
  };

  const onBlurHandler = (e, field) => {
    saveChanges(e, field);
    setActiveEditField(null);
  };

  const onKeyDownHandler = (e, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveChanges(e, field);
      setActiveEditField(null);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group/card relative min-h-16 overflow-y-hidden rounded-lg bg-white dark:bg-[#1B1B1B] shadow-main-purple px-4 py-3 shadow-sm flex justify-between"
    >
      <div className="w-full">
        {activeEditField === "title" ? (
          <textarea
            className="h-10 w-full outline-0 resize-none"
            defaultValue={cardData?.title}
            onFocus={(e) => e.target.select()}
            autoFocus
            onBlur={(e) => onBlurHandler(e, "title")}
            onKeyDown={(e) => onKeyDownHandler(e, "title")}
          ></textarea>
        ) : (
          <button
            className="text-heading-m font-heading-m mb-2 h-10 w-full text-start"
            onClick={() => setActiveEditField("title")}
          >
            {cardData?.title ? (
              cardData?.title
            ) : (
              <p className="text-medium-grey">Title</p>
            )}
          </button>
        )}
        {activeEditField === "details" ? (
          <textarea
            className="h-10 w-full outline-0 resize-none"
            defaultValue={cardData?.description}
            onFocus={(e) => e.target.select()}
            onBlur={(e) => onBlurHandler(e, "details")}
            onKeyDown={(e) => onKeyDownHandler(e, "details")}
            autoFocus
          ></textarea>
        ) : (
          <button
            className="text-heading-m mb-2 h-10 w-full text-start"
            onClick={() => setActiveEditField("details")}
          >
            {cardData?.description ? (
              cardData?.description
            ) : (
              <p className="text-medium-grey">Details</p>
            )}
          </button>
        )}
      </div>
      <button
        className="text-red-200 opacity-50 group-hover/card:opacity-100 group-hover/card:text-red-400 cursor-pointer text-heading-m font-heading-s border-l-1 pl-2 border-medium-grey/25 group-hover/card:border-medium-grey/75"
        onClick={deleteTaskHandler}
      >
        Delete
      </button>
    </div>
  );
}
