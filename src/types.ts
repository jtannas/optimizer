import type { Brand } from "ts-brand";

export const RANKS = ["bronze 1", "bronze 2"] as const;
export type Rank = (typeof RANKS)[number];

export type MaterialRarity =
	| "common"
	| "uncommon"
	| "rare"
	| "epic"
	| "legendary"
	| "shards";
export type NodeType = "intro" | "standard" | "mirror" | "elite" | "extremis";
export type SlotType = `${"health" | "weapon" | "armor"} ${1 | 2}`;

export type NodeInfo = {
	[key in NodeType]: {
		dailyAttempts: number;
		energyCostPerAttempt: number;
		averageEnergyPerDrop: { [rarity in MaterialRarity]: number };
	};
};

export type Material = {
	id: Brand<string, "MaterialID">;
	rarity: MaterialRarity;
	nodeSources: ResourceNode["id"][];
};

export type ResourceNode = {
	id: Brand<string, "ResourceNodeID">;
	materialProvided: Material["id"];
	nodeType: NodeType;
};

export type MaterialRequirement = {
	materialId: Material["id"];
	quantity: number;
};

export type Character = {
	id: Brand<string, "CharacterID">;
	nextRankRequirements: {
		[rank in Rank]: {
			[slot in SlotType]: MaterialRequirement[];
		};
	};
};

export type CharacterGoal = {
	characterId: Character["id"];
	currentRank: Rank;
	targetRank: Rank;
};

export type PlayerSettings = {
	dailyEnergyBudget: number;
	characterGoals: CharacterGoal[];
};
