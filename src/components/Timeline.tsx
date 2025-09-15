import React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getDiffBetweenDates } from "../utils/dates";
dayjs.extend(customParseFormat);

export function Timeline({ request }) {
  const { submissionDate, planningClosureDate, stage, status, delay } = request;

  const today = dayjs().startOf("day");
  const submission = dayjs(submissionDate, "DD/MM/YYYY");
  const planned = dayjs(planningClosureDate, "DD/MM/YYYY");
  const plannedPassed = status === "Delayed";

  // Calculate position for middle step based on time progress
  const totalDays = planned.diff(submission, 'day');
  const daysPassed = today.diff(submission, 'day');
  const progressPercent = Math.max(0, Math.min(100, (daysPassed / totalDays) * 100));
  
  // Initialize variables
  let marginClass, firstConnectorWidth, secondConnectorWidth, connectorAdjustment;
  
  // Determine position with 5 possible positions: 20%, 35%, 50%, 65%, 80%
  if (progressPercent <= 20) {
    // Position 1: 20% (Early - close to start)
    marginClass = "mr-24"; // Move left significantly
    firstConnectorWidth = "w-[calc(100%-6rem)]";
    secondConnectorWidth = "w-[calc(100%+6rem)]";
    connectorAdjustment = "-ml-24";
  } else if (progressPercent <= 40) {
    // Position 2: 35% (Early-Mid)
    marginClass = "mr-12"; // Move left moderately
    firstConnectorWidth = "w-[calc(100%-3rem)]";
    secondConnectorWidth = "w-[calc(100%+3rem)]";
    connectorAdjustment = "-ml-12";
  } else if (progressPercent <= 60) {
    // Position 3: 50% (Center)
    marginClass = ""; // Stay center
    firstConnectorWidth = "w-full";
    secondConnectorWidth = "w-full";
    connectorAdjustment = "";
  } else if (progressPercent <= 80) {
    // Position 4: 65% (Mid-Late)
    marginClass = "ml-12"; // Move right moderately
    firstConnectorWidth = "w-[calc(100%+3rem)]";
    secondConnectorWidth = "w-[calc(100%-3rem)]";
    connectorAdjustment = "";
  } else {
    // Position 5: 80% (Late - close to end)
    marginClass = "ml-24"; // Move right significantly
    firstConnectorWidth = "w-[calc(100%+6rem)]";
    secondConnectorWidth = "w-[calc(100%-6rem)]";
    connectorAdjustment = "";
  }

  // Build dynamic stages
  let stages = [
    { name: "Submission", date: submission, state: "done" },
  ];

  if (!plannedPassed) {
    stages.push({ name: stage, date: today, state: "current" });
    stages.push({ name: "Planned Closure", date: planned, state: "pending" });
  } else {
    stages.push({ name: "Planned Closure", date: planned, state: "delayed" });
    stages.push({ name: stage, date: today, state: "delayed-current" });
  }

  function connectorLabel(prev, next) {
    if (!prev.date || !next.date) return null;
    return getDiffBetweenDates(dayjs(next.date, "DD/MM/YYYY"), dayjs(prev.date, "DD/MM/YYYY"));
  }

  return (
    <ul className="timeline w-full flex justify-between relative">
      {stages.map((step, idx) => {
        const notLast = idx < stages.length - 1;
        const isMiddle = idx === 1; // Middle item (index 1)
  
        // circle / line colors
        let circleClass = "bg-gray-300 text-gray-600";
        let icon = "";
        let connectorClass = "bg-gray-300";
  
        if (step.state === "done") {
          circleClass = "bg-green-500 text-white";
          icon = "✓";
          connectorClass = "bg-green-500";
        } else if (step.state === "pending") {
          circleClass = "bg-gray-300 text-gray-600";
        } else if (step.state === "delayed") {
          circleClass = "bg-red-500 text-white";
          icon = "!";
          connectorClass = "bg-red-500";
        } else if (step.state === "current") {
          circleClass = "bg-purple-600 text-white animate-pulse";
          icon = "⏳";
          connectorClass = "bg-purple-600";
        } else if (step.state === "delayed-current") {
          circleClass = "bg-red-600 text-white animate-pulse";
          icon = "⚠";
          connectorClass = "bg-red-500";
        }
  
        return (
          <li key={idx} className={`flex-1 relative flex flex-col items-center ${isMiddle ? marginClass : ''}`}>
            {/* connector to next step */}
            {notLast && (
              <div className={`absolute top-1/2 w-full -translate-y-1/2 ${idx === 0 ? 'left-1/2' : `left-1/2 ${connectorAdjustment}`}`}>
                <div className={`h-0.5 ${connectorClass} ${idx === 0 ? firstConnectorWidth : ''} ${idx === 1 ? secondConnectorWidth : ''}`} />
              </div>
            )}
  
            {/* alternating layout */}
            {idx % 2 === 0 ? (
              <div className="timeline-start flex flex-col items-center mb-2">
                <div className="font-medium">{step.name}</div>
                {step.date && (
                  <div className="text-xs text-gray-500">
                    {step.date.format("DD/MM/YYYY")}
                  </div>
                )}
              </div>
            ) : null}
  
            {/* Circle */}
            <div className="timeline-middle z-10">
              <div
                className={`h-6 w-6 flex items-center justify-center rounded-full ${circleClass}`}
              >
                {icon}
              </div>
            </div>
  
            {idx % 2 === 1 ? (
              <div className="timeline-end flex flex-col items-center mt-2">
                <div className="font-medium">{step.name}</div>
                {step.date && (
                  <div className="text-xs text-gray-500">
                    {step.date.format("DD/MM/YYYY")}
                  </div>
                )}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}