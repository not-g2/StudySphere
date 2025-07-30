// components/UserCourses/GradientBanner.tsx
import React, { useMemo } from 'react';
import { Typography } from '@mui/material';

function randomColor() {
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.random() * 20;  // 60–80%
  const l = 70 + Math.random() * 10;  // 70–80%
  return `hsl(${h},${s}%,${l}%)`;
}

interface GradientBannerProps {
  width?: string;
  height?: string;
  courseTitle?: string;
}

const GradientBanner: React.FC<GradientBannerProps> = ({
  width = '100%',
  height = '200px',
  courseTitle,
}) => {
  // generate a single random gradient per mount
  const angle = useMemo(() => Math.floor(Math.random() * 360), []);
  const c1 = useMemo(() => randomColor(), []);
  const c2 = useMemo(() => randomColor(), []);
  return (
    <div
      style={{
        width,
        height,
        background: `linear-gradient(${angle}deg, ${c1}, ${c2})`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {courseTitle && (
        <Typography
            variant="h4"
            component="div"
            sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'black',         // ← was 'white'
                fontWeight: 'bold',
            }}
            >
            {courseTitle}
        </Typography>
      )}
    </div>
  );
};

export default GradientBanner;
