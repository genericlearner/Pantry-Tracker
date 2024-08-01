'use client'

import {useState,useEffect} from 'react'
//import {firestore} from 'firebase'
import {Box, Stack, Typography} from '@mui/material'
import {query, collection, getDocs, docRef, setDoc} from 'firebase/firestore'
import { firestore } from './firebase'


export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'Inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })

    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }
  const addItem = async(item) =>{
    const docRef = doc(collection(firestore,'inventory'),item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
        await setDoc(docRef, {quantity: quantity+1})
      }
    else{
      await setDoc(docRef, {quantity: 1})
    }
    
    await updateInventory()
  }
  const removeItem = async(item) =>{
    const docRef = doc(collection(firestore,'inventory'),item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if(quantity === 1){
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity-1})
      }
    }
    await updateInventory()
  }

  useEffect(()=>{
    updateInventory()
  },[])
  return (
    <Box>
      <Typography variant="h1">Inventory Management</Typography>
      {
        inventory.forEach((item)=>{

          return(<Box>
          
          {item.name}
          {item.count}
          </Box>)
        })
      }
      
    
    </Box>
   
  );
}
