<template>
    <svg viewBox="0 0 24 22">
        <path :fill="color" :d="path" />
    </svg>
</template>
<script>
    export default {
        name: 'Icon',
        props: {
            path: {
                type: String,
                required: true,
            },
            color: {
                type: String,
                required: false,
                default: '',
            }
        }
    }
</script>