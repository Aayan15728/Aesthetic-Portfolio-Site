import type { ReactElement } from "react";

/** Types for the vendored React Bits <ShapeWaves /> (see https://reactbits.dev). All props are optional. */
export interface ShapeWavesProps {
  text?: string;
  fontFamily?: string;
  fontWeight?: string | number;
  textSize?: number;
  shapes?: "mixed" | "squares" | "circles" | "triangles";
  cellSize?: number;
  dotSize?: number;
  color?: string;
  hoverColor?: string;
  backgroundColor?: string;
  speed?: number;
  scale?: number;
  contrast?: number;
  brightness?: number;
  flow?: number;
  direction?: number;
  fade?: number;
  interactive?: boolean;
  splashRadius?: number;
  splashStrength?: number;
  glow?: number;
  intro?: boolean;
  introDuration?: number;
  introKey?: string | number;
  paused?: boolean;
  onError?: (error: Error) => void;
  className?: string;
}

declare function ShapeWaves(props: ShapeWavesProps): ReactElement;
export default ShapeWaves;
