<template>

		<v-progress-linear  indeterminate v-show="loading"  color="indigo-darken-1"></v-progress-linear>

		<v-card
		v-show="!loading && data.length != 0"
		class="mx-auto my-12"
		max-width="374"
		:loading="loadCard == index ? cardLoading : false"
		v-for="(item, index) in data"
		:key="index"
		>
			<v-card-title>{{ cardType == 'rockets' ? item.name : item.mission_name }}</v-card-title>
			<v-card-text>
				<v-row align="center" class="mx-0">
					<v-table class="tbl">
						<tbody v-if="cardType == 'rockets'">
						  <tr>
							<td><b>First Flight:</b></td>
							<td> {{ formatDate(item.first_flight) }}</td>
						  </tr>
						  <tr>
							<td><b>Height:</b></td>
							<td> {{ item.height.meters || '-' }}</td>
						  </tr>
						  <tr>
							<td><b>Diameter:</b></td>
							<td> {{ item.diameter.meters || '-' }}</td>
						  </tr>
						  <tr>
							<td><b>Mass:</b></td>
							<td> {{ item.mass.kg || '-' }}</td>
						  </tr>
						  <tr>
							<td><b>Number of stages:</b></td>
							<td> {{ item.stages || '-' }}</td>
						  </tr>
						  </tbody>
						<tbody v-if="cardType == 'launches'">
							  <tr>
								<td><b>Launch Date:</b></td>
								<td> {{ formatDate(item.launch_date_local) || '-' }}</td>
							  </tr>
							  <tr>
								<td><b>Mission Name:</b></td>
								<td> {{ item.mission_name || '-' }}</td>
							  </tr>
							  <tr>
								<td><b>Launch Site:</b></td>
								<td> {{ item.launch_site || '-' }}</td>
							  </tr>
							</tbody>
					</v-table>
				</v-row>
				<v-divider />
				<div class="mt-3">
					<b>Description:</b>
					<p class="desc">{{  cardType == 'rockets' ? item.description : item.details }}</p>
				</div>
			</v-card-text>
			<v-card-actions v-if="cardType != 'rockets'">
				<v-spacer></v-spacer>
				<v-btn size="small"
					v-if="storedData.some((e: any) => e.mission_name === item.mission_name)"
					color="red-darken-1"
					variant="text"
					icon="mdi-heart"
					@click="$emit('removeFavorites', item, index)" >

				</v-btn>
				<v-btn size="small"
					v-else
					color="red-darken-1"
					variant="text"
					icon="mdi-heart-outline"
					@click="$emit('addingFavorite', item, index)"
					>
				</v-btn>
			</v-card-actions>
		</v-card>

		<v-card
			v-if="isNoRecord"
			class="mx-auto my-12"
			max-width="374"
			elevation="0"
		>
			<v-sheet class="ma-2 pa-2">
				<img src="../images/no_record_found.jpg" alt="No Record Found" style="max-width: 100%;" />
			</v-sheet>
		</v-card>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
	data: any[]
	storedData: any[]
	loading: boolean
	cardLoading: boolean
	loadCard: number
	isNoRecord: boolean
	cardType: string
  }>(),
  { },
)

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
