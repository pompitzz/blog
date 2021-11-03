<template>
  <div>
    <div
        v-if="showPosts.length > 0"
        class="posts-row"
    >
      <div
          v-for="(post, index) in showPosts"
          :key="index"
      >
        <div
            class="post-card shadow border cursor-pointer hover:shadow-xl"
            @click="$router.push(post.path)"
        >

          <div
              v-if="hasImage(post.frontmatter)"
              class="post-card-img-wrapper shadow-md"
          >
            <img
                :src="'/blog/img/' + post.frontmatter.img[0]"
                alt=""
                class="post-card-img"
            />
          </div>
          <div class="post-card-title">{{ post.frontmatter.title }}</div>
          <div class="post-card-date">{{ post.frontmatter.date }}</div>
          <div class="text-center py-1.5">
            <Tag
                v-for="(tagName, index) in getTags(post)"
                :key="index"
                :tagName="tagName"
                class="mr-2"
                routing
                small
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTagStore } from '../store/tag';
import Tag from './Tag.vue';

export default {
  components: { Tag },
  props: {
    posts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      pageNumber: 0,
      pageItemSize: 10,
    };
  },
  computed: {
    showPosts() {
      this.posts.forEach(p => console.log(p.frontmatter.title));
      return this.posts
          .filter(({ frontmatter }) => !!frontmatter)
          .filter(({ frontmatter }) => !frontmatter.sub)
          .map(post => ({
            ...post,
            frontmatter: Object.assign({
              title: '',
              date: '',
              path: '',
              tags: [],
              img: [],
            }, post.frontmatter),
          }));
    },
  },
  methods: {
    getColor(tagName) {
      return getTagStore().color(tagName);
    },
    hasImage(frontmatter) {
      return frontmatter.img && frontmatter.img.length >= 1;
    },
    getTags(post) {
      const tags = post.frontmatter.tags;
      if (tags && tags.length > 0) {
        return tags;
      }
      return [''];
    },
  },
};

function size(listLength, size) {
  return size > listLength ? listLength : size;
}
</script>

<style
    lang="stylus"
    scoped
>
.post-card
  display block
  width 18rem
  margin 1rem
  background-color #fff
  transition all .5s

.post-card:hover
  transform translateY(-4px)

.post-card-img-half-wrapper
  position relative
  flex-grow 1
  padding-bottom 40%


.post-card-img-wrapper
  position relative
  width 100%
  height 0
  padding-bottom 40%


.post-card-img
  position absolute
  top 0
  height 100%
  left 50%
  width auto
  transform translate(-50%)


.post-card-title
  font-size 1rem !important
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
  line-height 1.5rem
  padding 16px 16px 0 16px
  font-weight 500


.post-card-date
  font-size 0.875rem
  font-weight 400
  line-height 1.375rem
  color rgba(0, 0, 0, 0.6)
  padding 0 16px
  text-align right


.posts-row
  display flex
  flex-wrap wrap
  justify-content center
  width 100%


@media (max-width: 740px)
  .post-card
    width 60%
    margin-left auto
    margin-right auto
    margin-top 20px


  .posts-row
    display block


@media (max-width: 500px)
  .post-card
    width 80%
</style>
