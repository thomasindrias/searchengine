<template>
  <v-container fluid>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <h1 class="mb-2 display-3 text-xs-center">Search Engine</h1>
          <v-form v-model="valid" ref="form" class="ma-3" lazy-validation>
            <v-container grid-list-xl fluid>
              <v-layout wrap>
                <v-flex xs12 sm6>
                  <v-text-field
                    label="Search"
                    v-model="query"
                    :rules="searchRules"
                    required
                    append-icon="search"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-select
                    :items="options"
                    v-model="filter"
                    label="select"
                    single-line
                    auto
                    append-icon="filter_list"
                    hide-details
                    item-text="option"
                    item-value="val"
                  ></v-select>
                </v-flex>
                <v-btn
                  @click="submit"
                  :disabled="!valid"
                  class="primary"
                >
                  Search
                </v-btn>
              </v-layout>
            </v-container>
          </v-form>
          <v-data-table
            :headers="headers"
            :items="results[0]"
            :rows-per-page-items="tableOpt"
            class="elevation-1 headline"
          >
            <template slot="items" slot-scope="props">
              <td><a v-bind:href="props.item.url">{{ props.item.title }}</a></td>
              <td class="text-xs-right">{{ props.item.url }}</td>
            </template>
            <template slot="no-data">
             <v-alert :value="true" color="error" icon="warning">
               No links, please search.
             </v-alert>
           </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
</v-container>
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
      headers: [
        {
        text: 'Links',
        align: 'left',
        sortable: false,
        value: 'link'
        },
        {
        text: 'Url',
        value: 'url',
        sortable: false,
        align: 'right'
        }
      ],
      query: '',
      valid: true,
      searchRules: [
        v => !!v || 'Search required'
      ],
      tableOpt: [10, {text:"All", value:-1}],
      filter: 0,
      queryGoogle: [],
      queryBing: [],
      results: [],
      groupID: '',
      select: { option: 'All', val: 0 },
      options: [
          { option: 'All', val: 0 },
          { option: 'Bing', val: 1 },
          { option: 'Google', val: 2 }
        ]
    }
  },
  methods: {
    submit () {
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
          this.APIFetch(this.query);
        }
      },

    APIFetch: function(query){
      this.refreshFetch();

      axios({
        method: 'get',
        url: 'https://www.googleapis.com/customsearch/v1?key=AIzaSyDvMAQgLw1lA_cz9QuyhKCSC7cwW7cgflY&cx=009623728814563280206:dto9xyi6jdy&q=' + query
        }).then( response => {
          /* eslint-disable no-console */
          //console.log(response.data.items);
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
      headers: { 'Ocp-Apim-Subscription-Key' : 'd71d7b2684334daca5987c838e432b2b' }
      }).then( response => {
        /* eslint-disable no-console */
        //console.log(response.data);
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  text-decoration: none;
}

</style>
