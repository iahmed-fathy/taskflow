import clsx from "clsx";

/**
 *
 * @param {object} props
 * @param {string} props.placeholder
 * @param {boolean} props.isInvalid
 * @param {string} props.name
 * @param {boolean} [props.required=false]
 * @param {string} props.defaultValue
 * @returns {JSX.Element}
 */

export default function TextField({
  placeholder,
  isInvalid,
  name,
  required,
  defaultValue,
}) {
  return (
    <div className="relative flex w-full  max-sm:w-full flex-1 items-center">
      {isInvalid && (
        <span className="absolute right-4 text-body-l font-body-l text-red">
          Can't be empty
        </span>
      )}

      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={clsx(
          "w-full rounded-[4px] border-2 border-medium-grey/25 py-2 pl-4 text-body-l font-body-l focus:outline-main-purple placeholder:text-body-m placeholder:font-body-m",
          {
            "border-red pr-32": isInvalid,
            "pr-4": !isInvalid,
          }
        )}
      />
    </div>
  );
}
