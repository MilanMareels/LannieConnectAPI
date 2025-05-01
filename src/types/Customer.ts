export interface Customer {
  userId: string;
  customerId: string;
  companyName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  status: 'lead' | 'nog bellen' | 'klant' | 'geen intresse';
  notes?: string;
  image: string;
}
