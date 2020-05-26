<template>
    <component v-if="Posts" :is="Posts" class="v-application my_home" :Tag="Tag" :posts="allPosts"/>
</template>

<script>
    import Posts from "./Posts";
    import Tag from "./Tag";
    import getPostsByPath from "../utils/htmlUtil";

    export default {
        name: "HomeMain",
        data() {
            return {
                allPosts: [],
                Posts: null,
                Tag: null,
            }
        },
        components: {Posts},
        beforeMount() {
            import('vuetify/dist/vuetify.min.css').then(() => {
                this.Posts = Posts;
                this.Tag = Tag;
                this.allPosts = getPostsByPath(this.$page.path, this.$site.pages);
            })
        },
    }
</script>

<style scoped>

</style>