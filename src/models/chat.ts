export interface Chat {
	_id: string;
	participant1: string;
	participant2: string;
	participant1Name: string;
	participant2Name: string;
	participant1PhotoUrl: string;
	participant2PhotoUrl: string;
	messages: Message[];
}

export interface Message {
	text: string;
	createdAt: number;
	sender: string;
}


export const chatSchema = {
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#", 
	"$id": "https://example.com/object1626297274.json", 
	"title": "Root", 
	"type": "object",
	"required": [
		"_id",
		"participant1",
		"participant2",
		"participant1Name",
		"participant2Name",
		"participant1PhotoUrl",
		"participant2PhotoUrl",
		"messages"
	],
	"properties": {
		"_id": {
			"$id": "#root/_id", 
			"title": "_id", 
			"type": "string",
			"default": "",
			"examples": [
				""
			],
			"pattern": "^.*$"
		},
		"participant1": {
			"$id": "#root/participant1", 
			"title": "Participant1", 
			"type": "string",
			"default": "",
			"examples": [
				"1"
			],
			"pattern": "^.*$"
		},
		"participant2": {
			"$id": "#root/participant2", 
			"title": "Participant2", 
			"type": "string",
			"default": "",
			"examples": [
				"2"
			],
			"pattern": "^.*$"
		},
		"participant1Name": {
			"$id": "#root/participant1Name", 
			"title": "Participant1name", 
			"type": "string",
			"default": "",
			"examples": [
				"string"
			],
			"pattern": "^.*$"
		},
		"participant2Name": {
			"$id": "#root/participant2Name", 
			"title": "Participant2name", 
			"type": "string",
			"default": "",
			"examples": [
				"string"
			],
			"pattern": "^.*$"
		},
		"participant1PhotoUrl": {
			"$id": "#root/participant1PhotoUrl", 
			"title": "Participant1photourl", 
			"type": "string",
			"default": "",
			"examples": [
				"string"
			],
			"pattern": "^.*$"
		},
		"participant2PhotoUrl": {
			"$id": "#root/participant2PhotoUrl", 
			"title": "Participant2photourl", 
			"type": "string",
			"default": "",
			"examples": [
				"string"
			],
			"pattern": "^.*$"
		},
		"messages": {
			"$id": "#root/messages", 
			"title": "Messages", 
			"type": "array",
			"default": [],
			"items":{
				"$id": "#root/messages/items", 
				"title": "Items", 
				"type": "object",
				"required": [
					"text",
					"createdAt",
					"sender"
				],
				"properties": {
					"text": {
						"$id": "#root/messages/items/text", 
						"title": "Text", 
						"type": "string",
						"default": "",
						"examples": [
							"text"
						],
						"pattern": "^.*$"
					},
					"sender": {
						"$id": "#root/messages/items/sender", 
						"title": "Sender", 
						"type": "string",
						"default": "",
						"examples": [
							"4"
						],
						"pattern": "^.*$"
					},
					"createdAt": {
						"$id": "#root/messages/items/createdAt", 
						"title": "Createdat", 
						"type": "integer",
						"default": "",
						"examples": [
							"1626300503171"
						],
						"pattern": "^.*$"
					}
				}
			}

		}
	}
}
