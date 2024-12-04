import { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  text: string;
  icon: ReactElement;
}

const buttonStyles = {
  primary:
    "bg-purple-500 text-white font-sm py-2 px-4 rounded-md shadow-md hover:shadow-lg",
  secondary:
    "bg-purple-400  text-white font-sm py-2 px-4 rounded-md  shadow-md hover:shadow-lg ",
};

const iconStyles = "mr-2";

export default function Button({ variant, text, icon }: ButtonProps) {
  return (

    <button className={`${buttonStyles[variant]} flex items-center`}>
      <span className={iconStyles}>{icon}</span>
      {text}
    </button>
  );
}
