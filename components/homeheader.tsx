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
        <div onClick={() => handleGo('/')} className="cursor-pointer hover:underline">Home</div>
        <div onClick={() => handleGo('/Dashboard')} className="cursor-pointer hover:underline">Dashboard</div>
        <div onClick={() => handleGo('/Courses')} className="cursor-pointer hover:underline">Courses</div>
        <div onClick={() => handleGo('/Challenges')} className="cursor-pointer hover:underline">Challenges</div>
        <div onClick={() => handleGo('/Rewards')} className="cursor-pointer hover:underline">Rewards</div>
      </div>
      
      <div className="flex items-center space-x-4">
        {!session ? (
          <Button variant="contained" color="primary" onClick={() => signIn()}>
            Sign In
          </Button>
        ) : (
          <div className="relative flex items-center">
            <Avatar
              src={session.user?.image ?? '/default-profile.png'}
              alt="Profile Picture"
              onClick={handleClick}
              sx={{ width: 40, height: 40, cursor: 'pointer' }}
              className="hover:shadow-lg"
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
  )
}
export default Header;