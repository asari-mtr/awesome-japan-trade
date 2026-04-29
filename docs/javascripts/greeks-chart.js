(() => {
  const PLOTLY_SRC = "https://cdn.plot.ly/plotly-2.35.2.min.js";

  function erf(x) {
    const sign = x < 0 ? -1 : 1;
    const ax = Math.abs(x);
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const t = 1 / (1 + p * ax);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
    return sign * y;
  }
  const normCdf = (x) => 0.5 * (1 + erf(x / Math.SQRT2));
  const normPdf = (x) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);

  function bsGreeks(S, K, T, r, q, sigma, isCall) {
    if (T <= 0 || sigma <= 0 || S <= 0 || K <= 0) {
      const intrinsicDelta = isCall ? (S > K ? 1 : 0) : (S < K ? -1 : 0);
      return { delta: intrinsicDelta, theta: 0 };
    }
    const sqrtT = Math.sqrt(T);
    const d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
    const d2 = d1 - sigma * sqrtT;
    const phi = normPdf(d1);
    const discR = Math.exp(-r * T);
    const discQ = Math.exp(-q * T);
    let delta, thetaAnnual;
    if (isCall) {
      delta = discQ * normCdf(d1);
      thetaAnnual = -S * discQ * phi * sigma / (2 * sqrtT)
        - r * K * discR * normCdf(d2)
        + q * S * discQ * normCdf(d1);
    } else {
      delta = -discQ * normCdf(-d1);
      thetaAnnual = -S * discQ * phi * sigma / (2 * sqrtT)
        + r * K * discR * normCdf(-d2)
        - q * S * discQ * normCdf(-d1);
    }
    return { delta, theta: thetaAnnual / 365 };
  }

  function loadPlotly() {
    if (window.Plotly) return Promise.resolve(window.Plotly);
    if (window.__plotlyLoading) return window.__plotlyLoading;
    window.__plotlyLoading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = PLOTLY_SRC;
      s.async = true;
      s.onload = () => resolve(window.Plotly);
      s.onerror = () => reject(new Error("Failed to load Plotly"));
      document.head.appendChild(s);
    });
    return window.__plotlyLoading;
  }

  function computeSeries(state) {
    const { K, sigma, dte, r, q, isCall, sMin, sMax, points } = state;
    const T = Math.max(dte, 0) / 365;
    const xs = new Array(points);
    const deltaArr = new Array(points);
    const thetaArr = new Array(points);
    const step = (sMax - sMin) / (points - 1);
    for (let i = 0; i < points; i++) {
      const S = sMin + i * step;
      const g = bsGreeks(S, K, T, r, q, sigma, isCall);
      xs[i] = S;
      deltaArr[i] = g.delta;
      thetaArr[i] = g.theta;
    }
    return { xs, deltaArr, thetaArr };
  }

  function darkMode() {
    return document.body.getAttribute("data-md-color-scheme") === "slate";
  }

  function plotLayout(state) {
    const dark = darkMode();
    const fg = dark ? "#e6e6e6" : "#222";
    const grid = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
    return {
      margin: { l: 60, r: 60, t: 30, b: 50 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { color: fg, family: "Roboto, sans-serif" },
      legend: { orientation: "h", x: 0, y: 1.12 },
      xaxis: {
        title: "原資産価格 S",
        gridcolor: grid,
        zerolinecolor: grid,
        range: [state.sMin, state.sMax],
      },
      yaxis: {
        title: "Delta",
        side: "left",
        range: state.isCall ? [-0.05, 1.05] : [-1.05, 0.05],
        gridcolor: grid,
        zerolinecolor: grid,
      },
      yaxis2: {
        title: "Theta (per day)",
        overlaying: "y",
        side: "right",
        gridcolor: grid,
        zerolinecolor: grid,
      },
      shapes: [
        {
          type: "line",
          x0: state.K, x1: state.K,
          y0: 0, y1: 1, yref: "paper",
          line: { color: dark ? "#888" : "#999", dash: "dot", width: 1 },
        },
      ],
      annotations: [
        {
          x: state.K, y: 1, yref: "paper",
          xanchor: "left", yanchor: "top",
          text: " K",
          showarrow: false,
          font: { color: fg, size: 11 },
        },
      ],
    };
  }

  function traces(series) {
    return [
      {
        x: series.xs, y: series.deltaArr,
        name: "Delta", mode: "lines",
        line: { color: "#3f51b5", width: 2 },
        yaxis: "y",
      },
      {
        x: series.xs, y: series.thetaArr,
        name: "Theta (per day)", mode: "lines",
        line: { color: "#e91e63", width: 2 },
        yaxis: "y2",
      },
    ];
  }

  function bindRange(input, valueLabel, formatter, onChange) {
    const syncLabel = () => { valueLabel.textContent = formatter(input.value); };
    syncLabel();
    input.addEventListener("input", () => {
      syncLabel();
      onChange();
    });
  }

  function initChart(root) {
    const state = {
      K: 35000,
      sigma: 0.2,
      dte: 30,
      r: 0.005,
      q: 0,
      isCall: true,
      sMin: 25000,
      sMax: 45000,
      points: 161,
    };

    root.innerHTML = `
      <div class="greeks-chart-plot" style="width:100%;height:420px"></div>
      <div class="greeks-chart-controls" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem 1.25rem;margin-top:.75rem;font-size:.9em;">
        <label>権利行使価格 K: <span data-label="K"></span><br>
          <input type="range" data-input="K" min="20000" max="50000" step="500" value="35000" style="width:100%">
        </label>
        <label>IV (σ): <span data-label="sigma"></span><br>
          <input type="range" data-input="sigma" min="0.05" max="0.6" step="0.01" value="0.20" style="width:100%">
        </label>
        <label>満期までの日数 (DTE): <span data-label="dte"></span><br>
          <input type="range" data-input="dte" min="1" max="120" step="1" value="30" style="width:100%">
        </label>
        <label>オプションタイプ:<br>
          <select data-input="type" style="width:100%;padding:.25rem">
            <option value="call" selected>Call</option>
            <option value="put">Put</option>
          </select>
        </label>
      </div>
    `;

    const plotDiv = root.querySelector(".greeks-chart-plot");
    const controls = {
      K: root.querySelector('[data-input="K"]'),
      sigma: root.querySelector('[data-input="sigma"]'),
      dte: root.querySelector('[data-input="dte"]'),
      type: root.querySelector('[data-input="type"]'),
    };
    const labels = {
      K: root.querySelector('[data-label="K"]'),
      sigma: root.querySelector('[data-label="sigma"]'),
      dte: root.querySelector('[data-label="dte"]'),
    };

    const redraw = () => {
      if (!window.Plotly) return;
      const series = computeSeries(state);
      window.Plotly.react(plotDiv, traces(series), plotLayout(state), {
        displaylogo: false,
        responsive: true,
        modeBarButtonsToRemove: ["lasso2d", "select2d", "autoScale2d"],
      });
    };

    bindRange(controls.K, labels.K,
      (v) => Number(v).toLocaleString(),
      () => { state.K = Number(controls.K.value); redraw(); });
    bindRange(controls.sigma, labels.sigma,
      (v) => `${(Number(v) * 100).toFixed(1)}%`,
      () => { state.sigma = Number(controls.sigma.value); redraw(); });
    bindRange(controls.dte, labels.dte,
      (v) => `${v}日`,
      () => { state.dte = Number(controls.dte.value); redraw(); });
    controls.type.addEventListener("change", () => {
      state.isCall = controls.type.value === "call";
      redraw();
    });

    if (window.MutationObserver) {
      const obs = new MutationObserver(() => redraw());
      obs.observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });
    }

    loadPlotly().then(() => redraw()).catch((err) => {
      plotDiv.textContent = "Plotly の読み込みに失敗しました: " + err.message;
    });
  }

  function bootstrap() {
    document.querySelectorAll("[data-greeks-chart]").forEach((el) => {
      if (el.dataset.greeksInit) return;
      el.dataset.greeksInit = "1";
      initChart(el);
    });
  }

  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(bootstrap);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
