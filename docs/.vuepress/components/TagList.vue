<template>
  <div class="px-8 text-center">
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
import Tag from './Tag.vue';

export default {
  name: 'TagList',
  components: { Tag },
  props: ['tags'],
}
</script>
