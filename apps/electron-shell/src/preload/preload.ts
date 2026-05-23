import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("electron", {
  version: "1.0.0",
});