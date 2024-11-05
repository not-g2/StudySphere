import { CircularProgress, Box, Typography } from '@mui/material';

const Loading: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      className="bg-c1" // Apply custom background color c1
      sx={{ height: '100vh' }}
    >
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2, color: 'white' }}> {/* Set text color to white */}
        Loading...
      </Typography>
    </Box>
  );
};

export default Loading;
