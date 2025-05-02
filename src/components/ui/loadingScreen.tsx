import Logo from "./logo";

export default function LoadingScreen() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-blue-500 z-50 flex justify-center items-center">
      <div className="animate-spin rounded-full h-[400px] w-[400px] border-b-8 border-white m-auto" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="mb-5">
          <Logo />
        </div>
      </div>
    </div>
    )
}