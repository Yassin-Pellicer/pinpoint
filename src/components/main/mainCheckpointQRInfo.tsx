"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useCheckpoints } from "../../utils/context/ContextCheckpoint";
import { useTranslations } from "next-intl";
import { QRCode } from "react-qrcode-logo";

const Quill = dynamic(() => import("react-quill"), { ssr: false });

const CheckpointInfo = ({ id, checkpoint, eventId }) => {
  const [name, setName] = useState(checkpoint?.name || "");
  const [description, setDescription] = useState(checkpoint?.description || "");

  const t = useTranslations("CpInfo");

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="flex items-center justify-center w-12 mr-4 h-12 bg-blue-400 shrink-0 text-white rounded-full cursor-pointer">
          <h1 className="flex text-xl font-extrabold cursor-pointer">
            {checkpoint.order}
          </h1>
        </div>
        <div className="max-w-[300px] cursor-pointer">
          <h1 className="font-bold break-words">{checkpoint.name}</h1>
          <p className="flex text-xs items-center">
            <span className="material-icons text-sm mr-2">location_on</span>
            {checkpoint.marker.position[0]}, {checkpoint.marker.position[1]}
          </p>
          <p className="flex text-xs items-center">
            <span className="material-icons text-sm mr-2">location_city</span>
            {checkpoint.address}
          </p>
        </div>
        <div className="ml-auto">
          <p className="material-icons text-2xl">tour</p>
        </div>
      </div>
      <div className="rounded-3xl border-blue-500 border-4 items-center p-4 mx-8 my-4 flex justify-center">
        <div className="w-full max-w-[400px]">
          <QRCode
            value={`${process.env.NEXT_PUBLIC_BASEURL}/main/checkpoint/${eventId}/${checkpoint.code}`}
            size={400} // Let it fill the container
            style={{ width: "100%", height: "auto" }} // Responsive sizing
            qrStyle="fluid"
            logoImage="/svg/logo_btn.svg"
            logoWidth={125}
            logoHeight={50}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckpointInfo;
