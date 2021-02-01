<template>
  <main :style="$route.query.open ? 'padding-left: 0' : null"
        class="page"
  >
    <slot name="top" />

    <Content class="theme-default-content" />
    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />

    <slot name="bottom" />
  </main>
</template>

<script>
import PageEdit from '@theme/components/PageEdit.vue';
import PageNav from '@theme/components/PageNav.vue';

export default {
  components: { PageEdit, PageNav },
  props: ['sidebarItems'],
  mounted() {
    if (this.$route.query.open) {
      const detailsElements = document.querySelectorAll('details');
      detailsElements.forEach(it => it.open = true);
    }
  },
};
</script>

<style lang="stylus">
@require '~@vuepress/theme-default/styles/wrapper.styl';

.page
  padding-bottom 2rem
  display block

</style>
