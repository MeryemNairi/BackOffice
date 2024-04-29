import * as React from 'react';
import { useState, useEffect } from 'react';
import BackOfficeService, { IInternalRecrutement } from './services/BackOfficeService';
import styles from './BackOffice.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const BackOffice: React.FC = () => {
  const [offreTitle, setOffreTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [city, setCity] = useState<'rabat' | 'fes' | 'rabat&fes' | ''>('');
  const [attachmentName, setAttachmentName] = useState<string | null>(null); // Nouveau state pour stocker le nom du fichier
  const [internalRecrutements, setInternalRecrutements] = useState<IInternalRecrutement[]>([]);
  const [selectedRecrutement, setSelectedRecrutement] = useState<IInternalRecrutement | null>(null);

  const backOfficeService = new BackOfficeService();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!offreTitle || !shortDescription || !deadline || !city || !attachmentName) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (selectedRecrutement) {
        // Update existing recrutement
        await backOfficeService.updateInternalRecrutement({
          ...selectedRecrutement,
          offre_title: offreTitle,
          short_description: shortDescription,
          deadline: deadline!,
          city: city,
          attachment_name: attachmentName, // Utiliser le nom de l'attachement existant
        });
      } else {
        // Add new recrutement
        await backOfficeService.postInternalRecrutement({
          offre_title: offreTitle,
          short_description: shortDescription,
          deadline: deadline!,
          city: city,
          attachment_name: attachmentName,
        });
      }
      const internalRecrutements = await backOfficeService.getInternalRecrutements();
      setInternalRecrutements(internalRecrutements);
      // Clear form fields and selected recrutement
      setOffreTitle('');
      setShortDescription('');
      setDeadline(null);
      setCity('');
      setAttachmentName(null);
      setSelectedRecrutement(null);
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

  const handleUpdate = (recrutement: IInternalRecrutement) => {
    setSelectedRecrutement(recrutement);
    setOffreTitle(recrutement.offre_title);
    setShortDescription(recrutement.short_description);
    setDeadline(recrutement.deadline);
    setCity(recrutement.city);
    setAttachmentName(recrutement.attachment_name);
  };

  const handleDelete = async (recrutementId?: number) => {
    if (recrutementId && window.confirm('Are you sure you want to delete this recrutement?')) {
      try {
        await backOfficeService.deleteInternalRecrutement(recrutementId);
        const internalRecrutements = await backOfficeService.getInternalRecrutements();
        setInternalRecrutements(internalRecrutements);
      } catch (error) {
        console.error('Error deleting internal recrutement:', error);
        alert('Error deleting internal recrutement. Please try again.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachmentName(files[0].name); // Utiliser le nom du fichier sélectionné
    }
  };

  return (
    <div className={styles.backOfficeContainer}>
      <h2>Back Office</h2>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <label className={styles.inputField}>
          Offre Title:
          <input type="text" value={offreTitle} onChange={(e) => setOffreTitle(e.target.value)} />
        </label>
        <br />
        <label className={styles.inputField}>
          Short Description:
          <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        </label>
        <br />
        <label className={styles.inputField}>
          Deadline:
          <input type="date" value={deadline?.toISOString().split('T')[0]} onChange={(e) => setDeadline(new Date(e.target.value))} />
        </label>
        <br />
        <label className={styles.inputField}>
          City:
          <select value={city} onChange={(e) => setCity(e.target.value as 'rabat' | 'fes' | 'rabat&fes')} >
            <option value="">Select City</option>
            <option value="rabat">Rabat</option>
            <option value="fes">Fes</option>
            <option value="rabat&fes">Rabat & Fes</option>
          </select>
        </label>
        <br />
        <label className={styles.inputField}>
          Attachment Name:
          <input type="file" onChange={handleFileChange} />
        </label>
        <br />
        <button type="submit">{selectedRecrutement ? 'Update' : 'Submit'}</button>
      </form>

      <div className={styles.tableContainer}>
        <h3>Internal Recrutements</h3>
        <table>
          <thead>
            <tr>
              <th>Offre Title</th>
              <th>Short Description</th>
              <th>Deadline</th>
              <th>City</th>
              <th>Attachment Name</th> {/* Nouvelle colonne pour afficher le nom du fichier */}
              <th>Action</th> {/* Nouvelle colonne */}
            </tr>
          </thead>
          <tbody>
            {internalRecrutements.map((recrutement, index) => (
              <tr key={index}>
                <td>{recrutement.offre_title}</td>
                <td>{recrutement.short_description}</td>
                <td>{recrutement.deadline.toISOString().split('T')[0]}</td>
                <td>{recrutement.city}</td>
                <td>{recrutement.attachment_name}</td> {/* Afficher le nom de l'attachement */}
                <td>
                  <button onClick={() => handleUpdate(recrutement)}>Update</button>
                  <span className={styles.iconSpace}></span>
                  <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(recrutement.Id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

};

export default BackOffice;
