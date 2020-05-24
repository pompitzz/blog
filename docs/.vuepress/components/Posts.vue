<template>
    <div class="v-application">
        <v-row
                style="width: 100%"
                justify="center"
                v-if="showPosts.length"
        >
            <v-card
                    class="post-card"
                    v-for="(post, index) in showPosts"
                    :key="index"
                    :to="post.path"
                    hover
                    v-if="post.frontmatter"
            >
                <div class="post-card-img-wrapper">
                    <v-img class="post-card-img" :src="/img/ + post.frontmatter.img" alt=""></v-img>
                </div>
                <v-card-title class="post-card-title">{{post.frontmatter.title}}</v-card-title>
                <v-card-subtitle class="text--primary text-right">{{post.frontmatter.date}}</v-card-subtitle>
                <v-card-text class=text-center>
                    <v-chip
                            class="mr-2 font-weight-bold"
                            v-for="(tag, index) in post.frontmatter.tags" v-bind:key="index"
                            :color="getColor(tag)"
                            label
                            small
                            text-color="white"
                    >
                        <v-icon left>mdi-label</v-icon>
                        {{tag}}
                    </v-chip>
                </v-card-text>
            </v-card>
        </v-row>
    </div>
</template>

<script>
    import "vuetify/dist/vuetify.min.css";
    import "vuetify/dist/vuetify"
    import {tagStore} from "../utils/tag";

    export default {
        props: ["allPosts"],
        data() {
            return {
                showPosts: [],
                tagStore: tagStore(),
                pageNumber: 0,
                pageItemSize: 10,
            }
        },
        methods: {
            addNextshowPosts() {
                if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight)) {
                    if (this.showPosts.length === this.allPosts.length) return;
                    this.pageNumber += 1;
                    const start = (this.pageNumber - 1) * this.pageItemSize;
                    const end = (this.pageNumber * this.pageItemSize) > this.allPosts.length ? this.allPosts.length : (this.pageNumber * this.pageItemSize);
                    for (let i = start; i < end; i++) {
                        this.showPosts.push(this.allPosts[i]);
                    }
                }
            },
            getColor(tagName) {
                return this.tagStore.color(tagName);
            },
        },
        beforeMount() {
            for (let i = 0; i < this.pageItemSize; i++) {
                this.showPosts.push(this.allPosts[i]);
            }
            window.addEventListener("scroll", this.addNextshowPosts);
        }
    }
</script>

<style scoped>
    .post-card {
        width: 20rem;
        margin: 1rem;
    }

    .post-card-img {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }

    .post-card-img-wrapper {
        position: relative;
        width: 100%;
        height: 0;
        overflow: hidden;
        padding-bottom: 40%;
    }

    .post-card-title {
        width: 100%;
        font-size: 1rem !important;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        line-height: 1.5rem;
    }

    @media (max-width: 740px) {
        .post-card {
            width: 80%;
            margin-left: 10px;
            margin-right: 10px;
            margin-top: 20px;
        }
    }

    @media (max-width: 500px) {
        .post-card {
            width: 100%;
            margin-left: 10px;
            margin-right: 10px;
            margin-top: 20px;
        }
    }
</style>