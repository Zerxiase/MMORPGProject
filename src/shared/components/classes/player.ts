import { Component, BaseComponent } from "@flamework/components";

export interface PlayerAttributes {
	loaded: boolean;
}

export const PLAYER_TAG = {
	PLAYER_TAG: "PLAYER_TAG",
} as const;

@Component()
export class SharedPlayerComponent extends BaseComponent<PlayerAttributes, Player> {
	public getInstance(): Player {
		return this.instance;
	}

	public isLoaded() {
		return this.attributes.loaded;
	}
}
