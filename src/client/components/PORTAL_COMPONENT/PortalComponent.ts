import { OnStart, OnRender } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { COMPONENT_TAGS } from "shared/components/data/tags";
import { Players } from "@rbxts/services";
import { UserInputService } from "@rbxts/services";

const Player = Players.LocalPlayer;
const Character = Player.Character;
const HRP = Character?.FindFirstChild("HumanoidRootPart") as Part;

interface PORTAL_INSTANCE extends Model {
	Portal: MeshPart;
	Ring: MeshPart;
	Blue: Part;
	Dragon: Part;
	Red: Part;
	Prompt: Part;
}

interface PORTAL_ATTRIBUTES {
	isTouched: boolean;
}

@Component({
	tag: COMPONENT_TAGS.PORTAL_TAG,
	defaults: {
		isTouched: false,
	},
})
export class PORTAL_COMPONENT extends BaseComponent<PORTAL_ATTRIBUTES, PORTAL_INSTANCE> implements OnStart, OnRender {
	onStart() {
		this.instance.Prompt.Touched.Connect((touchedPart: BasePart) => {
			if (touchedPart.Parent?.FindFirstChildOfClass("Humanoid")) {
				if (!this.attributes.isTouched) {
					this.attributes.isTouched = true;
					print("hi");
				}
			}
		});

		
	}

	onRender() {
		for (const i of this.instance.GetChildren()) {
			const parts = i as Part;
			const v = new Vector3(parts.Orientation.X, parts.Orientation.Y + 1, parts.Orientation.Z);
			parts.Orientation = v;
		}
	}
}
