declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      "camera-target"?: string;
      "min-camera-orbit"?: string;
      "max-camera-orbit"?: string;
      autoplay?: boolean;
      exposure?: string;
      "shadow-intensity"?: string;
      "camera-controls"?: boolean;
      style?: React.CSSProperties;
    };
  }
}
