<template>
    <div class="v-application d-block content-title">
        <v-row style="width: 100%">
                <div class="w-90 mx-auto">
                    <h1 v-if="mobile" style="font-size: 1.5rem">{{title}}</h1>
                    <h1 v-else>{{title}}</h1>
                </div>

                <div class="text--primary text-right w-100 mr-5 mt-2">
                    작성일: {{date}}
                </div>
                <div class="w-100 text-center">
                    <Tag :tags="tags"/>
                </div>
                <hr class="content-divider">
        </v-row>
    </div>
</template>

<script>

    import {tagStore} from "../utils/tag";
    import Tag from "./Tag";

    export default {
        name: "ContentTitle.vue",
        components: {Tag},
        data() {
            return {
                title: '',
                tags: [],
                date: '',
                mobile: '',
            }
        },
        beforeMount() {
            const frontmatter = this.$page.frontmatter;
            this.title = frontmatter.title;
            this.tags = frontmatter.tags;
            this.date = frontmatter.date;
            this.mobile = window.innerWidth < 1000;
            window.addEventListener('resize', this.changeTageViewer)
        },
        methods: {
            getColor(tagName) {
                return tagStore().color(tagName);
            },
            changeTageViewer() {
                this.mobile = window.innerWidth < 1000;
                console.log(this.mobile)
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