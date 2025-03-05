<template>
	<div class="input-skill">
		<p>{{title}}</p>
		<button v-for="level in 6" @click.left="onLevelSelect(level)" :class="{skilled: modelValue >= level}"/>
	</div>
</template>



<script>
export default {
	props: {
		title: String,
		modelValue: Number
	},
	data() {
		return {
			currentLevel: 0
		}
	},
	emits: ["update:modelValue"],
	watch: {
		currentLevel(newLevel) {
			this.$emit("update:modelValue", newLevel)
		}
	},
	methods: {
		onLevelSelect(level) {
			if (level === this.currentLevel) {
				this.currentLevel = level - 1
			} else {
				this.currentLevel = level
			}
		}
	}
}
</script>



<style>
.input-skill {
	width: 285px;
	height: 77px;
	border-radius: 4px;
	background-color: #393939;
	margin-block-end: 16px;
}

.input-skill p {
	padding: 8px 24px 10px;
	font-family: "Rubik", serif;
	font-size: 15px;
	line-height: 1;
	color: #c8c8c8;
}

.input-skill button {
	width: 38px;
	height: 38px;
	margin-inline-end: 6px;
	padding: 0;
	border: none;
	border-radius: 3px;
	background-color: #7d8183;
}

.input-skill button:hover {
	background-color: #4c5b66;
}

.input-skill button:first-of-type {
	margin-inline-start: 12px;
}

.input-skill button.skilled::after {
	display: block;
	content: "";
	width: 24px;
	height: 24px;
	position: relative;
	left: 7px;
	background-color: #fab003;
}
</style>