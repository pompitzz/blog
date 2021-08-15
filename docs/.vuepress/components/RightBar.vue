<template>
  <aside class="rightbar">
    <div v-if="isTagMain"
         class="flex flex-col justify-center align-middle h-full"
    >
      <div v-for="(tag, index) in tags"
           :key="index"
           class="text-center"
      >
        <Tag :color="tag.color"
             :count="tag.count"
             :tagName="tag.tagName"
             class="mt-3 justify-center"
             routing
             style="width: 130px; height: 30px;"
        />
      </div>
    </div>
    <HeaderLinks v-else
                 :headers="headers"
                 :rootPath="currentPath"
                 class="pr-2"
    />
  </aside>
</template>

<script>
import { groupHeaders } from '@vuepress/theme-default/util/index.js';
import HeaderLinks from './HeaderLinks.vue';
import Tag from './Tag.vue';

export default {
  name: 'RightBar',
  components: { Tag, HeaderLinks },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    currentPath: {
      type: String,
    },
    tags: {
      type: Array,
      required: true,
    },
    isTagMain: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    headers() {
      const currentItem = findCurrentItem(this.items, this.currentPath);
      if (currentItem && currentItem.headers) {
        return groupHeaders(currentItem.headers);
      }
      return [];
    },
  },
};

function findCurrentItem(items, currentPath) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type === 'group') {
      const currentItem = findCurrentItem(item.children, currentPath);
      if (currentItem) {
        return currentItem;
      }
    } else {
      if (currentPath === item.path) {
        return item;
      }
    }
  }
  return null;
}
</script>

<style lang="stylus"
       scoped
>
.rightbar
  font-size: 13px;
  background-color: #fff;
  width: $rightbarWidth;
  position: fixed;
  z-index: 10;
  margin: 0;
  top: 3.6rem;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  border-left: 1px solid #eaecef;
  overflow-y: auto;
  padding 1rem 0 1rem 0

  ul
    list-style-type none


@media (max-width: $MQXMobile)
  .rightbar
    display none
</style>
