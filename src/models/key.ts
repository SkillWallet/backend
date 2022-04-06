import { Schema, model } from 'mongoose';

const PartnerKeySchema = new Schema({ 
    key: { type: String }, 
    communityAddress: { type: String },
    partnersAgreementAddress: {type: String },
})

export const PartnerKeyModel = model('PartnersKeys', PartnerKeySchema);

export interface PartnerKey { 
    key: string; 
    communityAddress: string;
    partnersAgreementAddress: string;
}
