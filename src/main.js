import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueMeta from "vue-meta";
import "./registerServiceWorker";

Vue.config.productionTip = false;

Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
