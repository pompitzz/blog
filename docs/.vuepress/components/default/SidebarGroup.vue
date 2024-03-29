<template>
  <section
      :class="[
      {
        collapsable,
        'is-sub-group': depth !== 0
      },
      `depth-${depth}`
    ]"
      class="sidebar-group"
  >
    <RouterLink
        v-if="item.path"
        :class="{
        open,
        'active': isActive($route, item.path)
      }"
        :to="item.path"
        class="sidebar-heading clickable"
        @click.native="$emit('toggle')"
    >
      <span>{{ item.title }}</span>
      <span
          v-if="collapsable"
          :class="open ? 'down' : 'right'"
          class="arrow"
      />
    </RouterLink>

    <p
        v-else
        :class="{ open }"
        class="sidebar-heading"
        @click="$emit('toggle')"
    >
      <span>{{ item.title }}</span>
      <span
          v-if="collapsable"
          :class="open ? 'down' : 'right'"
          class="arrow"
      />
    </p>

    <DropdownTransition>
      <SidebarLinks
          v-if="open || !collapsable"
          :depth="depth + 1"
          :items="item.children"
          :sidebar-depth="item.sidebarDepth"
          class="sidebar-group-items"
      />
    </DropdownTransition>
  </section>
</template>

<script>
import { isActive } from '@vuepress/theme-default/util/index.js';
import DropdownTransition from '@theme/components/DropdownTransition.vue';

export default {
  name: 'SidebarGroup',

  components: {
    DropdownTransition,
  },

  props: [
    'item',
    'open',
    'collapsable',
    'depth',
  ],

  // ref: https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components
  beforeCreate() {
    this.$options.components.SidebarLinks = require('./SidebarLinks.vue').default;
  },

  methods: { isActive },
};
</script>

<style lang="stylus">
.sidebar-group
  .sidebar-group
    padding-left 0.5em

  &:not(.collapsable)
    .sidebar-heading:not(.clickable)
      cursor auto
      color inherit

  // refine styles of nested sidebar groups

  &.is-sub-group
    padding-left 0

    & > .sidebar-heading
      font-size 0.95em
      line-height 1.4
      font-weight normal
      padding-left 2rem

      &:not(.clickable)
        opacity 0.5

    & > .sidebar-group-items
      padding-left 1rem

      & > li > .sidebar-link
        font-size: 0.95em;
        border-left none

  &.depth-2
    & > .sidebar-heading
      border-left none

.sidebar-heading
  color $textColor
  transition color .15s ease
  cursor pointer
  font-size 14px
  font-weight bold
  // text-transform uppercase
  padding 0 1.5rem 0 0.8rem
  width 100%
  box-sizing border-box
  margin 0
  border-left 0.25rem solid transparent

  &.open, &:hover
    color inherit

  .arrow
    position relative
    top -0.12em
    left 0.5em

  &.clickable
    &.active
      font-weight 600
      color $accentColor
      border-left-color $accentColor

    &:hover
      color $accentColor

.sidebar-group-items
  transition height .1s ease-out
  font-size 0.95em
  overflow hidden

.sidebar-group.is-sub-group > .sidebar-heading
  font-size 13px !important
  font-weight bold !important
  color #2c3e50 !important
</style>
