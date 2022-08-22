import { Dependency, Modding, OnStart, OnTick } from "@flamework/core";
import { Component, BaseComponent, Components } from "@flamework/components";
import { COMPONENT_TAGS as Tags } from "shared/components/data/tags";
import { HasLoaded } from "../SharedPlayerData";
import { SharedPlayerData } from "server/components/SharedPlayerData";
import { Events } from "server/network";
import { Players } from "@rbxts/services";

interface CLASS_INSTANCE extends Player {}

interface ATTRIBUTES {
	isLoaded: boolean;
}

@Component({
	tag: Tags.CLASS_PALADIN,
	defaults: {
		isLoaded: false,
	},
})
export class PaladinComponent extends BaseComponent<ATTRIBUTES, CLASS_INSTANCE> implements OnTick, OnStart, HasLoaded {
	private components = Dependency<Components>();
	public SPD = this.components.getComponent<SharedPlayerData>(this.instance);
	onDataLoad(loaded: boolean, profile: Map<unknown, unknown>): void {
		this.attributes.isLoaded = loaded;
	}
	onStart() {}

	addItemToInventory(Item: string) {
		task.spawn(() => this.SPD!.addItemToInventory(this.instance, Item));
	}
	removeItemFromInventory(Item: string) {
		task.spawn(() => this.SPD!.removeItemFromInventory(this.instance, Item));
	}

	onTick() {}
}
