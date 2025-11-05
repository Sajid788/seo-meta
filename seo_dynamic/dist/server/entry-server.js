import { j as jsxRuntimeExports, A as App } from "../client/assets/App.XgbrQMIu.js";
import "react";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.js";
import "react-router-dom";
function render(url, initialData) {
  return renderToPipeableStream(
    /* @__PURE__ */ jsxRuntimeExports.jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, { initialData }) }),
    {
      onShellReady() {
      },
      onShellError(err) {
        console.error(err);
      },
      onAllReady() {
      }
    }
  );
}
export {
  render
};
