import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function CricleProgress({ value }) {
  return (
    <div style={{ width: 80, height: 80 }}>
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={buildStyles({
          pathColor: "#4A6B4E",
          textColor: "#1A2E1C",
          trailColor: "#E5E7EB",
        })}
      />
    </div>
  );
}