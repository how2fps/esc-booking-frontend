import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
       cleanup();
});

if (!window.matchMedia) {
       window.matchMedia = (query: string): MediaQueryList => {
              return {
                     matches: false,
                     media: query,
                     onchange: null,
                     addListener: () => {},
                     removeListener: () => {},
                     addEventListener: () => {},
                     removeEventListener: () => {},
                     dispatchEvent: () => false,
              };
       };
}
