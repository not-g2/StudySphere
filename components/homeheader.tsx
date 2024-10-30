"use client";

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Avatar, Button } from '@mui/material';
import Dropdown from '../components/dropdown';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleGo = (path: string) => {
    router.push(path);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut();
    handleClose();
  };

  return (
    <header className="flex items-center justify-between p-4 bg-c1 text-white">
      <div className="flex space-x-4">
        <div onClick={() => handleGo('/')}>Home</div>
        <div onClick={() => handleGo('/Dashboard')}>Dashboard</div>
      </div>
      <div className="flex space-x-4">
        {!session ? (
          <div>
            <Button variant="contained" onClick={() => signIn()}>
              Sign In
            </Button>
          </div>
        ) : (
          <div>
            <Avatar
              src={session.user?.image ?? '/default-profile.png'}
              alt="Profile Picture"
              onClick={handleClick}
              sx={{ width: 40, height: 40, cursor: 'pointer' }}
            />
            <Dropdown
              anchorEl={anchorEl}
              handleClose={handleClose}
              handleSignOut={handleSignOut}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;