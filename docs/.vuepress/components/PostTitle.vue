<template>
  <div class="d-block content-title">
    <div style="width: 100%">
      <div class="w-90 mx-auto">
        <h1 :class="mobile ? 'mobile-post-title' : ''">{{ post.title }}</h1>
      </div>

      <div class="text--primary text-right w-95 mr-5 my-2">
        작성일: {{ post.date }}
      </div>
      <div class="w-100 text-center">
        <Tag v-for="(tagName, index) in post.tags"
             :key="index"
             :tagName="tagName"
             routing
             small
        />
      </div>
      <hr class="content-divider">
    </div>
  </div>
</template>

<script>
import Tag from "./Tag";

export default {
  name: "PostTitle",
  components: { Tag },
  data() {
    return {
      tags: [],
      mobile: false,
    }
  },
  computed: {
    post() {
      return Object.assign({ post: '' }, this.$page.frontmatter);
    }
  },
  beforeMount() {
    this.changePageViewer();
    window.addEventListener('resize', this.changePageViewer)
  },
  methods: {
    changePageViewer() {
      this.mobile = window.innerWidth < 1200;
    },
  }
}
</script>

<style scoped>
.content-title {
  width: 100%;
  text-align: center;
  margin-top: 6rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
}

.content-divider {
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.mobile-post-title {
  font-size: 1.5rem;
}
</style>
