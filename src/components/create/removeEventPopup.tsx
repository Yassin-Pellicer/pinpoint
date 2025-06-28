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

export default function DeleteEventButton({ event, events, setEvents, deleteEventHook }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    setEvents(events.filter((eventParam) => eventParam.id !== event?.id));
    await deleteEventHook(event.id);
    handleClose();
    router.push("/main/home");
  };

  return (
    <>
      <button
        className={
          "flex justify-center font-bold " +
          "align-center w-full items-center text-2xl " +
          "bg-red-500 text-white py-4 px-4 " +
          "hover:bg-red-600 focus:outline-none " +
          "focus:ring-opacity-50"
        }
        onClick={handleOpen}
      >
        Eliminar evento
      </button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
