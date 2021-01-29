<template>
  <v-app class="page tag-main">
    <TagList :tags="tags"
             class="mt-3"
    />
    <Posts :posts="posts"
           class="mt-3"
    />
  </v-app>
</template>

<script>
import getPostsByPath from '../utils/htmlUtil';
import { toArray } from '../utils/arrayUtil';
import { getTagStore } from '../store/tag';
import TagList from './TagList.vue';
import Posts from './Posts.vue';

export default {
  components: { Posts, TagList },
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
    };
  },
  computed: {
    // 태그전용 페이지면 태그 post만 보여준다.
    posts() {
      return this.tagName ? filterOnlyTagName(this.tagName, this.allPosts) : this.allPosts;
    },
  },
  beforeMount() {
    this.allPosts = getPostsByPath('/', this.$site.pages);
    this.tags = getTagStore().getTagsWithCouting(this.allPosts);
    this.tags.sort((a, b) => b.count - a.count);
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
.tag-main
  padding-top 65px
</style>
