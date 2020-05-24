<template>
    <Posts :allPosts="allPosts"/>
</template>

<script>
    import Posts from "./Posts";
    import getHtmlPagesByPath from "../utils/htmlUtils";
    export default {
        name: "HomeMain",
        data() {
            return {
                allPosts: [],
            }
        },
        components: {Posts},
        beforeMount() {
            this.allPosts = getHtmlPagesByPath(this.$page.path, this.$site.pages);
        }
    }
</script>

<style scoped>

</style>