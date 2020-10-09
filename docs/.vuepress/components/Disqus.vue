<template>
  <div id="disqus_thread"></div>
</template>

<script>
export default {
  name: "Disqus",
  mounted() {
    /**
     *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
     *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

    const disqus_config = function () {
      this.page.url = location.origin;  // Replace PAGE_URL with your page's canonical URL variable
      this.page.identifier = location.pathname; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    (function () { // DON'T EDIT BELOW THIS LINE
      const d = document, s = d.createElement('script');
      s.src = 'https://vuepress-blog.disqus.com/embed.js';
      s.setAttribute('data-timestamp', String(new Date()));
      (d.head || d.body).appendChild(s);
    })();
  }
}
</script>

<style scoped>
#disqus_thread {
  padding-left: 40px;
  padding-right: 40px;
}
</style>
