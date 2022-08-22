import { Service, OnStart, Modding } from "@flamework/core";
import { CollectionService } from "@rbxts/services";
import { Players } from "@rbxts/services";
import { NameDecorator } from "shared/moddings";

export interface OnPlayerJoined {
	onPlayerRemoved(Player: Player): void;
}

@Service()
export class PlayerInitialize implements OnStart {
	onStart() {
		const playerListener = new Set<OnPlayerJoined>();
		Modding.onListenerAdded<OnPlayerJoined>((object) => playerListener.add(object));

		Players.PlayerAdded.Connect((Player: Player) => {
			CollectionService.AddTag(Player, "PLAYER_TAG");
			CollectionService.AddTag(Player, "CLASS_PALADIN");
		});

		Players.PlayerRemoving.Connect((Player: Player) => {
			for (const listener of playerListener) {
				task.spawn(() => listener.onPlayerRemoved(Player));
			}
		});
	}
}
