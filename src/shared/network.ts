import { Networking } from "@flamework/networking";

interface ServerEvents {
	processDataToClient(Profile: unknown): void;
	sendCommandToService(Command: string): void;
	sendErrorToClient(ErrorMessage: string): void;
}

interface ClientEvents {
	processDataToClient(Profile: unknown): void;
	sendCommandToService(Command: string): void;
	sendErrorToClient(ErrorMessage: string): void;
}

interface ServerFunctions {
	getPlayerDataOnLoad(Player: Player): Player;
}

interface ClientFunctions {
	getPlayerDataOnLoad(Player: Player): Player;
}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
