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
        <form id="form" class="form-inline" v-on:submit.prevent="APIFetch(query, filter)">
          <div class="form-group">
            <input type="text" id="search" placeholder="Search here" class="form-control" v-model="query">
          </div>
          <div class="form-group">
          <div class="col-auto my-1">
            <select class="custom-select mr-sm-2" id="filter" v-model="filter">
              <option selected>All</option>
              <option value="1">Bing</option>
              <option value="2">Google</option>
            </select>
          </div>
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
            <tr v-for="result in results[0]">
              <td>
                <a v-bind:href="result.url">{{result.title}}</a>
              </td>
              <td>
                {{result.url}}
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

let linkRef = db.ref('links');

export default {
  name: 'SearchEngine',
  firebase: {
    links: linkRef
  },
  data () {
    return {
      query: '',
      filter: 0,
      queryGoogle: [],
      queryBing: [],
      results: [],
      groupID: ''
    }
  },
  methods: {
    APIFetch: function(query){
      this.refreshFetch();

      axios({
        method: 'get',
        url: 'https://www.googleapis.com/customsearch/v1?key=AIzaSyDvMAQgLw1lA_cz9QuyhKCSC7cwW7cgflY&cx=009623728814563280206:dto9xyi6jdy&q=' + query
        }).then( response => {
          /* eslint-disable no-console */
          console.log(response.data.items);
          /* eslint-disable no-console */
          for (var i = 0; i < response.data.items.length; i++) {
            linkRef.push({
              title: response.data.items[i].title,
              url: response.data.items[i].link
            })
            this.queryGoogle.push({
              title: response.data.items[i].title,
              url: response.data.items[i].link
            })
          }
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
          linkRef.push({
            title: response.data.webPages.value[i].name,
            url: response.data.webPages.value[i].url
          })
          this.queryBing.push({
            title: response.data.webPages.value[i].name,
            url: response.data.webPages.value[i].url
          })
        }
      });
    this.resultSort();
    },

    refreshFetch: function(){
      linkRef.remove();
      this.results = [];
      this.queryBing = [];
      this.queryGoogle = [];
      toastr.success("Search completed");
    },

    resultSort: function(){
      if(this.filter == 1) {
        this.results.push(this.queryBing);
        console.log('1');
      }
      else if(this.filter == 2){
        this.results.push(this.queryGoogle);
        console.log('2');
      }
      else {
        this.results.push(this.links);
        console.log('0');
      }

      /*this.links.sort(function(a, b) {
        var linkA = a.url.toUpperCase(); // ignore upper and lowercase
        var linkB = b.url.toUpperCase(); // ignore upper and lowercase
        if (linkA < linkB) {
          return -1;
        }
        if (linkA > linkB) {
          return 1;
        }

        // links must be equal
        return 0;
      }); */

      //this.results.push(this.links);
      console.log(this.results);
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
