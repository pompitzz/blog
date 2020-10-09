<template>
  <div class="my_home">
    <div v-if="mobile">
      <component v-if="TagList" :is="TagList" :tags="tags"/>
    </div>
    <div v-else>
      <component v-if="TagListDrawer" :is="TagListDrawer" :tags="tags"/>
    </div>
    <component v-if="Posts" :is="Posts" :posts="posts" :Tag="Tag" :style="{'margin-right': marginRight + 'px'}"/>
  </div>
</template>

<script>
import TagListDrawer from "./TagListDrawer";
import TagList from "./TagList";
import Posts from "./Posts";
import Tag from "./Tag";
import getPostsByPath from "../utils/htmlUtil";
import {toArray} from "../utils/arrayUtil";
import {buildAllTag, getTagStore} from "../store/tag";

export default {
  props: ['tagName'],
  name: "TagMain",
  data() {
    return {
      tags: [],
      posts: [],
      mobile: false,
      TagListDrawer: null,
      TagList: null,
      Posts: null,
      Tag: null,
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
    import('vuetify/dist/vuetify.min.css').then(() => {
      this.TagListDrawer = TagListDrawer;
      this.TagList = TagList;
      this.Posts = Posts;
      this.Tag = Tag;
    });

    const allPosts = getPostsByPath('/', this.$site.pages);
    this.tags = getTags(allPosts);
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
  const tags = post.frontmatter.tags;
  tags.splice(tags.indexOf(tag), 1);
  tags.unshift(tag);
  return post;
}

function getTags(allPosts) {
  const tags = getTagStore().getTagsWithCouting(allPosts);
  tags.unshift(buildAllTag(tags))
  return tags;
}
</script>

<style scoped>

</style>
