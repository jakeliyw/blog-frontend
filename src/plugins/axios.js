import { notify } from "@/utils/notify";

export default function ({ $axios }) {
  $axios.onResponse((response) => {
    const data = response && response.data ? response.data : null;
    const code = data && typeof data.code !== "undefined" ? data.code : undefined;
    if (typeof code !== "undefined" && code !== 0) {
      const message = data && data.message ? data.message : "服务器异常";
      notify(message, "error");
      const err = new Error(message);
      err.statusCode = 500;
      err.response = response;
      return Promise.reject(err);
    }
    return response;
  });
}
