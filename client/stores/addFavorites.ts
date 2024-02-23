import { defineStore } from 'pinia';

export const addFavorites= defineStore('favoriteListRoutes', {
	state: (): FavoriteListRoutesState => ({
        listOfFavorite: [],
    }),
	getters: {
		getListOfFavorite: (state) => state.listOfFavorite
	},
	actions: {
		addNewFavorite(value: any) {
			this.listOfFavorite.push(value)
		},
		removeFavorite(value: any) {
			const newArr =  this.listOfFavorite.filter((e: any) => e !== value);
			this.listOfFavorite = newArr
		},
	},
	// state: () => ({ listOfFavorites: [] as Array<any> }),
	// getters: {
	// 	getListOfFavorite: (state) => state.listOfFavorites
	// },
	// actions: {
	// 	addNewFavorite(value: any) {
	// 		this.listOfFavorites.push(value)
	// 	},
	// 	removeFavorite(value: any) {
	// 		const newArr =  this.listOfFavorites.filter(e => e !== value);
	// 		this.listOfFavorites = newArr
	// 	},
	// },
})
