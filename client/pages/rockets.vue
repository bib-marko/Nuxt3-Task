<template>
	<v-container>
	<h3 class="my-5">
		Rockets
	</h3>

	<v-progress-linear  indeterminate v-show="state.loading"  color="indigo-darken-1"></v-progress-linear>

	<v-row no-gutters>

		<v-row no-gutters v-if="state.loading" >
			<v-col v-for="(n, index) in rockets.length < 16 ? 16 : rockets.length" :key="index" cols="3" >
			<v-skeleton-loader class="mx-auto my-12" elevation="2" max-width="400" type="image, article"></v-skeleton-loader>
			</v-col>
		</v-row>

		<Card
			:data="rockets"
			:stored-data="store.listOfFavorite"
			:loading="state.loading"
			:cardLoading="state.cardLoading"
			:isNoRecord="state.noRecord"
			cardType="rockets"
		/>
	</v-row>
</v-container>
</template>
<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';

definePageMeta({
	icon: 'mdi-rocket',
	title: 'Rockets',
	drawerIndex: 3,
  })

const store = useFavorite()
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
	noRecord: false,
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

onMounted(() => {
	state.noRecord = false;
	state.loading = true;
	setTimeout(()=>{
		if(rockets.value.length == 0){
			state.noRecord = true;
		}
		state.loading = false;
    }, 2000)
})

</script>

<style scoped>
.desc{
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow: hidden;
	-webkit-line-clamp: 6;
}

.tbl{
	margin-bottom: 1em;
	width: 100%;
}

tr{
	padding: -5em;
}
</style>
