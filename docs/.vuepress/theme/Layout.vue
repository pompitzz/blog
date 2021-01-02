<template>
  <ParentLayout>
    <ContentTitle v-if="this.$frontmatter.title"
                  slot="page-top"
    />
    <Disqus v-if="this.$frontmatter.title"
            slot="page-bottom"
    />
  </ParentLayout>
</template>

<script>
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import Disqus from '../components/Disqus'
import ContentTitle from "../components/ContentTitle";

export default {
  name: "Layout",
  components: { ContentTitle, ParentLayout, Disqus },
}
</script>

<style scoped>

</style>
