import { Slider, FormControl, FormControlLabel, Switch, Snackbar, Alert, Box, Modal, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import Tags from "../tags";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useEvent } from "../../../utils/context/eventContext";
import fileURL from "../../../utils/funcs/createUrlImage";
import { createEventHook } from "../../../hooks/create/addEventHook";
import { addTagsHook } from "../../../hooks/create/addTagsHook";
import SnackbarContent from '@mui/material/SnackbarContent';
import { addCheckpointsHook } from "../../../hooks/create/addCheckpointsHook";
import { useRouter } from 'next/navigation';
import Logo from "../../ui/logo";

const SimpleEvent = () => {
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
    author,
    setAuthor,
    comments,
    setComments,
    enableComments,
    setEnableComments,
    enableRatings,
    setEnableRatings,
  } = useEvent();

  const [loading, setLoading] = useState(false);
  const [openCp, setOpenCp] = useState(false);
  const [openTags, setOpenTags] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const router = useRouter();
  
  const t = useTranslations("Create");
  const tagsTrans = useTranslations("Tags");

  const Quill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await createEventHook(event);
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
        await addTagsHook({ eventId: result.id, data: tags });

        setSnackbarMessage(t("successNotif"));
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Something went wrong!");
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
          <h1 className="text-4xl tracking-tight font-caveat font-bold">
            {t("Details.creation")}
          </h1>
          {/* <i className="material-icons">lock</i> */}
          {isPublic && <i className="material-icons">public</i>}
          {!isPublic && <i className="material-icons">lock</i>}
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

        <div className="flex justify-between mt-8 flex-row">
          <FormControl className="">
            <FormControlLabel
              label={
                isPublic
                  ? t("Details.public.title")
                  : t("Details.private.title")
              }
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

        {!isPublic ? (
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
              className="border border-black rounded p-1 mb-1"
            />
            <p className="text-sm mt-1 mb-2">
              {t.rich("Details.private.description", {
                b: (chunks) => <b>{chunks}</b>,
              })}
            </p>
          </>
        ) : (
          <p className="text-sm mt-1 mb-2">
            {t.rich("Details.public.description", {
              b: (chunks) => <b>{chunks}</b>,
            })}
          </p>
        )}

        <div className="flex justify-between">
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
              label="Permitir Comentarios"
            />
          </FormControl>

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
              label="Permitir Valoraciones"
            />
          </FormControl>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap w-full mb-4 gap-2">
            {tags.map((tag) => (
              <div
                key={tag.name}
                className={`rounded-md w-fit p-[10px] py-2 text-center
                 text-white bg-[#3F7DEA] font-bold tracking-tight text-white"
              }`}
              >
                {tagsTrans(`${tag.name}`)}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={(e) => {
            setOpenTags(!openTags);
            e.preventDefault();
          }}
          className="font-bold bg-transparent border-2 text-sm border-black 
            text-black rounded-xl p-2 hover:bg-blue-500
            hover:border-blue-500 hover:text-white 
            transition duration-300 mb-4 mt-4"
        >
          {t("Details.setTags")}
        </button>

        <div className="flex justify-center">
          <button
            className={
              "flex justify-center font-caveat font-bold " +
              "align-center w-full items-center text-3xl " +
              "bg-blue-500 text-white py-2 px-4 rounded-lg " +
              "hover:bg-blue-600 focus:outline-none " +
              "focus:ring-opacity-50"
            }
            type="submit"
          >
            {loading ? t("loading") : t("upload")}
          </button>
        </div>
        <div className="flex justify-center mt-5">
          <h1 className="text-center"></h1>
        </div>
      </form>

      <Tags open={openTags} setOpen={setOpenTags} parentTags={undefined} setParentTags={undefined} />
    </div>
  );
};

export default SimpleEvent;

