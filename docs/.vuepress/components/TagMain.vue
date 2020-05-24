<template>
    <div>
        <TagList :allPosts="allPosts" v-if="mobile"/>
        <TagListDrawer :allPosts="allPosts" v-else/>
        <Posts :posts="posts" :style="{'margin-right': marginRight + 'px'}"/>
    </div>
</template>

<script>
    import TagList from "./TagList";
    import Posts from "./Posts";
    import TagListDrawer from "./TagListDrawer";
    import getPostsByPath from "../utils/htmlUtils";
    import {toArray} from "../utils/arrays";

    export default {
        props: ['tagName'],
        name: "TagMain",
        data() {
            return {
                allPosts: [],
                posts: [],
                mobile: '',
            }
        },
        components: {Posts, TagList, TagListDrawer},
        methods: {
            changeTageViewer() {
                this.mobile = window.innerWidth < 1000;
            },
            setMargin() {
                return {
                    'margin-right': this.mobile ? '0' : '200px'
                }
            }
        },
        computed: {
            marginRight() {
                return this.mobile ? 0 : 200;
            },
        },
        beforeMount() {
            this.allPosts = getPostsByPath('/', this.$site.pages);
            this.posts = this.tagName ? filterOnlyTagName(this.tagName, this.allPosts) : this.allPosts;
            this.mobile = window.innerWidth < 1000;
            window.addEventListener('resize', this.changeTageViewer);
        },
    }

    function filterOnlyTagName(tagName, posts) {
        return toArray(posts)
            .filter(post => post.frontmatter.tags.includes(tagName))
            .map(post => changePostTagArr(post, tagName));
    }

    function changePostTagArr(post, tag) {
        let tags = post.frontmatter.tags;
        tags.splice(tags.indexOf(tag), 1);
        tags.unshift(tag);
        return post;
    }
</script>

<style scoped>

</style>