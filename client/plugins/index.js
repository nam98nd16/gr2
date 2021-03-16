import Vue from "vue";
const moment = require("moment");
require("moment/locale/vi");
import VueLodash from "vue-lodash";
import lodash from "lodash";

Vue.use(require("vue-moment"), {
  moment
});
Vue.use(VueLodash, { name: "custom", lodash: lodash });
