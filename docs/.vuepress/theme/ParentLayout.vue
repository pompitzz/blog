<template>
  <div :class="pageClasses"
       class="theme-container"
       @touchend="onTouchEnd"
       @touchstart="onTouchStart"
  >
    <Navbar v-if="shouldShowNavbar"
            @toggle-sidebar="toggleSidebar"
    />

    <div
        class="sidebar-mask"
        @click="toggleSidebar(false)"
    />

    <Sidebar :items="sidebarItems"
             @toggle-sidebar="toggleSidebar"
    >
      <template #top>
        <slot name="sidebar-top" />
      </template>
      <template #bottom>
        <slot name="sidebar-bottom" />
      </template>
    </Sidebar>
    <RightBar :currentPath="$route.path"
              :isTagMain="$page.frontmatter.home || $page.frontmatter.tagMain"
              :items="sidebarItems"
              :tags="tags"
    />
    <TagMain v-if="$page.frontmatter.home || $page.frontmatter.tagMain"
             :allPosts="allPosts"
             :tagName="$page.frontmatter.home ? null : $page.frontmatter.tagMain"
             :tags="tags"
    />
    <Page v-else
          :sidebar-items="sidebarItems"
    >
      <template #top>
        <slot name="page-top" />
      </template>
      <template #bottom>
        <slot name="page-bottom" />
      </template>
    </Page>
  </div>
</template>

<script>
import Home from '@theme/components/Home.vue';
import Navbar from '@theme/components/Navbar.vue';
import Page from '../components/default/Page.vue';
import Sidebar from '../components/default/Sidebar.vue';
import { resolveSidebarItems } from '@vuepress/theme-default/util/index.js';
import TagMain from '../components/TagMain.vue';
import RightBar from '../components/RightBar.vue';
import getPostsByPath from '../utils/htmlUtil.js';
import { getTagStore } from '../store/tag.js';

export default {
  name: 'Layout',

  components: {
    RightBar,
    TagMain,
    Home,
    Page,
    Sidebar,
    Navbar,
  },

  data() {
    return {
      isSidebarOpen: false,
      tags: [],
      allPosts: [],
    };
  },

  computed: {
    shouldShowNavbar() {
      const { themeConfig } = this.$site;
      const { frontmatter } = this.$page;
      if (
          frontmatter.navbar === false
          || themeConfig.navbar === false) {
        return false;
      }
      return (
          this.$title
          || themeConfig.logo
          || themeConfig.repo
          || themeConfig.nav
          || this.$themeLocaleConfig.nav
      );
    },

    shouldShowSidebar() {
      const { frontmatter } = this.$page;
      return (frontmatter.sidebar !== false && this.sidebarItems.length);
    },

    sidebarItems() {
      return resolveSidebarItems(
          this.$page,
          this.$page.regularPath,
          this.$site,
          this.$localePath,
      );
    },

    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass;
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar,
        },
        userPageClass,
      ];
    },

    showTagMain() {
      const { frontmatter } = this.$page;
      return frontmatter.home || frontmatter.tagMain;
    },
  },

  beforeMount() {
    this.allPosts = getPostsByPath('/', this.$site.pages);
    this.tags = getTagStore().getTagsWithCouting(this.allPosts);
    this.tags.sort((a, b) => b.count - a.count);
  },

  mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false;
    });
  },

  methods: {
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen;
      this.$emit('toggle-sidebar', this.isSidebarOpen);
    },

    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
    },

    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x;
      const dy = e.changedTouches[0].clientY - this.touchStart.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true);
        } else {
          this.toggleSidebar(false);
        }
      }
    },
  },
};
</script>
