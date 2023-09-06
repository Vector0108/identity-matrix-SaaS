import React from "react";
import Svg from "../../../assets/svg";
import { ISvg, ISVGIcons } from "../../../types/components/svgIcons.type";

const SvgIcons: React.FunctionComponent<ISVGIcons> = ({
  iconName,
  ...props
}) => {
  const SvgIcons = Svg[iconName as keyof ISvg];
  return <SvgIcons {...props} />;
};

export default SvgIcons;
