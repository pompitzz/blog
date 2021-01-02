<template>
  <div>
    <v-navigation-drawer
        app
        right
        width="200"
        permanent
    >
      <v-row class="w-100; h-100 text-center"
             align="center"
      >
        <v-col class="col-12">
          <div v-for="(tag, index) in tags"
               :key="index"
               class="mt-3"
          >
            <Tag :count="tag.count"
                 :tagName="tag.tagName"
                 :color="tag.color"
                 style="width: 150px; height: 32px"
                 routing
            />
          </div>
        </v-col>
      </v-row>
    </v-navigation-drawer>
  </div>
</template>
<script>
import {errorLogging} from "../utils/error";
import Tag from "./Tag.vue";

export default {
  name: "TagListDrawer",
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
