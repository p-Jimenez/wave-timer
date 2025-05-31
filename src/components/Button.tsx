import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

const Button = ({ ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className={clsx(props.className, "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800")}
    >
      {props.children}
    </button>
  );
}

export default Button;
