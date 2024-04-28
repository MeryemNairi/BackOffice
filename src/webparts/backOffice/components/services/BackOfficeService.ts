import { sp } from '@pnp/sp/presets/all';

export interface IInternalRecrutement {
  offre_title: string;
  short_description: string;
  deadline: Date;
  city: 'rabat' | 'fes' | 'rabat&fes';
}

export default class BackOfficeService {
  async getInternalRecrutements(): Promise<IInternalRecrutement[]> {
    try {
      const response = await sp.web.lists.getByTitle("BackOffice").items.select("offre_title", "short_description", "deadline", "city").get();
      
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
      await sp.web.lists.getByTitle("BackOffice").items.add({
        offre_title: recrutement.offre_title,
        short_description: recrutement.short_description,
        deadline: recrutement.deadline,
        city: recrutement.city,
      });
    } catch (error) {
      throw new Error('Error submitting internal recrutement');
    }
  }
}
