const axios = require("axios");

const RAW_API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";
const API_BASE_URL = String(RAW_API_BASE_URL || "")
  .trim()
  .replace(/\/(dev|prod)-api\/?$/i, "");
const RAW_SITE_URL = process.env.SITE_URL || "http://localhost:3000";
const API_PREFIX = process.env.API_PREFIX || "/dev-api";
const SITE_URL = (() => {
  let v = String(RAW_SITE_URL || "").trim().replace(/^['"]|['"]$/g, "");
  if (!v) v = "http://localhost:3000";
  if (!/^https?:\/\//i.test(v)) v = `http://${v}`;
  try {
    return new URL(v).origin;
  } catch (e) {
    return "http://localhost:3000";
  }
})();

// const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";
// const SITE_URL = process.env.SITE_URL || "http://localhost:3000";


module.exports = {
  srcDir: "src/",
  ssr: true,
  target: "server",
  server: {
    port: 4000,
  },
  head: {
    titleTemplate: "%s - LYW的博客",
    htmlAttrs: { lang: "zh-CN" },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "个人博客，文章、标签、归档与技术笔记。" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [
      {
        hid: "theme-init",
        innerHTML:
          "(function(){try{var t=localStorage.getItem('theme');var d=t==='dark';document.documentElement.classList.toggle('theme-dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();",
        type: "text/javascript",
      },
    ],
    style: [
      {
        hid: "theme-critical",
        innerHTML:
          "html.theme-dark,html.theme-dark body{background:#16181d!important;color:#e8e8e8!important;}html.theme-dark .v-application,html.theme-dark .theme--light.v-application{background:#16181d!important;color:#e8e8e8!important;}html.theme-dark .v-application .v-app-bar,html.theme-dark .theme--light.v-app-bar{background:#1b1f26!important;}html.theme-dark .theme--light.v-sheet,html.theme-dark .theme--light.v-card,html.theme-dark .theme--light.v-list,html.theme-dark .theme--light.v-navigation-drawer{background-color:#22252b!important;color:#e8e8e8!important;}html.theme-dark .theme--light.v-btn,html.theme-dark .theme--light.v-icon,html.theme-dark .theme--light.v-list-item,html.theme-dark .theme--light.v-card__text,html.theme-dark .theme--light.v-card__title{color:#e8e8e8!important;border-color:rgba(255,255,255,.12)!important;}",
      },
    ],
  },
  __dangerouslyDisableSanitizersByTagID: {
    "theme-init": ["innerHTML"],
    "theme-critical": ["innerHTML"],
  },
  css: [
    "@/style/index.scss",
    "mavon-editor/dist/css/index.css",
    "highlight.js/styles/github.css",
    "nprogress/nprogress.css",
  ],
  plugins: [
    { src: "@/plugins/mavon-editor.client.js", mode: "client" },
    { src: "@/plugins/theme.client.js", mode: "client" },
    "@/plugins/axios.js",
  ],
  buildModules: ["@nuxtjs/vuetify"],
  modules: ["@nuxtjs/axios", "@nuxtjs/proxy", "@nuxtjs/sitemap", "@nuxtjs/robots", "@nuxtjs/style-resources"],
  styleResources: {
    scss: ["@/style/index.scss"],
  },
  axios: {
    proxy: true,
    credentials: false,
    baseURL: API_BASE_URL,
    browserBaseURL: "",
  },
  proxy: {
    [`${API_PREFIX}/`]: {
      target: API_BASE_URL,
      changeOrigin: true,
    },
  },
  vuetify: {
    defaultAssets: {
      icons: "mdi",
    },
    theme: {
      dark: false,
    },
  },
  router: {
    middleware: ["theme"],
  },
  generate: {
    routes: ["/", "/article", "/archives", "/tag", "/about"],
    exclude: [/^\/article\/.+/],
  },
  sitemap: {
    hostname: SITE_URL,
    routes: async () => {
      const routes = ["/", "/article", "/archives", "/tag", "/about"];
      try {
        const { data } = await axios.get(`${API_BASE_URL}${API_PREFIX}/article/list`, {
          params: { current: 1, pageSize: 1000 },
        });
        const list = (data && data.data) || [];
        list.forEach((item) => {
          if (!item || item.id === undefined || item.id === null) return;
          const id = encodeURIComponent(String(item.id).trim());
          if (id) routes.push(`/article/${id}`);
        });
      } catch (e) {
        // keep static routes if API is unavailable at build time
      }
      const unique = Array.from(new Set(routes))
        .map((r) => String(r || "").trim())
        .filter((r) => r && r.startsWith("/"))
        .filter((r) => {
          try {
            new URL(r, SITE_URL);
            return true;
          } catch (e) {
            return false;
          }
        });
      return unique;
    },
  },
  robots: {
    UserAgent: "*",
    Disallow: "",
    Sitemap: `${SITE_URL}/sitemap.xml`,
  },
  env: {
    API_PREFIX,
  },
  build: {
    transpile: [/vuetify/],
  },
};
