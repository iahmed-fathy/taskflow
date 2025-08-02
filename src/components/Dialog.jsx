import { Dialog } from "radix-ui";

/**
 *
 * @param {object} props
 * @param {string} props.title
 * @param {JSX.Element} props.triggerComponante
 * @param {JSX.Element} props.children
 * @param {boolean} props.isOpen
 * @param {function} props.SetOpen
 * @param {string} props.Description
 * @returns {JSX.Element}
 */

export default function DialogDemo({
  title,
  triggerComponante,
  children,
  isOpen,
  SetOpen,
}) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={SetOpen}>
      <Dialog.Trigger asChild>{triggerComponante}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/50 z-10" />
        <Dialog.Content
          aria-describedby={undefined}
          className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[480px] translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-[6px] bg-white dark:bg-[#1B1B1B] dark:text-white p-8 focus:outline-none z-10"
        >
          <Dialog.Title className="text-heading-l font-heading-l mb-6">
            {title}
          </Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
