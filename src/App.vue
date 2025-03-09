<template>
	<TabSelect :tabs="tabs" v-model="currentTab"/>

	<main>
		<div v-show="currentTab === 0">
			<h1>ETS2 Reward Calculator</h1>
			<section>
				<h3>Features</h3>
				<ul>
					<li>Calculate the <b>reward</b> for any given trailer-cargo combination</li>
					<li>Find the <b>best trailer</b> for every type of cargo</li>
					<li><b>Filter</b> trailer & cargo - for example to exclude double trailers or fragile cargo</li>
					<li>Adjustable to match your <b>player level & unlocked skills</b></li>
					<li>Fine tuning for a <b>specific trip</b> distance & urgency</li>
					<li>You can include <b>DLCs and modded content</b> too!</li>
				</ul>
			</section>
			<section>
				<h3>Disclaimer</h3>
				<p>This tool <b>does not include</b> any content from the game. Hosting copyrighted content is explicitly forbidden as per the games License Agreement:</p>
				<blockquote cite="readme.rtf">No part of this file or the software may be copied, reproduced, translated, or reduced to any software medium or machine-readable form without the prior written consent of SCS Software.</blockquote>	
				<p>You will need to provide the required files from <b>your own purchased copy</b> of the game.</p>
			</section>
			<section>
				<h3>Instructions</h3>
				<ol>
					<li>Install <a href="https://store.steampowered.com/app/227300" target="_blank">Euro Truck Simulator 2</a></li>
					<li>Download the <a href="https://modding.scssoft.com/wiki/Documentation/Tools/Game_Archive_Extractor" target="_blank">Official Game Archive Extractor</a></li>
					<li>Navigate to your game folder and find the <code>.scs</code> files listed below</li>
					<li>Extract their contents using the extractor by dragging files onto it</li>
					<li>Out of all extracted content you only need the trailer and cargo definitons:</li>
					<ul>
						<li>Trailer definitions are <code>.sii</code> files inside <code>\def\vehicle\trailer_defs\</code></li>
						<li>Cargo definitions are <code>.sui</code> files <b>directly</b> inside <code>\def\cargo\</code> (no subfolder!)</li>
					</ul>
					<li>Navigate to the second tab on this website to get started</li>
				</ol>
			</section>
			<section>
				<h3>Relevant game files</h3>
				<p>Base Game</p>
				<code>defs.scs</code>
				<p style="margin-top:8px">Trailer DLC</p>
				<code>dlc_feldbinder.scs<br>dlc_kassbohrer.scs<br>dlc_kogel.scs<br>dlc_krone.scs<br>dlc_schmitz.scs<br>dlc_schwarzmuller.scs<br>dlc_tirsan.scs<br>dlc_wielton.scs</code>
				<p style="margin-top:8px">Cargo DLC</p>
				<code>dlc_heavy_cargo.scs<br>dlc_jcb.scs<br>dlc_oversize.scs<br>dlc_trailers.scs<br>dlc_volvo_construction.scs</code>
			</section>
			<footer>
				<p>Full source code on <a href="https://github.com/Qivex/ets-calculator" target="_blank">Github</a></p>
				<p>Created by <a href="https://github.com/Qivex" target="_blank">Qivex</a></p>
			</footer>
		</div>

		<div v-show="currentTab === 1">
			<h2>Upload</h2>
			<section>
				<h3>Trailers</h3>
				<p>Select <code>.sii</code> files from <code>\def\vehicle\trailer_defs\</code></p>
				<FileInput multiple accept=".sii" word="trailer" @files="onTrailerUpload"/>
			</section>
			<section>
				<h3>Cargo</h3>
				<p>Select <code>.sui</code> files from <code>\def\cargo\</code> (not subfolders!)</p>
				<FileInput multiple accept=".sui" word="cargo" @files="onCargoUpload"/>
			</section>
		</div>

		<div v-show="currentTab === 2">
			<h2>Available Trailers</h2>
			<FilterDialog @filter="filterTrailers">
				<ValueFilter ref="filter_trailer_chain" name="Chain Configuration" :values="uniqueValuesFromColumn(trailerInfo, 'chain')"/>
				<ValueFilter ref="filter_trailer_type"  name="Cargo Compatibility" :values="uniqueValuesFromColumn(trailerInfo, 'type')"/>
				<ValueFilter ref="filter_trailer_axles" name="Axle Count"          :values="uniqueValuesFromColumn(trailerInfo, 'axles')"/>
			</FilterDialog>
			<DataView class="trailers" :columnTitles="['Name','Chain','Type','Axle Count','Weight Capacity','Volume Capacity']" :rows="trailerInfoFiltered"/>
		</div>

		<div v-show="currentTab === 3">
			<h2>Available Cargo</h2>
			<FilterDialog @filter="filterCargos">
				<ValueFilter ref="filter_cargo_valuable" name="High Value" :values="uniqueValuesFromColumn(cargoInfo, 'valuable')"/>
				<ValueFilter ref="filter_cargo_adr"      name="ADR Class"  :values="uniqueValuesFromColumn(cargoInfo, 'adr')"/>
			</FilterDialog>
			<DataView class="cargos" :columnTitles="['Name','Types','Fragility','High Value','ADR','Unit Weight','Unit Volume', 'Unit Reward']" :rows="cargoInfoFiltered"/>
		</div>

		<div v-show="currentTab === 4">
			<h2>Skill Selection</h2>
			<section>
				<h3>Player Level</h3>
				<ProficiencyInput v-model="skillProficiency"/>
			</section>
			<section>
				<h3>Skills</h3>
				<SkillInput v-model="skillLongDist"  title="Long Distance"/>
				<SkillInput v-model="skillHighValue" title="High Value Cargo"/>
				<SkillInput v-model="skillFragile"   title="Fragile Cargo"/>
				<SkillInput v-model="skillUrgency"   title="Just-In-Time Delivery"/>
			</section>
		</div>

		<div v-show="currentTab === 5">
			<h2>Trip Info</h2>
			<section>
				<h3>Distance</h3>
				<DistanceInput v-model.number="tripDistance"/>
			</section>
			<section>
				<h3>Urgency</h3>
				<UrgencyInput v-model="tripUrgency"/>
			</section>
		</div>

		<div v-show="currentTab === 6">
			<h2>Result</h2>
			<DataView class="result" :columnTitles="['Cargo', 'Best Trailer', 'Base Reward', 'Full Reward']" :rows="finalResult"/>
		</div>
	</main>
	<button class="back2top" @click.left="onClickScrollTop" v-show="showScrollButton">
		<img src="/svg/top.svg"/>
		Back to top
	</button>
</template>



<script>
function roundToDigit(number, digits) {
	let factor = Math.pow(10, digits)
	return Math.round(number * factor) / factor
}

function dataFromConfigFile(file, prepare) {
	return file.text()
		.then(text => prepare(file.name, parseConfigText(text)))
}

const configRowRegex = /(?<key>\w+)(?<isArray>\[\])?: (?<value>.+)\n/g

function parseConfigText(text) {
	var result = {}
	// Find all rows
	for (let match of text.matchAll(configRowRegex)) {
		var {key, isArray, value} = match.groups
		// Try to parse as number
		var floatValue = parseFloat(value)
		if (!isNaN(floatValue))
			value = floatValue
		// Add entry to result
		if (isArray) {
			// Create or add to array-property
			if (Object.hasOwn(result, key))
				result[key].push(value)
			else
				result[key] = [value]
		} else
			result[key] = value
	}
	return result
}

function uniqueValuesFromColumn(data, columnName) {
	if (data && data.length) {
		let allValues = data.map(entry => entry[columnName])
		let uniqueValues = new Set(allValues)
		return Array.from(uniqueValues).sort((a,b) => a > b ? 1 : -1)	// Custom sort because of inexplicably dumb default...
	}
	return []
}

function prepareTrailerData(filename, config) {
	return {
		name: filename.replace(".sii", ""),
		chain: config.chain_type,
		type: config.body_type,
		axles: config.axles,
		capacity_weight: config.gross_trailer_weight_limit - config.chassis_mass - config.body_mass,
		capacity_volume: config.volume
	}
}

function prepareCargoData(filename, config) {
	return {
		name: filename.replace(".sui", ""),
		types: config.body_types,
		fragility: config.fragility || 0,
		valuable: config.valuable === "true" ? "Yes" : "No",
		adr: typeof config.adr_class === "number" ? config.adr_class : 0,
		unit_weight: config.mass,
		unit_volume: config.volume,
		unit_reward: config.unit_reward_per_km
	}
}

import TabSelect from "./components/TabSelect.vue"
import DataView from "./components/DataView.vue"

import FilterDialog from "./components/FilterDialog.vue"
import ValueFilter from "./components/ValueFilter.vue"

import FileInput from "./components/inputs/FileInput.vue"
import ProficiencyInput from "./components/inputs/ProficiencyInput.vue"
import SkillInput from "./components/inputs/SkillInput.vue"
import DistanceInput from "./components/inputs/DistanceInput.vue"
import UrgencyInput from "./components/inputs/UrgencyInput.vue"

export default {
	components: {
		TabSelect,
		DataView,
		FilterDialog,
		ValueFilter,
		FileInput,
		ProficiencyInput,
		SkillInput,
		DistanceInput,
		UrgencyInput
	},
	data() {
		return {
			currentTab: 0,
			tabs: ["intro", "upload", "trailer", "cargo", "skills", "trip", "result"],
			// All available data from files
			trailerInfo: [],
			cargoInfo: [],
			// Filtered data displayed in table
			trailerInfoFiltered: [],
			cargoInfoFiltered: [],
			// Calculated combinations
			bestMatches: [],
			// Displayed result
			finalResult: [],
			// Customization
			skillProficiency: 67,
			skillLongDist: 6,
			skillHighValue: 6,
			skillFragile: 6,
			skillUrgency: 6,
			tripDistance: 6,
			tripUrgency: 2,
			// Scroll button visibiliy
			showScrollButton: false
		}
	},
	watch: {
		// Newly added data is shown unfiltered
		trailerInfo(newTrailerInfo) {
			this.trailerInfoFiltered = newTrailerInfo
		},
		cargoInfo(newCargoInfo) {
			// Custom toString for array of types
			newCargoInfo.forEach(row => row.types.toString = function() {return this.join(", ")})
			this.cargoInfoFiltered = newCargoInfo
		},
		// Calculate best matches based on filtered data
		trailerInfoFiltered: "calculateBestMatches",
		cargoInfoFiltered:   "calculateBestMatches",
		// Update rewards after new matches were calculated
		bestMatches:      "calculateRewards",
		// Update rewards when skills change
		skillProficiency: "calculateRewards",
		skillLongDist:    "calculateRewards",
		skillHighValue:   "calculateRewards",
		skillFragile:     "calculateRewards",
		skillUrgency:     "calculateRewards",
		// Update rewards when trip changes
		tripDistance:     "calculateRewards",
		tripUrgency:      "calculateRewards"
	},
	methods: {
		uniqueValuesFromColumn,
		onTrailerUpload(files) {
			Promise.all(files.map(file => dataFromConfigFile(file, prepareTrailerData)))
				.then(data => this.trailerInfo = data)
		},
		onCargoUpload(files) {
			Promise.all(files.map(file => dataFromConfigFile(file, prepareCargoData)))
				.then(data => this.cargoInfo = data)
		},
		filterTrailers() {
			// Apply all filters
			let filteredData = this.trailerInfo
			for (let filterRef of ["chain", "type", "axles"]) {
				let filterComponent = this.$refs["filter_trailer_" + filterRef]
				filteredData = filterComponent.applyFilter(filteredData, filterRef)
			}
			// Update DataView
			this.trailerInfoFiltered = filteredData
		},
		filterCargos() {
			// Apply all filters
			let filteredData = this.cargoInfo
			for (let filterRef of ["valuable", "adr"]) {
				let filterComponent = this.$refs["filter_cargo_" + filterRef]
				filteredData = filterComponent.applyFilter(filteredData, filterRef)
			}
			// Update DataView
			this.cargoInfoFiltered = filteredData
		},
		calculateBestMatches() {
			// Only calculate if required data is available
			if (this.trailerInfoFiltered.length == 0 || this.cargoInfoFiltered.length == 0)
				this.bestMatches = []
			// Find best trailer for each cargo (best "match")
			let bestMatches = []
			this.cargoInfoFiltered.forEach(cargo => {
				let bestUnits = 0
				let bestTrailers = []	// They may be tied
				this.trailerInfoFiltered.forEach(trailer => {
					// Is correct type?
					if (!cargo.types.includes(trailer.type)) return
					// Find limiting factor: weight or volume
					let units = Math.min(
						Math.floor(trailer.capacity_weight / cargo.unit_weight),
						Math.floor(trailer.capacity_volume / cargo.unit_volume)
					)
					// Keep track of best
					if (units > bestUnits) {
						bestUnits = units
						bestTrailers = [trailer]
					} else if (units == bestUnits) {
						bestTrailers.push(trailer)
					}
				})
				// Failsafe for cargo without ownable trailer
				if (bestTrailers.length == 0) return
				// Store match
				bestMatches.push({
					cargo: cargo,
					trailer: "<ul><li>" + bestTrailers.map(trailer => trailer.name).join("</li><li>") + "</li></ul>",
					units: bestUnits
				})
			})
			// Cache until new data available or filter changed
			this.bestMatches = bestMatches
		},
		calculateRewards() {
			// Calculate bonuses which are equal for all cargo
			let bonusFactor = 1
			bonusFactor += Math.min(1, this.skillProficiency * 0.015)	// 0.01 for ATS
			if (this.skillLongDist >= this.tripDistance) {
				bonusFactor += this.tripDistance * 0.05
			}
			if (this.tripUrgency >= 1) {
				if (this.tripUrgency === 2 && this.skillUrgency >= 2) {
					bonusFactor += this.skillUrgency * 0.05	// Urgent delivery
				} else {
					bonusFactor += this.skillUrgency * 0.03	// Important delivery
				}
			}
			// Include all cargos in result
			let finalResult = []
			this.bestMatches.forEach(match => {
				// Calculate varying bonuses
				let individualBonusFactor = bonusFactor
				if (match.cargo.valuable === "Yes")
					individualBonusFactor += this.skillHighValue * 0.05
				if (match.cargo.fragility >= 0.7)
					individualBonusFactor += this.skillFragile * 0.05
				// Calculate reward
				let baseReward = match.units * match.cargo.unit_reward	// Note: Ingame baseReward + 600 is shown
				finalResult.push({
					cargo_name: match.cargo.name,
					trailer: match.trailer,
					base_reward: roundToDigit(baseReward, 2),
					full_reward: roundToDigit(baseReward * individualBonusFactor, 2)
				})
			})
			this.finalResult = finalResult
		},
		onClickScrollTop() {
			document.documentElement.scrollTop = 0
		}
	},
	mounted() {
		window.addEventListener("scroll", () => this.showScrollButton = (document.documentElement.scrollTop > 20))
	}
}
</script>



<style>
@import url('style.css');

/* Scroll button */
.back2top {
	position: fixed;
	bottom: 10px;
	right: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
}

.back2top img {
	width: 40px;
}


/* Suffixes for data */
.trailers td:nth-child(5)::after {
	content: " kg";
}

.trailers td:nth-child(6)::after {
	content: " m³";
}

.cargos td:nth-child(6)::after {
	content: " kg";
}

.cargos td:nth-child(7)::after {
	content: " m³";
}

.cargos td:nth-child(8)::after {
	content: " €/km";
}

.result td:nth-child(3)::after {
	content: " €/km";
}

.result td:nth-child(4)::after {
	content: " €/km";
}


/* Styling for list of trailers (handle overflow) */
.result ul {
	counter-reset: trailercount -1;
	list-style-type: none;
	margin: 0;
	padding: 10px 0;
	cursor: pointer;
}

.result ul:hover::after {
	color: #fab003;
}

.result li {
	counter-increment: trailercount 1;
	display: inline-block;	/* to show "more"-message inline, while allowing width:0 */
	cursor: initial;
}

/* Default: Hide everything beyond first trailer... */
.result li+li {
	opacity: 0;	/* display:none would not increase counter */
	width: 0;
	height: 0;
	overflow: hidden;	/* prevents wrong cursor attribute overshadowing the ::after */
}

/* ...and show message instead */
.result ul:has(li+li)::after {
	content: " and " counter(trailercount, decimal) " more";
}

/* When selected: Show all trailers... */
.selected li+li {
	opacity: initial;
	width: initial;
	height: initial;
}

.selected li {
	display: block;	/* list in rows (inline-block no longer required) */
}

/* ...and hide message */
.selected ul:has(li+li)::after {
	content: none;
}
</style>