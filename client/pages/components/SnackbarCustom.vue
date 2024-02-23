Code snippet
<template>
	<v-snackbar
	v-model="snackbar.show"
	:timeout="snackbar.timeout"
	location="top"
	:color="snackbar.color"
>
	{{
		snackbar.text
	}}
	<template v-slot:actions>
		<v-btn size="small" color="light-green-darken-4" variant="text" icon="mdi-close"  @click="snackbar.show = false"></v-btn>
	</template>

</v-snackbar>
</template>

<script lang="ts" setup>
const props = defineProps({
  snackbar: {
    type: Object,
    required: true,
    default: () => ({
      show: false,
      color: 'info', // Default color
      textColor: 'white', // Default text color
      timeout: 5000, // Default timeout
      icon: '', // Optional icon
	  text: '',
    }),
  },
});
</script>
