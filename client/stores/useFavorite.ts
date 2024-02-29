import { defineStore } from 'pinia';

export const useFavorite= defineStore('favoriteRoutes', {
	state: (): FavoriteListRoutesState => ({
        listOfFavorite: [],
    }),
	actions: {
		addNewFavorite(value: any) {
			this.listOfFavorite.push(value)
		},
		removeFavorite(value: any) {
			const newArr =  this.listOfFavorite.filter((e: any) => e.mission_name != value.mission_name);
			this.listOfFavorite = newArr
		},
	},
	persist: true,
})
