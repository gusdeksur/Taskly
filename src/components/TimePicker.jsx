
import { useEffect, useRef } from "react";

const ITEM_HEIGHT = 40;

function WheelColumn({ label, options, value, onChange }) {
    const columnRef = useRef(null);

    const initialIndex = useRef(
        Math.max(options.indexOf(value), 0)
    );

    useEffect(() => {
        if (columnRef.current) {
            columnRef.current.scrollTop =
                initialIndex.current * ITEM_HEIGHT;
        }
    }, []);

    const handleScroll = (event) => {
        const index = Math.max(
            0,
            Math.min(
                options.length - 1,
                Math.round(
                    event.currentTarget.scrollTop / ITEM_HEIGHT
                )
            )
        );

        const selectedValue = options[index];

        if (selectedValue && selectedValue !== value) {
            onChange(selectedValue);
        }
    };

    return (
        <div className="min-w-0 flex-1">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-textMuted">
                {label}
            </p>

            <div className="relative">
                <div
                    ref={columnRef}
                    onScroll={handleScroll}
                    role="listbox"
                    aria-label={label}
                    className="h-40 overflow-y-auto overscroll-contain snap-y snap-mandatory rounded-xl bg-gray-50 text-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    <div aria-hidden="true" className="h-[60px]" />

                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            role="option"
                            aria-selected={value === option}
                            onClick={() => {
                                const index = options.indexOf(option);

                                columnRef.current?.scrollTo({
                                    top: index * ITEM_HEIGHT,
                                    behavior: "smooth",
                                });

                                onChange(option);
                            }}
                            className={`flex h-10 w-full snap-center items-center justify-center text-lg transition-colors ${
                                value === option
                                    ? "font-extrabold text-primary"
                                    : "font-medium text-gray-400"
                            }`}
                        >
                            {option}
                        </button>
                    ))}

                    <div aria-hidden="true" className="h-[60px]" />
                </div>

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-2 right-2 top-1/2 h-10 -translate-y-1/2 rounded-lg border-y-2 border-primary/20 bg-primary/5"
                />
            </div>
        </div>
    );
}

function TimePicker({ value, onChange }) {
    const safeValue =
        /^\d{2}:\d{2}$/.test(value || "")
            ? value
            : "09:00";

    const [hours, minutes] = safeValue.split(":");

    const hourOptions = Array.from(
        { length: 24 },
        (_, index) => String(index).padStart(2, "0")
    );

    const minuteOptions = Array.from(
        { length: 60 },
        (_, index) => String(index).padStart(2, "0")
    );

    const handleHourChange = (hour) => {
        onChange(`${hour}:${minutes}`);
    };

    const handleMinuteChange = (minute) => {
        onChange(`${hours}:${minute}`);
    };

    return (
        <div className="rounded-xl border border-gray-200 p-4">
            <div className="mb-4">
                <p className="font-semibold text-gray-800">
                    Waktu deadline
                </p>

                <p className="mt-1 text-xs text-textMuted">
                    Gulir kolom jam dan menit untuk memilih waktu.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <WheelColumn
                    label="Jam"
                    options={hourOptions}
                    value={hours}
                    onChange={handleHourChange}
                />

                <span className="mt-6 text-2xl font-extrabold text-gray-700">
                    :
                </span>

                <WheelColumn
                    label="Menit"
                    options={minuteOptions}
                    value={minutes}
                    onChange={handleMinuteChange}
                />
            </div>

            <p className="mt-4 text-center text-sm text-textMuted">
                Deadline pukul{" "}
                <span className="font-bold text-primary">
                    {hours}:{minutes}
                </span>
            </p>
        </div>
    );
}

export default TimePicker;
