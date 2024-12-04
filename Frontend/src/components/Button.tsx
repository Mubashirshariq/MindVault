import { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  text: string;
  icon: ReactElement;
  onClick?: ()=>void;
}

const buttonStyles = {
  primary:
    "bg-purple-500 text-white font-sm py-2 px-4 rounded-md shadow-md hover:shadow-lg",
  secondary:
    "bg-purple-400  text-white font-sm py-2 px-4 rounded-md  shadow-md hover:shadow-lg ",
};

const iconStyles = "mr-2";

export default function Button({ onClick,variant, text, icon }: ButtonProps) {
  return (

    <button onClick={onClick} className={`${buttonStyles[variant]} flex items-center`}>
      <span className={iconStyles}>{icon}</span>
      {text}
    </button>
  );
}
