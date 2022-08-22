import { Service, OnStart, OnInit } from "@flamework/core";
import { has } from "@rbxts/gamejoy/out/Misc/Aliases";
import { CollectionService } from "@rbxts/services";
import { Events } from "server/network";

@Service({})
export class CommandService implements OnStart, OnInit {
	onInit() {}

	onStart() {
		Events.sendCommandToService.connect((Player: Player, Command: string) => {
			const myTag = CollectionService.GetTags(Player);
			let hasAdmin = false;

			myTag.forEach((value) => {
				if (value === "Admin") {
					hasAdmin = true;
				}
			});

			if (hasAdmin) {
				print("i got admin yay bithc!");
			} else {
				Events.sendErrorToClient.fire(Player, `$ - ${Player.Name} is not a Admin!`);
			}
		});
	}
}
