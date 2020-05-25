<template>
    <ParentLayout>
        <component v-if="this.$frontmatter.title" :is="ContentTitle" slot="page-top"/>
        <Disqus v-if="this.$frontmatter.title" slot="page-bottom"/>
    </ParentLayout>
</template>

<script>
    import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
    import ContentTitle from '../components/ContentTitle'
    import Disqus from '../components/Disqus'
    import Posts from "../components/Posts";
    import getPostsByPath from "../utils/htmlUtils";
    export default {
        name: "Layout",
        data() {
            return{
                ContentTitle: null,
            }
        },
        components: {ContentTitle, ParentLayout, Disqus},
        beforeMount() {
            import('vuetify/dist/vuetify.min.css').then(module => {
                this.ContentTitle = ContentTitle;
            });
            console.log(this.$page);
        },
    }
</script>

<style scoped>

</style>