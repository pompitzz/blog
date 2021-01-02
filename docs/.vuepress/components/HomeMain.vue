<template>
  <div>
    <component :is="TagMain"
               v-if="TagMain"
               :tagName="tagName"
    />
  </div>
</template>

<script>
import TagMain from "./TagMain.vue";

export default {
  name: "HomeMain",
  props: {
    tagName: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      TagMain: null,
    }
  },
  beforeMount() {
    import('vuetify/dist/vuetify.min.css').then(() => {
      this.TagMain = TagMain;
    })
  },
}
</script>

<style scoped>

</style>
