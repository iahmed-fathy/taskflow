import Column from "@/components/Column";
import { DataContext } from "@/DataContext";
import { useContext, useMemo } from "react";
/**
 *
 * @param {object} props
 * @param {Array} props.columns
 * @param {Array} props.columns.tasks
 * @returns {JSX.Element}
 */

import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function WorkSpace({ columns = [] }) {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  const { dataState, setDataState, activeBoardIndex } = useContext(DataContext);

  const addNewColumn = (num) => {
    return {
      id: Date.now() + Math.random(),
      title: `New Column ${num + 1 || 1}`,
      tasks: [],
    };
  };

  const addNewColumnHandler = () => {
    setDataState((draft) => {
      const num = draft[activeBoardIndex].columns.length;
      const newColumn = addNewColumn(num);
      const activeBoard = draft[activeBoardIndex];
      if (activeBoard) {
        activeBoard.columns.push(newColumn);
      } else {
        console.warn(`Active board at index ${activeBoardIndex} not found.`);
      }
    });
  };

  const allTasksIds = useMemo(() => {
    let tasksIds = [];
    for (let column of columns) {
      tasksIds = [...tasksIds, ...column.tasks.map((task) => task.id)];
    }
    return tasksIds;
  }, [columns]);

  const saveDateAfterChanges = (active, over) => {
    setDataState((draft) => {
      const board = draft[activeBoardIndex];
      if (!board) return;

      const activeColumnId = active.data.current?.column;
      const overColumnId = over.data.current?.column;

      if (!activeColumnId || !overColumnId) return;

      const activeColumn = board.columns.find(
        (col) => col.id === activeColumnId
      );
      const overColumn = board.columns.find((col) => col.id === overColumnId);

      if (!activeColumn || !overColumn) return;

      const activeTaskIndex = activeColumn.tasks.findIndex(
        (task) => task.id === active.id
      );

      const overTaskIndex = overColumn.tasks.findIndex(
        (task) => task.id === over.id
      );

      if (activeTaskIndex === -1) return;

      const [movedTask] = activeColumn.tasks.splice(activeTaskIndex, 1);
      const insertIndex =
        overTaskIndex >= 0 ? overTaskIndex : overColumn.tasks.length;

      overColumn.tasks.splice(insertIndex, 0, movedTask);
    });
  };

  const onDragOver = (event) => {
    const { active, over } = event;
    const activeColumnId = active.data.current?.column;
    const overColumnId = over.data.current?.column;

    if (!over) return;

    if (activeColumnId !== overColumnId) {
      saveDateAfterChanges(active, over);
    }
  };

  const onDragEndHandler = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    saveDateAfterChanges(active, over);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEndHandler}
      onDragOver={onDragOver}
    >
      <div className="flex max-sm:flex-col h-[calc(100vh-97px)] flex-1 gap-6 overflow-auto p-6 transition-all duration-200">
        <SortableContext
          items={allTasksIds}
          strategy={verticalListSortingStrategy}
        >
          {columns.map((column, index) => (
            <Column column={column} key={index} />
          ))}
          {dataState.length > 0 && (
            <button
              className="text-heading-xl max-sm:self-center font-heading-xl max-sm:w-80 text-medium-grey w-72 shrink-0 self-start rounded-lg bg-lines-light dark:bg-[#1B1B1B] shadow-main-purple  px-2 shadow cursor-pointer"
              onClick={addNewColumnHandler}
            >
              + New Column
            </button>
          )}
        </SortableContext>
      </div>
    </DndContext>
  );
}
