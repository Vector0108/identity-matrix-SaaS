import { ISvg } from "../../types/components/svgIcons.type";
import { ReactComponent as Close } from "./close.svg";
import { ReactComponent as Lock } from "../../assets/iamges/lock.svg";
import { ReactComponent as Received } from "./received.svg";
import { ReactComponent as Decline } from "./declined.svg";
import { ReactComponent as Delete } from "./delete.svg";
import { ReactComponent as ArrowDown } from "./arrowDown.svg";
import { ReactComponent as Copy } from "./copy.svg";
import { ReactComponent as Search } from "./search.svg";

const Svg: ISvg = {
  close: Close,
  lock: Lock,
  received: Received,
  decline: Decline,
  delete: Delete,
  arrowDown: ArrowDown,
  copy: Copy, 
  search: Search
};

export default Svg;
