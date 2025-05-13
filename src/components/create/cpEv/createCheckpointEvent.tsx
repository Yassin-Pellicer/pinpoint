import {
  Slider,
  FormControl,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import CpList from "./createCheckpointList";
import Tags from "../tags";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useEvent } from "../../../utils/context/ContextEvent";
import fileURL from "../../../utils/funcs/createUrlImage";
import { createEventHook } from "../../../hooks/create/addEventHook";
import { addTagsHook } from "../../../hooks/create/addTagsHook";
import { useCheckpoints } from "../../../utils/context/ContextCheckpoint";
import { addCheckpointsHook } from "../../../hooks/create/addCheckpointsHook";
import SnackbarContent from "@mui/material/SnackbarContent";
import { useRouter } from "next/navigation";
import Logo from "../../ui/logo";
import Counter from "../../ui/counter";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import { useSession } from "../../../utils/context/ContextSession";

const CheckpointEvent = () => {
  const {
    event,
    name,
    setName,
    description,
    setDescription,
    isPublic,
    setIsPublic,
    marker,
    setMarker,
    banner,
    setBanner,
    tags,
    setTags,
    qr,
    setQr,
    setAuthor,
    enableComments,
    setEnableComments,
    enableRatings,
    setEnableRatings,
    setEnableInscription,
    enableInscription,
    capacity,
    setCapacity,
    start,
    setStart,
    end,
    setEnd,
    date,
    setDate,
  } = useEvent();

  const t = useTranslations("Create");
  const tagsTrans = useTranslations("Tags");

  const [loading, setLoading] = useState(false);
  const [openCp, setOpenCp] = useState(false);
  const [openTags, setOpenTags] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const router = useRouter();

  const { checkpoints, setCheckpoints } = useCheckpoints();
  const { user } = useSession();

  const Quill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createEventHook(event, user.id);
      if (result.status === 400) {
        if (result.message === "name") {
          setSnackbarMessage(t("nameNotif"));
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        } else if (result.message === "marker") {
          setSnackbarMessage(t("locationNotif"));
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } else {
        await addCheckpointsHook({ eventId: result.id, data: checkpoints });

        setSnackbarMessage(t("successNotif"));
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        router.push("/main/home");
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("errorNotif");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  return (
    <div className="mb-6 rounded-2xl bg-[#ffffff] px-2 pt-6">
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-[400px] w-[400px] border-b-8 border-white m-auto" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="mb-5">
              <Logo />
            </div>
          </div>
        </div>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={
            snackbarSeverity as "error" | "success" | "info" | "warning"
          }
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <form className="flex flex-col px-3 w-full" onSubmit={handleSubmit}>
        <div className="flex flex-row items-center justify-between text-black">
          <h1 className="text-3xl tracking-tight font-bold">
            {t("Details.creation")}
          </h1>
          {/* <i className="material-icons">lock</i> */}
          <div className="flex gap-2">
            {isPublic && <i className="material-icons">public</i>}
            {!isPublic && <i className="material-icons">lock</i>}
            {qr && <i className="material-icons">qr_code</i>}
            {!qr && <i className="material-icons">tour</i>}
          </div>
        </div>

        <input
          accept="image/*"
          id="image"
          type="file"
          hidden
          onChange={(e) => fileURL(e, (url) => setBanner(url))}
        />
        <label htmlFor="image">
          <div className="flex flex-col justify-center items-center mt-4 mb-4">
            {banner ? (
              <div className="cursor-pointer relative flex justify-end items-center w-full h-15 mb-2 rounded-2xl overflow-hidden border border-gray-400">
                <img
                  src={banner}
                  className="w-full h-full object-cover rounded-2xl"
                  alt="banner"
                />
              </div>
            ) : (
              <div className="flex flex-col cursor-pointer justify-center items-center w-full h-15 mb-2 rounded-2xl p-14 bg-[#e6e6e6] border border-gray-400 hover:bg-[#d6d6d6] transition duration-200">
                <i className="text-gray-400 material-icons mr-1 text-[150px] select-none">
                  add_photo_alternate
                </i>
                <p className="font-caveat text-gray-500 text-2xl tracking-tighter select-none">
                  {t("pic")}
                </p>
              </div>
            )}
          </div>
        </label>

        <label className="font-bold">{t("Details.title")}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="border border-black rounded p-1 mb-3"
        />
        <label className="font-bold">{t("Details.description")}</label>
        <Quill
          value={description}
          onChange={setDescription}
          style={{ height: "200px", marginBottom: "40px" }}
        />

        <button
          onClick={(e) => {
            setOpenTags(!openTags);
            e.preventDefault();
          }}
          className="font-bold bg-transparent border-l-[1px] border-r-[1px] mt-[18px] border-b-[1px] text-sm border-gray-400 
          text-black p-2 hover:bg-blue-500
          hover:border-blue-500 hover:text-white 
          transition duration-300"
        >
          {t("Details.setTags")}
        </button>

        <button
          onClick={(e) => {
            setOpenCp(true);
            e.preventDefault();
          }}
          className="font-bold bg-transparent border-l-[1px] border-r-[1px] border-b-[1px] text-sm border-gray-400 
          text-black rounded-b-2xl mb-3 p-2 hover:bg-blue-500
          hover:border-blue-500 hover:text-white 
          transition duration-300"
        >
          {t("Details.checkpoints")}
        </button>

        {tags.length > 0 && (
          <div>
            <div className="flex flex-wrap w-full gap-2 my-2">
              {tags.map((tag) => (
                <div
                  key={tag.tag_id}
                  className={`rounded-full w-fit px-2 py-1 text-center
               text-white bg-[#3F7DEA] font-bold tracking-tight"
            }`}
                >
                  <p className="text-xs">{tagsTrans(`${tag.tag_id}`)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-auto rounded-2xl mt-3 bg-gray-300 relative transition duration-100 overflow-hidden">
          <div className="relative h-full">
            <div className="relative p-4 z-10">
              <div className="flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <i
                    className="material-icons text-white text-4xl mr-2"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    date_range
                  </i>
                  <h1
                    className="text-2xl tracking-tighter font-bold text-white"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    Vigencia del evento
                  </h1>
                </div>
              </div>

              <div className="grid mt-2 grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <div
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    className="flex flex-row mb-2 items-center"
                  >
                    <i className="material-icons text-white text-2xl mr-2">
                      timer
                    </i>
                    <h1 className="text-white tracking-tigher font-bold">
                      Hora de Inicio
                    </h1>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setStart(null);
                      }}
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                      className="flex items-center justify-center ml-auto"
                    >
                      <i className="material-icons text-white">refresh</i>
                    </button>
                  </div>
                  <DateTimePicker
                    label="Seleccione fecha y hora"
                    format="dd/MM/yyyy HH:mm"
                    value={new Date(start) && start}
                    onChange={(newValue) => {
                      if (!newValue) return;
                      if (end && newValue > end) {
                        setSnackbarMessage(
                          "La fecha de inicio no puede ser posterior a la de fin!"
                        );
                        setSnackbarSeverity("error");
                        setSnackbarOpen(true);
                      } else {
                        setStart(newValue);
                      }
                    }}
                    slotProps={{
                      textField: {
                        InputProps: {
                          readOnly: true,
                          style: { fontSize: "0.875rem" },
                        },
                        InputLabelProps: {
                          style: { fontSize: "0.875rem" },
                        },
                      },
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <div
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    className="flex flex-row mb-2 items-center"
                  >
                    <i className="material-icons text-white text-2xl mr-2">
                      timer_off
                    </i>
                    <h1 className="text-white tracking-tigher font-bold">
                      Hora de Fin
                    </h1>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEnd(null);
                      }}
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                      className="flex items-center justify-center ml-auto"
                    >
                      <i className="material-icons text-white">refresh</i>
                    </button>
                  </div>
                  <DateTimePicker
                    label="Seleccione fecha y hora"
                    format="dd/MM/yyyy HH:mm"
                    value={new Date(end) && end}
                    onChange={(newValue) => {
                      if (!newValue) return;
                      if (start && newValue < start) {
                        setSnackbarMessage(
                          "La fecha de fin no puede ser anterior a la de inicio!"
                        );
                        setSnackbarSeverity("error");
                        setSnackbarOpen(true);
                      } else if (newValue > end && end) {
                        setSnackbarMessage(
                          "La fecha y hora del evento no pueden ocurrir antes que el fin de su vigencia."
                        );
                        setSnackbarSeverity("error");
                        setSnackbarOpen(true);
                      } else {
                        setEnd(newValue);
                      }
                    }}
                    slotProps={{
                      textField: {
                        InputProps: {
                          readOnly: true,
                          style: { fontSize: "0.875rem" },
                        },
                        InputLabelProps: {
                          style: { fontSize: "0.875rem" },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="flex mt-4 flex-col">
                <div
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  className="flex flex-row mb-2 items-center"
                >
                  <i className="material-icons text-white text-2xl mr-2">
                    timer
                  </i>
                  <h1 className="text-white text-2xl tracking-tighter font-bold">
                    Fecha y hora del evento*
                  </h1>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setDate(null);
                    }}
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    className="flex items-center justify-center ml-auto"
                  >
                    <i className="material-icons text-white">refresh</i>
                  </button>
                </div>
                <DateTimePicker
                  label="Seleccione fecha y hora"
                  format="dd/MM/yyyy HH:mm"
                  value={new Date(date)}
                  onChange={(newValue) => {
                    if (!newValue) return;
                    if (newValue < end && end) {
                      setSnackbarMessage(
                        "La fecha y hora del evento no pueden ocurrir antes que el fin de su vigencia."
                      );
                      setSnackbarSeverity("error");
                      setSnackbarOpen(true);
                    } else {
                      setDate(newValue);
                    }
                  }}
                  slotProps={{
                    textField: {
                      InputProps: {
                        readOnly: true,
                        style: { fontSize: "0.875rem" },
                      },
                      InputLabelProps: {
                        style: { fontSize: "0.875rem" },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`h-auto rounded-2xl mt-6 ${
            !enableInscription
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600 transition duration-100"
          } relative hover:cursor-pointer`}
        >
          <div className="relative select-none flex flex-row h-[150px] items-center justify-center">
            <div
              className="bg-no-repeat bg-center bg-cover absolute right-[-40px] top-[-15px] bottom-0 w-1/2 transform"
              style={{
                backgroundImage: "url('/img/checklist.png')",
                transform: "rotate(5deg)",
                scale: "0.8",
              }}
            ></div>
            <div
              onClick={() => setEnableInscription(!enableInscription)}
              className="relative z-10 p-5"
            >
              <h1
                className="text-3xl tracking-tighter font-extrabold mb-2 text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
              >
                {enableInscription
                  ? "Deshabilitar inscripción"
                  : "Habilitar inscripción"}
              </h1>
              <p
                className="text-sm tracking-tighter font-bold text-white"
                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
              >
                {enableInscription &&
                  "Si la capacidad se deja en 0 o nula, el aforo será también ilimitado."}
                {!enableInscription &&
                  "Habilitar la inscripción permite a los usuarios registrarse en el evento y limitar el aforo de la actividad."}
              </p>
            </div>
            <div className="relative z-10 p-2">
              {enableInscription && (
                <Counter
                  number={capacity}
                  setNumber={setCapacity}
                  min={0}
                  max={10000}
                />
              )}
            </div>
          </div>
        </div>

        <div className="h-auto rounded-t-2xl mt-6 bg-gray-300 relative transition duration-100 overflow-hidden">
          <div className="relative h-full">
            <div className="relative p-4 z-10">
              <div className="flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <i
                    className="material-icons text-white text-4xl mr-2"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    {isPublic ? "public" : "lock"}
                  </i>
                  <h1
                    className="text-2xl tracking-tighter font-bold text-white"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    {isPublic ? "Evento Público" : "Evento Privado"}
                  </h1>
                </div>
                <FormControl className="flex justify-end">
                  <FormControlLabel
                    label={""}
                    control={
                      <Switch
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        name="isPublic"
                        color="primary"
                      />
                    }
                  />
                </FormControl>
              </div>
            </div>
          </div>
        </div>

        <div className="h-auto rounded-b-2xl bg-gray-200 relative transition duration-100 overflow-hidden">
          <div className="relative h-full">
            <div className="relative p-4 z-10">
              {isPublic ? (
                <p className="text-sm mt-1 mb-2">
                  {t.rich("Details.public.description", {
                    b: (chunks) => <b>{chunks}</b>,
                  })}
                </p>
              ) : (
                <>
                  <label className="text-sm font-bold mb-1">
                    Introduce tu código de invitación:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    className="border w-full mt-2 border-black rounded p-1 mb-1"
                  />
                  <p className="text-sm mt-1 mb-2">
                    {t.rich("Details.private.description", {
                      b: (chunks) => <b>{chunks}</b>,
                    })}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="h-auto rounded-t-2xl mt-6 bg-gray-300 relative transition duration-100 overflow-hidden">
          <div className="relative h-full">
            <div className="relative p-4 z-10">
              <div className="flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <i
                    className="material-icons text-white text-4xl mr-2"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    {!qr ? "tour" : "qr_code"}
                  </i>
                  <h1
                    className="text-2xl tracking-tighter font-bold text-white"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                  >
                    {!qr ? t("Details.tour.title") : t("Details.qr.title")}
                  </h1>
                </div>
                <FormControl>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={qr}
                        onChange={(e) => setQr(e.target.checked)}
                        name="qr"
                        color="primary"
                      />
                    }
                    label={""}
                  />
                </FormControl>
              </div>
            </div>
          </div>
        </div>

        <div className="h-auto rounded-b-2xl mb-6 bg-gray-200 relative transition duration-100 overflow-hidden">
          <div className="relative h-full">
            <div className="relative p-4 z-10">
              {!qr ? (
                <p className="text-sm mt-1 mb-2">
                  {t.rich("Details.tour.description", {
                    b: (chunks) => <b>{chunks}</b>,
                  })}
                </p>
              ) : (
                <>
                  <p className="text-sm mt-1 mb-2">
                    {t.rich("Details.qr.description", {
                      b: (chunks) => <b>{chunks}</b>,
                    })}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-auto rounded-2xl bg-gray-300 relative transition duration-100 overflow-hidden">
            <div className="relative h-full">
              <div className="relative p-4 z-10">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex items-center">
                    <h1
                      className="text-lg tracking-tighter font-bold text-white"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    >
                      {enableComments
                        ? "Comentarios Activados"
                        : "Comentarios Desactivados"}
                    </h1>
                  </div>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={enableComments}
                          onChange={(e) => setEnableComments(e.target.checked)}
                          name="enableComments"
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </FormControl>
                </div>
              </div>
            </div>
          </div>

          <div className="h-auto rounded-2xl bg-gray-300 relative transition duration-100 overflow-hidden">
            <div className="relative h-full">
              <div className="relative p-4 z-10">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex items-center">
                    <h1
                      className="text-lg tracking-tighter font-bold text-white"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    >
                      {enableRatings
                        ? "Valoraciones Activadas"
                        : "Valoraciones Desactivadas"}
                    </h1>
                  </div>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={enableRatings}
                          onChange={(e) => setEnableRatings(e.target.checked)}
                          name="enableRatings"
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className={
              "flex justify-center font-caveat font-bold " +
              "align-center w-full items-center text-3xl " +
              "bg-blue-500 text-white py-2 px-4 rounded-lg " +
              "hover:bg-blue-600 focus:outline-none " +
              "focus:ring-opacity-50"
            }
          >
            {loading ? t("loading") : t("upload")}
          </button>
        </div>
        <div className="flex justify-center mt-5">
          <h1 className="text-center"></h1>
        </div>
      </form>

      <Tags open={openTags} setOpen={setOpenTags} />
      <CpList open={openCp} setOpen={setOpenCp} />
    </div>
  );
};

export default CheckpointEvent;
