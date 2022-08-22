import { Dependency, Modding, OnStart } from "@flamework/core";
import { OnPlayerJoined } from "server/services/PlayerInitialize";
import { Component, BaseComponent } from "@flamework/components";
import { COMPONENT_TAGS as Tags } from "shared/components/data/tags";
import { dataVersion as Version } from "shared/components/data/DataStructure";
import { Profile, ProfileStore } from "@rbxts/profileservice/globals";
import ProfileService from "@rbxts/profileservice";
import { CollectionService, Players } from "@rbxts/services";
import { Store } from "redux";
import { Events, Functions } from "server/network";

export interface HasLoaded {
	onDataLoad(loaded: boolean, profile: Map<unknown, unknown>): void;
}

interface PLAYER_INSTANCE extends Player {
	Backpack: Backpack;
}

interface ATTRIBUTES {
	isLoaded: boolean;
}

const profileTemplate = {
	level: 1,
	exp: 200,
	class: "Paladin",
	class_tag: "CLASS_PALADIN",
	Gold: 0,
	Inventory: new Map(),
	Equips: {
		Head: new Map(),
		Top: new Map(),
		Bottom: new Map(),
		Main: new Map(),
		Off: new Map(),
	},
	LogInTimes: 0,
};

const ProfileStore = ProfileService.GetProfileStore(`PlayerData_${Version.version}`, profileTemplate);

// const Profiles: Map<Player, Profile<{},unknown>> = new Map();

@Component({
	tag: Tags.PLAYER_TAG,
	defaults: {
		isLoaded: false,
	},
})
export class SharedPlayerData extends BaseComponent<ATTRIBUTES, PLAYER_INSTANCE> implements OnStart, OnPlayerJoined {
	public profile = ProfileStore.LoadProfileAsync(`Player_${this.instance.UserId}`);
	public Profiles: Map<
		Player,
		Profile<
			{
				level: number;
				exp: number;
				class: string;
				class_tag: string;
				Gold: number;
				Inventory: Map<unknown, unknown>;
				Equips: {
					Head: Map<unknown, unknown>;
					Top: Map<unknown, unknown>;
					Bottom: Map<unknown, unknown>;
					Main: Map<unknown, unknown>;
					Off: Map<unknown, unknown>;
				};
				LogInTimes: number;
			},
			unknown
		>
	> = new Map();
	public Admins = ["Ah", "KaseiKasaki12"];
	private listeners = new Set<HasLoaded>();
	constructor() {
		super();
		Modding.onListenerAdded<HasLoaded>((object) => this.listeners.add(object));
		if (this.profile !== undefined) {
			this.profile.AddUserId(this.instance.UserId);
			this.profile.Reconcile();
			this.profile.ListenToRelease(() => {
				this.Profiles.delete(this.instance);
				this.instance.Kick();
			});
			if (this.instance.IsDescendantOf(Players)) {
				this.Profiles.set(this.instance, this.profile);
				if (this.Profiles.get(this.instance)) {
					this.attributes.isLoaded = true;
					CollectionService.AddTag(this.instance, this.Profiles.get(this.instance)!.Data.class_tag);
					for (const listener of this.listeners) {
						task.spawn(() => listener.onDataLoad(this.attributes.isLoaded, this.Profiles));
					}
				}
			} else {
				this.profile.Release();
			}
		} else {
			this.instance.Kick();
		}
	}
	onStart() {
		Events.processDataToClient.fire(this.instance, this.Profiles.get(this.instance)!.Data);

		for (const i of this.Admins) {
			if (i.find(tostring(this.instance))[0] !== undefined) {
				CollectionService.AddTag(this.instance, "Admin");
			}
		}
	}

	onPlayerRemoved(Player: Player): void {
		this.Profiles.delete(Player);
	}

	getPlayerData(Player: Player) {
		return this.Profiles.get(Player)!.Data;
	}

	addItemToInventory(Player: Player, Item: string) {
		while (!this.attributes.isLoaded) {
			task.wait(1);
		}
		const num = this.Profiles.get(Player)?.Data.Inventory.get(Item) as number;
		// eslint-disable-next-line roblox-ts/lua-truthiness
		if (this.Profiles.get(Player)?.Data.Inventory.has(Item)) {
			this.Profiles.get(Player)?.Data.Inventory.set(Item, num + 1);
		} else {
			this.Profiles.get(Player)?.Data.Inventory.set(Item, 1);
		}
	}

	removeItemFromInventory(Player: Player, Item: string) {
		while (!this.attributes.isLoaded) {
			task.wait(1);
		}
		const num = this.Profiles.get(Player)?.Data.Inventory.get(Item) as number;

		if (this.Profiles.get(Player)?.Data.Inventory.has(Item)) {
			if (num > 1) {
				this.Profiles.get(Player)?.Data.Inventory.set(Item, num - 1);
			} else {
				this.Profiles.get(Player)?.Data.Inventory.delete(Item);
			}
		}
	}
}
