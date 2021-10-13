import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    editorFont: 12,
    background: 2,
    editorTheme: 'funky',
    code: ''
  },
  mutations: {
    setEditorFont (state, font) {
      state.editorFont = font;
    },
    setBackground (state, background) {
      state.background = background;
    },
    setEditorTheme (state, theme) {
      state.editorTheme = theme;
    },
    saveCode (state, code) {
      state.code = code;
    },
  },
  actions: {
  },
  modules: {
  }
})
