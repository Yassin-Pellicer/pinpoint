"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";
import { closeSession } from "../../hooks/auth/closeSession/closeSession";

export default function DeleteEventButton({ }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogout = async () => {
    try {
      await closeSession();
      router.push("/");
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <>
      <button
        onClick={() => handleLogout()}
        className="bg-red-500 hover:bg-red-700 text-white font-bold h-[40px] mt-4 px-3 rounded-full"
        title="Cerrar Sesión"
      >
        <i className="material-icons text-lg">logout</i>
      </button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres cerrar sesión?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Cerrar sesión.
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
