<template>
		<v-container>
				<h3 class="my-5">
					Lanches
				</h3>

				<v-snackbar
					v-model="state.cardLoading"
					multi-line
					:timeout="2000"
					location="top"
					elevation="24"
					:color="state.loadCardText ? 'green-lighten-5' :  'red-lighten-5'"
				>
					{{ state.loadCardText ? 'Added new favorites!' : 'Removed favorites!' }}
				</v-snackbar>

				<v-row justify="space-between">
					<v-col cols="10" >
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
						cols="2"
						offset="30"
					>
					<v-sheet class="pa-2 ma-4">
						<v-btn-toggle
						v-model="state.defaultToggle"
						color="indigo-lighten-3"
						borderless
						mandatory
						>

							<v-btn value="left" @click="sortDataByType(0)">
								<span class="hidden-sm-and-down"></span>
								<v-icon end>
								mdi-format-align-left
								</v-icon>
							</v-btn>

							<v-btn value="right"  @click="sortDataByType(1)">
								<span class="hidden-sm-and-down"></span>

								<v-icon end>
									mdi-sort-ascending
								</v-icon>
							</v-btn>

							<v-btn value="justify"  @click="sortDataByType(2)">
								<span class="hidden-sm-and-down"></span>
								<v-icon end>
									mdi-sort-descending
								</v-icon>
							</v-btn>
						</v-btn-toggle>
					</v-sheet>
					</v-col>
				</v-row>

				<v-progress-linear  indeterminate v-show="state.loading"  color="indigo-darken-1"></v-progress-linear>
				<v-row no-gutters>

				<v-row no-gutters v-if="state.loading" >
					<v-col v-for="(n, index) in state.pages.length < 16 ? 16 : state.pages.length" :key="index" cols="3" >
					<v-skeleton-loader class="mx-auto my-12" elevation="2" max-width="400" type="image, article"></v-skeleton-loader>
					</v-col>
				</v-row>

				<Card
					v-else
					:data="visiblePages"
					:storedData="store.listOfFavorite"
					:loading="state.loading"
					:cardLoading="state.cardLoading"
					:loadCard="state.loadCard"
					:isNoRecord="state.noRecord"
					@addingFavorite="addingFavorite"
					@removeFavorites="removeFavorites"
					cardType="launches"
				/>

				</v-row>
				<v-pagination
					v-model="state.page"
					:total-visible="state.totalPerPage/2"
					:length="Math.ceil(state.pages.length/state.totalPerPage)"
				>
				</v-pagination>
		</v-container>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

definePageMeta({
	icon: 'mdi-launch',
	title: 'Launches',
	drawerIndex: 1,
  })

const store = useFavorite();
const state: any = reactive({
	icon: 'justify',
	defaultToggle: 0,
	dateSearch: '',
	loading: false,
	headers: [
		  { key: 'action', title: 'Action',  width: '80', sortable: false, },
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
	cardLoading: false,
	loadCard: null,
	loadCardText: null,


	page: 1,
    totalPerPage: 16,
    pages: [],

	noRecord: false,

})

const visiblePages = computed(() =>
    state.pages.slice((state.page - 1)* state.totalPerPage, state.page* state.totalPerPage)
);

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
		state.pages = data.value?.launches
		state.loading = false;
    }, 2000)

	console.log(store.listOfFavorite)
})

const searchData = (value: any) => {
	state.loading = true;
	setTimeout(()=>{
		if(value !== null){
			state.pages = filteringData(data.value?.launches, value)
		}else{
			state.pages = data.value?.launches
		}
		state.loading = false;
    }, 2000)
};

const resetSearch = () => {
	state.loading = true;
	setTimeout(()=>{
		state.pages = data.value?.launches
		state.dateSearch = null;
		state.loading = false;
    }, 2000)
};


const sortDataByType = (type: number) => {
		state.dateSearch = null
		state.loading = true;
		setTimeout(()=>{
			if(!type){
				state.pages = data.value?.launches
			}
			if(type){
				state.pages = sortData(data.value?.launches, 'asc')
			}
			if(type == 2){
				state.pages = sortData(data.value?.launches, 'desc')
			}
			state.loading = false;
		}, 2000)
		state.pages = data.value?.launches

};


const addingFavorite = (data: any, index: number) => {
	state.cardLoading = true;
	state.loadCard = index;
	state.loadCardText = 1;
	store.addNewFavorite(data)
	setTimeout(()=>{
		state.loadCard = null;
		state.cardLoading = false;
    }, 2000)
	console.log(store.listOfFavorite)
}

const removeFavorites = (data: any, index: number) => {
	state.cardLoading = true;
	state.loadCard = index;
	state.loadCardText = 0;
	store.removeFavorite(data)
	setTimeout(()=>{
		state.cardLoading = false;
		state.loadCard = null;
    }, 2000)
}

</script>

<style scoped>
.desc{
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow: hidden;
	-webkit-line-clamp: 6;
}
</style>
