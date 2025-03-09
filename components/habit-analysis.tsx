import { IHabitDocument } from "@/lib/db/models/Habit";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { DecayResponse } from "@/app/api/decay/route";
import { HabitInsightResponse } from "@/app/api/insights/route";
import { ChartBar, GitGraph, Lightbulb } from "lucide-react";

interface HabitAnalysisProps {
  habits: IHabitDocument[];
}

const HabitAnalysis: React.FC<HabitAnalysisProps> = (props) => {
  const { data, isPending, isFetched } = useQuery<DecayResponse>({
    queryKey: ["habit-analysis-decay", props.habits],
    queryFn: async () => {
      const response = await fetch("/api/decay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const {
    data: insightData,
    isPending: isInsightPending,
    isFetched: isInsightFetched,
  } = useQuery<HabitInsightResponse>({
    queryKey: ["habit-analysis-insight", props.habits],
    queryFn: async () => {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <>
      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Habit Decay Predictions */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ChartBar /> AI Habit Decay Predictions{" "}
              <div className="badge badge-secondary">AI Generated</div>
            </h2>
            <div className="mt-4 space-y-3">
              {isFetched &&
                data?.decayRisk.map((risk, index) => (
                  <div
                    className="p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                    key={index}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: "black" }}
                        ></div>
                        <span className="font-medium">{risk.habitName}</span>
                      </div>
                      <span
                        className={`badge ${
                          risk.riskLevel === "High"
                            ? "badge-error"
                            : risk.riskLevel === "Medium"
                            ? "badge-warning"
                            : "badge-success"
                        }`}
                      >
                        {risk.riskLevel}
                      </span>
                    </div>

                    <div className="flex items-center w-full mb-1">
                      <progress
                        className="progress flex-1 mr-2"
                        value={risk.riskPercentage}
                        max="100"
                      ></progress>
                      <span className="text-xs font-medium">
                        {risk.riskPercentage}%
                      </span>
                    </div>

                    {risk.recommendation && (
                      <div className="mt-2 p-2 bg-primary/10 rounded border-l-2 border-primary text-xs">
                        <strong>💡 Recommendation:</strong>{" "}
                        {risk.recommendation}
                      </div>
                    )}
                  </div>
                ))}
              {isPending && (
                <div className="flex flex-col items-center justify-center p-4 bg-base-200 rounded-lg">
                  <div className="flex justify-center items-center py-6">
                    <span className="loading loading-spinner loading-md"></span>
                    <span className="ml-2 text-sm font-medium">
                      Analyzing habits...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Habit Insights */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-6">
            <h2 className="flex text-xl font-semibold gap-2">
              <Lightbulb /> AI Habit Insights{" "}
              <div className="badge badge-secondary">AI Generated</div>
            </h2>
            <div className="mt-4">
              {isInsightFetched && insightData?.recommendations && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-3">
                  <p className="text-sm">
                    <strong>📊 {insightData.recommendations}</strong>
                  </p>
                </div>
              )}
              {isInsightPending && (
                <div className="flex items-center justify-center p-4 bg-base-200 rounded-lg">
                  <span className="loading loading-spinner loading-md"></span>
                  <span className="ml-2 text-sm font-medium">
                    Generating insights...
                  </span>
                </div>
              )}
            </div>
            {isInsightFetched && insightData && (
              <div className="stats shadow mt-4">
                <div className="stat">
                  <div className="stat-title">Your Success Rate</div>
                  <div className="stat-value">
                    {Math.round(insightData.successRate)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HabitAnalysis;
