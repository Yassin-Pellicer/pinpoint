import MainMap from "../../components/main/mainMap";

export default function Layout({ children }) {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col overflow-auto shrink-0 bg-white h-screen px-6 w-[550px]">
        {children}
      </div>
      <MainMap />
    </div>
  );
}
