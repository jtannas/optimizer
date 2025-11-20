import type {
	Character,
	Material,
	NodeInfo,
	PlayerSettings,
	ResourceNode,
} from "./types";

export const RESOURCE_NODES: ResourceNode[] = [
	{
		id: "node 1" as ResourceNode["id"],
		materialProvided: "HP A" as Material["id"],
		nodeType: "intro",
	},
	{
		id: "node 2" as ResourceNode["id"],
		materialProvided: "HP B" as Material["id"],
		nodeType: "standard",
	},
	{
		id: "node 3" as ResourceNode["id"],
		materialProvided: "HP C" as Material["id"],
		nodeType: "mirror",
	},
	{
		id: "node 4" as ResourceNode["id"],
		materialProvided: "WP A" as Material["id"],
		nodeType: "elite",
	},
	{
		id: "node 5" as ResourceNode["id"],
		materialProvided: "WP B" as Material["id"],
		nodeType: "extremis",
	},
	{
		id: "node 6" as ResourceNode["id"],
		materialProvided: "AR A" as Material["id"],
		nodeType: "intro",
	},
	{
		id: "node 7" as ResourceNode["id"],
		materialProvided: "AR B" as Material["id"],
		nodeType: "standard",
	},
];

export const MATERIALS: Material[] = [
	{
		id: "HP A" as Material["id"],
		rarity: "common",
		nodeSources: ["node 1"] as ResourceNode["id"][],
	},
	{
		id: "HP B" as Material["id"],
		rarity: "uncommon",
		nodeSources: ["node 2"] as ResourceNode["id"][],
	},
	{
		id: "HP C" as Material["id"],
		rarity: "rare",
		nodeSources: ["node 3"] as ResourceNode["id"][],
	},
	{
		id: "WP A" as Material["id"],
		rarity: "common",
		nodeSources: ["node 4"] as ResourceNode["id"][],
	},
	{
		id: "WP B" as Material["id"],
		rarity: "uncommon",
		nodeSources: ["node 5"] as ResourceNode["id"][],
	},
	{
		id: "AR A" as Material["id"],
		rarity: "common",
		nodeSources: ["node 6"] as ResourceNode["id"][],
	},
	{
		id: "AR B" as Material["id"],
		rarity: "uncommon",
		nodeSources: ["node 7"] as ResourceNode["id"][],
	},
];

export const CHARACTERS: Character[] = [
	{
		id: "Tan" as Character["id"],
		nextRankRequirements: {
			"bronze 1": {
				"health 1": [
					{ materialId: "HP A" as Material["id"], quantity: 5 },
					{ materialId: "HP B" as Material["id"], quantity: 3 },
				],
				"health 2": [{ materialId: "HP C" as Material["id"], quantity: 1 }],
				"weapon 1": [{ materialId: "WP A" as Material["id"], quantity: 4 }],
				"weapon 2": [{ materialId: "WP B" as Material["id"], quantity: 2 }],
				"armor 1": [{ materialId: "AR A" as Material["id"], quantity: 6 }],
				"armor 2": [{ materialId: "AR B" as Material["id"], quantity: 3 }],
			},
			"bronze 2": {
				"health 1": [],
				"health 2": [],
				"weapon 1": [],
				"weapon 2": [],
				"armor 1": [],
				"armor 2": [],
			},
		},
	},
];

export const PLAYER_SETTINGS: PlayerSettings = {
	dailyEnergyBudget: 200,
	characterGoals: [
		{
			characterId: "Tan" as Character["id"],
			targetRank: "bronze 2",
			currentRank: "bronze 1",
		},
	],
};

export const NODE_INFO: NodeInfo = {
	intro: {
		dailyAttempts: 10,
		energyCostPerAttempt: 5,
		averageEnergyPerDrop: {
			common: 6.4,
			uncommon: 8.0,
			rare: 15.0,
			epic: 20.0,
			legendary: 32.5,
			shards: 13.8,
		},
	},
	standard: {
		dailyAttempts: 10,
		energyCostPerAttempt: 6,
		averageEnergyPerDrop: {
			common: 7.7,
			uncommon: 9.6,
			rare: 18.0,
			epic: 24.0,
			legendary: 39.0,
			shards: 16.5,
		},
	},
	mirror: {
		dailyAttempts: 10,
		energyCostPerAttempt: 6,
		averageEnergyPerDrop: {
			common: 7.0,
			uncommon: 8.2,
			rare: 14.0,
			epic: 18.0,
			legendary: 36.0,
			shards: 16.5,
		},
	},
	elite: {
		dailyAttempts: 6,
		energyCostPerAttempt: 10,
		averageEnergyPerDrop: {
			common: 6.4,
			uncommon: 7.5,
			rare: 8.7,
			epic: 14.0,
			legendary: 23.3,
			shards: 9.3,
		},
	},
	extremis: {
		dailyAttempts: 10,
		energyCostPerAttempt: 6,
		averageEnergyPerDrop: {
			common: 6.4,
			uncommon: 7.5,
			rare: 8.7,
			epic: 14.0,
			legendary: 24.1,
			shards: 9.3,
		},
	},
};
