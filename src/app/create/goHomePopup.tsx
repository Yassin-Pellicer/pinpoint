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

export default function GoHomePopup({type}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-white h-full hover:bg-gray-200 shadow-2xl border-r-[1px] border-gray-400"
      >
        {type === "home" ? (
          <i className="material-icons text-black text-xl">home</i>
        ) : (
          <i className="material-icons text-black text-xl">arrow_back</i>
        )}
      </button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Volver atrás</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres volver atrás? Perderás todo tu progreso.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() =>
              type === "home"
                ? router.push("/main/home")
                : router.back()
            }
            color="error"
            variant="contained"
          >
            Volver atrás
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
