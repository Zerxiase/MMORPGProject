import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { COMPONENT_TAGS as Tags } from "shared/components/data/tags";
import { Players } from "@rbxts/services";

interface PLAYER_INSTANCE extends Player {}

interface Attributes {
	isLoaded: boolean;
}
// const Profiles: Map<Player, Profile<{},unknown>> = new Map();
@Component({
	tag: Tags.PLAYER_TAG,
	defaults: {
		isLoaded: false,
	},
})
export class PLAYER_COMPONENT extends BaseComponent<Attributes, PLAYER_INSTANCE> implements OnStart {
	onStart() {}
}
