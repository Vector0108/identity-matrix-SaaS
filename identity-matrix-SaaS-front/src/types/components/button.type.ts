export interface IButton {
  onClick?: () => void;
  type?: "outline" | "secondary" | "primary" | "smoke" | "white";
  className?: string;
  style?: React.CSSProperties;
  children?: string|React.ReactNode;
  disabled?: boolean;
  action?: "button" | "submit" | "reset";
}
