<template>
    <div class="v-application">
        <v-container>
            <v-row class="w-100 mx-auto">
                <v-chip
                        class="mr-2 mt-2 font-weight-bold"
                        v-for="(tag, index) in tags" v-bind:key="index"
                        :color="tag.color"
                        label
                        :to="'/tag/' + tag.tagName"
                        text-color="white"
                >
                    <v-icon left>mdi-label</v-icon>
                    {{tag.tagName}} ({{tag.count}})
                </v-chip>
            </v-row>
        </v-container>
    </div>
</template>
<script>
    import {tagStore} from "../utils/tag";
    import getPostsByPath from "../utils/htmlUtils";

    export default {
        name: "TagList",
        data() {
            return {
                tags:[],
                tagStore: tagStore()
            }
        },
        props: ["allPosts"],
        beforeMount() {
            this.tagStore.count(this.allPosts);
            this.tags = this.tagStore.values();
            this.tags.sort((a, b) => b.count - a.count);
        }
    }
</script>

<style scoped>

</style>