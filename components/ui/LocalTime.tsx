"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timezone,
  hour: "2-digit",
  minute: "2-digit",
});

/** Current time where Razin is. Renders a placeholder on the server to avoid a hydration mismatch. */
export default function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums">{time ?? "--:--"} local time</span>;
}
