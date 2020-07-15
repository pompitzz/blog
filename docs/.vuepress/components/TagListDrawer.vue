<template>
    <div class="v-application">
        <v-navigation-drawer
                app
                right
                width="200"
                permanent
        >
            <v-row class="w-100; h-100 text-center"
                   align="center"
            >
                <v-col class="col-12">
                    <div v-for="(tag, index) in tags" v-bind:key="index">
                        <v-chip
                                style="width: 150px"
                                class="mt-3 font-weight-bold"
                                :color="tag.color"
                                label
                                @click="moveTo('/tag/' + tag.tagName)"
                                text-color="white"
                        >
                            <v-icon left>mdi-label</v-icon>
                            {{tag.tagName}} ({{tag.count}})
                        </v-chip>
                    </div>
                </v-col>
            </v-row>
        </v-navigation-drawer>
    </div>
</template>
<script>
    import {errorLogging} from "../utils/error";

    export default {
        name: "TagListDrawer",
        props: ['tags'],
        methods: {
            moveTo(path){
                this.$router.push(path).catch(errorLogging)
            }
        }
    }
</script>

<style scoped>

</style>