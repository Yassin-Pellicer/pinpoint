import { Slider, FormControl, FormControlLabel, Switch } from "@mui/material";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import dynamic from "next/dynamic";
import Quill from "quill";

const CheckpointEvent = () => {
  const [qr, setQr] = useState(false);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [expand, setExpand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [difficulty, setDifficulty] = useState(50);
  const [editorContent, setEditorContent] = useState("");

  const t = useTranslations("Create");

  const Quill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  return (
    <div className="mb-6 rounded-2xl bg-[#ffffff] px-2 pt-6">
      <form className="flex flex-col px-3 w-full">
        <h1 className="text-4xl mb-2 tracking-tight font-caveat font-bold">
          {t("Details.creation")}
        </h1>

        <p className="text-sm mt-1 mb-4">
          {t.rich("Details.internet", {
            b: (chunks) => <b>{chunks}</b>,
          })}
        </p>

        <label className="font-bold">{t("Details.title")}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="border border-black rounded p-1 mb-3"
        />
        <label className="mb-1">{t("Details.description")}</label>
        <Quill
          value={editorContent}
          onChange={setEditorContent}
          style={{ height: "200px" }}
        />

        {/* Difficulty slider */}
        <label className="mt-16 text-lg">
          {t("Details.difficulty")}
          <span className="font-bold">{difficulty}</span>
        </label>
        <Slider
          value={difficulty}
          min={1}
          max={100}
          step={1}
          onChange={(e, value) => setDifficulty(value as number)}
        />

        <div className="flex justify-between mt-4 flex-row">
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
              label={qr ? t("Details.qr.title") : t("Details.tour.title")}
            />
          </FormControl>

          <FormControl className="ml-4">
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

        {qr ? (
          <p className="text-sm mt-1 mb-6">
            {t.rich("Details.qr.description", {
              b: (chunks) => <b>{chunks}</b>,
            })}
          </p>
        ) : (
          <p className="text-sm mt-1 mb-6">
            {t.rich("Details.tour.description", {
              b: (chunks) => <b>{chunks}</b>,
            })}
          </p>
        )}

        {isPublic ? (
          <p className="text-sm mt-1 mb-6">
            {t.rich("Details.public.description", {
              b: (chunks) => <b>{chunks}</b>,
            })}
          </p>
        ) : (
          <p className="text-sm mt-1 mb-6">
            {t.rich("Details.private.description", {
              b: (chunks) => <b>{chunks}</b>,
            })}
          </p>
        )}

        <button
          onClick={(e) => {
            setOpen(true);
            e.preventDefault();
          }}
          className="font-bold bg-transparent border-2 text-sm border-black 
            text-black rounded-xl p-2 hover:bg-blue-500
            hover:border-blue-500 hover:text-white 
            transition duration-300"
        >
          {t("Details.checkpoints")}
        </button>

        <div className="flex justify-center mt-5">
          <button
            className={
              "flex justify-center font-caveat font-bold " +
              "align-center w-full items-center text-3xl " +
              "bg-blue-500 text-white py-2 px-4 rounded-lg " +
              "hover:bg-blue-600 focus:outline-none " +
              "focus:ring-opacity-50"
            }
          >
            {loading ? t("Details.loading") : t("Details.upload")}
          </button>
        </div>
        <div className="flex justify-center mt-5">
          <h1 className="text-center"></h1>
        </div>
      </form>
    </div>
  );
};

export default CheckpointEvent;
