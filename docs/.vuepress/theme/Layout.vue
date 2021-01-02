<template>
  <v-app>
    <ParentLayout>
      <PostTitle v-if="this.$frontmatter.title"
                 slot="page-top"
      />
      <Disqus v-if="this.$frontmatter.title"
              slot="page-bottom"
      />
    </ParentLayout>
  </v-app>
</template>

<script>
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import Disqus from '../components/Disqus'
import PostTitle from "../components/PostTitle.vue";

export default {
  name: "Layout",
  components: { PostTitle, ParentLayout, Disqus },
}
</script>

<style scoped>

</style>
