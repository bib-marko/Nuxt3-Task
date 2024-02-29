export default defineNuxtRouteMiddleware((context) => {
	const { error, route, redirect } = context;

	console.log('asdasdsad')
	if (error.statusCode === 404) {
	  redirect('/404');
	}
  });
