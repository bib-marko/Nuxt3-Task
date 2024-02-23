<template>
	<v-container>
		<h3 class="my-5">
			Lanches
		</h3>


		  <v-btn @click="showSnackbar('success')">
			Show Success Snackbar
		  </v-btn>


		  <!-- <SnackbarCustom :snackbar="mySnackbar" /> -->



		<!-- <v-snackbar
			v-model="state.showAlert"
			:timeout="2000"
			location="top"
			:color="state.showAlert ? 'green-lighten-5' : 'red-lighten-5'"
		>
			{{
				state.showAlert ? 'Added New Favorites!' : 'Favorite is already removed!'
			}}
			<template v-slot:actions>
				<v-btn size="small" color="light-green-darken-4" variant="text" icon="mdi-close"  @click="state.showAlert = false"></v-btn>
			</template>

		</v-snackbar> -->

		<v-row justify="space-between">
			<v-col
			  cols="8"
			>
			  <v-sheet class="pa-2 ma-2">
				<v-sheet class="pa-2 ma-2">
					<v-row justify="space-around">
						<v-text-field  v-model="state.dateSearch" label="Launch Date" type="date" ></v-text-field>
						<v-btn variant="plain" color="indigo-accent-3" size="x-large" @click="searchData(state.dateSearch)">
							Find
						</v-btn><br>
						<v-btn variant="plain" color="indigo-accent-3" size="x-large" @click="resetSearch(state.dateSearch)">
							Reset
						</v-btn>
					</v-row>
				</v-sheet>
			  </v-sheet>
			</v-col>

			<v-col
			  cols="4"
			  offset="30"
			>
			  <v-sheet class="pa-2 ma-2">
				<p>Sort Launch Date</p>

				<v-btn-toggle
				v-model="state.defaultToggle"
				color="indigo-lighten-3"
				borderless
				mandatory
				>
					<v-btn value="left" @click="sortDataByType(0)">
						<span class="hidden-sm-and-down">Normal Data</span>

						<v-icon end>
						mdi-format-align-left
						</v-icon>
					</v-btn>

					<v-btn value="right"  @click="sortDataByType(1)">
						<span class="hidden-sm-and-down">Ascending</span>

						<v-icon end>
							mdi-sort-ascending
						</v-icon>
					</v-btn>

					<v-btn value="justify"  @click="sortDataByType(2)">
						<span class="hidden-sm-and-down">Descending</span>

						<v-icon end>
							mdi-sort-descending
						</v-icon>
					</v-btn>
				</v-btn-toggle>
			  </v-sheet>
			</v-col>
		  </v-row>


		<v-data-table
			:headers="state.headers"
			:items="state.tableData"
			:loading="state.loading"
			>

			<template v-slot:item.action="{ item, index }">
				<v-btn size="small"
					color="yellow-darken-1"
					variant="text"
					:icon="store.listOfFavorite.includes(item) ? 'mdi-star' : 'mdi-star-outline'"
					@click="store.listOfFavorite.includes(item) ? removeToFavorites(item, index) : addToFavorites(item, index)"
				></v-btn>
			  </template>
		</v-data-table>
	</v-container>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import SnackbarCustom from '~/components/SnackbarCustom.vue';
const mySnackbar = reactive({
  show: false,
  color: '', // Empty to be dynamically filled
  textColor: '',
  timeout: 0, // Use default in SnackbarWrapper
  icon: '',
  text: '',
});


const store = addFavorites();
const state: any = reactive({
	icon: 'justify',
	defaultToggle: 0,
	dateSearch: '',
	loading: false,
	headers: [
		  { key: 'action', title: 'Action', sortable: false, },
          { key: 'mission_name', title: 'Mission Name', width: '150', sortable: false, },
          { key: 'launch_date_local', title: 'Launch Date', width: '300', sortable: false, },
          { key: 'launch_site.site_name', title: 'Launch Site', width: '150', sortable: false, },
          { key: 'rocket.rocket_name', title: 'Rocket Name', width: '150', sortable: false, },
          { key: 'details', title: 'Details', sortable: false, },


	],
	dateFormat: {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'UTC'
	},
	tableData: [],
	showAlert: false,
	hideAlert: false,

})

const query = gql`
query GetLaunches {
  launches {
		mission_name
		launch_date_local
		launch_site {
			site_id
			site_name
		}
		rocket {
			rocket_name
		}
		details
	}
}
`

const { data } = useAsyncQuery<{
	launches: {
		mission_name: String
		launch_date_local: Date
		launch_site: {
			site_name: String
		}
		rocket: {
			rocket_name: String
		}
		details: String
	}[]
}>(query)

onMounted(() => {
	state.loading = true;
	setTimeout(()=>{
		state.tableData = data.value?.launches
		state.loading = false;
    }, 2000)
})

const searchData = (value: any) => {
	state.loading = true;
	setTimeout(()=>{
		if(value !== null){
			state.tableData = filteringData(data.value?.launches, value)
		}else{
			state.tableData = data.value?.launches
		}
		state.loading = false;
    }, 2000)
};

const resetSearch = () => {
	state.dateSearch = null
	state.loading = true;
	setTimeout(()=>{
		state.tableData = data.value?.launches
		state.loading = false;
    }, 2000)
};


const sortDataByType = (type: number) => {

		state.dateSearch = null
		state.loading = true;
		setTimeout(()=>{
			if(!type){
				state.tableData = data.value?.launches
			}
			if(type){
				state.tableData = sortData(data.value?.launches, 'asc')
			}
			if(type == 2){
				state.tableData = sortData(data.value?.launches, 'desc')
			}
			state.loading = false;
		}, 2000)
		state.tableData = data.value?.launches

};


const addToFavorites = (data: any, index: number) => {
	state.showAlert = true;
	store.addNewFavorite(data)
	setTimeout(()=>{
		state.showAlert = false;
    }, 2000)
	console.log(store.listOfFavorite)
}

const removeToFavorites = (data: any, index: number) => {

	state.hideAlert = true;
	store.removeFavorite(data)
	setTimeout(()=>{
		state.hideAlert = false;
		state.loading = false;
    }, 2000)
}

const showSnackbar = (type: any) => {
  mySnackbar.show = true;
  mySnackbar.color = type === 'success' ? 'success' : 'error'; // Set color based on type
  mySnackbar.icon = type === 'success' ? 'mdi-check' : 'mdi-alert'; // Set icon based on type
  mySnackbar.timeout = 5000; // Override default if needed
  mySnackbar.text = type === 'success' ? 'Added' : 'Deleted';
}

</script>
