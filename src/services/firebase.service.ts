import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  type DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { EmailProject, SectionTemplateData } from '../types/firebase';

const COLLECTIONS = {
  PROJECTS: 'email-projects',
  TEMPLATES: 'section-templates',
};

export class FirebaseService {
  static async getProjects(): Promise<EmailProject[]> {
    const q = query(
      collection(db, COLLECTIONS.PROJECTS),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
    })) as EmailProject[];
  }

  static async getProject(id: string): Promise<EmailProject | null> {
    const docRef = doc(db, COLLECTIONS.PROJECTS, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: (docSnap.data().createdAt as Timestamp).toDate(),
      updatedAt: (docSnap.data().updatedAt as Timestamp).toDate(),
    } as EmailProject;
  }

  static async createProject(project: Omit<EmailProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), {
      ...project,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  }

  static async updateProject(id: string, updates: Partial<Omit<EmailProject, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PROJECTS, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    } as DocumentData);
  }

  static async deleteProject(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PROJECTS, id);
    await deleteDoc(docRef);
  }

  static async getTemplates(): Promise<SectionTemplateData[]> {
    const q = query(
      collection(db, COLLECTIONS.TEMPLATES),
      orderBy('name', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
    })) as SectionTemplateData[];
  }

  static async createTemplate(template: Omit<SectionTemplateData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTIONS.TEMPLATES), {
      ...template,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  }

  static async updateTemplate(id: string, updates: Partial<Omit<SectionTemplateData, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.TEMPLATES, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    } as DocumentData);
  }

  static async deleteTemplate(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.TEMPLATES, id);
    await deleteDoc(docRef);
  }
}
