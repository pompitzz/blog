<template>
  <div :style="resolveStyle"
       class="tag"
       @click="move"
  >
    <div class="my-auto mr-2">
      <svg fill="white"
           height="22"
           version="1.1"
           viewBox="0 0 24 24"
           width="22"
           xmlns="http://www.w3.org/2000/svg"
           xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path d="M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z" />
      </svg>
    </div>
    <div class="my-auto">
      {{ tagName }}
    </div>
    <div class="my-auto">
      <span v-if="count">({{ count }})</span>
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

<style lang="stylus"
       scoped
>
.tag
  display inline-flex
  padding 0 12px
  color white
  height 24px
  font-weight bold
  border-radius 4px
  cursor pointer

</style>
