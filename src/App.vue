<template>
  <div>
    <notifications group="main" position="top center" width="500"/>
    <div id="bg" v-bind:style="{
      backgroundImage: `url(bg/${store('background')}.jpg)`
    }"></div>
    <div id="layout">
      <header>
        <div>
          <div v-for="item in menu" 
               v-bind:key="item.title" 
               class="menu-button" 
               @click="openMenu(item.title)">
            <div class="menu-button__title">
              <icon color="#fff" :path="icon(item.icon)"></icon>
              {{item.title}}
            </div>
          </div>
        </div>
        <div>
          <div v-show="executing" style="height: 100%;">
            <sync-loader color="#ffffff4a" size="10px"></sync-loader>
          </div>
        </div> 
        <div class="action-button action-button__execute" v-if="!executing">
          <div @click="execute">
            Execute 
            <icon :path="icon('CodeGreaterThan')"></icon>
          </div>
        </div>
        <div class="action-button action-button__stop" v-if="executing">
          <div @click="stop">
            Stop 
            <icon :path="icon('StopCircleOutline')"></icon>
          </div>
        </div>
      </header>
      <section id="editor-section" v-bind:style="{
        fontSize: `${store('editorFont')}px`
      }">
        <div id="editor-bg" @click="focus"></div>
        <editor ref="editor" v-model="code" :theme="store('editorTheme')"></editor>
      </section>
    </div>
    <div id="modal-bg" v-if="executing"></div>
    <section id="modal" ref="modal" v-if="executing">
      <div></div>
    </section>
    <section class="settings-modal" v-show="menuMode !== 'hidden'">
      <header>
        <div>
          <span v-for="item in menu" 
                v-bind:key="item.title"
                v-show="menuMode === item.title">
            <icon color="#fff" :path="icon(item.icon)"></icon>
            {{item.title}}
          </span>
        </div>
        <div style="text-align: right;" class="modal-close" @click="closeMenu()">
          <icon color="#fff" :path="icon('CloseBoxOutline')"></icon>
        </div>
      </header>
      <div class="modal-content">
        <div>
          <settings v-show="menuMode === 'Settings'"></settings>
          <file v-show="menuMode === 'File'"></file>
          <help v-show="menuMode === 'Help'"></help>
          <div v-show="menuMode === 'About'">
            <div style="text-align: center; padding-top: 20px;">
              <img src="android-chrome-192x192.png" style="height: 150px;">
              <br>
              <br>
              Say hello to Penguin!
              <br>
              <br>
              Online IDE for coding on JS with some old-school features
              <br>
              <br>
              Fork me on <a target="__blank" style="color: #6cb1de;" href="https://github.com/VladReshet/penguin">Github!</a>  
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import Editor from './components/Editor'
  import Icon from './components/Icon'
  import Settings from './components/Menu/Settings'
  import File from './components/Menu/File'
  import Help from './components/Menu/Help'
  import SyncLoader from 'vue-spinner/src/SyncLoader.vue'

  import {parse} from "@babel/parser";
  import generate from "@babel/generator";
  import traverse from "@babel/traverse";

  export default {
    name: 'App',
    components: {
      Editor,
      Icon,
      SyncLoader,
      Settings,
      File,
      Help,
    },
    data () {
      return {
        code: '',
        executing: false,
        menuMode: 'hidden',
        menu: [
          {
            title: 'File',
            icon: 'FileDocumentOutline',
          },
          {
            title: 'Settings',
            icon: 'CogOutline',
          },
          {
            title: 'Help',
            icon: 'HelpBox',
          },
          {
            title: 'About',
            icon: 'InformationOutline',
          }
        ],
        cache: Math.random()
      }
    },
    methods: {
      focus () {
        // sooooo long :D
        this.$refs.editor.$refs.editor.$el.querySelector('textarea').focus();
      },
      stop () {
        this.executing = false;
      },
      openMenu (type) {
        this.menuMode = type;
      },
      closeMenu () {
        this.menuMode = 'hidden';
      },
      /* transform ast to make all function calls async */
      transform (ast) {
        traverse(ast, {
          enter({node}) {
            if (node.type === "FunctionDeclaration") {
              node.async = true;
            }

            if (node.type !== "AwaitExpression") {
              for (let field in node) {
                if (node[field] !== null && node[field].type !== undefined) {
                  if (node[field].type === "CallExpression") {
                    const call = node[field];

                    node[field] = {
                      type: "AwaitExpression",
                      argument: call
                    }
                  }

                  if (node[field].type === "FunctionExpression" || node[field].type === "ArrowFunctionExpression") {
                    node[field].async = true;
                  }
                }
              }
            }

            if (node.type === "CallExpression") {
              for (let index in node.arguments) {
                if (node.arguments[index].type === "CallExpression") {
                  const call = node.arguments[index];

                  node.arguments[index] = {
                    type: "AwaitExpression",
                    argument: call
                  };
                }
              }
            }
          },
        });

        // if (node.type === "ExpressionStatement") {
        //   if (node.expression && node.expression.type === "CallExpression") {
        //     const call = node.expression;

        //     node.expression = {
        //       type: "AwaitExpression",
        //       argument: call
        //     }
        //   }
        // // }

        // if (node.init && node.init.type === "CallExpression") {
        //   const call = node.init;

        //   node.init = {
        //     type: "AwaitExpression",
        //     argument: call
        //   }
        // }

        return ast;
      },
      async execute () {
        if (this.code.length === 0) {
          return this.warn('🤨 Nothing to execute');
        }

        let ast;

        try {
          ast = parse(this.code);
        } catch (e) {
          return this.error(`📛 Error: ${e.toString()}`);
        }

        this.executing = true;

        await this.$nextTick();

        this.createIframe(
          generate(this.transform(ast)).code
        );
      },
      createIframe (code) {
        const iframe = document.createElement("iframe");

        iframe.src = `run.html?cache=${this.cache}`;

        iframe.onload = () => {
          iframe.contentDocument
                .body
                .querySelector('#script')
                .innerHTML = `
                  "use strict";
                  (async () => {
                    try {
                      ${code}
                    } catch (e) {
                      notifyAboutError(e);
                    }
                    syslog("Execution finished");
                  })();
                `;
        };

        this.$refs.modal.appendChild(iframe);
      }
    },
    watch: {
      executing () {
        this.closeMenu();
      }
    },
  }
</script>

<style lang="less">
  #bg {
    background-size: cover;
    position: fixed;
    width: 100%;
    height: 100%;
  }

  .row {
    display: grid;
    grid-column-gap: 30px;
  }

  @iterations: 12;
  .row-loop (@i) when (@i > 0) {
      .row-@{i} {
        grid-template-columns: repeat(~"@{i}", 1fr);
      }
      .row-loop(@i - 1);
  }
  .row-loop (@iterations);

  #editor-section {
    z-index: 2;
    margin-top: 50px;
  }

  #editor-section {
    position: relative;
  }

  #editor-bg {
    position: fixed;
    height: calc(100vh - 50px);
    width: 100%;
    top: 50px;
    background: #0b2142e8;
    z-index: 1;
    cursor: text;
  }

  #layout {
    position: absolute;
    width: 100%;
    height: 100%;

    header {
      user-select: none;
      position: fixed;
      height: 50px;
      width: 100vw;
      background-color: #222;
      padding-left: 15px;
      z-index: 4;

      display: grid;
      grid-template-columns: 1fr 100px 1fr;
    }
  }

  #modal {
    position: fixed;
    background-color: #05172573;
    width: 90vw;
    height: 80vh;
    z-index: 9998;
    left: 5vw;
    top: 50px;

    iframe {
      width: 100%;
      height: 100%;
    }
  }

  .settings-modal {
    position: fixed;
    background-color: #08080873;
    width: 600px;
    z-index: 9999999;
    left: calc(50vw - 300px);
    top: 70px;

    header {
      color: #fff;
      padding: 10px 20px;
      background-color: #3f94c69e;
      display: grid;
      grid-template-columns: 1fr 1fr;

      svg {
        height: 22px;
        margin-bottom: -4px;
      }
    }

    .modal-close svg {
      cursor: pointer;

      &:hover {
        path {
          fill: #aaa !important;
        }
      }
    }

    .modal-content {
      color: #fff;
      padding: 15px;
    }

    select {
      cursor: pointer;
      display: block;
      margin-top: 10px;
      width: 100%;
      padding: 10px;
      font-size: 16px;
      background-color: transparent;
      color: #fff;
      border-color: #3f94c69e;

      option {
        color: #111;
      }
    }
  }

  #modal-bg {
    z-index: 9998;
    position: fixed;
    height: calc(100vh - 50px);
    width: 100%;
    top: 50px;
    background-color: #00000075;
  }

  .action-button {
    text-align: right;
    padding-right: 15px;

    svg {
      height: 22px;
      margin-bottom: -4px;
    }

    div {
      display: inline-block;
      font-family: system-ui;
      font-size: 18px;
      padding: 12px 15px 12px 15px;
      width: 140px;
      text-align: center;

      &:hover {
        cursor: pointer;
        color: #fff;

        svg {
          fill: #fff !important;
        }
      }
    }
  }

  .action-button__execute {
    svg {
      fill: #97f797;
    }

    div {
      color: #97f797;

      &:hover {
        background-color: #97f797;
      }
    }
  }

  .action-button__stop {
    svg {
      fill: #ff6060;
    }

    div {
      color: #ff6060;

      &:hover {
        background-color: #ff6060;
      }
    }
  }

  .menu-button__title {
    font-size: 15px;
    padding: 14px 10px 10px 15px;
  }
  .menu-button {
    display: inline-block;
    color: #fff;
    font-family: system-ui;
    letter-spacing: 1px;
    height: 100%;

    svg {
      height: 15px;
      vertical-align: initial;
      margin-bottom: -2px;
    }

    transition: .2s;

    &:hover {
      background-color: #3f94c69e;
      cursor: pointer;
    }
  }

  .vue-notification {
    padding: 15px;
    margin: 10px 10px;
   
    font-size: 15px !important;
    font-family: system-ui;
   
    color: #ffffff;
    background: #44A4FC;
    border-left: 5px solid #187FE7;
   
    &.warn {
      background: #ffb648;
      border-left-color: #f48a06;
    }
   
    &.error {
      background: #ff6060;
      border-left-color: #B82E24;
    }
   
    &.success {
      background: #68CD86;
      border-left-color: #42A85F;
    }
  }

  .v-spinner {
    margin-top: 20px;
  }

  .btn {
    display: inline-block;
    border: 1px #3f94c69e solid;
    padding: 10px 15px;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    color: #fff;
    transition: .2s;

    &:hover {
      cursor: pointer;
      background-color: #3f94c69e;
    }
  }

  body {
    margin: 0px;
    padding: 0px;
    font-family: system-ui;
  }
</style>
