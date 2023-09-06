export interface IPopup {
  text?: string;
  onClose: () => void;
  style?: React.CSSProperties;
  className?: string;
  bodyClass?: string;
  buttonText?: string;
  type?: "modal" | "message";
  children?: React.ReactNode;
}
