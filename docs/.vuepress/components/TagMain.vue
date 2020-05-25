<template>
    <component v-if="TagMainWarpper" :is="TagMainWarpper" :tagName="tagName"/>
</template>

<script>
    import TagMainWarpper from "./TagMainWarpper";

    export default {
        props: ['tagName'],
        name: "TagMain",
        components: {TagMainWarpper},
        data() {
            return {
                TagMainWarpper: null,
            }
        },
        beforeMount() {
            import('vuetify/dist/vuetify.min.css').then(module => {
                this.TagMainWarpper = TagMainWarpper;
            })
        }
    }


</script>

<style scoped>

</style>