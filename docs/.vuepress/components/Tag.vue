<template>
  <div :style="resolveStyle"
       class="tag"
       @click="move"
  >
    <div class="my-auto">
      <v-icon class="white--text mr-2"
              v-text="'$label'"
      />
    </div>
    <div class="my-auto">
      {{ tagName }} <span v-if="count">({{ count }})</span>
    </div>
  </div>
</template>

<script>
import { getTagStore } from '../store/tag';
import { errorLogging } from '../utils/error';

export default {
  name: 'Tag',
  props: {
    tagName: {
      type: String,
      required: true,
    },
    routing: {
      type: Boolean,
      default: false,
    },
    count: {
      type: Number,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    resolveStyle() {
      if (!this.tagName) return;
      const color = this.color || getTagStore().color(this.tagName);
      const fontSize = this.small ? 12 : 14;
      return {
        'background-color': color,
        'border-color': color,
        'font-size': `${fontSize}px`,
      };
    },
  },
  methods: {
    move() {
      if (this.routing) {
        const path = this.tagName === 'ALL' ? '/' : `/tag/${this.tagName}`;
        this.$router.push(path).catch(errorLogging);
      }
    },
  },
};
</script>

<style scoped>
.tag {
  display: inline-flex;
  margin-right: 8px;
  padding: 0 12px;
  color: white;
  height: 24px;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
}
</style>
