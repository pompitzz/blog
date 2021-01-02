<template>
  <div class="px-3 text-center">
    <Tag v-for="(tag, index) in tags"
         :key="index"
         :color="tag.color"
         :count="tag.count"
         :tagName="tag.tagName"
         class="mt-2"
         routing
    />
  </div>
</template>
<script>
import {errorLogging} from "../utils/error";
import Tag from "./Tag.vue";

export default {
  name: "TagList",
  components: { Tag },
  props: ['tags'],
  methods: {
    moveTo(path) {
      if (path === '/tag/ALL') {
        this.$router.push('/');
      } else {
        this.$router.push(path).catch(errorLogging);
      }
    }
  }
}
</script>

<style scoped>

</style>
