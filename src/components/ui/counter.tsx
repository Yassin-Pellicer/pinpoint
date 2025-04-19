import { useRef } from "react";

export default function Counter({ number, setNumber, min, max }) {
  const inputRef = useRef();

  const handleKeyDown = (e) => {
    const allowedKeys = [
      'Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'
    ];
    if (
      allowedKeys.includes(e.key) ||
      (e.ctrlKey || e.metaKey)
    ) {
      return;
    }

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const val = e.target.value.replace(/\D/g, '');
    const num = Math.min(max, Math.max(min, Number(val || min)));
    setNumber(num);
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full p-3 bg-gray-300 hover:bg-gray-400 font-bold text-2xl"
        onClick={(e) => { e.preventDefault(); setNumber(Math.max(min, number - 1))}}
      >
        -
      </button>
      <input
        ref={inputRef}
        className="w-20 h-10 text-center rounded-xl p-3 bg-gray-300 text-2xl border-none focus:outline-none"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={number}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full p-3 bg-gray-300 hover:bg-gray-400 font-bold text-2xl"
        onClick={(e) => { e.preventDefault(); setNumber(Math.min(max, number + 1))}}
      >
        +
      </button>
    </div>
  );
}
