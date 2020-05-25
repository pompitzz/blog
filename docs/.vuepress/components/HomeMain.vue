<template>
    <component v-if="Posts" :is="Posts" class="v-application" :posts="allPosts"/>
</template>

<script>
    import Posts from "./Posts";
    import getPostsByPath from "../utils/htmlUtils";

    export default {
        name: "HomeMain",
        data() {
            return {
                allPosts: [],
                Posts: null,
            }
        },
        components: {Posts},
        beforeMount() {
            import('vuetify/dist/vuetify.min.css').then(module => {
                this.Posts = Posts;
                this.allPosts = getPostsByPath(this.$page.path, this.$site.pages);
            });
        },
    }
</script>

<style scoped>

</style>