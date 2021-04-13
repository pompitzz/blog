<template>
  <ParentLayout>
    <PostTitle
        v-if="$frontmatter.title"
        slot="page-top"
    />
  </ParentLayout>
</template>

<script>
import ParentLayout from './ParentLayout.vue';
import PostTitle from '../components/PostTitle.vue';

export default {
  name: 'Layout',
  components: { PostTitle, ParentLayout },
};
</script>

<style scoped>

</style>
