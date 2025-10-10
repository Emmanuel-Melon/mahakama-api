import { Request, Response } from 'express';

const legalDocuments = [
  {
    id: 'constitution',
    title: 'National Constitution',
    description: 'The supreme law of the country, establishing the framework of government and fundamental rights.',
    lastUpdated: '2023',
    sections: 300,
    type: 'Constitutional Law'
  },
  {
    id: 'criminal-code',
    title: 'Criminal Code Act',
    description: 'Comprehensive legislation covering all criminal offenses and their corresponding penalties.',
    lastUpdated: '2022',
    sections: 412,
    type: 'Criminal Law'
  },
  {
    id: 'labor-act',
    title: 'Labor Act',
    description: 'Regulates employment relationships, working conditions, and workers\' rights.',
    lastUpdated: '2017',
    sections: 187,
    type: 'Labor Law'
  },
  {
    id: 'landlord-tenant',
    title: 'Landlord and Tenant Act',
    description: 'Governs the rental of residential and commercial properties and the rights of both parties.',
    lastUpdated: '2022',
    sections: 154,
    type: 'Property Law'
  },
  {
    id: 'consumer-protection',
    title: 'Consumer Protection Act',
    description: 'Protects consumers from unfair trade practices and ensures fair market competition.',
    lastUpdated: '2021',
    sections: 98,
    type: 'Commercial Law'
  },
  {
    id: 'civil-procedure',
    title: 'Civil Procedure Act',
    description: 'Rules and procedures for civil litigation in courts of law.',
    lastUpdated: '2021',
    sections: 203,
    type: 'Civil Procedure'
  }
];

export const getDocuments = (_req: Request, res: Response) => {
  try {
    res.status(200).json(legalDocuments);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch legal documents' });
  }
};

export const getDocumentById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = legalDocuments.find(doc => doc.id === id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.status(200).json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
};
