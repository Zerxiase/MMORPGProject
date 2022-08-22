import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { COMPONENT_TAGS } from "shared/components/data/tags";
import { Players } from "@rbxts/services";
import { Events, Functions } from "client/network";
interface INTERFACE_INSTANCE extends ScreenGui {
	Portrait: Frame & {
		Level: TextLabel;
		Xp: TextLabel;
	};
}

interface Attributes {
	interfaceLoaded: boolean;
}

@Component({
	tag: COMPONENT_TAGS.INTERFACE_TAG,
	defaults: {
		interfaceLoaded: false,
	},
})
export class InterfaceComponent extends BaseComponent<Attributes, INTERFACE_INSTANCE> implements OnStart {
	public Player = Players.LocalPlayer;
	public Character = this.Player.Character;
	onStart() {
		Events.processDataToClient.connect((Profile: Map<unknown, unknown>) => {
			do {
				task.wait(1);
				this.instance.Portrait.Level.Text = tostring(Profile.get("level"));
				this.instance.Portrait.Xp.Text = "EXP: " + tostring(Profile.get("exp"));
				this.attributes.interfaceLoaded = true;
			} while (this.attributes.interfaceLoaded);

			this.processDataToInterface(Profile);
		});
	}

	processDataToInterface(Profile: Map<unknown, unknown>) {}
}
