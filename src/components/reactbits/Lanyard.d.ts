import type { CSSProperties, ReactElement } from "react";

/** Types for the vendored React Bits <Lanyard /> (see https://reactbits.dev). All props are optional. */
export interface LanyardProps {
  frontImage?: string;
  backImage?: string;
  imageFit?: "cover" | "contain";
  cardColor?: string;
  orientation?: "portrait" | "landscape";
  finish?: "glossy" | "matte" | "holographic" | "metallic";
  cornerRadius?: number;
  size?: number;
  anchor?: "left" | "center" | "right";
  strapLength?: number;
  strapImage?: string;
  strapColor?: string;
  strapWidth?: number;
  metal?: "graphite" | "silver" | "gold";
  gravity?: number;
  damping?: number;
  elasticity?: number;
  breeze?: number;
  interactive?: boolean;
  intro?: boolean;
  className?: string;
  style?: CSSProperties;
}

declare const Lanyard: (props: LanyardProps) => ReactElement;
export default Lanyard;
