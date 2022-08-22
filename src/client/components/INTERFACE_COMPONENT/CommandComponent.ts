import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { COMPONENT_TAGS } from "shared/components/data/tags";
import { UserInputService as UIS } from "@rbxts/services";
import { MessagingService, CollectionService as CS, Players, StarterGui, Debris } from "@rbxts/services";
import { Events } from "client/network";
StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);
const LocalPlayer = Players.LocalPlayer;

interface COMMAND_INSTANCE extends ScreenGui {
	Template: Folder & {
		output: TextLabel;
		error: TextLabel;
	};
	Main: Frame & {
		Scroll: ScrollingFrame;
		Command: TextBox;
	};
}

interface Attributes {}

@Component({
	tag: COMPONENT_TAGS.CLOUD_TAG,
})
export class CommandComponent extends BaseComponent<Attributes, COMMAND_INSTANCE> implements OnStart {
	public canvasSize = 1;
	public CMDS = {
		output: this.instance.Template.output,
		frame: this.instance.Main.Scroll,
		size: this.canvasSize,
		["help"]: function (text: string) {
			Events.sendCommandToService("help");

			const help = [
				"$help - Show the list of information on how to use",
				"$cmds - Shows the list of Commands you can use",
			];

			for (const i of help) {
				const out = this.output.Clone();
				out.Text = "$ - " + i;
				out.Parent = this.frame;
				out.Visible = true;
				this.size = this.size + 0.5;
				this.frame.CanvasSize = new UDim2(0, 0, this.size, 0);
			}
		},
		["cmds"]: function (text: string) {
			Events.sendCommandToService("cmds");
		},
	};

	public CommandError = {
		error_: this.instance.Template.error,
		frame: this.instance.Main.Scroll,
		size: this.canvasSize,
		["error"]: function (Message: string) {
			const er = this.error_.Clone();
			er.Text = "$ - " + Message;
			er.Parent = this.frame;
			er.Visible = true;
			this.size = this.size + 0.5;
			this.frame.CanvasSize = new UDim2(0, 0, this.size, 0);
		},
	};

	onStart() {
		UIS.InputBegan.Connect((Input, gameProccessed) => {
			if (gameProccessed) {
				return;
			}
			if (Input.KeyCode === Enum.KeyCode.Backquote) {
				const myTag = CS.GetTags(LocalPlayer);

				if (!this.instance.Enabled) {
					for (const i of myTag) {
						if (i === "Admin") {
							this.instance.Enabled = true;
						}
					}
				} else {
					this.instance.Enabled = false;
				}
			}
		});

		this.instance.Main.Command.FocusLost.Connect((enterPressed) => {
			if (enterPressed) {
				const myLastText = this.instance.Main.Command.Text as "help";
				const [succ, err] = pcall(() => {
					this.CMDS[myLastText](myLastText);
					this.instance.Main.Command.Text = "Type help for more information";
				});
				if (err !== undefined) {
					const myError = this.instance.Template.error.Clone();
					myError.Text = "Cannot find Command! Got: " + myLastText + ", type help to find more information!";
					myError.Parent = this.instance.Main.Scroll;
					myError.Visible = true;
					this.canvasSize = this.canvasSize + 0.5;
					this.instance.Main.Scroll.CanvasSize = new UDim2(0, 0, this.canvasSize, 0);
					this.instance.Main.Command.Text = "Type help for more information";
				}
			}
		});

		Events.sendErrorToClient.connect((message: string) => {
			this.CommandError.error(message);
		});
	}
}
