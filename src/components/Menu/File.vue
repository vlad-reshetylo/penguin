<template>
    <div>      
        <div class="row row-3">
            <div>
                <div class="btn" @click="_import">
                    <icon color="#fff" :path="icon('DatabaseImportOutline')"></icon>
                    Import file
                </div>
            </div>  
            <div>
                <div class="btn" @click="_export">
                    <icon color="#fff" :path="icon('DatabaseExportOutline')"></icon>
                    Export file
                </div>
            </div>  
            <div>
                <div class="btn" @click="_example">
                    <icon color="#fff" :path="icon('DatabaseImportOutline')"></icon>
                    Load Example
                </div>
            </div>  
        </div>
        <input type="file" style="display: none;" accept=".jsi" ref="input"/>
    </div>
</template>

<script>
    import Icon from '../Icon';

    const download = (filename, text) => {
        const element = document.createElement('a');

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();
        document.body.removeChild(element);
    };
    
    export default {
        components: {
            Icon,
        },
        name: 'File',
        data () {
            return {
                editorFont: 0,
                background: 0,
                editorTheme: '',
            }
        },
        methods: {
            _import () {
                if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                    return this.error('The File APIs are not fully supported in this browser.');
                }

                this.$refs.input.click();
            },
            _example () {
                this.setCode(`
function ask (text) {
    writeln(text);
    return readln();
}

const name = ask("What is your name?");

write("Hello World and ");
write(name + "!");
`.trim());
            },
            setCode (code) {
                this.$store.commit('saveCode', code);

                window.location.reload();
            },
            _export () {
                download('Code.jsi', this.store('code'));
            },
            handleFileSelection ({target}) {
                if (target.files.length < 1) {
                    return;
                }

                const reader = new FileReader();

                reader.readAsText(target.files[0]);

                reader.onload = () => {
                    this.setCode(reader.result);
                };

                reader.onerror = () => this.error(reader.error);
            }
        },
        mounted () {
            this.$refs.input.onchange = this.handleFileSelection.bind(this);
        }
    }
</script>   
<style scoped>
    svg {
        height: 22px;
        margin-bottom: -4px;
    }
</style>