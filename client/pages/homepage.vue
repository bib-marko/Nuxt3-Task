<script setup lang="ts">

definePageMeta({
  icon: 'mdi-home',
  title: 'Homepage',
  drawerIndex: 0,
})
const state: any = reactive({
	pages: [],
	rocketList: [],
	loading: false,
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
		state.pages = data.value?.launches

		const countPerRocket = state.pages.reduce((acc: any, launch: any) => {
		const { rocket_name } = launch.rocket;
		if (acc[rocket_name]) {
			acc[rocket_name]++;
		} else {
			acc[rocket_name] = 1;
		}
		return acc;
		}, {});

		state.rocketList = Object.entries(countPerRocket).map(([name, count]) => ({
			color: 'primary',
			name,
			count,
		}));

		state.loading = false;
    }, 2000)
})

</script>

<template>
  <v-container fluid>
	<v-progress-linear  indeterminate v-show="state.loading"  color="indigo-darken-1"></v-progress-linear>
    <v-row>
      <v-col
        v-for="(stat, index) in state.rocketList"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="2"
      >
        <StatsCard
          :title="stat.name"
		  :count="stat.count"
        >
        </StatsCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.wrapper {
  position: relative;
  top: calc(50vh - 330px);
  text-align: center;
}
</style>
