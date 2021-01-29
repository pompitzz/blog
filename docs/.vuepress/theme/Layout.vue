<template>
  <ParentLayout v-if="!loading">
    <PostTitle v-if="$frontmatter.title"
               class="v-application"
               slot="page-top"
    />
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
  data() {
    return {
      loading: true,
    };
  },
  components: { PostTitle, ParentLayout, Disqus },
  beforeMount() {
    import('vuetify/dist/vuetify.min.css').then(() => this.loading = false);
  },
};
</script>

<style scoped>

</style>
