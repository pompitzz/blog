<template>
    <div>
        <v-chip
                class="mr-2 font-weight-bold"
                v-for="(tag, index) in tags" v-bind:key="index"
                :color="getColor(tag)"
                :to="'/tag/' + tag"
                label
                small
                text-color="white"
        >
            <v-icon left>mdi-label</v-icon>
            {{tag}}
        </v-chip>
    </div>
</template>

<script>
    import {tagStore} from "../utils/tag";

    export default {
        name: "Tag",
        props: ['tags'],
        methods: {
            getColor(tag) {
                return tagStore().color(tag);
            }
        }
    }
</script>

<style scoped>

</style>