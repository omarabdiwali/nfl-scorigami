import { ChartsTooltipContainer, useItemTooltip } from '@mui/x-charts';
import { Box, Typography } from '@mui/material';

// const square = 'M-4,-4L4,-4L4,4L-4,4Z';
const square = 'M 0, 0 m -4, 0 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0';
const gradientColors = [
  '#0769c6',
  '#33ccff',
  '#00ff08ff',
  '#80ff00',
  '#ffff00',
  '#ffd700',
  '#FFA500',
  '#ff8c00',
  '#fa0404',
  '#c40000'
];

export function valueToColor(value, min, max) {
  value = Math.min(Math.max(value, min), max);
  const normalizedValue = (value - min) / (max - min);
  const colorIndex = normalizedValue * (gradientColors.length - 1);
  const color1Index = Math.floor(colorIndex);
  const color2Index = Math.min(color1Index + 1, gradientColors.length - 1);
  const color1 = hexToRgb(gradientColors[color1Index]);
  const color2 = hexToRgb(gradientColors[color2Index]);
  const interpolatedColor = interpolateColors(color1, color2, colorIndex - color1Index);
  return rgbToHex(interpolatedColor);
}

const hexToRgb = (hex) => {
  hex = hex.substring(0, Math.max(7, hex.length - 2));
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const interpolateColors = (color1, color2, fraction) => {
  return {
    r: Math.round(color1.r + (color2.r - color1.r) * fraction),
    g: Math.round(color1.g + (color2.g - color1.g) * fraction),
    b: Math.round(color1.b + (color2.b - color1.b) * fraction)
  };
}

const rgbToHex = (rgb) => {
  return `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}`;
}

export function CustomMarker({
  size,
  x,
  y,
  seriesId,
  isHighlighted,
  isFaded,
  dataIndex,
  color,
  ...other
}) {
  const width = window.innerWidth * 0.95;
  const markerSize = width > 1100 ? 4 : (width / 1100) * 4;
  const props = {
    x: 0,
    y: 0,
    width: (isHighlighted ? 1.2 : 1) * markerSize,
    height: (isHighlighted ? 1.2 : 1) * markerSize,
    transform: `translate(${x}, ${y})`,
    fill: color,
    opacity: isFaded ? 0.3 : 1,
    ...other,
  };

  return (
    <g {...props}>
      <path
        d={square}
        transform={`scale(${(isHighlighted ? 1.2 : 1) * markerSize / 8})`}
      />
    </g>
  );
}

export function CustomTooltip() {
  const item = useItemTooltip();
  if (!item || !item.value) {
    return (
      <ChartsTooltipContainer sx={{ display: "none" }}>
      </ChartsTooltipContainer>
    )
  }

  return (
    <ChartsTooltipContainer trigger='item'>
      <Box sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(4px)',
        minWidth: '200px'
      }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#00fffa' }}>
          {item.value.id} Final Score
        </Typography>
        <Typography variant="body2">
          <strong>Total Games:</strong> {item.value.count}
        </Typography>
        <Typography variant="body2" noWrap>
          <strong>Latest Matchup:</strong> {item.value.versus}
        </Typography>
        <Typography variant="body2">
          <strong>Last Occurrence:</strong> {new Date(item.value.lastTime).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </Typography>
      </Box>
    </ChartsTooltipContainer>
  );
}

const resetTime = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getChartData() {
  const data = localStorage.getItem("nbaChartData");
  const storedDateString = localStorage.getItem("nbaChartDate");

  if (storedDateString) {
    const storedDate = resetTime(new Date(storedDateString));
    const currentDate = resetTime(new Date());
    if (currentDate.getTime() != storedDate.getTime()) return [];
  }

  return data != null ? JSON.parse(data) : [];
}