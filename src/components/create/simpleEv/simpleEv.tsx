import { Slider, FormControl, FormControlLabel, Switch } from "@mui/material";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import dynamic from "next/dynamic";
import Quill from "quill";
import { useEvent } from "../../../utils/context/eventContext";
import fileURL from "../../../utils/funcs/createUrlImage";

const SimpleEvent = () => {
  const {
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
  } = useEvent();

  const [loading, setLoading] = useState(false);

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

        <input accept="image/*" id="image" type="file" hidden onChange={(e) => fileURL(e, (url) => setBanner(url))}/>
        <label htmlFor="image">
          <div className="flex flex-col justify-center items-center mt-4 mb-4">
            {banner ? (
              <img
                src={banner}
                className="flex justify-center items-center w-full h-15 mb-2 rounded-2xl"
                alt="banner"
              />
            ) : (
              <div className="flex justify-center items-center w-full h-15 mb-2 rounded-2xl p-20 bg-[#e6e6e6] border border-gray-400">
                <i className="text-gray-400 material-icons mr-1 text-8xl">
                  image
                </i>
              </div>
            )}
            <p className="font-caveat text-2xl tracking-tighter">{t("pic")}</p>
          </div>
        </label>

        <p className="text-sm mt-1 mb-4">
          {t.rich("Details.internetSimple", {
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
          value={description}
          onChange={setDescription}
          style={{ height: "200px", marginBottom: "40px" }}
        />

        <div className="flex justify-between mt-4 flex-row">
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

        <div className="flex justify-center">
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

export default SimpleEvent;

