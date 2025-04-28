import { firestore } from '@/config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  DocumentReference,
  Timestamp
} from 'firebase/firestore';

// Interfaces
export interface IKQuestion {
  id?: string;
  userId: string;
  title: string;
  description: string;
  attachments?: string[];
  category?: string;
  status: 'pending' | 'answered';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  assignedExpertId?: string;
  monthlyQuestionCount: number;
}

export interface IKAnswer {
  id?: string;
  questionId: string;
  expertId: string;
  content: string;
  attachments?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isRead: boolean;
}

// Constants
export const IK_CATEGORIES = [
  'Bordro',
  'İzin',
  'Özlük',
  'İş Hukuku',
  'SGK',
  'Diğer'
] as const;

export const MONTHLY_QUESTION_LIMIT = 3;

// Service Class
class IKHelpService {
  private questionsRef = collection(firestore, 'ikQuestions');
  private answersRef = collection(firestore, 'ikAnswers');

  // Soru ekleme
  async addQuestion(data: Omit<IKQuestion, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'monthlyQuestionCount'>): Promise<string> {
    try {
      // Kullanıcının bu ayki soru sayısını kontrol et
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date();
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      monthEnd.setHours(23, 59, 59, 999);

      const userQuestionsQuery = query(
        this.questionsRef,
        where('userId', '==', data.userId),
        where('createdAt', '>=', monthStart),
        where('createdAt', '<=', monthEnd)
      );

      const userQuestions = await getDocs(userQuestionsQuery);
      
      if (userQuestions.size >= MONTHLY_QUESTION_LIMIT) {
        throw new Error('Bu ay için soru limitinize ulaştınız.');
      }

      const questionData: Omit<IKQuestion, 'id'> = {
        ...data,
        status: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        monthlyQuestionCount: userQuestions.size + 1
      };

      const docRef = await addDoc(this.questionsRef, questionData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding question:', error);
      throw error;
    }
  }

  // Kullanıcının sorularını getirme
  async getUserQuestions(userId: string) {
    try {
      const q = query(
        this.questionsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as IKQuestion[];
    } catch (error) {
      console.error('Error getting user questions:', error);
      throw error;
    }
  }

  // Soru detayını getirme
  async getQuestionById(questionId: string) {
    try {
      const docRef = doc(this.questionsRef, questionId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Soru bulunamadı');
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as IKQuestion;
    } catch (error) {
      console.error('Error getting question:', error);
      throw error;
    }
  }

  // Soruya cevap ekleme (uzman için)
  async addAnswer(data: Omit<IKAnswer, 'id' | 'createdAt' | 'updatedAt' | 'isRead'>) {
    try {
      // Önce sorunun var olduğunu kontrol et
      const questionRef = doc(this.questionsRef, data.questionId);
      const questionSnap = await getDoc(questionRef);
      
      if (!questionSnap.exists()) {
        throw new Error('Soru bulunamadı');
      }

      // Cevabı ekle
      const answerData: Omit<IKAnswer, 'id'> = {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isRead: false
      };

      const answerRef = await addDoc(this.answersRef, answerData);

      // Sorunun durumunu güncelle
      await updateDoc(questionRef, {
        status: 'answered',
        updatedAt: serverTimestamp()
      });

      return answerRef.id;
    } catch (error) {
      console.error('Error adding answer:', error);
      throw error;
    }
  }

  // Sorunun cevaplarını getirme
  async getQuestionAnswers(questionId: string) {
    try {
      const q = query(
        this.answersRef,
        where('questionId', '==', questionId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as IKAnswer[];
    } catch (error) {
      console.error('Error getting answers:', error);
      throw error;
    }
  }

  // Cevabı okundu olarak işaretleme
  async markAnswerAsRead(answerId: string) {
    try {
      const answerRef = doc(this.answersRef, answerId);
      await updateDoc(answerRef, {
        isRead: true,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking answer as read:', error);
      throw error;
    }
  }

  // Admin: Tüm soruları getirme
  async getAllQuestions() {
    try {
      const q = query(this.questionsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as IKQuestion[];
    } catch (error) {
      console.error('Error getting all questions:', error);
      throw error;
    }
  }

  // Admin: Uzmana soru atama
  async assignQuestionToExpert(questionId: string, expertId: string) {
    try {
      const questionRef = doc(this.questionsRef, questionId);
      await updateDoc(questionRef, {
        assignedExpertId: expertId,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error assigning question:', error);
      throw error;
    }
  }
}

export const ikHelpService = new IKHelpService(); 