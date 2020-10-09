<template>
  <div>
    <v-chip
        class="mr-2 mt-2 font-weight-bold"
        v-for="(tag, index) in tags" v-bind:key="index"
        :color="getColor(tag)"
        @click="moveTo('/tag/' + tag)"
        label
        small
        text-color="white"
    >
      <v-icon left>mdi-label</v-icon>
      {{ tag }}
    </v-chip>
  </div>
</template>

<script>
import {getTagStore} from "../store/tag";
import {errorLogging} from "../utils/error";

export default {
  name: "Tag",
  props: ['tags', 'canRouting'],
  methods: {
    getColor(tag) {
      return getTagStore().color(tag);
    },
    moveTo(path) {
      if (this.canRouting) {
        this.$router.push(path).catch(errorLogging)
      }
    }
  }
}
</script>

<style scoped>

</style>
