<template>
    <ParentLayout>
        <component v-if="this.$frontmatter.title" :is="ContentTitle" :Tag="Tag" slot="page-top"/>
        <Disqus v-if="this.$frontmatter.title" slot="page-bottom"/>
    </ParentLayout>
</template>

<script>
    import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
    import ContentTitle from "../components/ContentTitle";
    import Tag from "../components/Tag";
    import Disqus from '../components/Disqus'

    export default {
        name: "Layout",
        data() {
            return {
                ContentTitle: null,
                Tag: null,
            }
        },
        components: {ParentLayout, Disqus},
        beforeMount() {
            import('vuetify/dist/vuetify.min.css').then(() => {
                this.ContentTitle = ContentTitle;
                this.Tag = Tag;
            })
        },
    }
</script>

<style scoped>

</style>