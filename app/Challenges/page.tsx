"use client";

import React, { useState } from 'react';
import { Grid, Box } from '@mui/material';
import LevelXPDisplay from '@/components/levelandexp';
import AddChallenge from '@/components/addchallenge';
import ChallengeTable from '@/components/challengetable';

interface Challenge {
  name: string;
  description: string;
  endDate: string;
}

const ChallengePage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    { name: 'Example Challenge 1', description: 'This is the first example challenge.', endDate: '2024-12-01' },
    { name: 'Example Challenge 2', description: 'This is the second example challenge.', endDate: '2024-12-15' },
  ]);

  const addChallenge = (challenge: Challenge) => {
    setChallenges([...challenges, challenge]);
  };

  return (
    <Box className="bg-c2 min-h-screen p-4">
      <Grid container spacing={4}>
        {/* Left Column - Level and XP Display */}
        <Grid item xs={12} md={3}>
          <LevelXPDisplay level={5} xp={1500} />
        </Grid>

        {/* Center Column - Add Challenge Form */}
        <Grid item xs={12} md={5}>
          <AddChallenge onAdd={addChallenge} />
        </Grid>

        {/* Right Column - Challenge Table */}
        <Grid item xs={12} md={4}>
          <ChallengeTable challenges={challenges} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChallengePage;
