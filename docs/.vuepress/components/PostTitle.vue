<template>
  <div class="block content-title">
    <div style="width: 100%">
      <div class="w-11/12 mx-auto title">
        <h1 class="title">{{ post.title }}</h1>
      </div>

      <div class="text--primary text-right w-95 mr-5 my-2">
        작성일: {{ post.date }}
      </div>
      <div class="w-100 text-center">
        <ClientOnly>
          <Tag v-for="(tagName, index) in post.tags || []"
               :key="index"
               :tagName="tagName"
               class="mr-2"
               routing
               small
          />
        </ClientOnly>
      </div>
      <hr class="content-divider">
    </div>
  </div>
</template>

<script>
import Tag from './Tag';

export default {
  name: 'PostTitle',
  components: { Tag },
  computed: {
    post() {
      return this.$page.frontmatter;
    },
  },
};
</script>

<style lang="stylus"
       scoped
>
.content-title
  width 100%
  text-align center
  margin-top 6rem
  padding-left 0.3rem
  padding-right 0.3rem


.content-divider
  width 100%
  margin-top 1rem
  margin-bottom 1rem

.title
  font-size 1.7rem
  font-weight bold


@media (max-width: 1200px)
  .title
    font-size 1.5rem
    font-weight bold
</style>
