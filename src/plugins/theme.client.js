export default ({ app }) => {
  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme === "dark";

  if (app.vuetify && app.vuetify.framework) {
    app.vuetify.framework.theme.dark = isDark;
  }

  if (isDark) {
    document.documentElement.classList.add("theme-dark");
  } else {
    document.documentElement.classList.remove("theme-dark");
  }
};
