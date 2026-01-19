import {
  CircleMaskProps,
  FilterProps,
  PatternProps,
} from "@/interfaces/component-props.interface";

// Reusable Pattern Component
export const Pattern = (inProps: PatternProps) => {
  const {
    id,
    patternUnits = "userSpaceOnUse",
    href,
    duration = 30,
    x = "0",
    y = "0",
    width = "200",
    height = "100",
    attributeName = "x",
    from = "0",
    to = "200",
    repeatCount = "indefinite",
    ...rest
  } = inProps;
  return (
    <pattern
      id={id}
      patternUnits={patternUnits}
      patternContentUnits={patternUnits}
      x={x}
      y={y}
      width={width}
      height={height}
      {...rest}
    >
      <animate
        attributeName={attributeName}
        from={from}
        to={to}
        dur={`${duration}s`}
        repeatCount={repeatCount}
      />
      <image x={x} y={y} width={width} height={height} href={href} />
    </pattern>
  );
};

// 2. Reusable Mask Component
export const CircleMask = (inProps: CircleMaskProps) => {
  const {
    id,
    pattern,
    filterId = "fisheye-filter",
    fill = "black",
    x = "0",
    y = "0",
    width = "100",
    height = "100",
    cx = "50",
    cy = "50",
    r = "50",
    ...rest
  } = inProps;
  return (
    <mask id={id} {...rest}>
      <rect x={x} y={y} width={width} height={height} fill={fill} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={pattern}
        // IMPORTANT: Must be in url(#id) format
        filter={`url(#${filterId})`}
      />
    </mask>
  );
};

export const Filter = (inProps: FilterProps) => {
  const {
    id,
    x = "0%",
    y = "0%",
    width = "100%",
    height = "100%",
    inValue = "SourceGraphic",
    in2 = "blur",
    scale = "3",
    stdDeviation = "10",
    result = "blur",
    ...rest
  } = inProps;
  return (
    <filter id={id} x={x} y={y} width={width} height={height} {...rest}>
      <feGaussianBlur
        in={inValue}
        stdDeviation={stdDeviation}
        result={result}
      />
      <feDisplacementMap in={inValue} in2={in2} scale={scale} />
    </filter>
  );
};
