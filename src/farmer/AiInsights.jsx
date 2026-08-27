import React from 'react';

export default function AiInsights() {
  return (
    <div className="flex-1 p-margin_mobile md:p-margin_desktop pb-24 overflow-y-auto">
      {/* Header section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-1">
            AI Demand Forecast & Crop Intelligence
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Live ML predictive insights for agricultural markets, demand trends, and crop planning in West Bengal.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#102F31] border border-primary/30 px-3 py-1.5 rounded-full shrink-0">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-label-sm font-label-sm text-primary font-bold">
            Live Streamlit Model
          </span>
        </div>
      </div>

      {/* Embedded Streamlit Application */}
      <div className="streamlit-iframe-wrapper">
        <iframe
          src="https://kisandirect-ai-demand-forcasting-26.streamlit.app/?embed=true"
          title="KisanDirect AI Demand Forecasting"
          className="streamlit-iframe"
          allow="geolocation; microphone; camera"
        />
      </div>
    </div>
  );
}
