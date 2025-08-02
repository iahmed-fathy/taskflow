import TextField from "@components/TextField";
import Button from "@components/Button";
import iconCross from "@assets/icon-cross.svg";
import { useContext, useState } from "react";
import { DataContext } from "@/DataContext";

function AddNewBoardFoarm({
  setDialogState,
  boardID,
  columnsData = [{ id: Date.now() + Math.random() }],
  title,
  saveChange,
}) {
  const [columns, setColumns] = useState(columnsData);
  const { setDataState, setActiveBoardIndex } = useContext(DataContext);

  const onRemoveColumns = (columnID) => {
    setColumns((prev) => prev.filter((column) => column.id !== columnID));
  };

  const onAddColumn = () => {
    setColumns((prev) => [...prev, { id: Date.now() + Math.random() }]);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    setDataState((draft) => {
      if (boardID) {
        const targetBoard = draft.find((board) => board.id === boardID);
        if (targetBoard) {
          targetBoard.title = formData.get("boardName");
          targetBoard.columns = formData
            .getAll("columnName")
            .map((title, index) => ({
              id:
                targetBoard.columns?.[index]?.id || Date.now() + Math.random(),
              title,
              tasks: targetBoard.columns?.[index]?.tasks || [],
            }));
        } else {
          console.warn(`Board with ID ${boardID} not found.`);
        }
      } else {
        draft?.push({
          id: Date.now() + Math.random(),
          title: formData.get("boardName"),
          columns: formData.getAll("columnName").map((title) => ({
            id: Date.now() + Math.random(),
            title,
            tasks: [],
          })),
        });
        setActiveBoardIndex(draft.length - 1);
      }
    });
    setDialogState(false);
  };

  return (
    <form
      className="flex flex-col gap-7 "
      onSubmit={(event) =>
        handleFormSubmit(event, setDataState, setDialogState, boardID)
      }
    >
      <div>
        <h3 className="text-medium-grey text-heading-s font-heading-s mb-2">
          Name
        </h3>
        <TextField
          placeholder="e.g. Web Design"
          name="boardName"
          required
          defaultValue={title}
        ></TextField>
      </div>
      <div>
        <h3 className="text-medium-grey text-heading-s font-heading-s mb-2">
          Columns
        </h3>
        {columns.map((column) => (
          <div key={column.id} className="flex gap-4 items-center mb-3">
            <TextField
              placeholder="e.g. Todo"
              name="columnName"
              required
              defaultValue={column.title || ""}
            ></TextField>
            <button
              onClick={() => onRemoveColumns(column.id)}
              className="cursor-pointer"
              type="button"
            >
              <img src={iconCross} alt="icon cross" />
            </button>
          </div>
        ))}
      </div>
      <Button
        variant="secondary"
        onClick={onAddColumn}
        type="button"
        className="cursor-pointer"
      >
        + Add New Column
      </Button>
      <Button variant="primary" type="submit" className="cursor-pointer">
        {saveChange ? saveChange : "Create New Board"}
      </Button>
    </form>
  );
}

export default AddNewBoardFoarm;
