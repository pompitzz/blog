<template>
  <div class="v-application">
    <v-row
        style="width: 100%"
        class="posts-row"
        justify="center"
        v-if="showPosts.length > 0"
    >
      <v-card
          class="post-card"
          v-for="(post, index) in showPosts"
          :key="index"
          @click="moveTo(post.path)"
          v-if="post.frontmatter !== undefined"
          hover>

        <div v-if="post.frontmatter.img.length === 1"
             class="post-card-img-wrapper elevation-2">
          <img :src="'/blog/img/' + post.frontmatter.img[0]" alt="" class="post-card-img"/>
        </div>
        <div v-else
             class="post-card-img-wrapper elevation-2">
          <div class="post-card-img-half-wrapper float-left">
            <img :src="'/blog/img/' + post.frontmatter.img[0]" alt="" class="post-card-img"/>
          </div>
          <div class="post-card-img-half-wrapper float-right">
            <img :src="'/blog/img/' + post.frontmatter.img[1]" alt="" class="post-card-img"/>
          </div>
        </div>


        <v-card-title class="post-card-title">{{ post.frontmatter.title }}</v-card-title>
        <v-card-subtitle class="text--primary text-right pb-0 pt-0">{{ post.frontmatter.date }}</v-card-subtitle>
        <v-card-text class="text-center pb-2 pt-0">
          <component v-if="Tag" :is="Tag" :canRouting="false" :tags="post.frontmatter.tags"/>
        </v-card-text>
      </v-card>
    </v-row>
  </div>
</template>

<script>
import {getTagStore} from "../store/tag";
import {errorLogging} from "../utils/error";

export default {
  props: ["posts", 'Tag'],
  data() {
    return {
      showPosts: [],
      pageNumber: 0,
      pageItemSize: 10,
    }
  },
  methods: {
    addNextshowPosts() {
      if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight)) {
        if (this.showPosts.length === this.posts.length) return;
        this.pageNumber += 1;
        const start = (this.pageNumber - 1) * this.pageItemSize;
        const end = (this.pageNumber * this.pageItemSize) > this.posts.length ? this.posts.length : (this.pageNumber * this.pageItemSize);
        for (let i = start; i < end; i++) {
          this.showPosts.push(this.posts[i]);
        }
      }
    },
    getColor(tagName) {
      return getTagStore().color(tagName);
    },
    moveTo(path) {
      this.$router.push(path).catch(errorLogging)
    }
  },
  beforeMount() {
    for (let i = 0; i < size(this.posts.length, this.pageItemSize); i++) {
      this.showPosts.push(this.posts[i]);
    }
    window.addEventListener("scroll", this.addNextshowPosts);
  },
};

function size(listLength, size) {
  return size > listLength ? listLength : size;
}
</script>

<style scoped>
.post-card {
  width: 18rem;
  margin: 1rem;
  display: block;
}

.post-card-img-half-wrapper {
  position: relative;
  width: 50%;
  height: 0;
  padding-bottom: 40%;
}

.post-card-img-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 40%;
}

.post-card-img {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.post-card-title {
  width: 100%;
  font-size: 1rem !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  line-height: 1.5rem;
}

.posts-row {
  display: flex;
  width: 100%;
}

@media (max-width: 740px) {
  .post-card {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
  }


  .posts-row {
    display: block;
  }
}

@media (max-width: 500px) {
  .post-card {
    width: 100%;
  }
}
</style>
