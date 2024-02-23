<template>
		<v-container>
		<h3 class="my-5">
			Rockets
			{{ store.listOfFavorite }}
		</h3>

		<v-progress-linear  indeterminate v-show="state.loading"  :color="state.showAlert ? 'green-lighten-1' : 'red-lighten-1'"></v-progress-linear>
		<v-alert
			v-model="state.loading"
			style="border-radius: 0px"
			:color="state.showAlert ? 'green-lighten-5' : 'red-lighten-5'"
			:text="state.showAlert ? 'Added New Favorites!' : 'Favorite is already removed!'"
		>
	  	</v-alert>

		<v-row no-gutters>



			<v-card class="mx-auto my-12" max-width="374" v-for="(rocket, index) in rockets" :key="index">

				<v-card-title>{{ rocket.name }}</v-card-title>

				<v-card-text>
					<v-row align="center" class="mx-0">
						<div class="grey--text mb-4"><b>First Flight:</b> {{ rocket.first_flight 	}}</div>
					</v-row>
					<div>
						<b>Description:</b>
						{{ rocket.description.substr(0, 150) + '...' }}
					</div>


				<v-card-actions>

				  <v-spacer></v-spacer>



					<v-tooltip :text="store.getListOfFavorite.includes(index) ? 'Remove Favorite' : 'Add Favorite'">
						<template v-slot:activator="{ props }">
							<v-btn v-bind="props" size="small" color="red-darken-1" variant="text" :icon="store.getListOfFavorite.includes(index) ? 'mdi-heart' : 'mdi-heart-outline'" @click="store.getListOfFavorite.includes(index) ? removeFavorites(index) : addingFavorite(index)" ></v-btn>
						</template>
					</v-tooltip>

				</v-card-actions>


				</v-card-text>
			</v-card>
		</v-row>
	</v-container>
</template>
<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';
const store = addFavorites()
const selection = ref(0)
const query = gql`
query GetRockets {
		rockets {
      name
      description
      first_flight
      height {
        feet
        meters
      }
      diameter {
        feet
        meters
      }
      mass {
        lb
        kg
      }
      stages
    }
	}
`

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
})
const { data } = useAsyncQuery<{
	rockets: {
		name: String
		description: String
		first_flight: Date
		height: {
			feet: Float32Array
			meters: Float32Array
		}
		diameter: {
			feet: Float32Array
			meters: Float32Array
		}
		mass: {
			lb: BigInt
			kg: BigInt
		}
		stages: String
	}[]
}>(query)
const rockets = computed(() => data.value?.rockets ?? [])
const addingFavorite = (index: any) => {
	state.loading = true;
	state.showAlert = true;
	store.addNewFavorite(index)
	setTimeout(()=>{
		state.showAlert = false;
		state.loading = false;
    }, 2000)
};

const removeFavorites = (index: any) => {
	state.loading = true;
	state.hideAlert = true;
	store.removeFavorite(index)
	setTimeout(()=>{
		state.hideAlert = false;
		state.loading = false;
    }, 2000)
};

</script>
