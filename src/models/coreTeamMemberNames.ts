export interface CoreTeamMemberName {
    _id: string;
    communityAddress: string;
    memberAddress: string;
    memberName: string;
}

export const coreTeamMemberNameSchema = {
	"definitions": {},
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$id": "https://example.com/object1626347242.json",
	"title": "Root",
	"type": "object",
	"required": [
		"_id",
		"communityAddress",
		"memberAddress",
		"memberName",
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
		"communityAddress": {
			"$id": "#root/communityAddress", 
			"title": "communityAddress", 
			"type": "string",
			"examples": [
				"0x.."
			],
			"default": 0
		},
		"memberAddress": {
			"$id": "#root/memberAddress", 
			"title": "memberAddress", 
			"type": "string",
			"default": "",
			"examples": [
				"0x.."
			],
			"pattern": "^.*$"
		},
		"memberName": {
			"$id": "#root/memberName", 
			"title": "memberName", 
			"type": "string",
			"examples": [
				"migrenaa"
			],
			"default": 0
		}
	}
}
