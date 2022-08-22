import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

interface LOAD_INSTANCE extends ScreenGui {
	Main: Frame & {
		ad: Frame;
	};
}

interface Attributes {}

@Component({
	tag: "LOAD_TAG",
})
export class LoadingComponent extends BaseComponent<Attributes, LOAD_INSTANCE> implements OnStart {
	onStart() {
		for (const v of this.instance.Main.ad.GetChildren()) {
			task.spawn(() => {
				for (let i = 1; 0.1; i -= 0.01) {
					task.wait(0.06);
					const mySheut = v as ImageLabel;
					mySheut.ImageTransparency = i;
				}
			});
		}
		task.wait(10);
		for (const v of this.instance.Main.ad.GetChildren()) {
			task.spawn(() => {
				for (let i = 0; 1; i += 0.01) {
					task.wait(0.06);
					const mySheut = v as ImageLabel;
					mySheut.ImageTransparency = i;
				}
			});
		}
	}
}
