import type { ContextBridgeApi } from "main/preload";

declare global {
  interface Window {
    api: ContextBridgeApi;
  }
}
