import * as React from 'react';
import { useState, useEffect } from 'react';
import BackOfficeService, { IInternalRecrutement } from './services/BackOfficeService';

const BackOffice: React.FC = () => {
  const [offreTitle, setOffreTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [city, setCity] = useState<'rabat' | 'fes' | 'rabat&fes' | ''>('');
  const [internalRecrutements, setInternalRecrutements] = useState<IInternalRecrutement[]>([]);

  const backOfficeService = new BackOfficeService();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!offreTitle || !shortDescription || !deadline || !city) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await backOfficeService.postInternalRecrutement({ offre_title: offreTitle, short_description: shortDescription, deadline, city });
      const internalRecrutements = await backOfficeService.getInternalRecrutements();
      setInternalRecrutements(internalRecrutements);
      // Clear form fields
      setOffreTitle('');
      setShortDescription('');
      setDeadline(null);
      setCity('');
    } catch (error) {
      console.error('Error submitting internal recrutement:', error);
      alert('Error submitting internal recrutement. Please try again.');
    }
  };

  useEffect(() => {
    const fetchInternalRecrutements = async () => {
      try {
        const internalRecrutements = await backOfficeService.getInternalRecrutements();
        setInternalRecrutements(internalRecrutements);
      } catch (error) {
        console.error('Error fetching internal recrutements:', error);
      }
    };

    fetchInternalRecrutements();
  }, []);

  return (
    <div>
      <h2>Back Office</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Offre Title:
          <input type="text" value={offreTitle} onChange={(e) => setOffreTitle(e.target.value)} />
        </label>
        <br />
        <label>
          Short Description:
          <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        </label>
        <br />
        <label>
          Deadline:
          <input type="date" value={deadline?.toISOString().split('T')[0]} onChange={(e) => setDeadline(new Date(e.target.value))} />
        </label>
        <br />
        <label>
          City:
          <select value={city} onChange={(e) => setCity(e.target.value as 'rabat' | 'fes' | 'rabat&fes')} >
            <option value="">Select City</option>
            <option value="rabat">Rabat</option>
            <option value="fes">Fes</option>
            <option value="rabat&fes">Rabat & Fes</option>
          </select>
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>

      <h3>Internal Recrutements</h3>
      <table>
        <thead>
          <tr>
            <th>Offre Title</th>
            <th>Short Description</th>
            <th>Deadline</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {internalRecrutements.map((recrutement, index) => (
            <tr key={index}>
              <td>{recrutement.offre_title}</td>
              <td>{recrutement.short_description}</td>
              <td>{recrutement.deadline.toISOString().split('T')[0]}</td>
              <td>{recrutement.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackOffice;
