import React, { useState } from 'react';
import { Box } from '@mui/material';
import PermanentDrawerLeft from './drawer';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <PermanentDrawerLeft open={open} onDrawerOpen={handleDrawerOpen} onDrawerClose={handleDrawerClose} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: (theme) =>
            theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          marginLeft: open ? `${drawerWidth}px` : '0px', // Drawer açık olduğunda içeriği yana kaydır
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

