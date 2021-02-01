<template>
  <div>
    <div v-if="showPosts.length > 0"
         class="posts-row"
    >
      <div v-for="(post, index) in showPosts"
           :key="index"
      >
        <div v-if="post.frontmatter !== undefined"
             class="post-card v-card v-card--hover"
             @click="moveTo(post.path)"
        >

          <div v-if="post.frontmatter.img.length >= 1"
               class="post-card-img-wrapper elevation-2"
          >
            <img :src="'/blog/img/' + post.frontmatter.img[0]"
                 alt=""
                 class="post-card-img"
            />
          </div>
          <div class="post-card-title">{{ post.frontmatter.title }}</div>
          <div class="post-card-date">{{ post.frontmatter.date }}</div>
          <div class="text-center pb-2 pt-0">
            <Tag v-for="(tagName, index) in post.frontmatter.tags"
                 :key="index"
                 :tagName="tagName"
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
import { errorLogging } from '../utils/error';
import Tag from './Tag.vue';

export default {
  components: { Tag },
  props: ['posts'],
  data() {
    return {
      pageNumber: 0,
      pageItemSize: 10,
    };
  },
  computed: {
    showPosts() {
      return this.posts;
    },
  },
  methods: {
    // addNextshowPosts() {
    //   if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight)) {
    //     if (this.showPosts.length === this.posts.length) return;
    //     this.pageNumber += 1;
    //     const start = (this.pageNumber - 1) * this.pageItemSize;
    //     const end = (this.pageNumber * this.pageItemSize) > this.posts.length ? this.posts.length : (this.pageNumber * this.pageItemSize);
    //     for (let i = start; i < end; i++) {
    //       this.showPosts.push(this.posts[i]);
    //     }
    //   }
    // },
    getColor(tagName) {
      return getTagStore().color(tagName);
    },
    moveTo(path) {
      this.$router.push(path).catch(errorLogging);
    },
  },
  beforeMount() {
    // for (let i = 0; i < size(this.posts.length, this.pageItemSize); i++) {
    //   this.showPosts.push(this.posts[i]);
    // }
    // window.addEventListener("scroll", this.addNextshowPosts);
  },
};

function size(listLength, size) {
  return size > listLength ? listLength : size;
}
</script>

<style lang="stylus"
       scoped
>
.post-card
  display block
  width 18rem
  margin 1rem
  background-color #fff


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
  width 100%
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