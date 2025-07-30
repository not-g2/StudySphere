"use client";
import { Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';

interface DropdownProps {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  handleSignOut: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ anchorEl, handleClose, handleSignOut }) => {
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleProfileRedirect = () => {
    router.push('/Profile')
    handleClose();
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          maxHeight: 48 * 4.5 + 8, // Adjust height as needed
          width: '20ch', // Adjust width as needed
        },
      }}
    >
      <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
    </Menu>
  );
};

export default Dropdown;
