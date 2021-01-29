<template>
  <v-app class="page tag-main">
    <div v-if="mobile">
      <TagList :tags="tags"
               class="mt-3"
      />
    </div>
    <div v-else>
      <TagListDrawer :tags="tags" />
    </div>
    <Posts :posts="posts"
           :style="{'margin-right': marginRight + 'px'}"
           class="mt-3"
    />
  </v-app>
</template>

<script>
import getPostsByPath from '../utils/htmlUtil';
import { toArray } from '../utils/arrayUtil';
import { getTagStore } from '../store/tag';
import TagList from './TagList.vue';
import TagListDrawer from './TagListDrawer.vue';
import Posts from './Posts.vue';

export default {
  components: { Posts, TagListDrawer, TagList },
  props: {
    tagName: {
      type: String,
      required: false,
    },
  },
  name: 'TagMain',
  data() {
    return {
      tags: [],
      allPosts: [],
      mobile: false,
    };
  },
  methods: {
    changeTageViewer() {
      this.mobile = window.innerWidth < 2500;
    },
  },
  computed: {
    marginRight() {
      return this.mobile ? 0 : 200;
    },

    // 태그전용 페이지면 태그 post만 보여준다.
    posts() {
      return this.tagName ? filterOnlyTagName(this.tagName, this.allPosts) : this.allPosts;
    },
  },
  beforeMount() {
    this.allPosts = getPostsByPath('/', this.$site.pages);
    this.tags = getTagStore().getTagsWithCouting(this.allPosts);
    this.tags.sort((a, b) => b.count - a.count);

    this.changeTageViewer();
    window.addEventListener('resize', this.changeTageViewer);
  },
};

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

<style lang="stylus"
       scoped
>
.tag-main {
  padding-top: 65px;
}
</style>
