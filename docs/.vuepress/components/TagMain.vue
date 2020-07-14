<template>
    <div class="my_home">
        <div v-if="mobile">
            <TagList :tags="tags"/>
        </div>
        <div v-else>
            <TagListDrawer :tags="tags"/>
        </div>
        <Posts :posts="posts"
               :style="{'margin-right': marginRight + 'px'}"/>
    </div>
</template>

<script>
    import TagListDrawer from "./TagListDrawer";
    import TagList from "./TagList";
    import Posts from "./Posts";
    import getPostsByPath from "../utils/htmlUtil";
    import {toArray} from "../utils/arrayUtil";
    import {getTagStore} from "../store/tag";

    export default {
        name: "TagMain",
        components: {
            TagListDrawer,
            TagList,
            Posts,
        },
        props: ['tagName'],
        data() {
            return {
                tags: [],
                posts: [],
                mobile: false,
                // TagListDrawer: null,
                // TagList: null,
                // Posts: null,
                // Tag: null,
            }
        },
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
            // import('vuetify/dist/vuetify.min.css').then(() => {
            //     this.TagListDrawer = TagListDrawer;
            //     this.TagList = TagList;
            //     this.Posts = Posts;
            //     this.Tag = Tag;
            // });

            const allPosts = getPostsByPath('/', this.$site.pages);
            this.tags = getTagStore().getTagsWithCouting(allPosts);
            this.tags.sort((a, b) => b.count - a.count);
            this.posts = this.tagName ? filterOnlyTagName(this.tagName, allPosts) : allPosts;
            this.mobile = window.innerWidth < 1000;
            window.addEventListener('resize', this.changeTageViewer);
        }
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