import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import infiniteScroll from  'vue-infinite-scroll'


export default (
    {
        Vue, // the version of Vue being used in the VuePress app
        options, // the options for the root Vue instance
        router, // the router instance for the app
        siteData // site metadata
    }) => {
    Vue.use(Vuetify);
    Vue.use(infiniteScroll);
    options.vuetify = new Vuetify({})
};