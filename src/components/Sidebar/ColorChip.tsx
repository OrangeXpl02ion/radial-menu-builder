interface ColorChipProps {
  color: string;
  filled?: boolean;
  size?: number;
}

export function ColorChip({ color, filled = true, size = 10 }: ColorChipProps) {
  return (
    <div style={{
      width: size,
      height: size,
      background: filled ? color : 'transparent',
      border: `1px solid ${color}`,
      flexShrink: 0,
    }} />
  );
}
