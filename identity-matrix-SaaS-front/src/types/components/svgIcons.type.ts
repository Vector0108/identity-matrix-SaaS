import { FunctionComponent, SVGProps } from "react";
export interface ISVGIcons {
  iconName: string;
}

export interface ISvg {
  close: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
  lock: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
  received: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
  decline: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
  delete: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
  arrowDown: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
  copy: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
  search: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
}
