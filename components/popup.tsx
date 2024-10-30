// components/Popup.tsx
import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Popup: React.FC<PopupProps> = ({ open, onClose, title, content }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <Typography sx={{ mt: 2 }}>{content}</Typography>
        <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default Popup;
