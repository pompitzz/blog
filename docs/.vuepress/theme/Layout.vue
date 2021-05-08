<template>
  <ParentLayout>
    <PostTitle
        v-if="$frontmatter.title"
        slot="page-top"
    />
    <UtterancesComment
        v-if="$frontmatter.title"
        slot="page-bottom"
    />
  </ParentLayout>
</template>

<script>
import ParentLayout from './ParentLayout.vue';
import PostTitle from '../components/PostTitle.vue';
import UtterancesComment from '../components/default/UtterancesComment.vue';

export default {
  name: 'Layout',
  components: { UtterancesComment, PostTitle, ParentLayout },
};
</script>

<style scoped>

</style>
