<template>
    <div class="v-application">
        <v-container>
            <v-row class="w-100 mx-auto">
                <v-chip
                        class="mr-2 mt-2 font-weight-bold"
                        v-for="(tag, index) in tags" v-bind:key="index"
                        :color="tag.color"
                        :to="'/tag/' + tag.tagName"
                        label
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
    export default {
        name: "TagList",
        props: ['tags']
    }
</script>

<style scoped>

</style>