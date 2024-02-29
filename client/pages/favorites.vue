<template>
	<v-container>
	<h3 class="my-5">
		Favorite Rockets
	</h3>

	<v-progress-linear  indeterminate v-show="state.loading"  color="indigo-darken-1"></v-progress-linear>

	<v-row no-gutters>

		<v-row no-gutters v-if="state.loading" >
			<v-col v-for="(n, index) in 16" :key="index" cols="3" >
			<v-skeleton-loader class="mx-auto my-12" elevation="2" max-width="400" type="image, article"></v-skeleton-loader>
			</v-col>
		</v-row>


		<v-card v-show="!state.loading && store.listOfFavorite.length != 0" class="mx-auto my-12"
			max-width="374"
			:loading="state.loadCard == index ? state.cardLoading : null"
			v-for="(rocket, index) in visiblePages"
			:key="index"
		>
				<v-card-title>{{ rocket.rocket.rocket_name }}</v-card-title>
				<v-card-text>
					<v-row align="center" class="mx-0">
						<div class="grey--text"><b>Launch Date:</b> {{ rocket.launch_date_local 	}}</div>
						<div class="grey--text mb-4"><b>Mission Name:</b> {{ rocket.mission_name 	}}</div>
					</v-row>
					<div>
						<b>Details:</b>
						{{ rocket.details.substr(0, 180) + '...' }}
					</div>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn size="small"
							color="red-darken-1"
							variant="text"
							:icon="store.listOfFavorite.some((e: any) => e.mission_name === rocket.mission_name) ? 'mdi-heart' : 'mdi-heart-outline'"
							@click="store.listOfFavorite.some((e: any) => e.mission_name === rocket.mission_name) ? removeFavorites(rocket, index) : addingFavorite(rocket, index)" >
						</v-btn>
					</v-card-actions>
				</v-card-text>
		</v-card>

		<v-card
			v-show="state.noRecord"
			class="mx-auto my-12"
			max-width="374"
			elevation="0"
		>
			<v-sheet class="ma-2 pa-2">
				<img src="../images/no_record_found.jpg" alt="No Record Found" style="max-width: 100%;" />
			</v-sheet>
		</v-card>


	</v-row>

		<v-pagination
			v-if="!state.loading && store.listOfFavorite.length != 0"
			v-model="state.page"
			:total-visible="state.totalPerPage/2"
			:length="Math.ceil(state.pages.length/state.totalPerPage)"
		>
		</v-pagination>

</v-container>
</template>
<script lang="ts" setup>
import { reactive, computed } from 'vue';

definePageMeta({
  icon: 'mdi-account-star',
  title: 'Favorites',
  drawerIndex: 2,
})

const store = useFavorite()

const state: any = reactive({
	filterData: '',
	loading: false,
	showAlert: false,
	hideAlert: false,
	headers: [
		{ key: 'name', title: 'Rocket Name', width: '150', align: 'center' },
		{ key: 'description', title: 'Description', width: '300' },
		{ key: 'first_flight', title: 'First Flight', width: '150' },
		{ key: 'height.feet', title: 'Height', width: '100', align: 'center' },
		{ key: 'diameter.meters', title: 'Diameter', align: 'center' },
		{ key: 'mass.kg', title: 'Mass', align: 'center' },
		{ key: 'stages', title: 'No. of Stages', align: 'center' },
		{ key: 'action', title: 'Action', align: 'center' },

	],
	count: 0,
	page: 1,
    totalPerPage: 16,
    pages: store.listOfFavorite,

	cardLoading: false,
	loadCard: null,
	loadCardText: null,

	noRecord: false,
})

const visiblePages = computed(() =>
    state.pages.slice((state.page - 1)* state.totalPerPage, state.page* state.totalPerPage)
);


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
	if(visiblePages.value.length == 1){
		state.loading = true
	}
	state.cardLoading = true;
	state.loadCard = index;
	state.loadCardText = 0;
	store.removeFavorite(data)
	setTimeout(()=>{
		state.cardLoading = false;
		state.loadCard = null;
		state.pages = state.pages.filter((item: any, i: any) => i !== index);
		if(visiblePages.value.length == 0){
			state.noRecord = true;
			state.loading = false;
		}
    }, 2000)
}

onMounted(() => {
	state.noRecord = false;
	state.loading = true;
	setTimeout(()=>{
		if(store.listOfFavorite.length == 0){
			state.noRecord = true;
		}
		state.loading = false;
    }, 2000)
})

</script>
