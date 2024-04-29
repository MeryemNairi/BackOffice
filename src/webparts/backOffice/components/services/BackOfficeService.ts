import { sp } from '@pnp/sp/presets/all';

export interface IInternalRecrutement {
  Id?: number; 
  offre_title: string;
  short_description: string;
  deadline: Date;
  city: 'rabat' | 'fes' | 'rabat&fes';
  attachment_name: string; 
}

export default class BackOfficeService {
  async getInternalRecrutements(): Promise<IInternalRecrutement[]> {
    try {
      const response = await sp.web.lists.getByTitle("BackOfficeV1").items.select("Id", "offre_title", "short_description", "deadline", "city", "attachment_name").get();
      
      const formattedInternalRecrutements = response.map((recrutement: any) => ({
        ...recrutement,
        deadline: new Date(recrutement.deadline),
      }));
      return formattedInternalRecrutements;
    } catch (error) {
      throw new Error('Error fetching internal recrutements');
    }
  }

  async postInternalRecrutement(recrutement: IInternalRecrutement): Promise<void> {
    try {
      await sp.web.lists.getByTitle("BackOfficeV1").items.add({
        offre_title: recrutement.offre_title,
        short_description: recrutement.short_description,
        deadline: recrutement.deadline,
        city: recrutement.city,
        attachment_name: recrutement.attachment_name, // Ajout de la nouvelle colonne
      });
    } catch (error) {
      throw new Error('Error submitting internal recrutement');
    }
  }

  async updateInternalRecrutement(recrutement: IInternalRecrutement): Promise<void> {
    try {
      if (!recrutement.Id) {
        throw new Error('Id is required for updating internal recrutement');
      }
      await sp.web.lists.getByTitle("BackOfficeV1").items.getById(recrutement.Id).update({
        offre_title: recrutement.offre_title,
        short_description: recrutement.short_description,
        deadline: recrutement.deadline,
        city: recrutement.city,
        attachment_name: recrutement.attachment_name,
      });
    } catch (error) {
      throw new Error('Error updating internal recrutement');
    }
  }

  async deleteInternalRecrutement(recrutementId: number): Promise<void> {
    try {
      await sp.web.lists.getByTitle("BackOfficeV1").items.getById(recrutementId).delete();
    } catch (error) {
      throw new Error('Error deleting internal recrutement');
    }
  }
}
