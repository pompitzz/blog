<template>
    <ParentLayout>
        <ContentTitle v-if="this.$frontmatter.title" slot="page-top"/>
        <Disqus v-if="this.$frontmatter.title" slot="page-bottom"/>
    </ParentLayout>
</template>

<script>
    import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
    import ContentTitle from "../components/ContentTitle";
    import Disqus from '../components/Disqus'

    export default {
        name: "Layout",
        data() {
            return {
                ContentTitle: null,
                Tag: null,
            }
        },
        components: {
            ParentLayout,
            Disqus,
            ContentTitle
        },
    }
</script>

<style scoped>

</style>