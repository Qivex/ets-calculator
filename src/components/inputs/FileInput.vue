<template>
	<label class="input-file" @drop.prevent="onFileDrop" @dragover.prevent>
		<input type="file" :multiple :accept @change="onFileChange"/>
		<img src="/svg/upload.svg"/>
		<p>{{fileCount}} {{word}}{{fileCount === 1 ? "" : "s"}} selected</p>
	</label>
</template>



<script>
export default {
	props: {
		accept: String,
		word: String,
		multiple: Boolean
	},
	data() {
		return {
			fileCount: 0
		}
	},
	emits: ["files"],
	methods: {
		onFileChange(event) {
			let files = Array.from(event.target.files)
			this.updateFiles(files)
		},
		onFileDrop(event) {
			
			let files = Array.from(event.dataTransfer.files)
				.filter(file => file.name.endsWith(this.accept))	// Filter unwanted types
			this.updateFiles(files)
		},
		updateFiles(files) {
			// Update label
			this.fileCount = files.length
			// Bubble up
			this.$emit("files", files)
		}
	}
}
</script>



<style>
.input-file {
	display: flex;
	flex-direction: column;
	align-items: center;
	border: 3px dashed #fab003;
	border-radius: 16px;
	margin-block: 8px;
	padding-block: 12px;
	cursor: pointer;
}

.input-file input {
	display: none;
}

.input-file img {
	width: 64px;
	height: 64px;
}
</style>