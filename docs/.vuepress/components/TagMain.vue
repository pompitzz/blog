<template>
  <div class="page tag-main">
    <TagList :tags="tags"
             class="mt-3 tag-list"
    />
    <ClientOnly>
      <Posts :posts="posts"
             class="mt-3"
      />
    </ClientOnly>
  </div>
</template>

<script>
import { toArray } from '../utils/arrayUtil';
import TagList from './TagList.vue';
import Posts from './Posts.vue';

export default {
  components: { Posts, TagList },
  props: {
    tagName: {
      type: String,
      required: false,
    },
    allPosts: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
  },
  name: 'TagMain',
  computed: {
    // 태그전용 페이지면 태그 post만 보여준다.
    posts() {
      return this.tagName ? filterOnlyTagName(this.tagName, this.allPosts) : this.allPosts;
    },
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

@media (min-width: $MQXMobile)
  .tag-list
    display none
</style>
