<template>
    <div>
        Basic javascript syntax is supported, plus 4 special cli functions.
        <br>
        <br>
        <b>
            readln()
        </b> - read user input.
        <br> Example: const name = readln();
        <br>
        <br>
        <b>
            write(text)
        </b> - write text to cli.
        <br> Example: write(name);
        <br>
        <br>
        <b>
            writeln(text)
        </b> - write text to cli and finish it with \n.
        <br> Example: writeln(name);
        <br>
        <br>
        <b>
            wait(ms)
        </b> - delay execution for <i>ms</i> milliseconds.
        <br> Example: wait(3 * 1000); // wait 3 seconds
        <hr>
        Example: ask user's name, wait 2 seconds, and say hello to him.
        <br>
        <br>
        <i>
            <code v-html="highlight(`writeln('What is your name?');`)"></code>
            <br>
            <code v-html="highlight(`const name = readln();`)"></code>
            <br>
            <code v-html="highlight(`wait(2000);`)"></code>
            <br>
            <code v-html="highlight(`write('Hello ');`)"></code>
            <br>
            <code v-html="highlight(`write(name);`)"></code>
        </i>
    </div>
</template>
<script>
    import {highlight, languages} from "prismjs";

    export default {
        name: "Help",
        methods: {
            highlight (code) {
                return highlight(code, languages.ts);
            }
        }
    }
</script>