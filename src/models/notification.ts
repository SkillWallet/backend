export interface Notification {
	_id: string;
	contactSkillWalletId: string;
	message: string;
	skillWalletId: string;
	title: string;
}


export const notificationSchema = {
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#", 
	"$id": "https://example.com/object1626347242.json", 
	"title": "Root", 
	"type": "object",
	"required": [
		"_id",
		"contactSkillWalletId",
		"message",
		"skillWalletId",
		"title"
	],
	"properties": {
		"_id": {
			"$id": "#root/_id", 
			"title": "_id", 
			"type": "string",
			"default": "",
			"examples": [
				"01f4ega4zmjqbdc24p0vrxe2xk"
			],
			"pattern": "^.*$"
		},
		"contactSkillWalletId": {
			"$id": "#root/contactSkillWalletId", 
			"title": "Contactskillwalletid", 
			"type": "string",
			"examples": [
				"2"
			],
			"default": 0
		},
		"message": {
			"$id": "#root/message", 
			"title": "Message", 
			"type": "string",
			"default": "",
			"examples": [
				"Start working on your Gig - and earn DITO Credits!"
			],
			"pattern": "^.*$"
		},
		"skillWalletId": {
			"$id": "#root/skillWalletId", 
			"title": "Skillwalletid", 
			"type": "string",
			"examples": [
				"1"
			],
			"default": 0
		},
		"title": {
			"$id": "#root/title", 
			"title": "Title", 
			"type": "string",
			"default": "",
			"examples": [
				"Your Gig has started!"
			],
			"pattern": "^.*$"
		}
	}
}
