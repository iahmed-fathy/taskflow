import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";

/**
 *  @param {Object} props
 * @param {function} props.triggerComponent
 * @param {object} props.items
 * @param {string} props.items.label - The text to display in the dropdown
 * @param {function} props.items.onClick - The function to run when the item is clicked
 * @returns {JSX.Element}
 */

export default function Dropdown({ triggerComponent, items }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {triggerComponent && triggerComponent()}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-48 rounded-lg bg-white dark:bg-[#1B1B1B] shadow-main-purple-hover  dark:text-white shadow will-change-[opacity,transform] z-10 mr-10 max-sm:mr-5"
          sideOffset={32}
        >
          {items &&
            Object.keys(items).map((item) => (
              <DropdownMenu.Item
                className={clsx(
                  "group cursor-pointer p-4 text-body-l leading-none outline-none data-[highlighted]:bg-light-grey dark:hover:text-black",
                  {
                    "!text-red": items[item].label.includes("Delete"),
                  }
                )}
                key={items[item].label}
                onClick={items[item].onClick}
              >
                {items[item].label}
              </DropdownMenu.Item>
            ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
