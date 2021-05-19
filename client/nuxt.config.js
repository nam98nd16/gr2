const { parsed } = require("dotenv").config({
  path:
    "environments/.env" +
    (process.env.NODE_ENV == "development" ? "" : "." + process.env.NODE_ENV)
});

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: "Skill Assessment System",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ["ant-design-vue/dist/antd.css", "~/css/main.css"],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    "@/plugins/antd-ui",
    "@/plugins/bootstrap-vue",
    "@/plugins/apexcharts",
    "@/plugins/axios",
    "@/plugins/index"
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ["@nuxtjs/axios"],
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.baseURL
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    optimization: {
      minimize: false,
      minimizer: [
        // terser-webpack-plugin
        // optimize-css-assets-webpack-plugin
      ],
      splitChunks: {
        chunks: "all",
        automaticNameDelimiter: ".",
        name: undefined,
        cacheGroups: {}
      }
    }
  },
  server: {
    port: 8080, // default: 3000
    host: "0.0.0.0" // default: localhost,
  },
  env: { ...parsed }
};
