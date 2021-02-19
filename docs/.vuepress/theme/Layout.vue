<template>
  <ParentLayout>
    <ClientOnly>
      <PostTitle v-if="$frontmatter.title"
                 slot="page-top"
      />
    </ClientOnly>
    <Disqus v-if="$frontmatter.title"
            slot="page-bottom"
    />
  </ParentLayout>
</template>

<script>
import ParentLayout from './ParentLayout.vue';
import Disqus from '../components/Disqus';
import PostTitle from '../components/PostTitle.vue';

export default {
  name: 'Layout',
  components: { PostTitle, ParentLayout, Disqus },
};
</script>

<style scoped>

</style>
