import { useState, useEffect } from 'react';

export default function EventTimeDisplay({ event, listMode }) {
  const [progress, setProgress] = useState(0);
  const [timeLeftText, setTimeLeftText] = useState("");
  const [progressColor, setProgressColor] = useState("bg-green-400");

  // Format date for display
  const formatDisplay = (date) => {
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate time remaining and progress
  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();
      const start = new Date(event?.start);
      const end = new Date(event?.end);

      const totalDuration = end.getTime() - start.getTime();
      const elapsedTime = now.getTime() - start.getTime();

      // Cap progress at 100%
      let calculated = Math.floor((elapsedTime / totalDuration) * 100);
      calculated = Math.min(calculated, 100);
      calculated = Math.max(calculated, 0); // Also prevent negative values

      setProgress(calculated);

      // Calculate remaining time
      if (calculated >= 100) {
        // If we've reached 100%, set "0m restantes"
        setTimeLeftText("0m restantes");
      } else {
        const timeLeft = end.getTime() - now.getTime();
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

        let timeLeftString = "";
        if (days > 0) timeLeftString += `${days}d `;
        if (hours > 0 || days > 0) timeLeftString += `${hours}h `;
        timeLeftString += `${minutes}m restantes`;

        setTimeLeftText(timeLeftString);
      }

      // Set color based on progress
      if (calculated >= 100) {
        setProgressColor("bg-red-500");
      } else if (calculated >= 80) {
        setProgressColor("bg-red-500");
      } else if (calculated >= 50) {
        setProgressColor("bg-orange-400");
      } else {
        setProgressColor("bg-green-400");
      }
    };

    calculateProgress();
    const timer = setInterval(calculateProgress, 60000);

    return () => clearInterval(timer);
  }, [event]);

  return (
    <div className={`h-auto ${!listMode && "bg-purple-500"}`}>
      <div className="relative h-full">
        <div className={`relative ${listMode ? "p-0" : "p-4"} z-10`}>
          {!listMode && <div className="grid grid-cols-2 gap-4">
            {event.start &&
              <div className="flex flex-col w-full">
                <div className="flex flex-row mb-2 items-center">
                  <div className="text-white text-2xl mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-white tracking-tight font-bold text-md">
                    Inicio de Inscripción
                  </h1>
                </div>
                <input
                  type="text"
                  value={formatDisplay(new Date(event.start))}
                  readOnly
                  className="rounded-lg p-2 bg-white bg-opacity-90 text-gray-800 text-sm w-full focus:outline-none"
                />
              </div>
            }
            {event.end &&
              <div className="flex flex-col">
                <div className="flex flex-row mb-2 items-center">
                  <div className="text-white text-2xl mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h1 className="text-white tracking-tight font-bold text-md">
                    Fin de Inscripción
                  </h1>
                </div>
                <input
                  type="text"
                  value={formatDisplay(new Date(event.end))}
                  readOnly
                  className="rounded-lg p-2 bg-white bg-opacity-90 text-gray-800 text-sm w-full focus:outline-none"
                />
              </div>
            }
          </div>
          }

          <div className="mt-4 no-print">
            {(!listMode && event.end && event.start) ?
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-white">
                  Tiempo restante
                </span>
                <span className="text-xs font-medium text-white">
                  {progress}%
                </span>
              </div>
            :
              ((new Date(event.end) <= new Date()) && <div className="flex justify-between items-center mb-1">
                <span className="text-md font-medium text-white mb-2">
                  Inscripción de evento finalizada
                </span>
              </div>)
            }

            {(!listMode && event.end && event.start) &&
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`${progressColor} h-2.5 rounded-full transition-all duration-500 ease-in-out`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            }
            <div className="mt-2 text-center">
              <span className="text-sm font-bold text-white bg-blue-800 bg-opacity-40 px-3 py-1 rounded-full">
                {timeLeftText}
              </span>
            </div>
          </div>

          {listMode && <div className="no-print">

            <div className="w-full bg-gray-200 rounded-full mt-4 h-2.5">
              <div
                className={`${progressColor} h-2.5 rounded-full transition-all duration-500 ease-in-out`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}