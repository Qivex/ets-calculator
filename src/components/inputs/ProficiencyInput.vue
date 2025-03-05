<template>
	<div class="input-proficiency">
		<input
			type="range"
			min="0"
			max="67"
			:value="modelValue"
			@input="onValuePreview"
			@change="onValueSelect"
		/>
		<input
			ref="textinput"
			type="text"
			maxlength="3"
			inputmode="numeric"
			:value="modelValue"
			@input="onCharInput"
		/>
	</div>
</template>



<script>
export default {
	props: {
		modelValue: Number
	},
	emits: ["update:modelValue"],
	methods: {
		onCharInput(event) {
			// Input sanitization
			let chars = new String(event.currentTarget.value)
			let digits = chars.replaceAll("\D", "")
			let number = parseInt(digits)
			if (isNaN(number)) number = 0
			let level = Math.min(100, number)
			event.currentTarget.value = level	// Required to overwrite invalid inputs (modelValue might not have changed -> no prop update)
			this.$emit('update:modelValue', level)
		},
		onValuePreview(event) {
			// Show preview of selected value WITHOUT rapidly emitting
			this.$refs.textinput.value = parseInt(event.currentTarget.value)
		},
		onValueSelect(event) {
			this.$emit('update:modelValue', parseInt(event.currentTarget.value))
		}
	}
}
</script>



<style>
.input-proficiency {
	width: 285px;
	display: flex;
	flex-direction: row;
	gap: 4px;
	margin-block-end: 16px;
}

.input-proficiency input[type=range] {
	flex-grow: 1;
}

.input-proficiency input[type=text] {
	width: 54px;
}
</style>