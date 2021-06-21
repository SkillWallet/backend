export enum Actions {
	Activate,
	Login,
	CreateGig,
	TakeGig,
	SubmitGig,
	CompleteGig

};

export interface QRCodeAuth {
	_id: string;
	nonce: number;
	action: Actions,
	isValidated: boolean;
	tokenId?: string;
}


export const qrCodeAuthSchema = {
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$id": "https://example.com/object1612283285.json",
	"title": "Root",
	"type": "object",
	"required": [
		"_id",
		"nonce",
		"action",
		"isValidated"
	],
	"properties": {
		"_id": {
			"$id": "#root/_id",
			"title": "_id",
			"type": "string",
			"default": "",
			"examples": [
				"asd"
			],
			"pattern": "^.*$"
		},
		"nonce": {
			"$id": "#root/nonce",
			"title": "nonce",
			"type": "integer",
			"default": 1,
			"examples": [
				2, 2000
			],
		},
		"action": {
			"$id": "#root/action",
			"title": "action",
			"type": "integer",
			"default": 0,
			"examples": [
				1
			],
		},
		"isValidated": {
			"$id": "#root/isValidated",
			"title": "isValidated",
			"type": "boolean",
			"examples": [
				false
			],
			"default": false
		},
		"tokenId": {
			"$id": "#root/tokenId",
			"title": "TokenId",
			"type": "string",
			"examples": [
				"1"
			],
		},
	}
}
