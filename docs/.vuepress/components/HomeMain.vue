<template>
    <Posts class="v-application" :posts="allPosts"/>
</template>

<script>
    import Posts from "./Posts";
    import getPostsByPath from "../utils/htmlUtils";
    export default {
        name: "HomeMain",
        data() {
            return {
                allPosts: [],
            }
        },
        components: {Posts},
        beforeMount() {
            this.allPosts = getPostsByPath(this.$page.path, this.$site.pages);
        }
    }
</script>

<style scoped>

</style>