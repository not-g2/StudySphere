// "use client";
// import { CircularProgress, Box, Typography } from "@mui/material";
// import dynamic from "next/dynamic";

// const Loading: React.FC = () => {
//     return (
//         <Box
//             display="flex"
//             flexDirection="column"
//             alignItems="center"
//             justifyContent="center"
//             className="bg-c1" // Apply custom background color c1
//             sx={{ height: "100vh" }}
//         >
//             <CircularProgress />
//             <Typography variant="h6" sx={{ mt: 2, color: "white" }}>
//                 {" "}
//                 {/* Set text color to white */}
//                 Loading...
//             </Typography>
//         </Box>
//     );
// };

// export default dynamic(() => Promise.resolve(Loading), { ssr: false });

import React from "react";

const page = () => {
    return <div>page</div>;
};

export default page;