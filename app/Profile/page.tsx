"use client";
import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button, Container, Typography, Avatar } from '@mui/material';
import Popup from '../../components/popup'; // Import the Popup component
import { useRouter } from 'next/navigation';

interface FormData {
  description: string;
  startDate: string;
  endDate: string;
}

const ProfilePage: React.FC = () => {
  const { data: session, status } = useSession();
  const [openPopup, setOpenPopup] = useState(false); // State to manage popup visibility
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/'); // Redirect to home page
    }
  }, [status, router]);

  const handleDeadlineSubmit = (formData: FormData) => {
    console.log(formData);
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Avatar src={session?.user?.image ?? '/default-profile.png'} alt="Profile Picture" />
      <Typography variant="h6">{session?.user?.name}</Typography>
      <Typography variant="body1">{session?.user?.email}</Typography>
      <Button variant="contained" onClick={() => setOpenPopup(true)} sx={{ mt: 2 }}>
        Open Popup
      </Button>
      <Button variant="contained" color="primary" onClick={() => signOut()} sx={{ mt: 2 }}>
        Sign Out
      </Button>
      {/* Popup Component */}
      <Popup
        open={openPopup}
        handleClose={() => setOpenPopup(false)}
        handleSubmit={handleDeadlineSubmit}
      />
    </Container>
  );
};

export default ProfilePage;
