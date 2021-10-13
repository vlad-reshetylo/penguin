<template>
  <prism-editor ref="editor" 
                class="my-editor"
                v-model="code"
                :tabSize="4"
                :highlight="highlighter" 
                line-numbers></prism-editor>
</template>

<script>
  import {PrismEditor} from 'vue-prism-editor';
  import {highlight, languages} from "prismjs";
  import 'prismjs/components/prism-typescript';
  
  import 'vue-prism-editor/dist/prismeditor.min.css';

  export default {
    name: 'Editor',
    props: {
      theme: {
        type: String,
        required: false,
        default: 'coy'
      }
    },
    components: {
      PrismEditor,
    },
    data () {
      return {
        code: "",
      }
    },
    methods: {
      highlighter: code => highlight(code, languages.ts),
      saveCode () {
        this.$store.commit('saveCode', this.code);
      },
    },
    watch: {
      code () {
        this.saveCode();

        this.$emit('input', this.code);
      },
      theme () {
        this.saveCode();

        window.location.reload();
      }
    },
    created () {
      require(`prismjs/themes/prism-${this.theme}.css`);
    },
    mounted () {
      this.code = this.store('code');

      setInterval(this.saveCode.bind(this), 60 * 1000);
    }
  }
</script>

<style>
  .my-editor {
    color: #ccc;

    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    line-height: 1.5;
    padding: 15px 10px 15px 0px;
    box-sizing: border-box;
    height: 100%;
    z-index: 4;
    position: inherit;
  }

  .prism-editor-wrapper .prism-editor__container textarea {
    padding-left: 15px;
  }
  .prism-editor-wrapper .prism-editor__container {
    height: 100%;
    border-left: 1px #198ba11f solid;
    padding-left: 15px;
  }

  .prism-editor__line-number {
    font-size: 90% !important;
  }

  .prism-editor__line-number {
    color: #198ba199 !important;
  }

  .prism-editor__textarea:focus {
    outline: none;
  }
</style>
