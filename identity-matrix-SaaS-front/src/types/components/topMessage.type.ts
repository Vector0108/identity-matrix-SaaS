import { ReactNode } from "react";

export interface ITopMessage {
  children: ReactNode;
  type: "warning" | "error";
}
