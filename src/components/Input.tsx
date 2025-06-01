import { InputHTMLAttributes } from "react";
import clsx from "clsx";

const Input = ({ ...props }: InputHTMLAttributes<HTMLInputElement>) => {

  return (
    <input
      {...props}
      className={clsx(props.className, "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500")}
    />
  )
}

export default Input;
