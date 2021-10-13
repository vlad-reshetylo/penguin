import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Notifications from 'vue-notification'

import {
  mdiFileDocumentOutline, 
  mdiCogOutline, 
  mdiHelpBox, 
  mdiCodeGreaterThan, 
  mdiStopCircleOutline, 
  mdiCloseBoxOutline,
  mdiInformationOutline,
  mdiDatabaseImportOutline,
  mdiDatabaseExportOutline,
} from '@mdi/js';

Vue.config.productionTip = false;

Vue.use(Notifications)

Vue.mixin({
  methods: {
    store (name) {
      return this.$store.state[name];
    },
    icon (name) {
      return {
        mdiFileDocumentOutline,
        mdiCogOutline,
        mdiHelpBox,
        mdiCodeGreaterThan,
        mdiStopCircleOutline,
        mdiCloseBoxOutline,
        mdiInformationOutline,
        mdiDatabaseImportOutline,
        mdiDatabaseExportOutline,
      }[`mdi${name}`];
    },
    warn (text) {
      this.$notify({
        group: 'main',
        ignoreDuplicates: true,
        type: 'warn',
        duration: 100,
        speed: 400,
        text,
      });
    },
    error (text) {
      this.$notify({
        group: 'main',
        ignoreDuplicates: true,
        type: 'error',
        duration: 2000,
        speed: 400,
        text,
      });
    },
    info (text) {
      this.$notify({
        group: 'main',
        ignoreDuplicates: true,
        type: 'info',
        duration: 300,
        speed: 100,
        text,
      });
    },
  }
});

new Vue({
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
