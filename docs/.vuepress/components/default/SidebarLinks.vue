<template>
  <ul v-if="items.length"
      class="sidebar-links"
  >
    <li v-for="(item, i) in items"
        :key="i"
    >
      <SidebarGroup v-if="item.type === 'group'"
                    :collapsable="item.collapsable || item.collapsible"
                    :depth="depth"
                    :item="item"
                    :open="isOpen(item, i)"
                    @toggle="toggleGroup(i)"
      />
      <SidebarLink v-else
                   :item="item"
                   :sidebar-depth="sidebarDepth"
      />
    </li>
  </ul>
</template>

<script>
import SidebarGroup from './SidebarGroup.vue';
import SidebarLink from './SidebarLink.vue';
import { isActive } from '@vuepress/theme-default/util/index.js';

export default {
  name: 'SidebarLinks',

  components: { SidebarGroup, SidebarLink },

  props: [
    'items',
    'depth',  // depth of current sidebar links
    'sidebarDepth', // depth of headers to be extracted
  ],

  data() {
    return {
      openGroupIndex: 0,
      openIndexMap: {},
    }
  },

  created() {
    this.refreshIndex()
  },

  methods: {
    refreshIndex() {
      // console.group()
      // console.log('items length. ', this.items.length)
      // console.log('depth:', this.depth);
      // this.items.forEach(item => console.log(item));
      // console.groupEnd()
      if (this.isSupportSidbarToggle()) {
        for (let index = 0; index < this.items.length; index++) {
          this.openIndexMap[index] = true;
        }
      }
    },

    toggleGroup(index) {
      if (this.isSupportSidbarToggle()) {
        this.openIndexMap = {
          ...this.openIndexMap,
          [index]: !this.openIndexMap[index],
        };
      }
    },

    isActive(page) {
      return isActive(this.$route, page.regularPath)
    },

    isOpen(item, index) {
      if (this.isSupportSidbarToggle()) {
        return this.openIndexMap[index];
      }
      // console.log(item.path, this.$route.path, item.path === this.$route.path);
      return this.$route.path.startsWith(item.path);
    },
    isSupportSidbarToggle() {
      return this.depth === 0;
    }
  }
}

function resolveOpenGroupIndex(route, items) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (descendantIsActive(route, item)) {
      return i
    }
  }
  return -1
}

function descendantIsActive(route, item) {
  if (item.type === 'group') {
    return item.children.some(child => {
      if (child.type === 'group') {
        return descendantIsActive(route, child)
      } else {
        return child.type === 'page' && isActive(route, child.path)
      }
    })
  }
  return false
}
</script>
