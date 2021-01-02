<template>
  <div class="v-application">
    <v-container>
      <v-row class="w-100 mx-auto">
        <Tag v-for="(tag, index) in tags"
             :key="index"
             :count="tag.count"
             :tag="tag.tagName"
             class="mt-2"
        />
      </v-row>
    </v-container>
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
