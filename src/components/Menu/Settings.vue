<template>
    <div>      
        <div class="row row-2">
          <div>
            <label>
                Code Font Size
            </label>
            <select v-model="editorFont">
                <option value="12">12px</option>
                <option value="14">14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
                <option value="20">20px</option>
                <option value="24">24px</option>
                <option value="30">30px</option>
            </select>
          </div>  
          <div>
            <label>
              Background
            </label>
            <select v-model="background">
              <option value="1">Abstract</option>
              <option value="2">Mountains</option>
              <option value="3">Sky</option>
              <option value="4">Stones</option>
            </select>
          </div>  
        </div>
        <br>
        <br>
        <div class="row row-3">
            <div></div>
            <div class="btn" @click="reset">
                Reset
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Settings',
        data () {
            return {
                editorFont: 0,
                background: 0,
                editorTheme: '',
            }
        },
        methods: {
            reset () {
                this.editorFont = 14;
                this.background = "1";
                this.editorTheme = "funky";
            }
        },
        watch: {
            editorFont () {
                this.$store.commit('setEditorFont', this.editorFont);
            },
            background () {
                this.$store.commit('setBackground', this.background);
            },
            editorTheme () {
                this.$store.commit('setEditorTheme', this.editorTheme);
            },
        },
        created () {
            this.editorFont = this.$store.state.editorFont;
            this.background = this.$store.state.background;
            this.editorTheme = this.$store.state.editorTheme;
        }
    }
</script>   