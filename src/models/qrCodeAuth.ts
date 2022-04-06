import { Schema, model } from 'mongoose';

export enum Actions {
	Activate,
	Login,
	CreateGig,
	TakeGig,
	SubmitGig,
	CompleteGig

};

const QrCodeAuthSchema = new Schema({
	nonce: { type: Number, default: 1 },
	action: { type: Number, default: 0 },
	isValidated: { type: Boolean, default: false },
	tokenId: { type: String },
});

export const QrCodeAuthModel = model('QRCodeAuths', QrCodeAuthSchema);
