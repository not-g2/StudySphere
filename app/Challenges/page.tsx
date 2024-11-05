"use client";

import React, { useState } from 'react';
import { Box } from '@mui/material';
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

  const addChallenge = (challenge: Challenge): void => {
    setChallenges([...challenges, challenge]);
  };

  return (
    <Box className="bg-c2 min-h-screen p-4" display="flex" flexDirection="column" alignItems="flex-start">
      <Box display="flex" justifyContent="space-between" width="100%" gap={4}>
        {/* Left Column - Level and XP Display */}
        <Box flex="1" maxWidth="25%">
          <LevelXPDisplay level={5} xp={1500} />
        </Box>

        {/* Center Column - Add Challenge Form */}
        <Box flex="1" maxWidth="50%">
          <AddChallenge onAdd={addChallenge} />
        </Box>

        {/* Right Column - Challenge Table */}
        <Box flex="1" maxWidth="25%">
          <ChallengeTable challenges={challenges} />
        </Box>
      </Box>
    </Box>
  );
};

export default ChallengePage;
