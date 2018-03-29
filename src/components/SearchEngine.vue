<template>
  <div class="container">
    <div class="page-header">
      <h1>Search Engine with Vue.js 2 and Firebase</h1>
    </div>

    <div class="card my-2">
      <div class="card-header">
        <h3>Search</h3>
      </div>
      <div class="card-body">
        <form id="form" class="form-inline" v-on:submit.prevent="APIFetch(query)">
          <div class="form-group">
            <input type="text" id="search" placeholder="Search here" class="form-control" v-model="query">
          </div>
          <input type="submit" class="btn btn-primary mx-2" value="Search">
        </form>
      </div>
    </div>

    <div class="card my-2">
      <div class="card-header">
        <h3>Search results</h3>
      </div>
      <div class="card-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>
                Title
              </th>
              <th>
                Url
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="link in links['0']">
              <td>
                <a v-bind:href="link.url">{{link.title}}</a>
              </td>
              <td>
                {{link.url}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Firebase from 'firebase'
import toastr from 'toastr'
import axios from 'axios'

let config = {
  apiKey: "AIzaSyBuw1TqFq2S4ZTy86XF2nmdVhy9hgH7vdg",
  authDomain: "search-engine-6c5c8.firebaseapp.com",
  databaseURL: "https://search-engine-6c5c8.firebaseio.com",
  projectId: "search-engine-6c5c8",
  storageBucket: "search-engine-6c5c8.appspot.com",
  messagingSenderId: "157490481509"
}

let app = Firebase.initializeApp(config);
let db = app.database();

let linkRef = db.ref('links')

export default {
  name: 'SearchEngine',
  firebase: {
    links: linkRef
  },
  data () {
    return {
      query: '',
      results: []
    }
  },
  methods: {
    APIFetch: function(query){
      this.refreshFetch();
      var request = [];

      axios({
        method: 'get',
        url: 'https://www.googleapis.com/customsearch/v1?key=AIzaSyDvMAQgLw1lA_cz9QuyhKCSC7cwW7cgflY&cx=009623728814563280206:dto9xyi6jdy&q=' + query
        }).then( response => {
          /* eslint-disable no-console */
          console.log(response.data.items);
          /* eslint-disable no-console */
          for (var i = 0; i < response.data.items.length; i++) {
            request.push({
              title: response.data.items[i].title,
              url: response.data.items[i].link
            })
          }
          this.fireBasePush(request);
          this.resultSort();
      });

      axios({
      method: 'get',
      url: 'https://api.cognitive.microsoft.com/bing/v7.0/search?q=' + query + '&responseFilter=webpages',
      headers: { 'Ocp-Apim-Subscription-Key' : '7f0afa4ee261486794c2106b68dea25e' }
      }).then( response => {
        /* eslint-disable no-console */
        console.log(response.data);
        /* eslint-disable no-console */
        for (var i = 0; i < response.data.webPages.value.length; i++) {
          request.push({
            title: response.data.webPages.value[i].name,
            url: response.data.webPages.value[i].url,
          })
        }
      });
    },

    refreshFetch: function(){
      linkRef.remove();
      toastr.success("Search completed");
    },

    fireBasePush: function(data){
      linkRef.push(data);
    },

    resultSort: function(){
      for (var i = 0; i < this.links.length; i++) {
        console.log(this.links);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
