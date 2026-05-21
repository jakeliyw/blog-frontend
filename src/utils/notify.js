import Vue from "vue";

const bus = new Vue();

export function notify(message, color = "error") {
  if (typeof window !== "undefined") {
    bus.$emit("notify", { message, color });
  }
}

export function onNotify(handler) {
  bus.$on("notify", handler);
}

export function offNotify(handler) {
  bus.$off("notify", handler);
}
