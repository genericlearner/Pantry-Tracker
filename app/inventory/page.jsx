'use client';
import { useState, useEffect } from 'react';
import { Box, Grid, Modal, Typography, TextField, Button, Card, CardContent, IconButton, Snackbar, Alert, Divider } from '@mui/material';
import { query, collection, getDoc, setDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';  // Import signOut method from Firebase Auth

export default function InventoryPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  if (!user) {
    router.push('/');
  }

  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Function to update the inventory list
  const updateInventory = async () => {
    try {
      const snapshot = await getDocs(query(collection(firestore, 'inventory')));
      const inventoryList = snapshot.docs.map((doc) => ({
        name: doc.id,
        ...doc.data(),
      }));
      setInventory(inventoryList);
      setFilteredInventory(inventoryList); // Initialize filteredInventory
    } catch (error) {
      console.error('Error updating inventory:', error);
      setSnackbarMessage('Error updating inventory');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Function to add an item to the inventory
  const addItem = async (item) => {
    if (!item.trim()) return; // Avoid adding empty items

    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }

      // Update inventory and show success message
      await updateInventory();
      setSnackbarMessage('Item added successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding item:', error);
      setSnackbarMessage('Error adding item');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Function to remove an item from the inventory
  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
        await updateInventory();
        setSnackbarMessage('Item removed successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      setSnackbarMessage('Error removing item');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Filter inventory based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(
        inventory.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, inventory]);

  // Fetch inventory on component mount
  useEffect(() => {
    updateInventory();
  }, []);

 //  Function to handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to home page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
      setSnackbarMessage('Error signing out');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      bgcolor="#f5f5f5"
      p={4}
      sx={{ position: 'relative' }}
    >
      {/* Sign Out Button */}
      <Button
        variant="contained"
        onClick={handleSignOut}
        color="secondary"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          bgcolor: '#d32f2f',
          '&:hover': { bgcolor: '#c62828' },
          borderRadius: '20px',
        }}
      >
        Sign Out
      </Button>

      {/* Modal for Adding Items */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="background.paper"
          borderRadius={2}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Item
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            label="Item Name"
            size="small"
          />
          <Button
            variant="contained"
            onClick={async () => {
              await addItem(itemName);
              setItemName('');
              handleClose();
            }}
            sx={{ bgcolor: '#007BFF', '&:hover': { bgcolor: '#0056b3' } }}
          >
            Add
          </Button>
        </Box>
      </Modal>

      {/* Search and Add Item Buttons */}
      <Box
        width="100%"
        maxWidth="1200px"
        display="flex"
        justifyContent="space-between"
        mb={3}
      >
        <Box display="flex" gap={2}>
          <TextField
            variant="outlined"
            placeholder="Search Inventory"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleOpen}
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#007BFF',
              '&:hover': { bgcolor: '#0056b3' },
              borderRadius: '20px',
            }}
          >
            Add New Item
          </Button>
        </Box>
      </Box>

      {/* Inventory Items Display */}
      <Box width="100%" maxWidth="1200px" p={4} bgcolor="background.paper" borderRadius={2} boxShadow={3}>
        <Typography
          variant="h2"
          align="center"
          color="#333"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          Inventory Items
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {filteredInventory.map(({ name, quantity }) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Quantity: {quantity}
                  </Typography>
                </CardContent>
                <Box
                  display="flex"
                  justifyContent="space-around"
                  p={2}
                  bgcolor="background.default"
                >
                  <IconButton
                    color="primary"
                    onClick={async () => await addItem(name)}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={async () => await removeItem(name)}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
            error: <ErrorIcon fontSize="inherit" />,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}