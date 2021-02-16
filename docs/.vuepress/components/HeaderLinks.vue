<template>
  <div>
    <div v-for="header in headers"
         class="header"
    >
      <router-link :class="isActive(getHeaderPath(header.slug)) ? 'active' : ''"
                   :to="getHeaderPath(header.slug)"
                   class="rightbar-link"
      >
        {{ header.title }}
      </router-link>
      <HeaderLinks :headers="header.children"
                   :rootPath="rootPath"
      />
    </div>
  </div>
</template>

<script>
import { isActive } from '@vuepress/theme-default/util/index.js';

export default {
  name: 'HeaderLinks',
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    rootPath: {
      type: String,
      required: true,
    },
  },
  methods: {
    isActive(path) {
      return isActive(this.$route, path);
    },
    getHeaderPath(slug) {
      return `${this.rootPath}#${slug}`;
    },
  },
};
</script>

<style lang="stylus"
       scoped
>
.header
  padding 8px 0 0 1rem

  a.rightbar-link
    font-weight 400
    display inline-block
    color $textColor
    overflow hidden;
    text-overflow ellipsis;
    white-space: nowrap;
    width 100%

  a.rightbar-link.active
    font-weight: 600
    color: #3eaf7c
    border-left-color: #3eaf7c

</style>
