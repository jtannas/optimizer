import {
	CHARACTERS,
	MATERIALS,
	NODE_INFO,
	RESOURCE_NODES,
} from "./sample-data";
import {
	type Character,
	type CharacterGoal,
	type Material,
	RANKS,
	type Rank,
	type ResourceNode,
} from "./types";

const EMPTY_REQUIREMENTS = {
	"health 1": [],
	"health 2": [],
	"weapon 1": [],
	"weapon 2": [],
	"armor 1": [],
	"armor 2": [],
};

export const getMaterialById = (materialId: Material["id"]) => {
	const material = MATERIALS.find((m) => m.id === materialId);
	if (!material) throw new Error("Material not found");
	return material;
};

export const getNodeById = (nodeId: ResourceNode["id"]) => {
	const node = RESOURCE_NODES.find((n) => n.id === nodeId);
	if (!node) throw new Error("Resource node not found");
	return node;
};

export const getCharacterById = (characterId: Character["id"]) => {
	const character = CHARACTERS.find((c) => c.id === characterId);
	if (!character) throw new Error("Character not found");
	return character;
};

export const getNodeTypeInfo = (nodeType: ResourceNode["nodeType"]) => {
	const nodeTypeInfo = NODE_INFO[nodeType];
	if (!nodeTypeInfo) throw new Error("Node type info not found");
	return nodeTypeInfo;
};

export const relevantRequirementsForGoal = (goal: CharacterGoal) => {
	const character = getCharacterById(goal.characterId);
	const currentRankIndex = RANKS.indexOf(goal.currentRank);
	const targetRankIndex = RANKS.indexOf(goal.targetRank);
	if (currentRankIndex === -1 || targetRankIndex === -1)
		throw new Error("Invalid rank specified in goal");
	if (targetRankIndex <= currentRankIndex) return [];

	const relevantRequirements = structuredClone(character.nextRankRequirements);
	for (const rank of RANKS) {
		const rankIndex = RANKS.indexOf(rank);
		if (rankIndex < currentRankIndex || rankIndex >= targetRankIndex)
			relevantRequirements[rank] = structuredClone(EMPTY_REQUIREMENTS);
	}

	return relevantRequirements;
};

export const totalMaterialsByRank = (
	requirements: Character["nextRankRequirements"],
) => {
	const totalMaterialsByRank: {
		[rank in Rank]: { [materialId: Material["id"]]: number };
	} = {
		"bronze 1": {},
		"bronze 2": {},
	};

	for (const [strRank, requirementsOfRank] of Object.entries(requirements)) {
		const rank = strRank as Rank;
		for (const slotRequirements of Object.values(requirementsOfRank)) {
			for (const req of slotRequirements) {
				if (!totalMaterialsByRank[rank][req.materialId])
					totalMaterialsByRank[rank][req.materialId] = 0;

				totalMaterialsByRank[rank][req.materialId] += req.quantity;
			}
		}
	}

	return totalMaterialsByRank;
};

export const expandedNodeInformation = (nodeId: ResourceNode["id"]) => {
	const nodeData = getNodeById(nodeId);
	const materialData = getMaterialById(nodeData.materialProvided);
	const nodeTypeInfo = getNodeTypeInfo(nodeData.nodeType);

	const averageEnergyPerDrop =
		nodeTypeInfo.averageEnergyPerDrop[materialData.rarity];
	const averageDropsPerAttempt =
		averageEnergyPerDrop / nodeTypeInfo.energyCostPerAttempt;
	const averageDropsPerDay =
		averageDropsPerAttempt * nodeTypeInfo.dailyAttempts;

	return {
		...nodeData,
		...materialData,
		...nodeTypeInfo,
		averageEnergyPerDrop,
		averageDropsPerAttempt,
		averageDropsPerDay,
	};
};
