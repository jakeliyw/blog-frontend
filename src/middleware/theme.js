function getCookieValue(cookie, name) {
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function ({ req, store, app }) {
  let isDark = false;

  if (process.server) {
    const cookie = req && req.headers ? req.headers.cookie || "" : "";
    const theme = getCookieValue(cookie, "theme");
    isDark = theme === "dark";
  } else if (process.client) {
    const savedTheme = localStorage.getItem("theme");
    isDark = savedTheme === "dark";
  }

  store.commit("theme/setDark", isDark);

  if (app && app.vuetify && app.vuetify.framework) {
    app.vuetify.framework.theme.dark = isDark;
  }

  if (process.client) {
    if (isDark) {
      document.documentElement.classList.add("theme-dark");
    } else {
      document.documentElement.classList.remove("theme-dark");
    }
  }
}
