<template>
  <div class="my_home">
    <div v-if="mobile">
      <TagList :tags="tags" />
    </div>
    <div v-else>
      <TagListDrawer :tags="tags" />
    </div>
    <Posts :Tag="Tag"
           :posts="posts"
           :style="{'margin-right': marginRight + 'px'}"
    />
  </div>
</template>

<script>
import getPostsByPath from "../utils/htmlUtil";
import {toArray} from "../utils/arrayUtil";
import {getTagStore} from "../store/tag";
import TagList from "./TagList.vue";
import TagListDrawer from "./TagListDrawer.vue";
import Posts from "./Posts.vue";

export default {
  components: { Posts, TagListDrawer, TagList },
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
    const allPosts = getPostsByPath('/', this.$site.pages);
    this.tags = getTagStore().getTagsWithCouting(allPosts);
    this.tags.sort((a, b) => b.count - a.count);

    // 태그전용 페이지면 태그 post만 보여준다.
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

</script>

<style scoped>

</style>
