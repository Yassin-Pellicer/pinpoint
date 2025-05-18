import {
  Slider,
  FormControl,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Box,
  Modal,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import Tags from "./tags";
import dynamic from "next/dynamic";
import { useEvent } from "../../utils/context/ContextEvent";
import fileURL from "../../utils/funcs/createUrlImage";
import { createEventHook } from "../../hooks/create/addEventHook";
import { useRouter } from "next/navigation";
import Logo from "../ui/logo";
import Counter from "../ui/counter";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useSession } from "../../utils/context/ContextSession";
import { useCheckpoints } from "../../utils/context/ContextCheckpoint";
import CpList from "./cpEv/createCheckpointList";
import { addCheckpointsHook } from "../../hooks/create/addCheckpointsHook";
import { Tag } from "../../utils/classes/Tag";
import Quill from "react-quill";
import { getEventCode } from "../../hooks/general/privateEventsHook";
const SimpleEvent = () => {
  const {
    event,
    name,
    setName,
    description,
    setDescription,
    isPublic,
    setIsPublic,
    banner,
    setBanner,
    qr,
    setQr,
    tags,
    enableComments,
    setEnableComments,
    enableRatings,
    setEnableRatings,
    enableInscription,
    setEnableInscription,
    capacity,
    setCapacity,
    start,
    setStart,
    end,
    setEnd,
    date,
    setDate,
    code,
    setCode,
    setTags
  } = useEvent();
  const [loading, setLoading] = useState(false);
  const [openTags, setOpenTags] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const { user, createType } = useSession();

  const router = useRouter();
  const { checkpoints, setCheckpoints } = useCheckpoints();
  const [openCp, setOpenCp] = useState(false);

  const t = useTranslations("Create");
  const tagsTrans = useTranslations("Tags");

  const handleTagSelection = (tagId) => {
    const selected = tags.filter((tag) => tag.tag_id !== tagId);
    setTags(selected);
  };

  useEffect(() => {
    if (tags != null) {
      const selected = Tag.tags.filter((tag) => tags[tag.tag_id]);
      setTags(selected);
    }
  }, []);

  const generateRandomAsciiCode = (length: number) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  useEffect(() => {
    getEventCode(event.id).then((res) => {
      console.log(res);
      if (!res || res.code === "") {
        setCode(generateRandomAsciiCode(20));
      } else {
        setCode(res.code);
      }
    })
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let data = event;
    if (createType === "simple") {
      data.qr = false;
    }
    try {
      const result = await createEventHook(data, user.id, code);
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
      } else if (createType === "checkpoints") {
        await addCheckpointsHook({ eventId: result.id, data: checkpoints });
      }
      router.push("/main/event/" + result.id);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Something went wrong!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white">
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

      <form className="flex flex-col w-full" onSubmit={handleSubmit}>
        <div className="h-auto bg-white  overflow-hidden border-b-[1px] border-gray-300">
          <div className="relative p-5 z-10">
            <div className="flex flex-row items-center ">
              <h1 className="text-2xl tracking-tighter font-bold text-black">
                Imagen de tu evento
              </h1>
            </div>
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
          <div className="flex flex-col justify-center items-center">
            {banner ? (
              <div className="cursor-pointer relative flex justify-end items-center w-full h-15 overflow-hidden border-b border-gray-300">
                <img
                  src={banner}
                  className="w-full h-full object-cover"
                  alt="banner"
                />
              </div>
            ) : (
              <div className="flex flex-col cursor-pointer justify-center items-center w-full h-15 p-14 bg-[#e6e6e6] border-b border-gray-300 hover:bg-[#d6d6d6] transition duration-200">
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

        <div className="h-auto bg-white overflow-hidden border-b-[1px] border-gray-300">
          <div className="flex flex-row items-center p-5 z-10">
            <h1 className="text-2xl tracking-tighter font-bold text-black">
              {t("Details.title")}
            </h1>
          </div>
        </div>

        <input
          type="text"
          value={name}
          placeholder="Escribe tu Título aquí..."
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="border-b-[1px] bg-gray-100 border-gray-300 px-6 py-2 text-lg hover:bg-gray-200 transition duration-200"
        />

        <div className="flex flex-row items-center p-5 z-10 ">
          <h1 className="text-2xl tracking-tighter font-bold text-black">
            {t("Details.description")}
          </h1>
        </div>
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
          className="font-bold bg-transparent mt-[16px] border-b-[1px] text-sm border-gray-300 
          text-black p-2 hover:bg-blue-500
          hover:border-blue-500 hover:text-white 
          transition duration-300"
        >
          {t("Details.setTags")}
        </button>

        {createType !== "simple" && (
          <button
            onClick={(e) => {
              setOpenCp(true);
              e.preventDefault();
            }}
            className="font-bold bg-transparent border-b-[1px] text-sm border-gray-300 
            text-black p-2 hover:bg-blue-500
            hover:border-blue-500 hover:text-white 
            transition duration-300"
          >
            {t("Details.checkpoints")}
          </button>
        )}

        {tags.length > 0 && (
          <div>
            <div className="px-4 mt-3 pb-3 flex flex-wrap w-full gap-2 border-b-[1px] border-gray-300">
              {tags.map((tag) => (
                <div
                  onClick={() => handleTagSelection(tag.tag_id)}
                  key={tag.tag_id}
                  className={`rounded-full select-none cursor-pointer w-fit px-2 py-1 text-center
               text-white bg-[#3F7DEA] font-bold tracking-tight"
            }`}
                >
                  <p className="text-xs">
                    <i className="material-icons text-xs mr-1">{tag.icon}</i>
                    {tagsTrans(`${tag.tag_id}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-row items-center p-5 z-10 border-b-[1px] border-gray-300 ">
          <h1 className="text-2xl tracking-tighter font-bold text-black">
            Vigencia y Fecha
          </h1>
        </div>
        <div className="h-auto bg-gray-300 relative transition duration-100 overflow-hidden">
          <div className="relative h-full">
            <div className="relative p-4 z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <div
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    className="flex flex-row mb-2 items-center"
                  >
                    <i className="material-icons text-white text-2xl mr-2">
                      timer
                    </i>
                    <h1 className="text-white tracking-tigher font-bold">
                      Inicio de vigencia
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
                      Fin de vigencia
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
                  <h1 className="text-white text-lg tracking-tighter font-bold">
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
          className={`h-auto ${
            !enableInscription
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600 transition duration-100"
          } relative hover:cursor-pointer`}
        >
          <div className="relative select-none flex flex-row h-[150px] items-center justify-center">
            <div
              className="bg-no-repeat bg-center bg-cover absolute right-[-40px] top-[-5px] bottom-0 w-1/2 transform"
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

        <div className="h-auto bg-gray-300 relative transition duration-100 overflow-hidden">
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

        <div className="h-auto bg-gray-200 relative transition duration-100 overflow-hidden">
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
                  <div className="flex flex-row items-center justify-between">
                    <label className="text-sm font-bold mb-1">
                      Este es tu código de invitación:
                    </label>
                    <button
                      className="hover:bg-gray-300 transition duration-100 rounded-full p-1"
                      onClick={(e) => {
                        e.preventDefault();
                        setCode(generateRandomAsciiCode(20))
                      }}
                    >
                      <i className="material-icons text-black text-xl">
                        refresh
                      </i>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={code}
                    className="border w-full mt-2 border-black rounded p-1 mb-1"
                    readOnly
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

        {createType != "simple" && (
          <>
            <div className="h-auto bg-gray-300 relative transition duration-100 overflow-hidden">
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
            <div className="h-auto bg-gray-200 relative transition duration-100 overflow-hidden">
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
          </>
        )}

        <div className="grid grid-cols-2">
          <div className="h-auto border-r-[1px] border-gray-400 bg-gray-300 relative transition duration-100 overflow-hidden">
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

          <div className="h-auto bg-gray-300 relative transition duration-100 overflow-hidden">
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
            className={
              "flex justify-center font-caveat font-bold " +
              "align-center w-full items-center text-5xl " +
              "bg-blue-500 text-white py-6 px-4 " +
              "hover:bg-blue-600 focus:outline-none " +
              "focus:ring-opacity-50"
            }
            type="submit"
          >
            {loading ? t("loading") : t("upload")}
          </button>
        </div>
      </form>
      <CpList open={openCp} setOpen={setOpenCp} />
      <Tags open={openTags} setOpen={setOpenTags} filterMode={false} />
    </div>
  );
};

export default SimpleEvent;
