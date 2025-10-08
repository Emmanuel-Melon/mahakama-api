import { Lawyer } from '../lawyer.types';

export const lawyers: Lawyer[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@lawfirm.com',
    specialization: 'Corporate Law',
    experienceYears: 10,
    rating: 4.8,
    casesHandled: 245,
    isAvailable: true,
    location: 'Nairobi',
    languages: ['English', 'Swahili', 'French'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Michael Omondi',
    email: 'michael.omondi@lawfirm.com',
    specialization: 'Criminal Law',
    experienceYears: 15,
    rating: 4.9,
    casesHandled: 320,
    isAvailable: true,
    location: 'Mombasa',
    languages: ['English', 'Swahili'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: 'Amina Mohammed',
    email: 'amina.mohammed@lawfirm.com',
    specialization: 'Family Law',
    experienceYears: 8,
    rating: 4.7,
    casesHandled: 180,
    isAvailable: false,
    location: 'Nakuru',
    languages: ['English', 'Swahili', 'Arabic'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
