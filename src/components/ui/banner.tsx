
export default function Banner() {
return (
  <div className="mb-6 rounded-2xl bg-white">
    <div className="relative w-full">
      <div
        className="w-full h-[200px] bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: "url(/img/dana.png)" }}
      />

      <div className="flex flex-row absolute ml-[75px] transform -translate-x-1/2 top-[130px] z-20">
        <div className="w-[125px] h-[125px] rounded-full overflow-hidden border-4 border-white">
          <img
            src="/img/dana.png"
            alt="Profile Picture"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between w-full px-6 pb-6 rounded-b-2xl h-[fit] z-10 bg-gray-300">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col pt-[60px] ">
            <h2
              className="text-white text-3xl font-bold mr-5"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
            >
              username
            </h2>
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-[40px] mt-4 px-4 rounded-full">
            Seguir
          </button>
        </div>
        <div className="flex flex-col justify-between w-full py-2">
          <p className="text-sm text-gray-600 tracking-tighter pb-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
            amet nulla auctor, vestibulum magna sed, convallis ex. Cum sociis
            natoque penatibus.
          </p>
          <div className="flex flex-row">
            <p className="text-sm text-gray-600 mr-2">
              <span className="font-bold">Siguiendo:</span> 21
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-bold">Seguidores:</span> 324
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}