<template>
    <div class="v-application d-block content-title">
        <v-row style="width: 100%">
            <div class="w-90 mx-auto">
                <h1 v-if="mobile" style="font-size: 1.5rem">{{post.title}}</h1>
                <h1 v-else>{{post.title}}</h1>
            </div>

            <div class="text--primary text-right w-100 mr-5 mt-2">
                작성일: {{post.date}}
            </div>
            <div class="w-100 text-center">
                <component v-if="Tag" :is="Tag" :tags="post.tags"/>
            </div>
            <hr class="content-divider">
        </v-row>
    </div>
</template>

<script>
    import {getTagStore} from "../utils/tag";

    export default {
        name: "ContentTitle.vue",
        props: ['Tag'],
        data() {
            return {
                tags: [],
            }
        },
        computed: {
            post() {
                return Object.assign({}, this.$page.frontmatter);
            }
        },
        beforeMount() {
            this.mobile = window.innerWidth < 1000;
            window.addEventListener('resize', this.changeTageViewer)
        },
        methods: {
            getColor(tagName) {
                return getTagStore().color(tagName);
            },
            changeTageViewer() {
                this.mobile = window.innerWidth < 1000;
            },
        }
    }
</script>

<style scoped>
    .content-title {
        width: 100%;
        text-align: center;
        margin-top: 6rem;
        padding-left: 0.3rem;
        padding-right: 0.3rem;
    }

    .content-divider {
        width: 100%;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
</style>