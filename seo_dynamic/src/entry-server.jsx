import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import App from './App.jsx';



export function render(url, initialData) {
  return renderToPipeableStream(
    <StaticRouter location={url}>
      <App initialData={initialData} />
    </StaticRouter>,
    {
      onShellReady() {},
      onShellError(err) { console.error(err); },
      onAllReady() {
        // This callback is called when all content is ready
        // We'll handle completion in the server.js file
      },
    }
  );
}