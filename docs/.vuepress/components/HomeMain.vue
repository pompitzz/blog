<template>
  <div>
    <!--    <component :is="TagMain"-->
    <!--               v-if="TagMain"-->
    <!--               :tagName="tagName"-->
    <!--    />-->
    <TagMain :tagName="tagName" />
  </div>
</template>

<script>

export default {
  name: "HomeMain",
  props: {
    tagName: {
      type: String,
      required: false,
    },
  },
  // data() {
  //   return {
  //     TagMain: null,
  //   }
  // },
  components: {
    TagMain: () => import('./TagMain.vue')
  },
  // beforeMount() {
  //   import('vuetify/dist/vuetify.min.css').then(() => {
  //     this.TagMain = TagMain;
  //   })
  // },
}
</script>

<style scoped>

</style>
